/* MODULE: 11_METRICS - recency-weighted micro-signal tracking.
   Feeds receipt text selection; never surfaced to the player. */

(function(ns){
  'use strict';

  var WINDOW_MS = 8000;
  var IDLE_BUCKET_MS = 400;
  var BACKTRACK_PX = 12;
  var state = null;
  var bound = false;

  function freshState(){
    return {
      timeMs: 0,
      idleMs: 0,
      idleBuckets: 0,
      lastX: null,
      lastY: null,
      lastFacing: 1,
      totals: {},
      recent: []
    };
  }

  function reset(){
    state = freshState();
  }

  function trim(){
    var cutoff = state.timeMs - WINDOW_MS;
    while (state.recent.length && state.recent[0].t < cutoff) {
      state.recent.shift();
    }
  }

  function pushRecent(key, amount, payload){
    state.recent.push({
      key: key,
      amount: amount,
      payload: payload || null,
      t: state.timeMs
    });
    trim();
  }

  function record(signalKey, n, payload){
    var amount = n == null ? 1 : n;
    state.totals[signalKey] = (state.totals[signalKey] || 0) + amount;
    pushRecent(signalKey, amount, payload);
    return state.totals[signalKey];
  }

  function bind(topic, key){
    if (!ns.Events || !ns.Events.on) return;
    ns.Events.on(topic, function(payload){
      record(key, payload && payload.amount ? payload.amount : 1, payload);
    });
  }

  function bindEvents(){
    if (bound || !ns.Events || !ns.Events.on) return;
    bound = true;
    bind('sign:peek', 'signPeek');
    bind('sign:read', 'signRead');
    bind('movement:jump', 'jump');
    bind('movement:doubleJump', 'doubleJump');
    bind('movement:tripleJump', 'tripleJump');
    bind('movement:wallJump', 'wallJump');
    bind('movement:punch', 'punch');
    bind('movement:kick', 'kick');
    bind('movement:spinDash', 'spinDash');
    bind('movement:cigCopter', 'cigCopter');
    bind('movement:groundSlam', 'groundSlam');
    bind('movement:glide', 'glide');
    bind('movement:backtrack', 'backtrack');
    bind('movement:idle', 'idle');
    bind('movement:nearMiss', 'nearMiss');
    bind('movement:correction', 'correction');
    bind('contradiction:follow', 'follow');
    bind('contradiction:defy', 'defy');
    bind('form:used', 'formUsed');
    bind('combat:damageTaken', 'damageTaken');
    bind('combat:damageDealt', 'damageDealt');
    bind('player:death', 'death');
    bind('player:respawn', 'respawn');
    bind('run:complete', 'runComplete');
    bind('module:passed', 'modulePassed');
    bind('module:skipped', 'moduleSkipped');
    bind('music:sync', 'musicSync');
  }

  function tick(dtMs, info){
    if (!state) reset();
    state.timeMs += dtMs || 0;
    trim();
    info = info || {};

    if (info.x != null && state.lastX != null && info.facing != null && info.facing < 0 && info.x < state.lastX - BACKTRACK_PX) {
      ns.Events.emit('movement:backtrack', {
        distance: state.lastX - info.x,
        x: info.x,
        y: info.y
      });
    }

    if (info.moving) {
      state.idleMs = 0;
      state.idleBuckets = 0;
    } else {
      state.idleMs += dtMs || 0;
      while (state.idleMs >= (state.idleBuckets + 1) * IDLE_BUCKET_MS) {
        state.idleBuckets += 1;
        ns.Events.emit('movement:idle', { dtMs: IDLE_BUCKET_MS, x: info.x, y: info.y });
      }
    }

    state.lastX = info.x != null ? info.x : state.lastX;
    state.lastY = info.y != null ? info.y : state.lastY;
    state.lastFacing = info.facing != null ? info.facing : state.lastFacing;
  }

  function snapshot(){
    return JSON.parse(JSON.stringify(state));
  }

  reset();
  bindEvents();

  ns.Metrics = {
    tick:       tick,
    record:     record,
    reset:      reset,
    snapshot:   snapshot,
    bindEvents: bindEvents
  };
})(CEHP);
CEHP._register('11_metrics');
