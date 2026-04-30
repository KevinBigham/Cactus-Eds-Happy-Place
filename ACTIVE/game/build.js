#!/usr/bin/env node
/* CEHP rebuild build.js — concatenates src/*.js into index.html via template.
   Ship-artifact rule: produced index.html must be playable with NO build step
   (CDN Phaser + inline script only). Keep this script tiny. */
'use strict';
var fs   = require('fs');
var path = require('path');

var GAME = __dirname;
var SRC  = path.join(GAME, 'src');
var TMPL = path.join(GAME, 'index.template.html');
var OUT  = path.join(GAME, 'index.html');
var PRIORITY = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '04_save.js',
  '05_caseseed.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js'
];

function isModuleFile(file) {
  return /\.js$/.test(file);
}

function bannerFor(file) {
  return '/* MODULE: ' + String(file || '').toUpperCase() + ' */';
}

function stripLeadingModuleComment(source) {
  if (!/^\/\*/.test(source || '')) return source;
  return source.replace(/^\/\*[\s\S]*?MODULE:[\s\S]*?\*\/\s*/, '');
}

function normalizeBundleSource(source) {
  return String(source || '').replace(/^[ \t]+/gm, '').replace(/^\s*\n/gm, '');
}

/* String-aware comment stripper. Walks char-by-char, skips contents of
   single/double-quoted strings (with backslash escapes), strips block
   comments and line comments outside of strings. Preserves /* MODULE: ... *\/
   banners so post_marathon_integration tests still find them. */
function stripBundleComments(source) {
  var out = '';
  var i = 0;
  var n = source.length;
  while (i < n) {
    var c = source.charAt(i);
    if (c === '\'' || c === '"') {
      var quote = c;
      out += c;
      i++;
      while (i < n) {
        var cc = source.charAt(i);
        out += cc;
        if (cc === '\\') {
          i++;
          if (i < n) { out += source.charAt(i); i++; }
          continue;
        }
        if (cc === quote) { i++; break; }
        if (cc === '\n') { i++; break; }
        i++;
      }
      continue;
    }
    if (c === '/' && source.charAt(i + 1) === '*') {
      var rest = source.substr(i, 200);
      var banner = rest.match(/^\/\*\s*MODULE:[^*]*\*\//);
      if (banner) {
        out += banner[0];
        i += banner[0].length;
        continue;
      }
      var end = source.indexOf('*/', i + 2);
      if (end === -1) { i = n; break; }
      i = end + 2;
      continue;
    }
    if (c === '/' && source.charAt(i + 1) === '/') {
      while (i < n && source.charAt(i) !== '\n') i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

function collapseBundleBlanks(source) {
  return String(source || '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{2,}/g, '\n');
}

function priorityIndex(file) {
  var i;
  for (i = 0; i < PRIORITY.length; i++) {
    if (PRIORITY[i] === file) return i;
  }
  return -1;
}

function compareFiles(a, b) {
  var aPriority = priorityIndex(a);
  var bPriority = priorityIndex(b);

  if (aPriority >= 0 || bPriority >= 0) {
    if (aPriority < 0) return 1;
    if (bPriority < 0) return -1;
    return aPriority - bPriority;
  }

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

var files = fs.readdirSync(SRC).filter(isModuleFile).sort(compareFiles);
var bundle = files.map(function(f){
  var source = fs.readFileSync(path.join(SRC, f), 'utf8');
  source = stripLeadingModuleComment(source);
  source = normalizeBundleSource(source);
  return bannerFor(f) + '\n' + source;
}).join('\n');

bundle = stripBundleComments(bundle);
bundle = collapseBundleBlanks(bundle);

var tmpl  = fs.readFileSync(TMPL, 'utf8');
var block = '<!-- BUILD START -->\n<script>\n' + bundle + '\n</script>\n<!-- BUILD END -->';
var html  = tmpl.replace(/<!-- BUILD START -->[\s\S]*?<!-- BUILD END -->/, function(){ return block; });

fs.writeFileSync(OUT, html);
console.log('Built ' + files.length + ' modules -> index.html (' + html.length + ' bytes)');
