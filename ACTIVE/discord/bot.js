#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var GAME = path.join(ROOT, 'game');
var SRC = path.join(GAME, 'src');
var OUTPUT_DIR = path.join(__dirname, 'output');
var VALID_WORLDS = { orientation:true, benefits:true, rasta:true };

function readArgValue(argv, index, flag) {
  var value = argv[index + 1];
  if (!value || value.indexOf('--') === 0) {
    throw new Error('Missing value for ' + flag);
  }
  return value;
}

function parseArgs(argv) {
  var out = { renderSeed: '', output: '', worldId: 'orientation', thermal: false };
  for (var i = 2; i < argv.length; i++) {
    if (argv[i] === '--render') {
      out.renderSeed = readArgValue(argv, i, '--render');
      i += 1;
      continue;
    }
    if (argv[i] === '--output') {
      out.output = readArgValue(argv, i, '--output');
      i += 1;
      continue;
    }
    if (argv[i] === '--world') {
      out.worldId = readArgValue(argv, i, '--world');
      i += 1;
      continue;
    }
    if (argv[i] === '--thermal') {
      out.thermal = true;
      continue;
    }
    throw new Error('Unknown argument: ' + argv[i]);
  }
  return out;
}

function loadCanvas(requireFn) {
  requireFn = requireFn || require;
  try {
    return requireFn('canvas');
  } catch (canvasError) {
    try {
      return requireFn('@napi-rs/canvas');
    } catch (napiError) {
      console.error('Missing canvas runtime in ACTIVE/discord.');
      console.error('Run: cd ' + __dirname + ' && npm install');
      throw napiError;
    }
  }
}

function loadDiscord() {
  try {
    return require('discord.js');
  } catch (error) {
    console.error('Missing discord.js dependency in ACTIVE/discord.');
    console.error('Run: cd ' + __dirname + ' && npm install');
    throw error;
  }
}

function buildSandbox() {
  var sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    JSON: JSON,
    location: { search: '' },
    localStorage: {
      getItem: function() { return null; },
      setItem: function() {},
      removeItem: function() {}
    }
  };
  sandbox.window = sandbox;
  sandbox.document = {
    readyState: 'loading',
    getElementById: function() { return null; }
  };
  vm.createContext(sandbox);
  return sandbox;
}

