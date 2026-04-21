/* ================================================================
   MODULE: 04_SAVE
   Save contract. v2 is the live schema; v1 blobs are preserved
   verbatim under the archaeological `legacy` field so future
   receipts can say "PREVIOUS INCIDENT ON FILE. DATED."
   The v1 key itself is also retained after migration — never
   silently deleted. Sacred: cactusEd_save_v1 must still parse.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var K_V1 = ns.K.SAVE_V1;
  var K_V2 = ns.K.SAVE_V2;
  var VERSION = 2;
  var ASSIST_DEFAULTS = {
    biggerCoyote:false, slowerBosses:false, easyCopter:false,
    infiniteHealth:false, slowerGame:false,
    reduceFlash:false, reduceShake:false, reduceParticles:false
  };

  function emptyAssistMode(){
    return JSON.parse(JSON.stringify(ASSIST_DEFAULTS));
  }

  function assistMode(source){
    var out = emptyAssistMode();
    var assist = source && source.assistMode ? source.assistMode : source;
    if (!assist) return out;
    for (var key in out) {
      if (!Object.prototype.hasOwnProperty.call(out, key)) continue;
      if (Object.prototype.hasOwnProperty.call(assist, key)) out[key] = !!assist[key];
    }
    return out;
  }

  function assistTuning(source){
    var assist = assistMode(source);
    return {
      coyoteMs: assist.biggerCoyote ? (ns.TUNING.COYOTE_MS + 60) : ns.TUNING.COYOTE_MS,
      timeScale: assist.slowerGame ? 0.85 : 1,
      physicsTimeScale: assist.slowerGame ? 0.85 : 1,
      cameraLerp: assist.reduceShake ? 0.06 : 0.12,
      flashAlpha: assist.reduceFlash ? 0.28 : 1,
      overlayAlpha: assist.reduceFlash ? 0.7 : 1,
      occlusionAlpha: assist.reduceFlash ? 0.45 : 1,
      particleAlpha: assist.reduceParticles ? 0 : 1
    };
  }

  function emptyV2(){
    return {
      version: VERSION,
      ruleset: ns.RULESET,
      ts: 0,
      world: 1, health: 3, aloe: 0,
      deaths: 0, runs: 0, bestTime: 0, totalKills: 0,
      axes: { compliance:0, intuition:0, curiosity:0, grace:0, chaos:0, efficiency:0 },
      micro: {},
      cases: [],
      assistMode: emptyAssistMode(),
      legacy: null
    };
  }

  function readRaw(key){
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  function writeRaw(key, obj){
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) { return false; }
  }

  function migrate(v1){
    var v2 = emptyV2();
    v2.ts         = (v1 && v1.timestamp) || Date.now();
    v2.world      = (v1 && v1.world)      || 1;
    v2.health     = (v1 && v1.health) != null ? v1.health : 3;
    v2.aloe       = (v1 && v1.aloe)       || 0;
    v2.deaths     = (v1 && v1.deaths)     || 0;
    v2.runs       = (v1 && v1.runs)       || 0;
    v2.bestTime   = (v1 && v1.bestTime)   || 0;
    v2.totalKills = (v1 && v1.totalKills) || 0;
    if (v1 && v1.behavior) {
      var src = v1.behavior;
      for (var i = 0; i < ns.AXIS_NAMES.length; i++) {
        var a = ns.AXIS_NAMES[i];
        if (typeof src[a] === 'number') v2.axes[a] = src[a];
      }
    }
    if (v1 && v1.assistMode) {
      v2.assistMode = assistMode(v1.assistMode);
    }
    /* Archaeological layer — frozen copy of the v1 blob, verbatim. */
    v2.legacy = v1 ? JSON.parse(JSON.stringify(v1)) : null;
    return v2;
  }

  function boot(){
    var v2 = readRaw(K_V2);
    if (v2 && v2.version === VERSION) return v2;
    var v1 = readRaw(K_V1);
    if (v1) {
      var migrated = migrate(v1);
      writeRaw(K_V2, migrated);
      return migrated;
    }
    return emptyV2();
  }

  function save(payload){
    if (!payload || typeof payload !== 'object') return false;
    if (payload.version !== VERSION) payload.version = VERSION;
    if (!payload.ruleset) payload.ruleset = ns.RULESET;
    payload.ts = Date.now();
    return writeRaw(K_V2, payload);
  }

  function load(){
    var v2 = readRaw(K_V2);
    if (v2 && v2.version === VERSION) return v2;
    return null;
  }

  function clear(){
    try { localStorage.removeItem(K_V2); return true; }
    catch (e) { return false; }
  }

  function exists(){
    try { return localStorage.getItem(K_V2) != null; }
    catch (e) { return false; }
  }

  function hasLegacy(){
    var v2 = readRaw(K_V2);
    return !!(v2 && v2.legacy);
  }

  ns.SAVE = {
    _key:     K_V2,
    _keyV1:   K_V1,
    _version: VERSION,
    boot:     boot,
    save:     save,
    load:     load,
    clear:    clear,
    exists:   exists,
    hasLegacy:hasLegacy,
    assistMode: assistMode,
    assistTuning: assistTuning,
    _migrate: migrate,
    _emptyV2: emptyV2,
    _assistDefaults: emptyAssistMode
  };
})(CEHP);
CEHP._register('04_save');
