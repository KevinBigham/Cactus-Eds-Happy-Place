/* MODULE: 88_FEEL - W7 FeelKit. Pickup feedback, camera lookahead,
   landing settle, run-scoped gravity helpers, W8-R04 Rayman camera. */

(function(ns){
  'use strict';

  var audioCtx = null;
  var LOOKAHEAD_MS = 180;
  var LOOKAHEAD_PX = 14;
  var SHAKE_COOLDOWN_MS = 800;

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function stopTween(tween){
    if (!tween) return;
    if (tween.stop) tween.stop();
    if (tween.remove) tween.remove();
  }

  function setBodyGravityY(body, value){
    if (!body) return;
    if (body.setGravityY) body.setGravityY(value);
    else if (body.gravity) body.gravity.y = value;
  }

  function ensureAudioCtx(){
    if (audioCtx) return audioCtx;
    if (typeof window === 'undefined') return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
    return audioCtx;
  }

  function ensureSceneState(scene){
    var state;
    if (!scene) return null;
    state = scene._cehpFeel;
    if (!state) {
      state = scene._cehpFeel = {
        bound: false,
        pauseActive: false,
        pauseOriginal: false,
        pauseHandle: null,
        pauseUnlockAt: 0,
        lookaheadOffset: 0,
        lookaheadStart: 0,
        lookaheadTarget: 0,
        lookaheadElapsed: LOOKAHEAD_MS,
        lastFacing: 0,
        squashTween: null,
        settleTween: null,
        vertOffset: 0
      };
    }
    if (!scene._cehpFeelShake) scene._cehpFeelShake = makeShakeBudget();
    if (!state.bound && scene.events && scene.events.once) {
      state.bound = true;
      scene.events.once('shutdown', function(){ cleanup(scene); });
    }
    return state;
  }

  function cleanup(scene){
    var state = scene && scene._cehpFeel ? scene._cehpFeel : null;
    if (!scene || !state) return;
    stopTween(state.squashTween);
    stopTween(state.settleTween);
    if (state.pauseHandle && state.pauseHandle.remove) state.pauseHandle.remove(false);
    if (state.pauseActive && scene.physics && scene.physics.world) {
      scene.physics.world.isPaused = !!state.pauseOriginal;
    }
    scene._cehpFeel = null;
    scene._cehpFeelShake = null;
  }

  function requestPause(scene, durationMs){
    var state = ensureSceneState(scene);
    var now;
    var delayMs;
    if (!scene || !state || !scene.physics || !scene.physics.world) return;
    now = scene.time && scene.time.now != null ? scene.time.now : 0;
    if (!state.pauseActive) {
      state.pauseActive = true;
      state.pauseOriginal = !!scene.physics.world.isPaused;
    }
    scene.physics.world.isPaused = true;
    state.pauseUnlockAt = Math.max(state.pauseUnlockAt || 0, now + durationMs);
    delayMs = Math.max(1, state.pauseUnlockAt - now);
    if (state.pauseHandle && state.pauseHandle.remove) state.pauseHandle.remove(false);
    if (!scene.time || !scene.time.delayedCall) return;
    state.pauseHandle = scene.time.delayedCall(delayMs, function(){
      var live = scene._cehpFeel;
      if (!live) return;
      if (scene.physics && scene.physics.world) scene.physics.world.isPaused = !!live.pauseOriginal;
      live.pauseActive = false;
      live.pauseOriginal = false;
      live.pauseHandle = null;
      live.pauseUnlockAt = 0;
    });
  }

  function makeShakeBudget(){
    return {
      lastAmplitude: 0,
      lastDuration: 0,
      lastGrantedAt: -SHAKE_COOLDOWN_MS,
      request: function(now, opts){
        opts = opts || {};
        now = now == null ? 0 : now;
        if (opts.signReadActive) return false;
        if ((now - this.lastGrantedAt) < SHAKE_COOLDOWN_MS) return false;
        this.lastAmplitude = clamp(opts.amplitude == null ? 0 : opts.amplitude, 0, 6);
        this.lastDuration = opts.duration == null ? 0 : opts.duration;
        this.lastGrantedAt = now;
        return true;
      },
      reset: function(){
        this.lastAmplitude = 0;
        this.lastDuration = 0;
        this.lastGrantedAt = -SHAKE_COOLDOWN_MS;
      }
    };
  }

  function drawInclusive(rng, min, max){
    if (!rng || !rng.int) return min;
    return min + rng.int(0, (max - min) + 1);
  }

  function buildFleckBurst(caseSeed, pickupId){
    var rng = ns.makeRNG ? ns.makeRNG(String(caseSeed || 'CASE-UNKNOWN') + '|feel|fleck|' + String(pickupId || 'pickup-0')) : null;
    var out = [];
    var i;
    for (i = 0; i < 4; i++) {
      out.push({
        x: drawInclusive(rng, -10, 10),
        y: drawInclusive(rng, -35, -20),
        life: drawInclusive(rng, 450, 650)
      });
    }
    return out;
  }

  function spawnFleckVelocities(caseSeed, pickupId){
    var burst = buildFleckBurst(caseSeed, pickupId);
    var out = [];
    var i;
    for (i = 0; i < burst.length; i++) out.push({ x: burst[i].x, y: burst[i].y });
    return out;
  }

  function spawnFlecks(scene, x, y, caseSeed, pickupId){
    var burst = buildFleckBurst(caseSeed, pickupId);
    var color = ns.PALETTE && ns.PALETTE.OFF_WHITE != null ? ns.PALETTE.OFF_WHITE : 16777215;
    var i;
    var item;
    var fleck;
    if (!scene || !scene.add || !scene.add.rectangle || !scene.tweens || !scene.tweens.add) return;
    for (i = 0; i < burst.length; i++) {
      item = burst[i];
      fleck = scene.add.rectangle(x, y, 2, 2, color, 1).setDepth(24);
      scene.tweens.add({
        targets: fleck,
        x: x + (item.x * 4),
        y: y + (item.y * 4),
        alpha: 0,
        duration: item.life,
        ease: 'Quad.Out',
        onComplete: function(targets){
          var entry = targets && targets[0] ? targets[0] : null;
          if (entry && entry.destroy) entry.destroy();
        }
      });
    }
  }

  function collectRoomSigns(room, out){
    var i;
    if (!room) return;
    if (room.signs) for (i = 0; i < room.signs.length; i++) if (room.signs[i] && room.signs[i].sensor) out.push(room.signs[i]);
    if (room.modules) for (i = 0; i < room.modules.length; i++) if (room.modules[i] && room.modules[i].sign && room.modules[i].sign.sensor) out.push(room.modules[i].sign);
    if (room.gate && room.gate.sign && room.gate.sign.sensor) out.push(room.gate.sign);
    if (room.restGate && room.restGate.sign && room.restGate.sign.sensor) out.push(room.restGate.sign);
    if (room.finalSign && room.finalSign.sensor) out.push(room.finalSign);
    if (room.sign && room.sign.sensor) out.push(room.sign);
    if (room.signB && room.signB.sensor) out.push(room.signB);
  }

  function isSignReadActive(scene){
    var root = scene && scene.room ? scene.room : null;
    var room = root && root.currentRoom ? root.currentRoom : root;
    var signs = [];
    var player = scene && scene.player ? scene.player : null;
    var i;
    if (!player || !ns.Collision || !ns.Collision.intersects) return false;
    collectRoomSigns(room, signs);
    if (root && root !== room) collectRoomSigns(root, signs);
    for (i = 0; i < signs.length; i++) {
      if (signs[i] && signs[i].sensor && ns.Collision.intersects(player, signs[i].sensor)) return true;
    }
    return false;
  }

  function playClack(caseSeed, pickupId){
    var audio = ensureAudioCtx();
    var rng;
    var osc;
    var gain;
    var now;
    if (!audio) return;
    if (audio.state === 'suspended' && audio.resume) audio.resume();
    rng = ns.makeRNG ? ns.makeRNG(String(caseSeed || 'CASE-UNKNOWN') + '|feel|clack|' + String(pickupId || 'pickup-0')) : null;
    osc = audio.createOscillator();
    gain = audio.createGain();
    osc.type = 'square';
    osc.frequency.value = drawInclusive(rng, 720, 860) * (0.95 + ((rng && rng.float) ? rng.float() * 0.1 : 0.05));
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(audio.destination);
    now = audio.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.037);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  function updateCamera(scene, delta, ed){
    var state = ensureSceneState(scene);
    var camera = scene && scene.cameras ? scene.cameras.main : null;
    var body = ed && ed.body;
    var vel = body && body.velocity;
    var T = ns.TUNING;
    var facing, t, vy, tg, dt;
    if (!scene || !state || !camera || !ed) return;
    facing = ed.facing || 1;
    if (!state.lastFacing) {
      state.lastFacing = facing;
      state.lookaheadOffset = state.lookaheadStart = state.lookaheadTarget = facing * LOOKAHEAD_PX;
      state.lookaheadElapsed = LOOKAHEAD_MS;
    } else if (facing !== 0 && facing !== state.lastFacing) {
      state.lastFacing = facing;
      state.lookaheadStart = state.lookaheadOffset;
      state.lookaheadTarget = facing * LOOKAHEAD_PX;
      state.lookaheadElapsed = 0;
    }
    if (state.lookaheadElapsed < LOOKAHEAD_MS) {
      state.lookaheadElapsed = Math.min(LOOKAHEAD_MS, state.lookaheadElapsed + (delta || 16));
      t = state.lookaheadElapsed / LOOKAHEAD_MS;
      state.lookaheadOffset = state.lookaheadStart + ((state.lookaheadTarget - state.lookaheadStart) * t);
    } else state.lookaheadOffset = state.lookaheadTarget;
    vy = vel ? vel.y : 0;
    tg = 0;
    if (!(body && body.blocked && body.blocked.down)) {
      if (vy > T.CAM_FALL_V && !state.settleTween) tg = T.CAM_FALL_DY;
      else if (Math.abs(vy) < T.CAM_APEX_V && state.prevVy < 0) tg = -T.CAM_APEX_DY;
    }
    dt = delta || 16;
    if (tg !== state.vertOffset) {
      state.vertOffset += (tg - state.vertOffset) * Math.min(1, dt / (tg < 0 ? T.CAM_APEX_MS : T.CAM_FALL_MS));
      if (Math.abs(state.vertOffset - tg) < 0.5) state.vertOffset = tg;
    }
    state.prevVy = vy;
    if (camera.setFollowOffset) camera.setFollowOffset(state.lookaheadOffset + clamp((vel ? vel.x : 0) * 0.12, -T.CAM_LEAD_MAX, T.CAM_LEAD_MAX), state.vertOffset);
  }

  function onPickup(scene, x, y, caseSeed, pickupId){
    var camera = scene && scene.cameras ? scene.cameras.main : null;
    var budget = ensureSceneState(scene) ? scene._cehpFeelShake : null;
    var now = scene && scene.time && scene.time.now != null ? scene.time.now : 0;
    if (!scene) return;
    requestPause(scene, 50);
    if (budget && budget.request(now, { amplitude: 2, duration: 60, signReadActive: isSignReadActive(scene) })) {
      if (camera && camera.shake) camera.shake(60, 0.002);
    }
    spawnFlecks(scene, x, y, caseSeed, pickupId);
    if (camera && camera.flash) camera.flash(110, 216, 216, 216);
    playClack(caseSeed, pickupId);
  }

  function onLanding(scene, ed, impactSpeed){
    var state = ensureSceneState(scene);
    var camera = scene && scene.cameras ? scene.cameras.main : null;
    var baseScrollY;
    var settleProxy;
    if (!scene || !state || !ed || impactSpeed <= 200) return;
    requestPause(scene, 35);
    stopTween(state.squashTween);
    if (ed.setScale) ed.setScale(1.12, 0.88);
    if (scene.tweens && scene.tweens.add) {
      state.squashTween = scene.tweens.add({
        targets: ed,
        scaleX: 1,
        scaleY: 1,
        duration: 80,
        ease: 'Quad.Out',
        onComplete: function(){ state.squashTween = null; }
      });
    } else if (ed.setScale) {
      ed.setScale(1, 1);
    }
    stopTween(state.settleTween);
    if (camera && scene.tweens && scene.tweens.add) {
      baseScrollY = camera.scrollY;
      settleProxy = { amount: 3 };
      camera.scrollY = baseScrollY + 3;
      state.settleTween = scene.tweens.add({
        targets: settleProxy,
        amount: 0,
        duration: 90,
        ease: 'Quad.Out',
        onUpdate: function(){ camera.scrollY = baseScrollY + settleProxy.amount; },
        onComplete: function(){
          camera.scrollY = baseScrollY;
          state.settleTween = null;
        }
      });
    }
  }

  function resetGravityModifier(ed){
    if (!ed || !ed.body) return 0;
    ed.gravityMultiplier = 1;
    setBodyGravityY(ed.body, 0);
    return 0;
  }

  function applyGravityModifier(ed){
    var extra;
    if (!ed || !ed.body) return 0;
    if (ed.gravityMultiplier == null) ed.gravityMultiplier = 1;
    extra = ed.gravityMultiplier > 1 ? (ed.gravityMultiplier - 1) * ns.TUNING.GRAVITY : 0;
    setBodyGravityY(ed.body, extra);
    return extra;
  }

  ns.Feel = {
    makeShakeBudget: makeShakeBudget,
    spawnFleckVelocities: spawnFleckVelocities,
    onPickup: onPickup,
    onLanding: onLanding,
    updateCamera: updateCamera,
    applyGravityModifier: applyGravityModifier,
    resetGravityModifier: resetGravityModifier
  };
})(CEHP);
CEHP._register('88_feel');
