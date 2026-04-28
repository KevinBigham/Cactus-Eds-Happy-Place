/* MODULE: 04_FIXED_STEP - deterministic fixed-timestep accumulator.
   Dormant infrastructure for W10 Phase 1. */

(function(ns){
  'use strict';

  var STEP_MS = 1000 / 60;
  var MAX_STEPS = 5;

  function cleanNumber(value, fallback){
    value = Number(value);
    if (!isFinite(value)) return fallback;
    return value;
  }

  function cleanStepMs(value){
    value = cleanNumber(value, STEP_MS);
    return value > 0 ? value : STEP_MS;
  }

  function cleanMaxSteps(value){
    value = Math.floor(cleanNumber(value, MAX_STEPS));
    return value > 0 ? value : MAX_STEPS;
  }

  function create(opts){
    opts = opts || {};
    return {
      stepMs: cleanStepMs(opts.stepMs),
      maxSteps: cleanMaxSteps(opts.maxSteps),
      accumulatorMs: 0,
      frame: 0,
      alpha: 0,
      lastStepCount: 0
    };
  }

  function reset(state){
    state = state || create();
    state.accumulatorMs = 0;
    state.frame = 0;
    state.alpha = 0;
    state.lastStepCount = 0;
    return state;
  }

  function advance(state, dtMs, onStep){
    var steps = 0;
    var droppedMs = 0;
    var droppedSteps = 0;

    state = state || create();
    dtMs = cleanNumber(dtMs, 0);
    if (dtMs < 0) dtMs = 0;

    state.accumulatorMs += dtMs;

    while (state.accumulatorMs >= state.stepMs && steps < state.maxSteps) {
      state.accumulatorMs -= state.stepMs;
      state.frame += 1;
      steps += 1;
      if (onStep) onStep(state.frame, state.stepMs, state);
    }

    if (state.accumulatorMs >= state.stepMs) {
      droppedSteps = Math.floor(state.accumulatorMs / state.stepMs);
      droppedMs = droppedSteps * state.stepMs;
      state.accumulatorMs -= droppedMs;
    }

    if (state.accumulatorMs < 0) state.accumulatorMs = 0;

    state.lastStepCount = steps;
    state.alpha = state.stepMs > 0 ? (state.accumulatorMs / state.stepMs) : 0;

    return {
      steps: steps,
      frame: state.frame,
      alpha: state.alpha,
      droppedMs: droppedMs
    };
  }

  ns.FixedStep = {
    STEP_MS: STEP_MS,
    MAX_STEPS: MAX_STEPS,
    create: create,
    reset: reset,
    advance: advance
  };
})(CEHP);
CEHP._register('04_fixed_step');
