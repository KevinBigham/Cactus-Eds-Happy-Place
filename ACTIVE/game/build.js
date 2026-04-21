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

var files = fs.readdirSync(SRC).filter(function(f){ return /\.js$/.test(f); }).sort();
var bundle = files.map(function(f){
  return '\n/* =============== MODULE: ' + f.toUpperCase() + ' =============== */\n'
       + fs.readFileSync(path.join(SRC, f), 'utf8');
}).join('\n');

var tmpl  = fs.readFileSync(TMPL, 'utf8');
var block = '<!-- BUILD START -->\n<script>\n' + bundle + '\n</script>\n<!-- BUILD END -->';
var html  = tmpl.replace(/<!-- BUILD START -->[\s\S]*?<!-- BUILD END -->/, function(){ return block; });

fs.writeFileSync(OUT, html);
console.log('Built ' + files.length + ' modules -> index.html (' + html.length + ' bytes)');
