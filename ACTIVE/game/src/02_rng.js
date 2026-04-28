/* MODULE: 02_RNG - seeded LCG. NEVER Math.random().
   Determinism is sacred: same seed > same sequence. */

(function(ns){
  'use strict';

  var MULT = 1664525;
  var INCR = 1013904223;
  var MOD  = 4294967296; /* 2^32 */

  function RNG(seed){ this._s = (seed >>> 0); }

  RNG.prototype.next  = function(){
    this._s = ((this._s * MULT) + INCR) >>> 0;
    return this._s;
  };
  RNG.prototype.float = function(){ return this.next() / MOD; };
  RNG.prototype.int   = function(min, max){
    /* inclusive min, exclusive max */
    return min + (this.next() % (max - min));
  };
  RNG.prototype.pick   = function(arr){ return arr[this.int(0, arr.length)]; };
  RNG.prototype.chance = function(p){ return this.float() < p; };
  RNG.prototype.getState = function(){ return this._s; };
  RNG.prototype.setState = function(s){ this._s = s >>> 0; };

  /* Stable 32-bit hash of an arbitrary string (FNV-1a) */
  function seedFromString(str){
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }

  ns.RNG            = RNG;
  ns.seedFromString = seedFromString;
  ns.makeRNG        = function(seed){
    if (typeof seed === 'string') return new RNG(seedFromString(seed));
    return new RNG(seed | 0);
  };
})(CEHP);
CEHP._register('02_rng');
