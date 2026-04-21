/* ================================================================
   MODULE: 82_APPEALS
   Seed deep-link replay + ghost movement recording + side-by-side
   comparison. This is the discourse engine. Ships in rebuild.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  /* Frame format: [tMs, x, y, facing] — compact, deterministic. */

  function Recorder(){
    this.frames  = [];
    this.playing = false;
    this.sampleMs = 120;
    this._lastT = -999999;
  }
  Recorder.prototype.mark  = function(t, x, y, facing){
    this.frames.push([t | 0, x | 0, y | 0, facing | 0]);
  };
  Recorder.prototype.sample = function(t, x, y, facing){
    if (!this.frames.length || (t - this._lastT) >= this.sampleMs) {
      this._lastT = t | 0;
      this.mark(t, x, y, facing);
    }
  };
  Recorder.prototype.clear = function(){ this.frames = []; };
  Recorder.prototype.dump  = function(){ return this.frames.slice(); };
  Recorder.prototype.load  = function(arr){
    this.frames = arr ? arr.slice() : [];
    this._lastT = this.frames.length ? this.frames[this.frames.length - 1][0] : -999999;
  };

  function axisMap(record){
    if (!record || !record.receipt || !record.receipt.axes) return {};
    if (record.receipt.axes.primary) return record.receipt.axes.primary;
    return record.receipt.axes;
  }

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function encodeBase64(str){
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf8').toString('base64');
    }
    if (typeof btoa !== 'undefined') {
      return btoa(unescape(encodeURIComponent(str)));
    }
    return 'plain:' + encodeURIComponent(str);
  }

  function decodeBase64(str){
    if (str.indexOf('plain:') === 0) {
      return decodeURIComponent(str.slice(6));
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf8');
    }
    if (typeof atob !== 'undefined') {
      return decodeURIComponent(escape(atob(str)));
    }
    return decodeURIComponent(str);
  }

  function encode(payload){
    return encodeURIComponent(encodeBase64(JSON.stringify(payload || {})));
  }

  function decode(payload){
    if (!payload) return null;
    return JSON.parse(decodeBase64(decodeURIComponent(payload)));
  }

  function fromURL(url){
    url = url || (typeof location !== 'undefined' ? location.search : '');
    var q = url.indexOf('?');
    var query = q >= 0 ? url.slice(q + 1) : url;
    var parts = query.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] === 'appeal') return decode(kv[1] || '');
    }
    return null;
  }

  function bounds(pathA, pathB){
    var all = (pathA || []).concat(pathB || []);
    var out = { minX:0, minY:0, maxX:0, maxY:0 };
    if (!all.length) return out;
    out.minX = out.maxX = all[0][1];
    out.minY = out.maxY = all[0][2];
    for (var i = 1; i < all.length; i++) {
      out.minX = Math.min(out.minX, all[i][1]);
      out.minY = Math.min(out.minY, all[i][2]);
      out.maxX = Math.max(out.maxX, all[i][1]);
      out.maxY = Math.max(out.maxY, all[i][2]);
    }
    return out;
  }

  function compare(recA, recB){
    recA = recA || {};
    recB = recB || {};
    var linesA = recA.receipt && recA.receipt.lines ? recA.receipt.lines : [];
    var linesB = recB.receipt && recB.receipt.lines ? recB.receipt.lines : [];
    var axisA = axisMap(recA);
    var axisB = axisMap(recB);
    var axisDelta = {};
    var lineDiff = [];
    var k;

    for (k in axisA) {
      if (!Object.prototype.hasOwnProperty.call(axisA, k)) continue;
      axisDelta[k] = ((axisB[k] || 0) - (axisA[k] || 0));
    }
    for (k in axisB) {
      if (!Object.prototype.hasOwnProperty.call(axisB, k)) continue;
      if (!Object.prototype.hasOwnProperty.call(axisDelta, k)) axisDelta[k] = axisB[k] || 0;
    }

    for (var i = 0; i < Math.max(linesA.length, linesB.length); i++) {
      if (linesA[i] !== linesB[i]) {
        lineDiff.push({ index: i, a: linesA[i] || '', b: linesB[i] || '' });
      }
    }

    return {
      matches: lineDiff.length === 0,
      lineDiff: lineDiff,
      axisDelta: axisDelta,
      pathA: clone(recA.frames || []),
      pathB: clone(recB.frames || []),
      bounds: bounds(recA.frames || [], recB.frames || [])
    };
  }

  ns.Appeals = {
    Recorder: Recorder,
    compare:  compare,
    encode:   encode,
    decode:   decode,
    fromURL:  fromURL
  };
})(CEHP);
CEHP._register('82_appeals');
