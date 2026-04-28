#!/usr/bin/env node
/*
 * check_process_manifest.mjs
 *
 * Cheap executable guard for durable CEHP process rules. This intentionally
 * validates structure and constraints already present in project doctrine:
 * single ship artifact, process scripts wired through package.json, ES5-only
 * runtime source, seeded RNG only, and protected tuning/save contracts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const gameDir = path.resolve(path.dirname(__filename), '..');
const manifestPath = path.join(gameDir, 'process_manifest.json');

const failures = [];
const passes = [];

function rel(filePath) {
  return path.relative(gameDir, filePath).replace(/\\/g, '/');
}

function fail(message) {
  failures.push(message);
}

function pass(message) {
  passes.push(message);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    fail(label + ' is not valid JSON: ' + err.message);
    return null;
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(gameDir, relativePath));
}

function fileText(relativePath) {
  return fs.readFileSync(path.join(gameDir, relativePath), 'utf8');
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

function maskRuntimeSource(source) {
  let out = '';
  let state = 'code';
  let backslash = false;
  const backtickLines = [];

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (state === 'lineComment') {
      if (ch === '\n') {
        state = 'code';
        out += '\n';
      } else {
        out += ' ';
      }
      continue;
    }

    if (state === 'blockComment') {
      if (ch === '*' && next === '/') {
        out += '  ';
        i++;
        state = 'code';
      } else {
        out += ch === '\n' ? '\n' : ' ';
      }
      continue;
    }

    if (state === 'singleQuote' || state === 'doubleQuote') {
      out += ch === '\n' ? '\n' : ' ';
      if (backslash) {
        backslash = false;
      } else if (ch === '\\') {
        backslash = true;
      } else if ((state === 'singleQuote' && ch === "'") || (state === 'doubleQuote' && ch === '"')) {
        state = 'code';
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      out += '  ';
      i++;
      state = 'lineComment';
      continue;
    }
    if (ch === '/' && next === '*') {
      out += '  ';
      i++;
      state = 'blockComment';
      continue;
    }
    if (ch === "'") {
      out += ' ';
      state = 'singleQuote';
      backslash = false;
      continue;
    }
    if (ch === '"') {
      out += ' ';
      state = 'doubleQuote';
      backslash = false;
      continue;
    }
    if (ch === '`') {
      backtickLines.push(lineOf(source, i));
      out += ' ';
      continue;
    }

    out += ch;
  }

  return { code: out, backtickLines };
}

function findMatches(code, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(code)) !== null) {
    matches.push({ text: match[0], line: lineOf(code, match.index) });
    if (match.index === regex.lastIndex) regex.lastIndex++;
  }
  return matches;
}

function checkRuntimeSource(manifest) {
  const runtime = manifest.runtimeSource || {};
  const srcDir = path.join(gameDir, runtime.dir || 'src');
  const files = fs.readdirSync(srcDir).filter((file) => file.endsWith('.js')).sort();

  if (files.length >= runtime.minimumModuleCount) {
    pass('runtime module count ' + files.length + ' >= ' + runtime.minimumModuleCount);
  } else {
    fail('runtime module count ' + files.length + ' < ' + runtime.minimumModuleCount);
  }

  for (const moduleName of runtime.requiredModules || []) {
    if (files.includes(moduleName)) pass('required runtime module exists: ' + moduleName);
    else fail('missing required runtime module: ' + moduleName);
  }

  const constText = fileText(path.join(runtime.dir, '01_const.js'));
  const legacyKey = runtime.saveKeys && runtime.saveKeys.legacy;
  const liveKey = runtime.saveKeys && runtime.saveKeys.live;
  if (legacyKey && constText.includes(legacyKey)) pass('legacy save key preserved: ' + legacyKey);
  else fail('legacy save key missing from src/01_const.js: ' + legacyKey);
  if (liveKey && constText.includes(liveKey)) pass('live save key preserved: ' + liveKey);
  else fail('live save key missing from src/01_const.js: ' + liveKey);

  for (const file of files) {
    const fullPath = path.join(srcDir, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const masked = maskRuntimeSource(source);
    const code = masked.code;

    if (runtime.es5Only) {
      for (const line of masked.backtickLines) {
        fail(rel(fullPath) + ':' + line + ' uses a template-literal backtick in runtime code');
      }
      for (const m of findMatches(code, /=>/g)) {
        fail(rel(fullPath) + ':' + m.line + ' uses arrow syntax');
      }
      for (const m of findMatches(code, /\b(let|const|class)\s+/g)) {
        fail(rel(fullPath) + ':' + m.line + ' uses ES6 runtime token: ' + m.text.trim());
      }
    }

    if (file !== runtime.rngModule) {
      for (const m of findMatches(code, /\bMath\s*\.\s*random\s*\(/g)) {
        fail(rel(fullPath) + ':' + m.line + ' calls Math.random outside ' + runtime.rngModule);
      }
    }

    for (const name of runtime.protectedTuningWrites || []) {
      const regex = new RegExp('\\bTUNING\\s*\\.\\s*' + name + '\\s*=', 'g');
      for (const m of findMatches(code, regex)) {
        fail(rel(fullPath) + ':' + m.line + ' mutates protected tuning value ' + name);
      }
    }
  }

  pass('runtime source constraints scanned');
}

function checkVerificationScript(scriptConfig, label) {
  if (!scriptConfig || !scriptConfig.file) {
    fail('missing verification script config: ' + label);
    return;
  }
  if (!exists(scriptConfig.file)) {
    fail(label + ' verification script missing: ' + scriptConfig.file);
    return;
  }
  const text = fileText(scriptConfig.file);
  for (const needle of scriptConfig.mustContain || []) {
    if (text.includes(needle)) pass(label + ' verification contains: ' + needle);
    else fail(label + ' verification missing command: ' + needle);
  }
}

function main() {
  const manifest = readJson(manifestPath, 'process_manifest.json');
  if (!manifest) {
    process.exitCode = 1;
    return;
  }

  if (manifest.schemaVersion === 1) pass('manifest schemaVersion is 1');
  else fail('manifest schemaVersion must be 1');

  for (const file of manifest.requiredFiles || []) {
    if (exists(file)) pass('required file exists: ' + file);
    else fail('missing required file: ' + file);
  }

  const packageJson = readJson(path.join(gameDir, 'package.json'), 'package.json');
  if (packageJson) {
    const scripts = packageJson.scripts || {};
    for (const [name, command] of Object.entries(manifest.requiredPackageScripts || {})) {
      if (scripts[name] === command) pass('package script ' + name + ' is wired');
      else fail('package script ' + name + ' expected "' + command + '" but found "' + (scripts[name] || '') + '"');
    }
  }

  const artifact = manifest.shipArtifact || {};
  if (artifact.file && exists(artifact.file)) {
    const size = fs.statSync(path.join(gameDir, artifact.file)).size;
    if (size <= artifact.maxBytes) pass('ship artifact size ' + size + ' <= ' + artifact.maxBytes);
    else fail('ship artifact size ' + size + ' > ' + artifact.maxBytes);
  } else {
    fail('ship artifact missing: ' + artifact.file);
  }

  checkRuntimeSource(manifest);

  const verification = manifest.verificationScripts || {};
  checkVerificationScript(verification.standard, 'standard');
  checkVerificationScript(verification.w10Full, 'w10Full');

  for (const message of passes) {
    console.log('PASS ' + message);
  }

  if (failures.length > 0) {
    console.log('');
    for (const message of failures) {
      console.log('FAIL ' + message);
    }
    console.log('');
    console.log('[check_process_manifest] FAIL - ' + failures.length + ' process guard issue(s)');
    process.exit(1);
  }

  console.log('');
  console.log('[check_process_manifest] OK - ' + passes.length + ' guard checks passed');
}

main();
