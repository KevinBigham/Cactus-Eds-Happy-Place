/* MODULE: 30_AUDIO - procedural Web Audio ambient beds and event hits.
   No external audio files. Deterministic envelopes only. */

(function(ns){
  'use strict';

  var ctx = null;
  var master = null;
  var ambient = null;
  var eventNodes = [];
  var duckUntil = 0;
  var eventsBound = false;

  var AMBIENTS = {
    orientation: { fund: 60, overtone: 90, filter: 200, lfo: 0.05, gain: 0.055, wave: 'triangle', color: 'sine' },
    benefits:    { fund: 90, overtone: 180, filter: 250, lfo: 0.08, gain: 0.050, wave: 'square', color: 'triangle' },
    rasta:       { fund: 50, overtone: 75, filter: 180, lfo: 0.035, gain: 0.060, wave: 'triangle', color: 'sine' }
  };

  var EVENTS = {
    door_open:      { frequency: 160, end: 230, filter: 520, gain: 0.060, duration: 0.24, wave: 'triangle' },
    door_close:     { frequency: 120, end: 70, filter: 360, gain: 0.070, duration: 0.26, wave: 'square' },
    stamp_thud:     { frequency: 85, end: 48, filter: 300, gain: 0.090, duration: 0.18, wave: 'triangle' },
    paper_rustle:   { frequency: 620, end: 760, filter: 1400, gain: 0.032, duration: 0.16, wave: 'sawtooth' },
    receipt_print:  { frequency: 420, end: 540, filter: 1200, gain: 0.048, duration: 0.28, wave: 'square' },
    boss_telegraph: { frequency: 55, end: 110, filter: 420, gain: 0.080, duration: 0.29, wave: 'sawtooth' }
  };

  var layers = {
    ambient:          null,
    eventBus:         null,
    hvacHymn:         null,
    bureauPulse:      null,
    curiosityShimmer: null,
    incidentNoise:    null
  };

  function ensureCtx(){
    if (ctx) return ctx;
    if (typeof window === 'undefined') return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }

  function reduceMotion(){
    return typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function now(audio){
    return audio && typeof audio.currentTime === 'number' ? audio.currentTime : 0;
  }

  function setParam(param, value, at){
    if (!param) return;
    if (param.setValueAtTime) param.setValueAtTime(value, at || 0);
    else param.value = value;
  }

  function rampParam(param, value, at){
    if (!param) return;
    if (param.linearRampToValueAtTime) param.linearRampToValueAtTime(value, at || 0);
    else param.value = value;
  }

  function cancelParam(param, at){
    if (param && param.cancelScheduledValues) param.cancelScheduledValues(at || 0);
  }

  function connect(source, target){
    if (source && source.connect && target) source.connect(target);
  }

  function disconnect(node){
    if (!node || !node.disconnect) return;
    try { node.disconnect(); } catch (e) {}
  }

  function startNode(node){
    if (!node || !node.start) return;
    try { node.start(); } catch (e) {}
  }

  function stopNode(node, at){
    if (!node || !node.stop) return;
    try { node.stop(at); } catch (e) {}
  }

  function worldKeyFor(worldKey){
    if (worldKey === 1 || worldKey === '1' || worldKey === 'w1' || worldKey === 'world1') return 'orientation';
    if (worldKey === 2 || worldKey === '2' || worldKey === 'w2' || worldKey === 'world2') return 'benefits';
    if (worldKey === 3 || worldKey === '3' || worldKey === 'w3' || worldKey === 'world3') return 'rasta';
    return AMBIENTS[worldKey] ? worldKey : 'orientation';
  }

  function ensureMaster(audio){
    if (master) return master;
    master = audio.createGain();
    master.gain.value = reduceMotion() ? 0.04 : 0.08;
    master.connect(audio.destination);
    layers.eventBus = master;
    return master;
  }

  function resetLayerRefs(){
    layers.ambient = ambient ? ambient.gain : null;
    layers.hvacHymn = ambient ? ambient.gain : null;
    layers.bureauPulse = ambient ? ambient.gain : null;
    layers.curiosityShimmer = ambient ? ambient.filter : null;
    layers.incidentNoise = null;
    layers.eventBus = master;
  }

  function oscillator(audio, wave, frequency){
    var node = audio.createOscillator();
    node.type = wave;
    setParam(node.frequency, frequency, now(audio));
    return node;
  }

  function gainFor(cfg){
    return cfg.gain * (reduceMotion() ? 0.7 : 1);
  }

  function stopAmbient(){
    if (!ambient) return false;
    for (var i = 0; i < ambient.oscillators.length; i++) {
      stopNode(ambient.oscillators[i]);
    }
    for (var j = 0; j < ambient.nodes.length; j++) {
      disconnect(ambient.nodes[j]);
    }
    ambient = null;
    resetLayerRefs();
    return true;
  }

  function playAmbient(worldKey){
    var audio = ensureCtx();
    if (!audio) return false;
    if (audio.state === 'suspended' && audio.resume) audio.resume();

    worldKey = worldKeyFor(worldKey || 'orientation');
    if (ambient && ambient.worldKey === worldKey) return true;
    stopAmbient();

    var cfg = AMBIENTS[worldKey];
    var at = now(audio);
    var out = ensureMaster(audio);
    var filter = audio.createBiquadFilter();
    var gain = audio.createGain();
    var main = oscillator(audio, cfg.wave, cfg.fund);
    var color = oscillator(audio, cfg.color, cfg.overtone);
    var lfo = oscillator(audio, 'sine', cfg.lfo);
    var lfoDepth = audio.createGain();
    var baseGain = gainFor(cfg);

    filter.type = 'lowpass';
    setParam(filter.frequency, cfg.filter, at);
    setParam(filter.Q, worldKey === 'benefits' ? 1.1 : 0.75, at);
    setParam(gain.gain, 0, at);
    rampParam(gain.gain, baseGain, at + 0.05);
    setParam(lfoDepth.gain, cfg.filter * 0.08, at);

    connect(main, filter);
    connect(color, filter);
    connect(lfo, lfoDepth);
    connect(lfoDepth, filter.frequency);
    connect(filter, gain);
    connect(gain, out);

    startNode(main);
    startNode(color);
    startNode(lfo);

    ambient = {
      worldKey: worldKey,
      baseGain: baseGain,
      gain: gain,
      filter: filter,
      nodes: [main, color, lfo, lfoDepth, filter, gain],
      oscillators: [main, color, lfo]
    };
    resetLayerRefs();
    return true;
  }

  function disconnectEvent(entry){
    if (!entry || entry.done) return;
    entry.done = true;
    for (var i = 0; i < entry.nodes.length; i++) disconnect(entry.nodes[i]);
  }

  function pruneEvents(at){
    var kept = [];
    for (var i = 0; i < eventNodes.length; i++) {
      if (eventNodes[i].endTime + 0.5 < at) disconnectEvent(eventNodes[i]);
      else kept.push(eventNodes[i]);
    }
    eventNodes = kept;
  }

  function duckAmbient(at){
    if (!ambient || !ambient.gain || !ambient.gain.gain) return;
    duckUntil = at + 0.3;
    cancelParam(ambient.gain.gain, at);
    setParam(ambient.gain.gain, ambient.baseGain * 0.5, at);
    rampParam(ambient.gain.gain, ambient.baseGain, duckUntil);
  }

  function playEvent(eventKey){
    var cfg = EVENTS[eventKey];
    if (!cfg) return false;

    var audio = ensureCtx();
    if (!audio) return false;
    if (audio.state === 'suspended' && audio.resume) audio.resume();

    var at = now(audio);
    var out = ensureMaster(audio);
    var osc = oscillator(audio, cfg.wave, cfg.frequency);
    var filter = audio.createBiquadFilter();
    var gain = audio.createGain();
    var entry = null;

    pruneEvents(at);
    filter.type = 'lowpass';
    setParam(filter.frequency, cfg.filter, at);
    setParam(filter.Q, 0.9, at);
    setParam(gain.gain, 0, at);
    rampParam(gain.gain, cfg.gain, at + 0.015);
    rampParam(gain.gain, 0.0001, at + cfg.duration);
    rampParam(osc.frequency, cfg.end, at + cfg.duration);

    connect(osc, filter);
    connect(filter, gain);
    connect(gain, out);

    entry = { nodes: [osc, filter, gain], endTime: at + cfg.duration, done: false };
    eventNodes.push(entry);
    osc.onended = function(){ disconnectEvent(entry); };

    startNode(osc);
    stopNode(osc, at + cfg.duration);
    duckAmbient(at);
    return true;
  }

  function updateFromAxes(axesSnapshot, context){
    if (!ambient) return;
    context = context || {};
    var requested = worldKeyFor(context.worldId || ambient.worldKey);
    if (requested !== ambient.worldKey) {
      playAmbient(requested);
      if (!ambient) return;
    }

    axesSnapshot = axesSnapshot || { primary: {} };
    var p = axesSnapshot.primary || {};
    var cfg = AMBIENTS[ambient.worldKey];
    var compliance = p.compliance || 0;
    var curiosity = p.curiosity || 0;
    var chaos = p.chaos || 0;
    var grace = p.grace || 0;
    var at = now(ctx);
    var motion = reduceMotion() ? 0.5 : 1;
    var base = cfg.gain * motion * (1 + (compliance * 0.16) + (curiosity * 0.08) + (grace * 0.04));
    var filter = cfg.filter + (compliance * 45) + (curiosity * 35) + (chaos * 25);

    if (base > 0.09) base = 0.09;
    ambient.baseGain = base;
    setParam(ambient.filter.frequency, filter, at);
    if (at >= duckUntil) setParam(ambient.gain.gain, base, at);
  }

  function stop(){
    var at = now(ctx);
    stopAmbient();
    for (var i = 0; i < eventNodes.length; i++) {
      stopNode(eventNodes[i].nodes[0], at);
      disconnectEvent(eventNodes[i]);
    }
    eventNodes = [];
    if (master) disconnect(master);
    master = null;
    resetLayerRefs();
    return true;
  }

  function bindEvents(){
    if (eventsBound || !ns.Events || !ns.Events.on) return;
    eventsBound = true;

    ns.Events.on('form:used', function(payload){
      var kind = payload && payload.kind;
      playEvent(kind === 'premium' || kind === 'trampoline' ? 'stamp_thud' : 'paper_rustle');
    });
    ns.Events.on('sign:read', function(){ playEvent('paper_rustle'); });
    ns.Events.on('sign:peek', function(){ playEvent('paper_rustle'); });
    ns.Events.on('module:passed', function(){ playEvent('door_open'); });
    ns.Events.on('module:skipped', function(){ playEvent('door_close'); });
    ns.Events.on('contradiction:defy', function(){ playEvent('door_close'); });
    ns.Events.on('run:complete', function(){ playEvent('receipt_print'); });
    ns.Events.on('camera:shake', function(){ playEvent('boss_telegraph'); });
  }

  bindEvents();

  ns.Audio = {
    layers:         layers,
    playAmbient:   playAmbient,
    stopAmbient:   stopAmbient,
    event:         playEvent,
    start:         playAmbient,
    stop:          stop,
    updateFromAxes:updateFromAxes,
    isRunning:     function(){ return !!ambient; }
  };
})(CEHP);
CEHP._register('30_audio');
