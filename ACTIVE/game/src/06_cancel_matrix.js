/* MODULE: 06_CANCEL_MATRIX - data-first action cancel skeleton for W10.
   Dormant infrastructure for W10 Phase 1. */

(function(ns){
  'use strict';

  function cloneRule(rule){
    if (!rule) return null;
    return {
      toState: rule.toState,
      bufferFrames: rule.bufferFrames,
      cooldownFrames: rule.cooldownFrames,
      window: {
        startFrame: rule.window.startFrame,
        endFrame: rule.window.endFrame
      }
    };
  }

  function cloneRules(source){
    var out = {};
    var state;
    var input;
    for (state in source) {
      if (!Object.prototype.hasOwnProperty.call(source, state)) continue;
      out[state] = {};
      for (input in source[state]) {
        if (!Object.prototype.hasOwnProperty.call(source[state], input)) continue;
        out[state][input] = cloneRule(source[state][input]);
      }
    }
    return out;
  }

  function rule(toState, bufferFrames, cooldownFrames, startFrame, endFrame){
    return {
      toState: toState,
      bufferFrames: bufferFrames,
      cooldownFrames: cooldownFrames,
      window: {
        startFrame: startFrame,
        endFrame: endFrame
      }
    };
  }

  var MATRIX = {
    idle: {
      jump: rule('jumpRise', 6, 0, 0, -1),
      dash: rule('dash', 5, 4, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    run: {
      jump: rule('jumpRise', 6, 0, 0, -1),
      dash: rule('dash', 5, 4, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    skid: {
      jump: rule('jumpRise', 6, 0, 0, -1),
      dash: rule('dash', 5, 4, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    crouch: {
      jump: rule('jumpRise', 6, 0, 0, -1),
      dash: rule('dash', 5, 4, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    jumpRise: {
      jump: rule('doubleJump', 6, 0, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    jumpApex: {
      jump: rule('doubleJump', 6, 0, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    jumpFall: {
      jump: rule('doubleJump', 6, 0, 0, -1),
      melee: rule('melee', 5, 3, 0, -1),
      ranged: rule('ranged', 5, 3, 0, -1)
    },
    wallSlide: {
      jump: rule('wallJump', 6, 0, 0, -1)
    }
  };

  function rules(){
    return cloneRules(MATRIX);
  }

  function get(fromState, input){
    if (!MATRIX[fromState] || !MATRIX[fromState][input]) return null;
    return cloneRule(MATRIX[fromState][input]);
  }

  function has(fromState, input){
    return !!(MATRIX[fromState] && MATRIX[fromState][input]);
  }

  ns.CancelMatrix = {
    rules: rules,
    get: get,
    has: has
  };
})(CEHP);
CEHP._register('06_cancel_matrix');
