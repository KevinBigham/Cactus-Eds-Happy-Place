/* MODULE: 51_CONTRADICTION - same sign different behavior > different route.
   DO NOT JUMP: jump opens lower path, wait opens upper.
   Receipts: INSUBORDINATION NOTED / PATIENCE REWARDED. */

(function(ns){
  'use strict';

  function gate(config){
    config = config || {};

    var out = {
      sign: config.sign || null,
      expectedBehavior: config.expectedBehavior || 'wait',
      windowMs: config.windowMs || config.window || 800,
      onFollow: typeof config.onFollow === 'function' ? config.onFollow : function(){},
      onDefy: typeof config.onDefy === 'function' ? config.onDefy : function(){},
      resolved: false,
      outcome: null,
      routeResult: null,
      evaluate: function(payload){
        payload = payload || {};
        if (out.resolved) return out.outcome;

        var action = payload.action || '';
        var elapsedMs = payload.elapsedMs || 0;
        var expected = out.expectedBehavior;

        if (action && action !== expected && elapsedMs <= out.windowMs) {
          out.outcome = 'defy';
          out.resolved = true;
          out.routeResult = out.onDefy(payload);
          if (ns.Events && ns.Events.emit) {
            ns.Events.emit('contradiction:defy', { gateId: out.sign && out.sign.id, action: action, elapsedMs: elapsedMs });
          }
          return out.outcome;
        }

        if (expected !== 'wait' && action === expected) {
          out.outcome = 'follow';
          out.resolved = true;
          out.routeResult = out.onFollow(payload);
          if (ns.Events && ns.Events.emit) {
            ns.Events.emit('contradiction:follow', { gateId: out.sign && out.sign.id, action: action, elapsedMs: elapsedMs });
          }
          return out.outcome;
        }

        if (expected === 'wait' && elapsedMs >= out.windowMs) {
          out.outcome = 'follow';
          out.resolved = true;
          out.routeResult = out.onFollow(payload);
          if (ns.Events && ns.Events.emit) {
            ns.Events.emit('contradiction:follow', { gateId: out.sign && out.sign.id, action: 'wait', elapsedMs: elapsedMs });
          }
          return out.outcome;
        }

        return 'pending';
      }
    };

    return out;
  }

  ns.Contradiction = {
    gate: gate
  };
})(CEHP);
CEHP._register('51_contradiction');
