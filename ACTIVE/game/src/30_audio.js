/* ================================================================
   MODULE: 30_AUDIO
   Four Web Audio layers, oscillators only — ZERO audio files.
     hvacHymn          — two detuned triangles → lowpass
     bureauPulse       — square-wave metronome @ 60 BPM base
     curiosityShimmer  — high-passed partials + delay
     incidentNoise     — filtered noise bursts + pitch wobble
   Axis changes modulate filter/tempo/detune in real time.
   Rasta Corp override: 72 BPM, warmer filter, noise layer off.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var ctx = null;
  var nodes = null;
  var layers = {
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

  function connectMany(list, target){
    for (var i = 0; i < list.length; i++) list[i].connect(target);
  }

  function start(worldId){
    var audio = ensureCtx();
    if (!audio || nodes) {
      if (audio && audio.state === 'suspended') audio.resume();
      return;
    }

    nodes = {};
    nodes.master = audio.createGain();
    nodes.master.gain.value = reduceMotion() ? 0.04 : 0.08;
    nodes.master.connect(audio.destination);

    nodes.hvacFilter = audio.createBiquadFilter();
    nodes.hvacFilter.type = 'lowpass';
    nodes.hvacFilter.frequency.value = 240;
    nodes.hvacGain = audio.createGain();
    nodes.hvacGain.gain.value = 0.05;
    nodes.hvacA = audio.createOscillator();
    nodes.hvacB = audio.createOscillator();
    nodes.hvacA.type = 'triangle';
    nodes.hvacB.type = 'triangle';
    nodes.hvacA.frequency.value = 55;
    nodes.hvacB.frequency.value = 56.4;
    connectMany([nodes.hvacA, nodes.hvacB], nodes.hvacFilter);
    nodes.hvacFilter.connect(nodes.hvacGain);
    nodes.hvacGain.connect(nodes.master);

    nodes.pulseGain = audio.createGain();
    nodes.pulseGain.gain.value = 0.015;
    nodes.pulseCarrier = audio.createOscillator();
    nodes.pulseCarrier.type = 'square';
    nodes.pulseCarrier.frequency.value = 110;
    nodes.pulseLfo = audio.createOscillator();
    nodes.pulseLfo.type = 'sine';
    nodes.pulseDepth = audio.createGain();
    nodes.pulseDepth.gain.value = 0.012;
    nodes.pulseLfo.frequency.value = 1;
    nodes.pulseLfo.connect(nodes.pulseDepth);
    nodes.pulseDepth.connect(nodes.pulseGain.gain);
    nodes.pulseCarrier.connect(nodes.pulseGain);
    nodes.pulseGain.connect(nodes.master);

    nodes.shimmerHigh = audio.createBiquadFilter();
    nodes.shimmerHigh.type = 'highpass';
    nodes.shimmerHigh.frequency.value = 700;
    nodes.shimmerDelay = audio.createDelay();
    nodes.shimmerDelay.delayTime.value = 0.18;
    nodes.shimmerGain = audio.createGain();
    nodes.shimmerGain.gain.value = 0.01;
    nodes.shimmerA = audio.createOscillator();
    nodes.shimmerB = audio.createOscillator();
    nodes.shimmerA.type = 'sine';
    nodes.shimmerB.type = 'triangle';
    nodes.shimmerA.frequency.value = 440;
    nodes.shimmerB.frequency.value = 660;
    connectMany([nodes.shimmerA, nodes.shimmerB], nodes.shimmerHigh);
    nodes.shimmerHigh.connect(nodes.shimmerDelay);
    nodes.shimmerDelay.connect(nodes.shimmerGain);
    nodes.shimmerGain.connect(nodes.master);

    nodes.incidentFilter = audio.createBiquadFilter();
    nodes.incidentFilter.type = 'bandpass';
    nodes.incidentFilter.frequency.value = 200;
    nodes.incidentGain = audio.createGain();
    nodes.incidentGain.gain.value = 0.0;
    nodes.incidentA = audio.createOscillator();
    nodes.incidentB = audio.createOscillator();
    nodes.incidentA.type = 'sawtooth';
    nodes.incidentB.type = 'square';
    nodes.incidentA.frequency.value = 180;
    nodes.incidentB.frequency.value = 247;
    nodes.incidentLfo = audio.createOscillator();
    nodes.incidentDepth = audio.createGain();
    nodes.incidentDepth.gain.value = 30;
    nodes.incidentLfo.type = 'triangle';
    nodes.incidentLfo.frequency.value = 0.4;
    nodes.incidentLfo.connect(nodes.incidentDepth);
    nodes.incidentDepth.connect(nodes.incidentA.frequency);
    connectMany([nodes.incidentA, nodes.incidentB], nodes.incidentFilter);
    nodes.incidentFilter.connect(nodes.incidentGain);
    nodes.incidentGain.connect(nodes.master);

    var starts = [
      nodes.hvacA, nodes.hvacB,
      nodes.pulseCarrier, nodes.pulseLfo,
      nodes.shimmerA, nodes.shimmerB,
      nodes.incidentA, nodes.incidentB, nodes.incidentLfo
    ];
    for (var i = 0; i < starts.length; i++) starts[i].start();

    layers.hvacHymn = nodes.hvacGain;
    layers.bureauPulse = nodes.pulseGain;
    layers.curiosityShimmer = nodes.shimmerGain;
    layers.incidentNoise = nodes.incidentGain;

    updateFromAxes(ns.Axes ? ns.Axes.snapshot() : null, { worldId: worldId || 'orientation' });
    if (audio.state === 'suspended') audio.resume();
  }

  function stop(){
    if (!nodes) return;
    var oscillators = [
      nodes.hvacA, nodes.hvacB,
      nodes.pulseCarrier, nodes.pulseLfo,
      nodes.shimmerA, nodes.shimmerB,
      nodes.incidentA, nodes.incidentB, nodes.incidentLfo
    ];
    for (var i = 0; i < oscillators.length; i++) {
      if (oscillators[i]) {
        try { oscillators[i].stop(); } catch (e) {}
        try { oscillators[i].disconnect(); } catch (e2) {}
      }
    }
    try { nodes.master.disconnect(); } catch (e3) {}
    nodes = null;
    layers.hvacHymn = null;
    layers.bureauPulse = null;
    layers.curiosityShimmer = null;
    layers.incidentNoise = null;
  }

  function updateFromAxes(axesSnapshot, context){
    if (!nodes) return;
    context = context || {};
    axesSnapshot = axesSnapshot || { primary: {} };
    var p = axesSnapshot.primary || {};
    var worldId = context.worldId || 'orientation';
    var rasta = worldId === 'rasta';
    var benefits = worldId === 'benefits';
    var compliance = p.compliance || 0;
    var curiosity = p.curiosity || 0;
    var chaos = p.chaos || 0;
    var grace = p.grace || 0;
    var efficiency = p.efficiency || 0;
    var tempo = (rasta ? ns.TUNING.TEMPO_BPM_RASTA : ns.TUNING.TEMPO_BPM_BASE) / 60;
    var modulation = reduceMotion() ? 0.3 : 1;

    nodes.hvacFilter.frequency.value = rasta ? 420 : (benefits ? (360 + (compliance * 520) + (grace * 90)) : (240 + (compliance * 600) + (grace * 120)));
    nodes.hvacGain.gain.value = benefits ? (0.022 + (compliance * 0.022)) : (0.03 + (compliance * 0.03));
    nodes.pulseLfo.frequency.value = tempo + (efficiency * 0.2 * modulation);
    nodes.pulseGain.gain.value = benefits ? (0.007 + (compliance * 0.016)) : (0.008 + (compliance * 0.02));
    nodes.shimmerGain.gain.value = benefits ? (0.012 + (curiosity * 0.036)) : (0.006 + (curiosity * 0.03));
    nodes.shimmerDelay.delayTime.value = benefits ? (0.11 + (curiosity * 0.08)) : (0.14 + (curiosity * 0.1));
    nodes.incidentGain.gain.value = rasta ? 0 : (benefits ? (0.001 + (chaos * 0.018 * modulation)) : (0.002 + (chaos * 0.035 * modulation)));
    nodes.incidentFilter.frequency.value = 180 + (chaos * 320);
    nodes.incidentDepth.gain.value = benefits ? (12 + (chaos * 32 * modulation)) : (18 + (chaos * 55 * modulation));
  }

  ns.Audio = {
    layers:          layers,
    start:           start,
    stop:            stop,
    updateFromAxes:  updateFromAxes,
    isRunning:       function(){ return !!nodes; }
  };
})(CEHP);
CEHP._register('30_audio');
