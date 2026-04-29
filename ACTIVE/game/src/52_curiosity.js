/* MODULE: 52_CURIOSITY - W8-R05 second-payoff.
   Listens to sign:peek/read; fires curiosity:reward 3-5s later.
   MUST NOT bump ns.Axes.curiosity - 10_axes.js:76 owns that axis. */

(function(ns){
  'use strict';

  var state = null;
  var REWARD_KINDS = ['environmental', 'luminous', 'receipt'];

  function armReward(payload){
    if (!state) return;

    state.nextMs = state.rng && state.rng.int ? state.rng.int(3000, 5001) : 4000;
    state.signId = payload && payload.signId ? payload.signId : null;
    state.pending = true;
  }

  function emitReward(){
    var kind = state.rng && state.rng.int
      ? REWARD_KINDS[state.rng.int(0, 3)]
      : 'receipt';

    if (kind === 'receipt' && state.scene && state.scene.runState) {
      state.scene.runState.curiosityPays = (state.scene.runState.curiosityPays || 0) + 1;
    }

    ns.emit('curiosity:reward', {
      kind: kind,
      signId: state.signId,
      worldId: state.worldId
    });

    state.pending = false;
  }

  ns.Curiosity = {
    prime: function(scene, worldId){
      var seed = scene && scene.data && scene.data.get
        ? scene.data.get('caseSeed')
        : null;

      state = {
        scene: scene || null,
        worldId: worldId || null,
        pending: false,
        nextMs: 0,
        signId: null,
        rng: ns.makeRNG
          ? ns.makeRNG((seed || 'cehp') + '|curiosity|' + (worldId || ''))
          : null
      };

      if (ns.Events && ns.Events.on) {
        ns.Events.on('sign:peek', armReward);
        ns.Events.on('sign:read', armReward);
      }
    },

    update: function(scene, dtMs){
      if (!state || !state.pending) return;

      state.nextMs -= dtMs || 0;
      if (state.nextMs <= 0) emitReward();
    }
  };
})(CEHP);
CEHP._register('52_curiosity');