function loadCEHP() {
  var files = [
    '00_index.js',
    '01_const.js',
    '02_rng.js',
    '03_events.js',
    '04_save.js',
    '05_caseseed.js',
    '10_axes.js',
    '11_metrics.js',
    '70_worlds.js',
    '71_world_orientation.js',
    '72_world_benefits.js',
    '73_world_rasta.js',
    '80_receipts.js',
    '83_receipt_render.js'
  ];
  var source = files.map(function(file) {
    return fs.readFileSync(path.join(SRC, file), 'utf8');
  }).join('\n');
  var sandbox = buildSandbox();
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function validateWorldId(worldId) {
  worldId = worldId || 'orientation';
  if (!Object.prototype.hasOwnProperty.call(VALID_WORLDS, worldId)) {
    throw new Error('Unsupported world "' + worldId + '". Expected orientation, benefits, or rasta.');
  }
  return worldId;
}

function validateSeed(CEHP, seed) {
  var parsed = CEHP && CEHP.CaseSeed && CEHP.CaseSeed.parse ? CEHP.CaseSeed.parse(seed) : null;
  if (!parsed || parsed.raw !== seed) {
    throw new Error('Invalid CASE seed: ' + seed);
  }
  return parsed;
}

function resolveOutputPath(outputFile) {
  var resolved = path.resolve(outputFile);
  var relative = path.relative(ROOT, resolved);
  if (!relative || relative === '' || relative.indexOf('..') === 0 || path.isAbsolute(relative)) {
    throw new Error('Output path must stay within ' + ROOT);
  }
  if (path.extname(resolved).toLowerCase() !== '.png') {
    throw new Error('Output path must end in .png');
  }
  return resolved;
}

function profileFromSeed(CEHP, seed) {
  var parsed = validateSeed(CEHP, seed);
  var axis = String(parsed.axis || 'CURIOSITY').toLowerCase();
  var profiles = {
    compliance: { compliance: 0.88, intuition: 0.22, curiosity: 0.18, grace: 0.35, chaos: 0.08, efficiency: 0.74 },
    intuition: { compliance: 0.22, intuition: 0.86, curiosity: 0.42, grace: 0.46, chaos: 0.16, efficiency: 0.32 },
    curiosity: { compliance: 0.24, intuition: 0.38, curiosity: 0.92, grace: 0.44, chaos: 0.26, efficiency: 0.35 },
    grace: { compliance: 0.28, intuition: 0.34, curiosity: 0.31, grace: 0.91, chaos: 0.18, efficiency: 0.58 },
    chaos: { compliance: 0.06, intuition: 0.28, curiosity: 0.56, grace: 0.32, chaos: 0.95, efficiency: 0.24 },
    efficiency: { compliance: 0.42, intuition: 0.25, curiosity: 0.24, grace: 0.52, chaos: 0.12, efficiency: 0.94 }
  };
  return {
    primary: clone(profiles[axis] || profiles.curiosity),
    micro: {}
  };
}

function tensionsFor(axes) {
  var p = axes.primary;
  return {
    obedience: p.compliance - p.chaos,
    style: p.grace + p.efficiency,
    auditRisk: p.curiosity - p.intuition
  };
}

function renderReceipt(seed, outputFile, worldId, thermal, overrides) {
  overrides = overrides || {};
  var fsImpl = overrides.fs || fs;
  var Canvas = overrides.Canvas || loadCanvas(overrides.requireFn);
  var createCanvas = Canvas.createCanvas;
  var CEHP = overrides.CEHP || loadCEHP();
  var safeWorldId = validateWorldId(worldId || 'orientation');
  var safeOutputFile = resolveOutputPath(outputFile);
  var axes = profileFromSeed(CEHP, seed);
  var receipt = CEHP.Receipts.generate({
    seed: seed,
    axes: axes,
    tensions: tensionsFor(axes),
    worldId: safeWorldId,
    cigaretteLit: safeWorldId !== 'rasta'
  });
  var playUrl = CEHP.Receipts.playUrlForSeed(seed) + (thermal ? '&thermal=1' : '');
  var canvas = CEHP.ReceiptRender.render(receipt, {
    createCanvas: createCanvas,
    width: 1080,
    height: 1350,
    worldId: safeWorldId,
    thermal: !!thermal,
    playUrl: playUrl
  });

  try {
    fsImpl.mkdirSync(path.dirname(safeOutputFile), { recursive: true });
    fsImpl.writeFileSync(safeOutputFile, canvas.toBuffer('image/png'));
  } catch (error) {
    throw new Error('Unable to write receipt PNG to ' + safeOutputFile + ': ' + error.message);
  }

  return {
    outputFile: safeOutputFile,
    receipt: receipt,
    playUrl: playUrl
  };
}

async function startBot() {
  var token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('DISCORD_TOKEN is required to start the CEHP Discord bot.');
  }

  var Discord = loadDiscord();
  var Client = Discord.Client;
  var GatewayIntentBits = Discord.GatewayIntentBits;
  var AttachmentBuilder = Discord.AttachmentBuilder;

  var client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once('ready', function() {
    console.log('CEHP Discord bot ready as ' + client.user.tag);
    console.log('Expect slash command /case with a string option named "seed".');
  });

  client.on('interactionCreate', async function(interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'case') return;

    var seed = interaction.options.getString('seed', true);
    var worldId = interaction.options.getString('world') || 'orientation';
    var thermal = interaction.options.getBoolean && interaction.options.getBoolean('thermal') ? true : false;
    var output = path.join(OUTPUT_DIR, seed + (thermal ? '-thermal' : '') + '.png');
    try {
      var rendered = renderReceipt(
        seed,
        output,
        worldId,
        thermal
      );
      var attachment = new AttachmentBuilder(output);
      await interaction.reply({
        content: rendered.playUrl,
        files: [attachment]
      });
      console.log('Rendered and posted ' + seed);
    } catch (error) {
      console.error(error.stack || error.message);
      if (!interaction.replied) {
        await interaction.reply({ content: 'Render failed for ' + seed, ephemeral: true });
      }
    }
  });

  await client.login(token);
}

async function main() {
  var args = parseArgs(process.argv);
  if (args.renderSeed) {
    var seed = args.renderSeed;
    var output = args.output || path.join(OUTPUT_DIR, seed + (args.thermal ? '-thermal' : '') + '.png');
    var rendered = renderReceipt(seed, output, args.worldId, args.thermal);
    console.log('Rendered ' + seed + ' -> ' + rendered.outputFile);
    console.log(rendered.receipt.lines.join(' | '));
    console.log(rendered.playUrl);
    return;
  }

  await startBot();
}

module.exports = {
  ROOT: ROOT,
  OUTPUT_DIR: OUTPUT_DIR,
  parseArgs: parseArgs,
  loadCanvas: loadCanvas,
  loadCEHP: loadCEHP,
  validateWorldId: validateWorldId,
  validateSeed: validateSeed,
  resolveOutputPath: resolveOutputPath,
  renderReceipt: renderReceipt,
  main: main
};

if (require.main === module) {
  main().catch(function(error) {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
