/* MODULE: 82_APPEALS - seed deep-link replay + ghost movement
   recording + side-by-side comparison. Discourse engine. */

(function(ns){
  'use strict';

  var RSV = 1;
  var RA = 'left right up down jump punch kick spinDash cigCopter groundSlam glide pause confirm back'.split(' ');

  function Recorder(){
    this.frames  = [];
    this.replay = [];
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
  Recorder.prototype.sampleInput = function(frame, input){ this.replay.push(inputFrame(frame, input)); };
  Recorder.prototype.clear = function(){ this.frames = []; this.replay = []; this._lastT = -999999; };
  Recorder.prototype.dump  = function(){ return this.frames.slice(); };
  Recorder.prototype.dumpReplay = function(){ return clone(this.replay || []); };
  Recorder.prototype.load  = function(arr){
    this.frames = arr ? arr.slice() : [];
    this._lastT = this.frames.length ? this.frames[this.frames.length - 1][0] : -999999;
  };

  function inputFrame(frame, input){
    var snapshot = {}, edges = [], action, i;
    for (i = 0; i < RA.length; i++) {
      action = RA[i]; snapshot[action] = input && input.down ? !!input.down(action) : !!(input && input.state && input.state[action]);
      if (input && input.justPressed && input.justPressed(action)) edges.push('justPressed:' + action);
    }
    return { frame: frame | 0, input: snapshot, edges: edges };
  }

  function axisMap(record){ return !record||!record.receipt||!record.receipt.axes?{}:(record.receipt.axes.primary||record.receipt.axes); }

  function clone(obj){
    if (obj == null) return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  function signature(value){
    var text = JSON.stringify(value || {}), hash = 2166136261, hex, i;
    for (i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24); }
    hex = (hash >>> 0).toString(16);
    while (hex.length < 8) hex = '0' + hex;
    return hex;
  }

  function encodeBase64(str){ return typeof Buffer!=='undefined'?Buffer.from(str,'utf8').toString('base64'):(typeof btoa!=='undefined'?btoa(unescape(encodeURIComponent(str))):'plain:'+encodeURIComponent(str)); }
  function decodeBase64(str){ return str.indexOf('plain:')===0?decodeURIComponent(str.slice(6)):(typeof Buffer!=='undefined'?Buffer.from(str,'base64').toString('utf8'):(typeof atob!=='undefined'?decodeURIComponent(escape(atob(str))):decodeURIComponent(str))); }
  function encode(payload){ return encodeURIComponent(encodeBase64(JSON.stringify(payload || {}))); }
  function decode(payload){ return payload?JSON.parse(decodeBase64(decodeURIComponent(payload))):null; }

  function fromURL(url){
    url = url || (typeof location !== 'undefined' ? location.search : '');
    var q = url.indexOf('?'), parts = (q >= 0 ? url.slice(q + 1) : url).split('&'), kv, i;
    for (i = 0; i < parts.length; i++) { kv = parts[i].split('='); if (kv[0] === 'appeal') return decode(kv[1] || ''); }
    return null;
  }

  function bounds(pathA, pathB){
    var all = (pathA || []).concat(pathB || []), out = { minX:0, minY:0, maxX:0, maxY:0 }, i;
    if (!all.length) return out;
    out.minX = out.maxX = all[0][1];
    out.minY = out.maxY = all[0][2];
    for (i = 1; i < all.length; i++) {
      out.minX = Math.min(out.minX, all[i][1]);
      out.minY = Math.min(out.minY, all[i][2]);
      out.maxX = Math.max(out.maxX, all[i][1]);
      out.maxY = Math.max(out.maxY, all[i][2]);
    }
    return out;
  }

  function compare(recA, recB){
    recA=recA||{}; recB=recB||{};
    var la=recA.receipt&&recA.receipt.lines?recA.receipt.lines:[],lb=recB.receipt&&recB.receipt.lines?recB.receipt.lines:[],aa=axisMap(recA),ab=axisMap(recB),ad={},ld=[],k,i;
    for(k in aa){ if(Object.prototype.hasOwnProperty.call(aa,k)) ad[k]=(ab[k]||0)-(aa[k]||0); }
    for(k in ab){ if(Object.prototype.hasOwnProperty.call(ab,k)&&!Object.prototype.hasOwnProperty.call(ad,k)) ad[k]=ab[k]||0; }
    for(i=0;i<Math.max(la.length,lb.length);i++) if(la[i]!==lb[i]) ld.push({ index:i, a:la[i]||'', b:lb[i]||'' });
    return {matches:ld.length===0,lineDiff:ld,axisDelta:ad,pathA:clone(recA.frames||[]),pathB:clone(recB.frames||[]),bounds:bounds(recA.frames||[],recB.frames||[])};
  }

  function record(scene){
    var r=ns.RunState||{},p=scene&&scene.player,c=scene&&scene.recorder,l=c&&c.dump?c.dump():[],f=c&&c.dumpReplay?c.dumpReplay():[],a=ns.Axes&&ns.Axes.snapshot?ns.Axes.snapshot():{},q=r.receipt||{},z=scene&&scene._fixedStep,i=scene&&scene._replayInitialState?clone(scene._replayInitialState):{x:p?p.x|0:0,y:p?p.y|0:0,facing:p?(p.facing||1)|0:1};
    return {schema_version:RSV,level_id:r.worldId||(scene&&scene.room&&scene.room.id)||'',engine_version:ns.VERSION||'',ruleset:ns.RULESET||'',seed:r.caseSeed||'',initial_state:i,frames:f,expected_checkpoints:clone(scene&&scene._replayCheckpoints?scene._replayCheckpoints:[]),expected_final:{frame:z?z.frame|0:0,recorder_signature:signature({frames:l,replay:f}),axes_snapshot:a,receipt_lines:q.lines?q.lines.slice():[]}};
  }
  function serialize(record){ return JSON.stringify(record || {}); }
  function deserialize(json){ var r=typeof json==='string'?JSON.parse(json):clone(json||{}); if((r.schema_version||RSV)!==RSV) throw Error('replay schema '+r.schema_version); return r; }
  function primitive(value){ return value === null || typeof value !== 'object'; }
  function firstDiff(e,a,f,m){
    var i,k,s={},d;
    if(JSON.stringify(e)===JSON.stringify(a)) return null;
    if(primitive(e)||primitive(a)) return {passed:false,divergent_frame:m==null?null:m,expected:e,actual:a,field:f};
    if(Array.isArray(e)||Array.isArray(a)){
      for(i=0;i<Math.max((e||[]).length,(a||[]).length);i++){ d=firstDiff(e?e[i]:undefined,a?a[i]:undefined,f+'['+i+']',m); if(d) return d; }
      return null;
    }
    k=Object.keys(e||{}).sort();
    for(i=0;i<k.length;i++){ s[k[i]]=true; d=firstDiff(e[k[i]],a?a[k[i]]:undefined,f+'.'+k[i],m); if(d) return d; }
    k=Object.keys(a||{}).sort();
    for(i=0;i<k.length;i++){ if(s[k[i]]) continue; d=firstDiff(undefined,a[k[i]],f+'.'+k[i],m); if(d) return d; }
    return null;
  }
  function runReplay(fixture, scene){
    var e=deserialize(fixture),a=scene&&scene._replayActual?scene._replayActual:record(scene),c=e.expected_checkpoints||[],ac=a.expected_checkpoints||[],d,i;
    for(i=0;i<c.length;i++){ d=firstDiff(c[i],ac[i],'expected_checkpoints['+i+']',c[i]&&c[i].frame); if(d) return d; }
    d=firstDiff(e.expected_final||{},a.expected_final||{},'expected_final',e.expected_final&&e.expected_final.frame);
    return d || {passed:true,divergent_frame:null,expected:null,actual:null,field:null};
  }

  ns.Appeals={Recorder:Recorder,compare:compare,encode:encode,decode:decode,fromURL:fromURL};
  ns.Replay={SCHEMA_VERSION:RSV,ACTIONS:RA.slice(),record:record,serialize:serialize,deserialize:deserialize,signature:signature,runReplay:runReplay};
})(CEHP);
CEHP._register('82_appeals');
