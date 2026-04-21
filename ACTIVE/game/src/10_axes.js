/* ================================================================
   MODULE: 10_AXES
   6 primary axes + ~30 micro-signals + 3 derived pairwise tensions.
   Primary axes stay invisible during play. Receipts are the reveal.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var primary = { compliance:0, intuition:0, curiosity:0, grace:0, chaos:0, efficiency:0 };

  var micro = {
    backtracks:0, idleMs:0, signPeeks:0, nearMisses:0, jumpCount:0,
    kickCount:0, punchCount:0, wallJumps:0, corrections:0,
    contradictionFollow:0, contradictionDefy:0, signsRead:0, signsIgnored:0,
    secretsFound:0, secretsMissed:0, deaths:0, respawns:0, formsUsed:0,
    damageDealt:0, damageTaken:0, hitStreak:0, noHitMs:0, speedrunMs:0,
    revisits:0, restsTaken:0, cigBurnRate:0, ashLength:0, musicSync:0,
    forbiddenTouched:0, modulesPassed:0, modulesSkipped:0
  };

  var bound = false;

  function clamp01(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }

  function bumpMicro(key, n){
    if (!Object.prototype.hasOwnProperty.call(micro, key)) return;
    micro[key] += n == null ? 1 : n;
  }

  function set(axis, v){
    if (Object.prototype.hasOwnProperty.call(primary, axis)) primary[axis] = clamp01(v);
  }
  function bump(axis, delta){
    if (Object.prototype.hasOwnProperty.call(primary, axis)) primary[axis] = clamp01(primary[axis] + delta);
  }
  function get(axis){
    return Object.prototype.hasOwnProperty.call(primary, axis) ? primary[axis] : 0;
  }

  function snapshot(){
    return JSON.parse(JSON.stringify({ primary: primary, micro: micro }));
  }

  function tensions(){
    return {
      obedience: primary.compliance - primary.chaos,
      style:     primary.grace + primary.efficiency,
      auditRisk: primary.curiosity - primary.intuition
    };
  }

  function dominant(){
    var best = null, score = -Infinity;
    for (var k in primary) {
      if (!Object.prototype.hasOwnProperty.call(primary, k)) continue;
      if (primary[k] > score) { score = primary[k]; best = k; }
    }
    return best;
  }

  function reset(){
    for (var k in primary) primary[k] = 0;
    for (var m in micro)   micro[m]   = 0;
  }

  function bind(topic, fn){
    if (!ns.Events || !ns.Events.on) return;
    ns.Events.on(topic, fn);
  }

  function bindEvents(){
    if (bound || !ns.Events || !ns.Events.on) return;
    bound = true;

    bind('sign:peek', function(payload){
      bumpMicro('signPeeks', 1);
      bump('curiosity', 0.02);
      bump('intuition', 0.01);
      if (payload && payload.words > 6) bump('curiosity', 0.01);
    });

    bind('sign:read', function(payload){
      bumpMicro('signsRead', 1);
      bump('curiosity', 0.04);
      bump('compliance', 0.02);
      if (payload && payload.defiant) bump('chaos', 0.01);
    });

    bind('movement:jump', function(){
      bumpMicro('jumpCount', 1);
      bump('grace', 0.02);
    });

    bind('movement:doubleJump', function(){
      bumpMicro('jumpCount', 1);
      bump('grace', 0.03);
      bump('chaos', 0.005);
    });

    bind('movement:tripleJump', function(){
      bumpMicro('jumpCount', 1);
      bump('grace', 0.035);
      bump('chaos', 0.01);
    });

    bind('movement:wallJump', function(){
      bumpMicro('wallJumps', 1);
      bump('grace', 0.04);
    });

    bind('movement:punch', function(){
      bumpMicro('punchCount', 1);
      bump('chaos', 0.02);
    });

    bind('movement:kick', function(){
      bumpMicro('kickCount', 1);
      bump('chaos', 0.03);
      bump('efficiency', 0.01);
    });

    bind('movement:spinDash', function(payload){
      bump('efficiency', 0.04);
      bump('chaos', 0.015);
      if (payload && payload.tier > 1) bump('grace', 0.01);
    });

    bind('movement:cigCopter', function(){
      bump('intuition', 0.025);
      bump('grace', 0.01);
    });

    bind('movement:groundSlam', function(){
      bump('chaos', 0.035);
    });

    bind('movement:glide', function(){
      bump('grace', 0.03);
      bump('intuition', 0.01);
    });

    bind('movement:idle', function(payload){
      var dt = payload && payload.dtMs ? payload.dtMs : 0;
      bumpMicro('idleMs', dt);
      bump('compliance', 0.015);
    });

    bind('movement:backtrack', function(payload){
      bumpMicro('backtracks', 1);
      if (payload && payload.distance) bump('curiosity', Math.min(0.05, payload.distance / 1000));
      else bump('curiosity', 0.02);
    });

    bind('movement:nearMiss', function(){
      bumpMicro('nearMisses', 1);
      bump('grace', 0.03);
    });

    bind('movement:correction', function(payload){
      bumpMicro('corrections', 1);
      bump('grace', 0.02);
      if (payload && payload.distance) bump('efficiency', 0.005);
    });

    bind('contradiction:follow', function(){
      bumpMicro('contradictionFollow', 1);
      bump('compliance', 0.05);
      bump('efficiency', 0.02);
    });

    bind('contradiction:defy', function(){
      bumpMicro('contradictionDefy', 1);
      bump('chaos', 0.06);
      bump('curiosity', 0.03);
    });

    bind('form:used', function(){
      bumpMicro('formsUsed', 1);
      bump('efficiency', 0.02);
    });

    bind('secret:found', function(){
      bumpMicro('secretsFound', 1);
      bump('curiosity', 0.04);
      bump('intuition', 0.02);
    });

    bind('secret:missed', function(){
      bumpMicro('secretsMissed', 1);
      bump('compliance', 0.01);
    });

    bind('combat:damageDealt', function(payload){
      bumpMicro('damageDealt', payload && payload.amount ? payload.amount : 1);
      bump('chaos', 0.02);
    });

    bind('combat:damageTaken', function(payload){
      bumpMicro('damageTaken', payload && payload.amount ? payload.amount : 1);
      bump('intuition', 0.02);
    });

    bind('player:death', function(){
      bumpMicro('deaths', 1);
      bump('intuition', 0.02);
    });

    bind('player:respawn', function(){
      bumpMicro('respawns', 1);
    });

    bind('run:complete', function(){
      bumpMicro('modulesPassed', 1);
      bump('efficiency', 0.03);
    });

    bind('module:passed', function(){
      bumpMicro('modulesPassed', 1);
      bump('compliance', 0.015);
      bump('efficiency', 0.01);
    });

    bind('run:skipped', function(){
      bumpMicro('modulesSkipped', 1);
      bump('chaos', 0.02);
    });

    bind('module:skipped', function(){
      bumpMicro('modulesSkipped', 1);
      bump('chaos', 0.01);
    });

    bind('music:sync', function(){
      bumpMicro('musicSync', 1);
      bump('grace', 0.015);
    });

    bind('cig:burn', function(payload){
      micro.cigBurnRate = payload && payload.rate ? payload.rate : 0;
    });

    bind('cig:ash', function(payload){
      micro.ashLength = payload && payload.length ? payload.length : 0;
    });
  }

  bindEvents();

  ns.Axes = {
    primary:  primary,
    micro:    micro,
    set:      set,
    bump:     bump,
    get:      get,
    bindEvents: bindEvents,
    snapshot: snapshot,
    tensions: tensions,
    dominant: dominant,
    reset:    reset
  };
})(CEHP);
CEHP._register('10_axes');
