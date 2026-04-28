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
  return '/* =============== MODULE: ' + String(file || '').toUpperCase() + ' =============== */';
}

function stripLeadingModuleComment(source) {
  if (!/^\/\*/.test(source || '')) return source;
  return source.replace(/^\/\*[\s\S]*?MODULE:[\s\S]*?\*\/\s*/, '');
}

function normalizeBundleSource(source) {
  return String(source || '').replace(/^  /gm, '').replace(/^  /gm, '');
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

var tmpl  = fs.readFileSync(TMPL, 'utf8');
var block = '<!-- BUILD START -->\n<script>\n' + bundle + '\n</script>\n<!-- BUILD END -->';
var html  = tmpl.replace(/<!-- BUILD START -->[\s\S]*?<!-- BUILD END -->/, function(){ return block; });

fs.writeFileSync(OUT, html);
console.log('Built ' + files.length + ' modules -> index.html (' + html.length + ' bytes)');
