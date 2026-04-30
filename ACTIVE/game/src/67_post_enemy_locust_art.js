/* MODULE: 67_POST_ENEMY_LOCUST_ART - ART2 manifest sprite overlays for enemies. */
(function(ns){
  'use strict';

  var ENEMY_ART = {
    scantron: {
      name: 'orientation_clipboard_imp.idle',
      w: 58,
      h: 58,
      offsetY: 0
    },
    pizzaParty: {
      name: 'benefits_premium_pigeon.idle',
      w: 48,
      h: 48,
      offsetY: -3
    },
    deductibleWeight: {
      name: 'benefits_premium_pigeon.idle',
      w: 60,
      h: 60,
      offsetY: -2
    }
  };
  var TAU = Math.PI * 2;
  var FLUTTER_HZ = 8;
  var FLUTTER_AMP = 0.15;

  function assistMode(scene){
    if (scene && scene._assistMode) return scene._assistMode;
    if (ns.RunState && ns.RunState.assistMode) return ns.RunState.assistMode;
    return {};
  }

  function artKeyFor(type, state){
    var config;
    if (!ns.Art || !ns.Art.getKey) return '';
    if (type === 'replyAllLocust') return ns.Art.getKey('enemies', 'reply_all_locust.' + (state || 'single'));
    config = ENEMY_ART[type];
    return config ? ns.Art.getKey('enemies', config.name) : '';
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function setAlpha(node, value){
    if (!node) return;
    if (node.setAlpha) node.setAlpha(value);
    else node.alpha = value;
  }

  function setScale(node, rect){
    if (!node || !rect) return;
    if (node.setScale) {
      node.setScale(rect.scaleX || 1, rect.scaleY || 1);
      return;
    }
    node.scaleX = rect.scaleX || 1;
    node.scaleY = rect.scaleY || 1;
  }

  function flutterPhase(locust){
    var rng;
    var rect = locust && locust.rect;
    if (!locust) return 0;
    if (locust._cehpArt3FlutterPhase == null) {
      rng = ns.makeRNG ? ns.makeRNG('locust|flutter|' + Math.round(rect ? rect.x : 0) + '|' + Math.round(rect ? rect.y : 0)) : null;
      locust._cehpArt3FlutterPhase = rng && rng.float ? rng.float() * TAU : 0;
    }
    return locust._cehpArt3FlutterPhase;
  }

  function applyLocustFlutter(scene, locust){
    var mode = assistMode(scene);
    var amp;
    var nowMs;
    var wave;
    var factor;
    if (!locust || !locust.art || (mode && mode.reduceParticles)) return false;
    amp = mode && mode.reduceShake ? FLUTTER_AMP * 0.3 : FLUTTER_AMP;
    nowMs = scene && scene.time && scene.time.now ? scene.time.now : 0;
    wave = (Math.sin(((nowMs / 1000) * FLUTTER_HZ * TAU) + flutterPhase(locust)) + 1) / 2;
    factor = 1 - (amp * wave);
    locust.art.scaleX = (locust.art.scaleX == null ? 1 : locust.art.scaleX) * factor;
    locust._cehpArt3FlutterFactor = factor;
    return true;
  }

  function setTexture(node, key, w, h){
    var width;
    var height;
    if (!node || !key) return;
    width = node.displayWidth || node.width || w;
    height = node.displayHeight || node.height || h;
    if (node.setTexture) node.setTexture(key);
    else node.textureKey = key;
    if (node.setDisplaySize) node.setDisplaySize(width || w, height || h);
  }

  function makeImage(scene, key, x, y, w, h, depth, alpha){
    var image;
    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;
    image = scene.add.image(x, y, key).setDepth(depth == null ? 12.75 : depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(w, h);
    setAlpha(image, alpha == null ? 1 : alpha);
    return image;
  }

  function softenPrimitive(rect){
    if (!rect) return;
    if (rect.setFillStyle && rect.fillColor != null) rect.setFillStyle(rect.fillColor, 0.04);
    else if (rect.fillAlpha != null) rect.fillAlpha = 0.04;
  }

  function syncEnemyArt(enemy){
    var alpha;
    if (!enemy || !enemy.art || !enemy.rect) return;
    enemy.art.x = enemy.rect.x;
    enemy.art.y = enemy.rect.y + (enemy.artOffsetY || 0);
    setScale(enemy.art, enemy.rect);
    alpha = enemy.rect.alpha == null ? 1 : enemy.rect.alpha;
    setAlpha(enemy.art, alpha);
    softenPrimitive(enemy.rect);
  }

  function applyArtSprite(scene, enemy, type){
    var kind;
    var config;
    var key;
    if (!enemy || !enemy.rect) return false;
    kind = type || enemy.kind;
    config = ENEMY_ART[kind];
    if (!config) return false;
    key = artKeyFor(kind);
    if (!key || !textureExists(scene, key)) return false;
    if (!enemy.art) {
      enemy.art = makeImage(scene, key, enemy.rect.x, enemy.rect.y + config.offsetY, config.w, config.h, 12.75, enemy.rect.alpha);
    } else if (enemy._cehpArt2EnemyKey !== key) {
      setTexture(enemy.art, key, config.w, config.h);
    }
    if (!enemy.art) return false;
    enemy.artOffsetY = config.offsetY;
    enemy._cehpArt2EnemyKey = key;
    syncEnemyArt(enemy);
    return true;
  }

  function syncWrappedEnemy(scene, enemy, type){
    var original;
    if (!applyArtSprite(scene, enemy, type) || enemy._cehpArt2EnemyWrapped) return enemy;
    enemy._cehpArt2EnemyWrapped = true;
    original = enemy.update;
    if (original) {
      enemy.update = function(){
        var result = original.apply(enemy, arguments);
        applyArtSprite(scene, enemy, type);
        return result;
      };
    }
    return enemy;
  }

  function applyLocustArt(scene, locust, fade){
    var key;
    var alpha;
    if (!locust || !locust.rect) return false;
    key = artKeyFor('replyAllLocust', 'single');
    if (!key || !textureExists(scene, key)) return false;
    alpha = 0.22 + (0.68 * (fade == null ? 1 : fade));
    if (!locust.art) {
      locust.art = makeImage(scene, key, locust.rect.x, locust.rect.y, 34, 26, 12.85, alpha);
    } else if (locust._cehpArt2LocustKey !== key) {
      setTexture(locust.art, key, 34, 26);
    }
    if (!locust.art) return false;
    locust._cehpArt2LocustKey = key;
    locust.art.x = locust.rect.x;
    locust.art.y = locust.rect.y;
    setScale(locust.art, locust.rect);
    applyLocustFlutter(scene, locust);
    setAlpha(locust.art, alpha);
    softenPrimitive(locust.rect);
    return true;
  }

  function destroyLocustArt(locust){
    if (!locust || !locust.art) return;
    if (locust.art.destroy) locust.art.destroy();
    locust.art = null;
  }

  function destroySwarmArt(swarm){
    var i;
    if (!swarm) return;
    if (swarm.warningArt && swarm.warningArt.destroy) swarm.warningArt.destroy();
    swarm.warningArt = null;
    for (i = 0; swarm.locusts && i < swarm.locusts.length; i++) destroyLocustArt(swarm.locusts[i]);
  }

  function syncWarningArt(swarm){
    var key;
    var alpha;
    if (!swarm || !swarm.scene || !swarm.warning) return false;
    key = artKeyFor('replyAllLocust', 'swarm');
    if (!key || !textureExists(swarm.scene, key)) return false;
    alpha = swarm.warning.alpha == null ? 0.18 : swarm.warning.alpha;
    if (!swarm.warningArt) {
      swarm.warningArt = makeImage(swarm.scene, key, swarm.warning.x, swarm.warning.y, 132, 54, 12.7, alpha);
    } else if (swarm._cehpArt2WarningKey !== key) {
      setTexture(swarm.warningArt, key, 132, 54);
    }
    if (!swarm.warningArt) return false;
    swarm._cehpArt2WarningKey = key;
    swarm.warningArt.x = swarm.warning.x;
    swarm.warningArt.y = swarm.warning.y;
    setAlpha(swarm.warningArt, alpha);
    softenPrimitive(swarm.warning);
    return true;
  }

  function syncSwarmArt(swarm){
    var fade;
    var i;
    if (!swarm) return;
    if (swarm.dead) {
      destroySwarmArt(swarm);
      return;
    }
    if (swarm.state === 'telegraph') {
      syncWarningArt(swarm);
      return;
    }
    if (swarm.warningArt && swarm.warningArt.destroy) swarm.warningArt.destroy();
    swarm.warningArt = null;
    fade = swarm.decayMs > 0 ? Math.max(0, Math.min(1, swarm.leftMs / swarm.decayMs)) : 1;
    for (i = 0; swarm.locusts && i < swarm.locusts.length; i++) applyLocustArt(swarm.scene, swarm.locusts[i], fade);
  }

  function wrapSwarm(swarm){
    var originalUpdate;
    var originalDestroy;
    if (!swarm || swarm._cehpArt2SwarmWrapped) return swarm;
    swarm._cehpArt2SwarmWrapped = true;
    syncSwarmArt(swarm);
    originalUpdate = swarm.update;
    if (originalUpdate) {
      swarm.update = function(){
        var result = originalUpdate.apply(swarm, arguments);
        syncSwarmArt(swarm);
        return result;
      };
    }
    originalDestroy = swarm.destroy;
    if (originalDestroy) {
      swarm.destroy = function(){
        destroySwarmArt(swarm);
        return originalDestroy.apply(swarm, arguments);
      };
    }
    return swarm;
  }

  function wrapEnemySpawner(){
    var original;
    if (!ns.Enemies || !ns.Enemies.spawn || ns.Enemies.spawn._cehpArt2Wrapped) return;
    original = ns.Enemies.spawn;
    ns.Enemies.spawn = function(scene, type, opts){
      return syncWrappedEnemy(scene, original.apply(this, arguments), type);
    };
    ns.Enemies.spawn._cehpArt2Wrapped = true;
  }

  function wrapLocustSpawner(){
    var original;
    if (!ns.Enemies || !ns.Enemies.spawnReplyAllLocust || ns.Enemies.spawnReplyAllLocust._cehpArt2Wrapped) return;
    original = ns.Enemies.spawnReplyAllLocust;
    ns.Enemies.spawnReplyAllLocust = function(){
      return wrapSwarm(original.apply(this, arguments));
    };
    ns.Enemies.spawnReplyAllLocust._cehpArt2Wrapped = true;
  }

  ns.Enemies = ns.Enemies || {};
  ns.Enemies.artKeyFor = artKeyFor;
  ns.Enemies.applyArtSprite = applyArtSprite;
  ns.Enemies.applyLocustArt = applyLocustArt;
  ns.Enemies.applyLocustFlutter = applyLocustFlutter;
  ns.Enemies.syncSwarmArt = syncSwarmArt;
  wrapEnemySpawner();
  wrapLocustSpawner();
})(CEHP);
CEHP._register('67_post_enemy_locust_art');
