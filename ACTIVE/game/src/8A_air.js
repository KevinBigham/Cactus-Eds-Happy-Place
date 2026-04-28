(function(ns){
  'use strict';

  var FALLBACK_SEED = 'C';
  var FLICKER_TINT = 0xe8e0d0;
  var TAU = Math.PI * 2;
  var ADD_BLEND = typeof Phaser !== 'undefined' && Phaser.BlendModes
    ? Phaser.BlendModes.ADD
    : 'ADD';

  function randomInt(rng, min, max){
    return rng && rng.int ? min + rng.int(0, max - min + 1) : min;
  }

  function makeRng(seed){
    return ns.makeRNG ? ns.makeRNG(seed || FALLBACK_SEED) : 0;
  }

  function randomFloat(rng){
    return rng && rng.float ? rng.float() : 0;
  }

  function mainCamera(scene){
    return scene.cameras.main;
  }

  function pickFrom(rng, list){
    return list[rng && rng.int ? rng.int(0, list.length) : 0];
  }

  function inputIsActive(){
    var input = ns.Input;
    var state = input && input.state ? input.state : 0;
    var key;

    if (input && input.axisX && input.axisX()) return 1;
    if (!input || !input.justPressed || !state) return 0;

    for (key in state) {
      if (input.justPressed(key) || (input.down && input.down(key))) return 1;
    }

    return 0;
  }

  function makePaperSchedule(seed){
    var rng = makeRng((seed || FALLBACK_SEED) + '|air|paper');

    return {
      drawInterval: function(){
        return randomInt(rng, 3000, 8000);
      },
      drawLifespan: function(){
        return randomInt(rng, 25000, 45000);
      }
    };
  }

  function makeFlickerSchedule(seed){
    var rng = makeRng((seed || FALLBACK_SEED) + '|air|flicker');

    return {
      drawInterval: function(){
        return randomInt(rng, 7000, 14000);
      }
    };
  }

  function prime(scene, opts){
    var camera = mainCamera(scene);
    var seed = opts && opts.seed ? opts.seed : FALLBACK_SEED;
    var state = scene._cehpAir = {
      papers: [],
      dust: [],
      paperRng: makeRng(seed + '|air|paper'),
      dustRng: makeRng(seed + '|air|dust'),
      flickerRng: makeRng(seed + '|air|flicker'),
      nextPaperMs: 0,
      nextDustMs: 0,
      nextFlickerMs: 0,
      paperTargetCount: 0,
      dustSeeded: 0,
      flickerActive: 0,
      flickerResetHandle: 0,
      cameraYOffset: 0,
      idleStartAt: -1,
      benefitsDustMuted: !opts || opts.worldId !== 'benefits',
      flickerOverlay: scene.add.rectangle(
        camera.width,
        camera.height,
        camera.width * 2,
        camera.height * 2,
        FLICKER_TINT,
        0
      ).setScrollFactor(0).setDepth(47)
    };

    state.paperTargetCount = randomInt(state.paperRng, 4, 6);
    state.nextFlickerMs = randomInt(state.flickerRng, 7000, 14000);

    scene.events.once('shutdown', function(){
      cleanup(scene);
    });

    return state;
  }

  function spawnPaper(scene, state){
    var camera = mainCamera(scene);
    var rng = state.paperRng;
    var lifespanMs = randomInt(rng, 25000, 45000);
    var travelMs = randomInt(rng, 20000, 40000);
    var direction = rng && rng.int && rng.int(0, 2) ? 1 : -1;
    var startX = direction < 0 ? camera.width + 8 : -8;
    var endX = direction < 0 ? -8 : camera.width + 8;
    var paper = scene.add.rectangle(
      startX,
      randomInt(rng, 18, camera.height - 18),
      2,
      3,
      ns.PALETTE.PAPER_TAN,
      0.92
    ).setScrollFactor(0).setDepth(23);
    var spinRate = rng && rng.int && rng.int(0, 20) === 0
      ? (randomFloat(rng) < 0.5 ? -1 : 1) * (0.003 + (randomFloat(rng) * 0.003))
      : 0;

    state.papers.push({
      object: paper,
      lifespanMs: lifespanMs,
      ageMs: 0,
      velocityX: (endX - startX) / travelMs,
      rotationVelocity: spinRate
    });
  }

  function spawnDust(scene, state, anchor){
    var rng = state.dustRng;
    var angle = randomFloat(rng) * TAU;
    var distance = Math.sqrt(randomFloat(rng)) * 145;
    var x = anchor.x + Math.cos(angle) * distance;
    var y = anchor.y + Math.sin(angle) * distance;
    var mote = scene.add.rectangle(
      x,
      y,
      1,
      1,
      rng && rng.int && rng.int(0, 2) ? ns.PALETTE.FLUORESCENT_TAN : ns.PALETTE.OFF_WHITE,
      0.04 + (randomFloat(rng) * 0.03)
    ).setDepth(24).setBlendMode(ADD_BLEND);
    var lifespanMs = randomInt(rng, 6000, 9000);
    var jitter = (randomFloat(rng) * 2) - 1;
    var phase = randomFloat(rng) * TAU;
    var driftY = -(5 + (randomFloat(rng) * 5));

    state.dust.push({
      object: mote,
      startX: x,
      startY: y,
      lifespanMs: lifespanMs,
      ageMs: 0,
      jitter: jitter,
      phase: phase,
      driftY: driftY,
      baseAlpha: mote.alpha
    });
  }

  function activeLightAnchors(scene){
    var lightState = scene._cehpLight;
    var anchors = [];
    var i;

    if (!lightState) return anchors;

    for (i = 0; i < lightState.signs.length; i++) {
      if (lightState.signs[i]) anchors.push(lightState.signs[i]);
    }

    return anchors;
  }

  function updatePapers(dtMs, state){
    var paper;
    var i;

    for (i = state.papers.length - 1; i >= 0; i--) {
      paper = state.papers[i];
      paper.ageMs += dtMs || 0;

      if (paper.ageMs >= paper.lifespanMs) {
        paper.object.destroy();
        state.papers.splice(i, 1);
      } else {
        paper.object.x += paper.velocityX * dtMs;
        if (paper.rotationVelocity) paper.object.angle += paper.rotationVelocity * dtMs;
      }
    }
  }

  function updateDust(dtMs, state){
    var dust;
    var progress;
    var i;

    for (i = state.dust.length - 1; i >= 0; i--) {
      dust = state.dust[i];
      dust.ageMs += dtMs || 0;

      if (dust.ageMs >= dust.lifespanMs) {
        dust.object.destroy();
        state.dust.splice(i, 1);
      } else {
        progress = dust.ageMs / dust.lifespanMs;
        dust.object.x = dust.startX + (Math.sin(dust.phase + (progress * TAU)) * dust.jitter);
        dust.object.y = dust.startY + (progress * dust.driftY);
        dust.object.alpha = dust.baseAlpha * (1 - (progress * 0.5));
      }
    }
  }

  function updateIdleSway(scene, state){
    var camera = mainCamera(scene);
    var player = scene.player;
    var now = scene.time.now;

    if (state.cameraYOffset) {
      camera.scrollY -= state.cameraYOffset;
      state.cameraYOffset = 0;
    }

    if (!(player.body.blocked.down || player.body.touching.down) ||
        inputIsActive() ||
        Math.abs(player.body.velocity.x) > 4 ||
        Math.abs(player.body.velocity.y) > 4) {
      state.idleStartAt = -1;
      return;
    }

    if (state.idleStartAt < 0) state.idleStartAt = now;
    if (now - state.idleStartAt < 3000) return;

    state.cameraYOffset = Math.sin(((now - state.idleStartAt) * TAU) / 4000);
    camera.scrollY += state.cameraYOffset;
  }

  function triggerFlicker(scene, state){
    var camera = mainCamera(scene);

    if (state.flickerActive) return;

    state.flickerActive = 1;
    camera.alpha = 0.96;
    state.flickerOverlay.alpha = 0.12;

    if (state.flickerResetHandle && state.flickerResetHandle.remove) {
      state.flickerResetHandle.remove(0);
    }

    state.flickerResetHandle = scene.time.delayedCall(80, function(){
      var liveState = scene._cehpAir;
      mainCamera(scene).alpha = 1;
      liveState.flickerOverlay.alpha = 0;
      liveState.flickerActive = 0;
      liveState.flickerResetHandle = 0;
    });
  }

  function update(scene, dtMs){
    var state = scene._cehpAir;
    var anchors;
    var i;

    if (!state) return;

    if (!state.papers.length) {
      for (i = state.paperTargetCount; i--;) spawnPaper(scene, state);
      state.nextPaperMs = randomInt(state.paperRng, 3000, 8000);
    }

    state.nextPaperMs -= dtMs || 0;
    if (state.nextPaperMs <= 0 && state.papers.length < state.paperTargetCount) {
      spawnPaper(scene, state);
      state.nextPaperMs = randomInt(state.paperRng, 3000, 8000);
    }

    updatePapers(dtMs, state);

    anchors = activeLightAnchors(scene);
    if (anchors.length) {
      if (!state.dustSeeded) {
        for (i = 6; i--;) spawnDust(scene, state, pickFrom(state.dustRng, anchors));
        state.dustSeeded = 1;
        state.nextDustMs = randomInt(state.dustRng, 350, 650);
      }

      state.nextDustMs -= dtMs || 0;
      if (state.nextDustMs <= 0 && state.dust.length < 18) {
        spawnDust(scene, state, pickFrom(state.dustRng, anchors));
        state.nextDustMs = randomInt(state.dustRng, 350, 650);
      }
    }

    updateDust(dtMs, state);
    updateIdleSway(scene, state);

    state.nextFlickerMs -= dtMs || 0;
    if (state.nextFlickerMs <= 0 && !state.flickerActive) {
      state.nextFlickerMs = randomInt(state.flickerRng, 7000, 14000);
      triggerFlicker(scene, state);
    }
  }

  function cleanup(scene){
    var state = scene && scene._cehpAir;
    var camera = scene && scene.cameras && scene.cameras.main;
    var resetHandle;
    var cameraYOffset;
    var papers;
    var dust;
    var overlay;
    var i;

    if (!state) return;

    resetHandle = state.flickerResetHandle || state.b;
    cameraYOffset = state.cameraYOffset != null ? state.cameraYOffset : state.y;
    papers = state.papers || state.p || [];
    dust = state.dust || state.d || [];
    overlay = state.flickerOverlay || state.v;

    if (resetHandle && resetHandle.remove) {
      resetHandle.remove(0);
    }

    if (cameraYOffset && camera) camera.scrollY -= cameraYOffset;
    if (camera) camera.alpha = 1;

    for (i = papers.length; i--;) {
      if (papers[i] && papers[i].object && papers[i].object.destroy) {
        papers[i].object.destroy();
      }
    }

    for (i = dust.length; i--;) {
      if (dust[i] && dust[i].object && dust[i].object.destroy) {
        dust[i].object.destroy();
      }
    }

    if (overlay && overlay.destroy) overlay.destroy();
    scene._cehpAir = 0;
  }

  ns.Air = {
    prime: prime,
    update: update,
    cleanup: cleanup,
    makePaperSchedule: makePaperSchedule,
    makeFlickerSchedule: makeFlickerSchedule
  };
})(CEHP);
CEHP._register('8A_air');
