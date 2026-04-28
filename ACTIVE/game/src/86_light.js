/* MODULE: 86_LIGHT - W7 LightKit fake ambient leaks + sign emissives.
   PlayScene only; no native light pipeline, no hidden randomness. */

(function(ns){
  'use strict';

  var AMBIENT_KEY = 'cehp-light-ambient';
  var EMISSIVE_KEY = 'cehp-light-emissive';
  var AMBIENT_SIZE = 256;
  var AMBIENT_DEPTH = 22;
  var AMBIENT_ALPHA = 0.45;
  var SIGN_BASE_ALPHA = 0.32;
  var SIGN_LOW_ALPHA = 0.16;
  var NORMAL_MIN_MS = 2800;
  var NORMAL_MAX_MS = 6800;
  var BAD_MIN_MS = 30000;
  var BAD_MAX_MS = 60000;
  var NORMAL_BEAT_MS = 55;
  var BAD_BEAT_MS = 50;

  function blendAdd(){
    if (typeof Phaser !== 'undefined' && Phaser.BlendModes) return Phaser.BlendModes.ADD;
    return 'ADD';
  }

  function inclusiveRange(rng, min, max){
    if (!rng || !rng.int) return min;
    return min + rng.int(0, (max - min) + 1);
  }

  function worldAmbientSpec(worldId, width, height){
    width = width || ns.GAME_W || 512;
    height = height || ns.GAME_H || 448;

    if (worldId === 'benefits') {
      return {
        tint: ns.PALETTE ? ns.PALETTE.COOL_KIOSK : 0xa8b8c4,
        x: width * 0.5,
        y: -height * 0.05,
        depth: AMBIENT_DEPTH,
        alpha: AMBIENT_ALPHA
      };
    }
    if (worldId === 'rasta') {
      return {
        tint: ns.PALETTE ? ns.PALETTE.WARM_EXIT : 0xe8a868,
        x: -width * 0.05,
        y: height * 0.55,
        depth: AMBIENT_DEPTH,
        alpha: AMBIENT_ALPHA
      };
    }
    return {
      tint: ns.PALETTE ? ns.PALETTE.FLUORESCENT_TAN : 0xf4e2c0,
      x: width * 1.05,
      y: height * 0.28,
      depth: AMBIENT_DEPTH,
      alpha: AMBIENT_ALPHA
    };
  }

  function makeFlickerState(caseSeed, signKey){
    var rng = ns.makeRNG ? ns.makeRNG(String(caseSeed || 'CASE-UNKNOWN') + '|light|' + String(signKey || 'sign-0')) : null;

    function drawNormalMs(){
      return inclusiveRange(rng, NORMAL_MIN_MS, NORMAL_MAX_MS);
    }

    function drawBadMs(){
      return inclusiveRange(rng, BAD_MIN_MS, BAD_MAX_MS);
    }

    return {
      rng: rng,
      drawNormalMs: drawNormalMs,
      drawBadMs: drawBadMs,
      nextNormalMs: drawNormalMs(),
      nextBadMs: drawBadMs(),
      busy: false,
      activeTween: null
    };
  }

  function ensureLayer(scene, opts){
    var layer = scene && scene._cehpLight ? scene._cehpLight : null;
    if (!scene) return null;
    if (!layer) {
      layer = {
        signs: [],
        emissives: [],
        ambient: null,
        originalPlace: null,
        wrappedPlace: null,
        primed: false,
        attached: false,
        cleanupBound: false,
        seed: '',
        worldId: 'orientation'
      };
      scene._cehpLight = layer;
    }
    if (opts) {
      if (opts.seed != null) layer.seed = opts.seed;
      if (opts.worldId) layer.worldId = opts.worldId;
    }
    return layer;
  }

  function bindCleanup(scene, layer){
    if (!scene || !layer || layer.cleanupBound || !scene.events || !scene.events.once) return;
    layer.cleanupBound = true;
    scene.events.once('shutdown', function(){
      cleanup(scene);
    });
  }

  function resetTexture(scene, key, width, height, drawFn){
    var graphics;
    if (!scene || !scene.add || !scene.add.graphics || !scene.textures) return null;
    if (scene.textures.exists && scene.textures.exists(key)) scene.textures.remove(key);
    graphics = scene.add.graphics();
    drawFn(graphics, width, height);
    if (graphics.generateTexture) graphics.generateTexture(key, width, height);
    if (graphics.destroy) graphics.destroy();
    return key;
  }

  function ensureTextures(scene){
    resetTexture(scene, AMBIENT_KEY, AMBIENT_SIZE, AMBIENT_SIZE, function(graphics, width, height){
      var steps = 18;
      var i;
      var radius;
      var alpha;
      for (i = steps; i >= 1; i--) {
        radius = (width / 2) * (i / steps);
        alpha = Math.max(0.01, ((i / steps) * (i / steps)) * 0.18);
        graphics.fillStyle(0xffffff, alpha);
        graphics.fillCircle(width / 2, height / 2, radius);
      }
    });
    resetTexture(scene, EMISSIVE_KEY, 1, 1, function(graphics){
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(0, 0, 1, 1);
    });
  }

  function signIdentity(layer, sign, index){
    if (sign && sign.id) return sign.id;
    return String(layer.worldId || 'orientation')
      + '|' + String(sign && sign.x != null ? sign.x : 0)
      + '|' + String(sign && sign.y != null ? sign.y : 0)
      + '|' + String(index || 0);
  }

  function clearTween(scene, entry){
    if (!entry) return;
    if (scene && scene.tweens && scene.tweens.killTweensOf && entry.image) {
      scene.tweens.killTweensOf(entry.image);
    }
    if (entry.activeTween && entry.activeTween.stop) entry.activeTween.stop();
    if (entry.activeTween && entry.activeTween.remove) entry.activeTween.remove();
    entry.activeTween = null;
    entry.busy = false;
    if (entry.image && entry.image.setAlpha) entry.image.setAlpha(SIGN_BASE_ALPHA);
  }

  function runSequence(scene, entry, values, beatMs){
    var tweens = [];
    var i;
    clearTween(scene, entry);
    entry.busy = true;

    if (!scene || !scene.tweens || !scene.tweens.chain || !entry.image) {
      entry.busy = false;
      if (entry.image && entry.image.setAlpha) entry.image.setAlpha(SIGN_BASE_ALPHA);
      return;
    }

    for (i = 0; i < values.length; i++) {
      tweens.push({
        alpha: values[i],
        duration: beatMs,
        ease: 'Linear'
      });
    }

    entry.activeTween = scene.tweens.chain({
      targets: entry.image,
      tweens: tweens,
      onComplete: function(){
        entry.activeTween = null;
        entry.busy = false;
        if (entry.image && entry.image.setAlpha) entry.image.setAlpha(SIGN_BASE_ALPHA);
      }
    });
  }

  function fireNormal(scene, entry){
    runSequence(scene, entry, [SIGN_LOW_ALPHA, SIGN_BASE_ALPHA], NORMAL_BEAT_MS);
  }

  function fireBad(scene, entry){
    runSequence(scene, entry, [
      SIGN_LOW_ALPHA, SIGN_BASE_ALPHA,
      SIGN_LOW_ALPHA, SIGN_BASE_ALPHA,
      SIGN_LOW_ALPHA, SIGN_BASE_ALPHA
    ], BAD_BEAT_MS);
  }

  function buildEmissive(scene, layer, sign, index){
    var paper;
    var width;
    var height;
    var fx;
    var fy;
    var state;
    var image;
    var entry;
    if (!scene || !layer || !sign || !sign.paper || sign._cehpLightEmissive) return sign && sign._cehpLightEmissive;
    if (!scene.add || !scene.add.image) return null;

    paper = sign.paper;
    width = (paper.width || paper.displayWidth || 104) * 1.08;
    height = (paper.height || paper.displayHeight || 34) * 1.08;
    fx = paper.scrollFactorX != null ? paper.scrollFactorX : 1;
    fy = paper.scrollFactorY != null ? paper.scrollFactorY : fx;
    state = makeFlickerState(layer.seed, signIdentity(layer, sign, index));

    image = scene.add.image(sign.x, sign.y, EMISSIVE_KEY)
      .setOrigin(0.5)
      .setDepth(((paper.depth != null ? paper.depth : 9) - 1))
      .setAlpha(SIGN_BASE_ALPHA)
      .setTint(ns.PALETTE ? ns.PALETTE.FLUORESCENT_TAN : 0xf4e2c0)
      .setBlendMode(blendAdd());

    if (image.setDisplaySize) image.setDisplaySize(width, height);
    if (image.setScrollFactor) image.setScrollFactor(fx, fy);

    entry = {
      sign: sign,
      image: image,
      signKey: signIdentity(layer, sign, index),
      rng: state.rng,
      drawNormalMs: state.drawNormalMs,
      drawBadMs: state.drawBadMs,
      nextNormalMs: state.nextNormalMs,
      nextBadMs: state.nextBadMs,
      busy: state.busy,
      activeTween: state.activeTween
    };

    sign._cehpLightEmissive = entry;
    layer.emissives.push(entry);
    return entry;
  }

  function captureSign(scene, sign){
    var layer = ensureLayer(scene);
    if (!layer || !sign || sign._cehpLightCaptured) return sign;
    sign._cehpLightCaptured = true;
    sign._cehpLightIndex = layer.signs.length;
    layer.signs.push(sign);
    if (layer.attached) buildEmissive(scene, layer, sign, sign._cehpLightIndex);
    return sign;
  }

  function prime(scene, opts){
    var layer = ensureLayer(scene, opts);
    if (!scene || !layer || layer.primed || !ns.Signs || !ns.Signs.place) return layer;

    layer.originalPlace = ns.Signs.place;
    layer.wrappedPlace = function(sceneArg){
      var sign = layer.originalPlace.apply(this, arguments);
      if (sceneArg === scene) captureSign(scene, sign);
      return sign;
    };
    ns.Signs.place = layer.wrappedPlace;
    layer.primed = true;
    bindCleanup(scene, layer);
    return layer;
  }

  function attach(scene, opts){
    var layer = ensureLayer(scene, opts);
    var width;
    var height;
    var spec;
    var i;
    if (!scene || !layer || layer.attached) return layer;

    bindCleanup(scene, layer);
    ensureTextures(scene);
    width = scene.cameras && scene.cameras.main ? scene.cameras.main.width : (ns.GAME_W || 512);
    height = scene.cameras && scene.cameras.main ? scene.cameras.main.height : (ns.GAME_H || 448);
    spec = worldAmbientSpec(layer.worldId, width, height);

    if (scene.add && scene.add.image) {
      layer.ambient = scene.add.image(spec.x, spec.y, AMBIENT_KEY)
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(spec.depth)
        .setAlpha(spec.alpha)
        .setTint(spec.tint)
        .setBlendMode(blendAdd());
    }

    layer.attached = true;
    for (i = 0; i < layer.signs.length; i++) {
      buildEmissive(scene, layer, layer.signs[i], i);
    }
    return layer;
  }

  function update(scene, delta){
    var layer = scene && scene._cehpLight ? scene._cehpLight : null;
    var i;
    var entry;
    if (!layer || !layer.attached) return;

    for (i = 0; i < layer.emissives.length; i++) {
      entry = layer.emissives[i];
      if (!entry || !entry.image) continue;

      entry.nextNormalMs -= delta;
      entry.nextBadMs -= delta;

      if (entry.busy) continue;
      if (entry.nextBadMs <= 0) {
        entry.nextBadMs = entry.drawBadMs();
        fireBad(scene, entry);
        continue;
      }
      if (entry.nextNormalMs <= 0) {
        entry.nextNormalMs = entry.drawNormalMs();
        fireNormal(scene, entry);
      }
    }
  }

  function cleanup(scene){
    var layer = scene && scene._cehpLight ? scene._cehpLight : null;
    var i;
    if (!layer) return;

    if (ns.Signs && layer.originalPlace && ns.Signs.place === layer.wrappedPlace) {
      ns.Signs.place = layer.originalPlace;
    }

    for (i = 0; i < layer.emissives.length; i++) {
      clearTween(scene, layer.emissives[i]);
      if (layer.emissives[i].image && layer.emissives[i].image.destroy) layer.emissives[i].image.destroy();
      if (layer.emissives[i].sign) layer.emissives[i].sign._cehpLightEmissive = null;
    }
    layer.emissives = [];

    if (layer.ambient && layer.ambient.destroy) layer.ambient.destroy();
    layer.ambient = null;

    if (scene && scene.textures && scene.textures.exists && scene.textures.remove) {
      if (scene.textures.exists(AMBIENT_KEY)) scene.textures.remove(AMBIENT_KEY);
      if (scene.textures.exists(EMISSIVE_KEY)) scene.textures.remove(EMISSIVE_KEY);
    }

    layer.signs = [];
    layer.originalPlace = null;
    layer.wrappedPlace = null;
    layer.primed = false;
    layer.attached = false;
    layer.cleanupBound = false;
    scene._cehpLight = null;
  }

  ns.Light = {
    prime: prime,
    attach: attach,
    update: update,
    cleanup: cleanup,
    worldAmbientSpec: worldAmbientSpec,
    makeFlickerState: makeFlickerState
  };
})(CEHP);
CEHP._register('86_light');
