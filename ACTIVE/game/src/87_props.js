(function(ns){
  'use strict';

  var KEY_RECEIPT = 'cehp:prop:receipt-slip';
  var KEY_STAMP = 'cehp:prop:stamp-pad';
  var KEY_CARBON = 'cehp:prop:carbon-copy-ghost';
  var KEY_TICKET = 'cehp:prop:ticket-chit';
  var KEY_TONER = 'cehp:prop:toner-cartridge';
  var WOBBLE_RAD = Math.PI / 180;
  var WOBBLE_MS = 3000;
  var FLUTTER_MAX = 1;
  var FLUTTER_MIN = 0.97;
  var FLUTTER_MS = 420;

  function palette(name){
    if (!ns.PALETTE) return 0;
    if (name === 'OFF_WHITE') return ns.PALETTE.OFF_WHITE;
    if (name === 'COPIER_GRAY') return ns.PALETTE.COPIER_GRAY;
    if (name === 'INK_BLACK') return ns.PALETTE.INK_BLACK;
    if (name === 'PAPER_TAN') return ns.PALETTE.PAPER_TAN;
    if (name === 'SANCTION_RED') return ns.PALETTE.SANCTION_RED;
    return 0;
  }

  function ensureLayer(scene, opts){
    var layer = scene && scene._cehpProp ? scene._cehpProp : null;
    if (!scene) return null;
    if (!layer) {
      layer = {
        e: [],
        orig: null,
        wrap: null,
        primed: false,
        bound: false,
        seed: '',
        world: ''
      };
      scene._cehpProp = layer;
    }
    if (opts) {
      if (opts.seed != null) layer.seed=opts.seed; if (opts.worldId) layer.world=opts.worldId;
    }
    return layer;
  }

  function bindCleanup(scene, layer){
    if (!scene || !layer || layer.bound || !scene.events || !scene.events.once) return;
    layer.bound = true;
    scene.events.once('shutdown', function(){
      cleanup(scene);
    });
  }

  function ensureTexture(scene, key, width, height, drawFn){
    var graphics;
    if (!scene || !scene.textures || !scene.add || !scene.add.graphics) return;
    if (scene.textures.exists && scene.textures.exists(key)) return;
    graphics = scene.add.graphics();
    drawFn(graphics, width, height);
    if (graphics.generateTexture) graphics.generateTexture(key, width, height);
    if (graphics.destroy) graphics.destroy();
  }

  function drawReceiptSlip(graphics){
    graphics.fillStyle(palette('OFF_WHITE'), 1);
    graphics.fillRect(1, 1, 14, 18);
    graphics.fillStyle(palette('COPIER_GRAY'), 0.24);
    graphics.fillRect(3, 7, 10, 1);
    graphics.fillRect(3, 11, 10, 1);
    graphics.fillStyle(palette('INK_BLACK'), 1);
    graphics.fillRect(5, 1, 6, 2);
  }

  function drawStampPad(graphics){
    graphics.fillStyle(palette('PAPER_TAN'), 1);
    graphics.fillRect(1, 3, 14, 14);
    graphics.fillStyle(palette('SANCTION_RED'), 1);
    graphics.fillRect(5, 7, 6, 6);
  }

  function drawCarbonGhost(graphics){
    graphics.fillStyle(palette('OFF_WHITE'), 0.55);
    graphics.fillRect(3, 3, 12, 16);
    graphics.fillStyle(palette('OFF_WHITE'), 0.85);
    graphics.fillRect(1, 1, 12, 16);
  }

  function drawTicketChit(graphics){
    var rng = ns.makeRNG ? ns.makeRNG('prop|ticket-chit|serial') : null;
    var i;
    var dotX;
    graphics.fillStyle(palette('PAPER_TAN'), 1);
    graphics.fillRect(0, 5, 16, 10);
    graphics.fillStyle(palette('INK_BLACK'), 0.45);
    for (i = 0; i < 3; i++) {
      dotX = rng ? rng.int(2, 14) : (3 + (i * 4));
      graphics.fillRect(dotX, 10, 1, 1);
    }
  }

  function drawTonerCartridge(graphics){
    graphics.fillStyle(palette('INK_BLACK'), 1);
    graphics.fillRect(2, 2, 12, 16);
    graphics.fillStyle(palette('OFF_WHITE'), 1);
    graphics.fillRect(3, 9, 10, 1);
  }

  function ensureTextures(scene){
    ensureTexture(scene, KEY_RECEIPT, 16, 20, drawReceiptSlip);
    ensureTexture(scene, KEY_STAMP, 16, 20, drawStampPad);
    ensureTexture(scene, KEY_CARBON, 16, 20, drawCarbonGhost);
    ensureTexture(scene, KEY_TICKET, 16, 20, drawTicketChit);
    ensureTexture(scene, KEY_TONER, 16, 20, drawTonerCartridge);
  }

  function makeMotionSchedule(caseSeed, uniqueId){
    var rng = ns.makeRNG ? ns.makeRNG(String(caseSeed || '') + '|prop|' + String(uniqueId || '')) : null;
    return {
      drawWobblePhase: function(){
        return rng && rng.float ? rng.float() : 0;
      },
      drawFlutterPhase: function(){
        return rng && rng.float ? rng.float() : 0;
      }
    };
  }

  function cycleState(phase, minValue, maxValue, halfMs){
    var normalized = phase - Math.floor(phase);
    var t;
    if (normalized < 0.5) {
      t = normalized * 2;
      return {
        value: minValue + ((maxValue - minValue) * t),
        target: maxValue,
        remainingMs: Math.max(1, Math.round((0.5 - normalized) * halfMs * 2)),
        loopTarget: minValue
      };
    }
    t = (normalized - 0.5) * 2;
    return {
      value: maxValue + ((minValue - maxValue) * t),
      target: minValue,
      remainingMs: Math.max(1, Math.round((1 - normalized) * halfMs * 2)),
      loopTarget: maxValue
    };
  }

  function runLoopTween(scene, image, entry, propName, state, halfMs, tweenKey){
    var config = {
      targets: image,
      duration: halfMs,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1
    };
    config[propName] = state.loopTarget;
    entry[tweenKey] = scene.tweens.add(config);
  }

  function runPhaseTween(scene, image, entry, propName, state, halfMs, tweenKey){
    var config;
    if (!scene || !scene.tweens || !scene.tweens.add || !image) return;
    config = {
      targets: image,
      duration: state.remainingMs,
      ease: 'Sine.InOut',
      onComplete: function(){
        runLoopTween(scene, image, entry, propName, state, halfMs, tweenKey);
      }
    };
    config[propName] = state.target;
    entry[tweenKey] = scene.tweens.add(config);
  }

  function releaseEntry(scene, layer, entry){
    var i;
    if (!entry || !entry.image) return;
    if (scene && scene.tweens && scene.tweens.killTweensOf && entry.image) {
      scene.tweens.killTweensOf(entry.image);
    }
    if (entry.image && entry.image.destroy) entry.image.destroy(); if (entry.premium) entry.premium._cehpPropEntry = null;
    entry.image = null;
    if (!layer) return;
    for (i = 0; i < layer.e.length; i++) {
      if (layer.e[i] === entry) {
        layer.e.splice(i, 1);
        return;
      }
    }
  }

  function decoratePremium(scene, layer, premium, index){
    var rect;
    var label;
    var depth;
    var schedule;
    var wobble;
    var flutter;
    var image;
    var entry;
    var originalRectSetVisible;
    var originalLabelSetVisible;
    var originalDestroy;
    if (!scene || !layer || !premium || premium._cehpPropEntry) return premium && premium._cehpPropEntry;

    rect = premium.rect;
    label = premium.label;
    if (!rect || !scene.add || !scene.add.image) return null;

    depth = label && label.depth != null ? label.depth : (rect.depth != null ? rect.depth : 12);
    schedule = makeMotionSchedule(layer.seed, String(premium.room && premium.room.id ? premium.room.id : 'room') + '|premium|' + String(index || 0));
    wobble = cycleState(schedule.drawWobblePhase(), -WOBBLE_RAD, WOBBLE_RAD, WOBBLE_MS);
    flutter = cycleState(schedule.drawFlutterPhase(), FLUTTER_MIN, FLUTTER_MAX, FLUTTER_MS);
    image = scene.add.image(rect.x, rect.y, KEY_RECEIPT).setOrigin(0.5).setDepth(depth);
    image.rotation = wobble.value;
    image.scaleY = flutter.value;

    entry = {
      premium: premium,
      image: image
    };
    premium._cehpPropEntry = entry;
    layer.e.push(entry);

    originalRectSetVisible = rect.setVisible ? rect.setVisible : null;
    originalLabelSetVisible = label && label.setVisible ? label.setVisible : null;
    originalDestroy = premium.destroy;

    rect.setVisible = function(value){
      if (entry.image && entry.image.setVisible) entry.image.setVisible(value !== false);
      if (originalRectSetVisible) originalRectSetVisible.call(rect, false);
      return rect;
    };

    if (label) {
      label.setVisible = function(){
        if (originalLabelSetVisible) originalLabelSetVisible.call(label, false);
        return label;
      };
    }

    premium.destroy = function(){
      releaseEntry(scene, layer, entry);
      if (originalDestroy) originalDestroy.call(premium);
    };

    rect.setVisible(!premium.collected);
    if (label && label.setVisible) label.setVisible(false);

    runPhaseTween(scene, image, entry, 'rotation', wobble, WOBBLE_MS, 'rotationTween');
    runPhaseTween(scene, image, entry, 'scaleY', flutter, FLUTTER_MS, 'flutterTween');
    return entry;
  }

  function decorateWorld(scene, layer, world){
    var i;
    if (!world || !world.premiums) return;
    ensureTextures(scene);
    for (i = 0; i < world.premiums.length; i++) {
      decoratePremium(scene, layer, world.premiums[i], i);
    }
  }

  function prime(scene, opts){
    var layer = ensureLayer(scene, opts);
    if (!scene || !layer) return layer;
    if (layer.world !== 'benefits') return layer;
    if (layer.primed || !ns.WorldBenefits || !ns.WorldBenefits.create) return layer;

    layer.orig = ns.WorldBenefits.create;
    layer.wrap = function(sceneArg){
      var world = layer.orig.apply(this, arguments);
      if (sceneArg === scene) decorateWorld(scene, layer, world);
      return world;
    };
    ns.WorldBenefits.create = layer.wrap;
    layer.primed = true;
    bindCleanup(scene, layer);
    return layer;
  }

  function cleanup(scene){
    var layer = scene && scene._cehpProp ? scene._cehpProp : null;
    var i;
    if (!layer) return;

    if (ns.WorldBenefits && layer.orig && ns.WorldBenefits.create === layer.wrap) {
      ns.WorldBenefits.create = layer.orig;
    }

    for (i = 0; i < layer.e.length; i++) {
      releaseEntry(scene, null, layer.e[i]);
    }
    layer.e = [];
    layer.orig = null;
    layer.wrap = null;
    layer.primed = false;
    layer.bound = false;
    scene._cehpProp = null;
  }

  ns.Prop = {
    prime: prime,
    cleanup: cleanup,
    ensureTextures: ensureTextures,
    makeMotionSchedule: makeMotionSchedule
  };
})(CEHP);
CEHP._register('87_props');
