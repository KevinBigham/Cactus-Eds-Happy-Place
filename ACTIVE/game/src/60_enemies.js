/* MODULE: 60_ENEMIES - W3 archetypes; W8-R01 telegraph cycle
   (windup->active->recovery->cooldown; damage gated to active;
   ±40ms seeded jitter via world.enemyRng). MMX timings in ms. */

(function(ns){
  'use strict';

  function intersects(a, b){
    return ns.Collision && ns.Collision.intersects ? ns.Collision.intersects(a, b) : false;
  }

  function makeLabel(scene, x, y, text, color){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace', fontSize: '7px',
      color: color || '#221111', align: 'center'
    }).setOrigin(0.5).setDepth(13);
  }

  function makeRect(scene, x, y, w, h, color, alpha, depth){
    return scene.add.rectangle(x, y, w, h, color, alpha == null ? 1 : alpha).setDepth(depth == null ? 12 : depth);
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function sourceImageForTexture(scene, key){
    var textures = scene && scene.textures;
    var texture;

    if (!textureExists(scene, key) || !textures.get) return null;
    texture = textures.get(key);
    return texture && texture.getSourceImage ? texture.getSourceImage() : null;
  }

  function makeCanvas(width, height){
    var canvas;

    if (typeof document === 'undefined' || !document.createElement) return null;
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  function telegraphFrameKey(index){
    return 'cehp:enemy:telegraph:' + index;
  }

  function ensureWindupFrames(scene){
    var textures = scene && scene.textures;
    var source = sourceImageForTexture(scene, 'enemy_telegraph_windup');
    var keys = [telegraphFrameKey(0), telegraphFrameKey(1), telegraphFrameKey(2)];
    var i;

    if (!source || !textures || !textures.addCanvas) return [];
    if (textureExists(scene, keys[0]) && textureExists(scene, keys[1]) && textureExists(scene, keys[2])) return keys;

    for (i = 0; i < 3; i++) {
      var startX = Math.round((source.width * i) / 3);
      var endX = Math.round((source.width * (i + 1)) / 3);
      var frameWidth = endX - startX;
      var canvas = makeCanvas(frameWidth, source.height);
      var context = canvas && canvas.getContext ? canvas.getContext('2d') : null;
      if (!canvas || !context || !context.drawImage) return [];
      context.drawImage(source, startX, 0, frameWidth, source.height, 0, 0, frameWidth, source.height);
      textures.addCanvas(keys[i], canvas);
    }

    return keys;
  }

  function setScale(node, xScale, yScale){
    if (!node) return;
    if (node.setScale) {
      node.setScale(xScale, yScale == null ? xScale : yScale);
      return;
    }
    node.scaleX = xScale;
    node.scaleY = yScale == null ? xScale : yScale;
  }

  function setVisible(node, visible){
    if (!node) return;
    if (node.setVisible) {
      node.setVisible(visible);
      return;
    }
    node.visible = visible;
  }

  function setTexture(node, key){
    if (!node || !key) return;
    if (node.setTexture) {
      node.setTexture(key);
      return;
    }
    node.key = key;
  }

  function makeImage(scene, key, x, y, w, h, depth, alpha){
    var image;

    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;

    image = scene.add.image(x, y, key).setDepth(depth == null ? 12.5 : depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(w, h);
    if (image.setAlpha) image.setAlpha(alpha == null ? 1 : alpha);
    return image;
  }

  function mkEnemy(kind, rect, label, w, a, r, c, live, arch){
    return {
      kind: kind, archetype: arch, rect: rect, label: label, dead: false,
      wBase: w, aBase: a, rBase: r, cBase: c,
      phase: live ? 'windup' : 'idle',
      windupMs: live ? w : 0, activeMs: 0, recoveryMs: 0, cooldownMs: 0,
      art: null, artOffsetY: 0, telegraph: null, telegraphOffsetY: 0, telegraphFrames: [], labelOffsetY: 18,
      destroy: function(){
        if (this.dead) return;
        this.dead = true;
        if (rect && rect.destroy) rect.destroy();
        if (label && label.destroy) label.destroy();
        if (this.art && this.art.destroy) this.art.destroy();
        if (this.telegraph && this.telegraph.destroy) this.telegraph.destroy();
      }
    };
  }

  function jitter(rng){ return rng && rng.int ? rng.int(-40, 41) : 0; }

  function tickHitStopActor(actor, dtMs){
    var active = actor && actor._cehpHitStopMs > 0;
    if (!active) return false;
    actor._cehpHitStopMs = Math.max(0, actor._cehpHitStopMs - (dtMs || 16));
    return true;
  }

  function syncPlayerIFrames(player){
    var snapshot;
    if (!player || !ns.EdState || !ns.EdState.snapshot) return;
    snapshot = ns.EdState.snapshot(player);
    if (snapshot && snapshot.phase4 && snapshot.phase4.iframesMs > 0) player.invulnMs = snapshot.phase4.iframesMs;
  }

  function acceptPlayerDamage(player, kind, enemy){
    if (ns.EdState && ns.EdState.damage) {
      return ns.EdState.damage(player, kind, {
        actor: enemy,
        hitStopClass: 'damage'
      });
    }
    return !(player && player.invulnMs > 0);
  }

  function emitCameraShake(kind, enemy){
    if (!ns.Events || !ns.Events.emit) return;
    ns.Events.emit('camera:shake', {
      kind: 'damage',
      source: kind,
      actor: enemy
    });
  }

  function attachArt(scene, enemy, key, w, h, offsetY){
    enemy.art = makeImage(scene, key, enemy.rect.x, enemy.rect.y + (offsetY || 0), w, h, 12.75, enemy.rect.alpha);
    enemy.artOffsetY = offsetY || 0;
    return enemy.art;
  }

  function attachTelegraph(scene, enemy, w, h, offsetY){
    enemy.telegraphFrames = ensureWindupFrames(scene);
    if (!enemy.telegraphFrames.length) return null;
    enemy.telegraph = makeImage(scene, enemy.telegraphFrames[0], enemy.rect.x, enemy.rect.y + (offsetY || 0), w, h, 14, 0.92);
    enemy.telegraphOffsetY = offsetY || 0;
    setVisible(enemy.telegraph, enemy.phase === 'windup');
    return enemy.telegraph;
  }

  function syncEnemyVisual(enemy){
    var progress;
    var frameIndex;
    var frameKey;

    if (!enemy || !enemy.rect) return;
    if (enemy.label) {
      enemy.label.x = enemy.rect.x;
      enemy.label.y = enemy.rect.y - (enemy.labelOffsetY || 18);
    }
    if (enemy.art) {
      enemy.art.x = enemy.rect.x;
      enemy.art.y = enemy.rect.y + (enemy.artOffsetY || 0);
      setScale(enemy.art, enemy.rect.scaleX || 1, enemy.rect.scaleY || 1);
      if (enemy.art.setAlpha) enemy.art.setAlpha(enemy.rect.alpha == null ? 1 : enemy.rect.alpha);
    }
    if (!enemy.telegraph) return;

    enemy.telegraph.x = enemy.rect.x;
    enemy.telegraph.y = enemy.rect.y + (enemy.telegraphOffsetY || 0);
    setScale(enemy.telegraph, enemy.rect.scaleX || 1, enemy.rect.scaleY || 1);
    setVisible(enemy.telegraph, enemy.phase === 'windup');
    if (enemy.phase !== 'windup' || !enemy.telegraphFrames.length) return;

    progress = enemy.wBase > 0 ? 1 - (Math.max(0, enemy.windupMs) / enemy.wBase) : 1;
    frameIndex = progress >= 0.67 ? 2 : (progress >= 0.34 ? 1 : 0);
    frameKey = enemy.telegraphFrames[frameIndex];
    setTexture(enemy.telegraph, frameKey);
    if (enemy.telegraph.setAlpha) enemy.telegraph.setAlpha(Math.min(0.98, (enemy.rect.alpha == null ? 1 : enemy.rect.alpha) + 0.08));
  }

  function stepPhase(e, dt, rng, auto){
    var r = e.rect, t, s;
    if (e.windupMs > 0) {
      e.windupMs -= dt;
      t = 1 - Math.max(0, e.windupMs) / e.wBase;
      s = Math.sin(t * Math.PI);
      r.alpha = 0.95 - 0.5 * s; r.scaleX = 1 + 0.12 * s;
      if (e.windupMs <= 0) { e.phase = 'active'; e.activeMs = e.aBase; r.alpha = 1; r.scaleX = 1; }
    } else if (e.activeMs > 0) {
      e.activeMs -= dt;
      if (e.activeMs <= 0) { e.phase = 'recovery'; e.recoveryMs = e.rBase; r.alpha = 0.85; }
    } else if (e.recoveryMs > 0) {
      e.recoveryMs -= dt;
      if (e.recoveryMs <= 0) { e.phase = 'cooldown'; e.cooldownMs = e.cBase; r.alpha = 0.96; }
    } else if (e.phase === 'cooldown') {
      if (e.cooldownMs > 0) e.cooldownMs -= dt;
      if (e.cooldownMs <= 0) {
        if (auto) { e.phase = 'windup'; e.windupMs = e.wBase + jitter(rng); }
        else e.phase = 'idle';
      }
    }
    syncEnemyVisual(e);
  }

  function spawnScantron(scene, opts){
    opts = opts || {};
    var points = opts.teleportPoints || [{ x: opts.x || 0, y: opts.y || 0 }];
    var rng = opts.rng || (ns.makeRNG && ns.makeRNG('scantron'));
    var rect = makeRect(scene, points[0].x, points[0].y, 28, 22, 0xc23b3b, 0.96, 12);
    var label = makeLabel(scene, rect.x, rect.y - 18, 'SCANTRON', '#fff9e0');
    var enemy = mkEnemy('scantron', rect, label, 220, 80, 180, 720, 0, 'turret');
    attachArt(scene, enemy, 'enemy_compliance_auditor', 58, 58, 0);
    attachTelegraph(scene, enemy, 68, 60, -8);
    enemy.pointIndex = 0;
    enemy.teleport = function(index){
      enemy.pointIndex = index;
      enemy.rect.x = points[index].x; enemy.rect.y = points[index].y;
      enemy.label.x = enemy.rect.x; enemy.label.y = enemy.rect.y - 18;
      enemy.phase = 'windup';
      enemy.windupMs = enemy.wBase + jitter(rng);
      syncEnemyVisual(enemy);
    };
    enemy.update = function(player, world, dtMs){
      if (enemy.dead || !player || !player.body) return;
      if (tickHitStopActor(enemy, dtMs || 16)) {
        syncEnemyVisual(enemy);
        return;
      }
      stepPhase(enemy, dtMs || 16, rng, false);
      if (enemy.phase === 'idle' &&
          player.body.velocity.y > 30 &&
          player.y < enemy.rect.y - 6 &&
          Math.abs(player.x - enemy.rect.x) < 170) {
        var next = 0;
        if (rng && rng.int) next = rng.int(0, points.length);
        if (points.length > 1 && next === enemy.pointIndex) next = (next + 1) % points.length;
        enemy.teleport(next);
      }
      if (enemy.phase === 'active' && intersects(player, enemy.rect) && player.invulnMs <= 0) {
        if (!acceptPlayerDamage(player, 'scantron', enemy)) return;
        emitCameraShake('scantron', enemy);
        if (world && world.hitByEnemy) world.hitByEnemy('scantron', enemy);
        else if (player.takeHit) player.takeHit('scantron');
        syncPlayerIFrames(player);
      }
    };
    syncEnemyVisual(enemy);
    return enemy;
  }

  function spawnPizza(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, 24, 16, 0xf0c46c, 0.95, 12);
    var enemy = mkEnemy('pizzaParty', rect, makeLabel(scene, rect.x, rect.y - 16, 'PIZZA', '#221111'), 160, 60, 120, 0, 1, 'ambusher');
    enemy.labelOffsetY = 16;
    attachTelegraph(scene, enemy, 58, 42, -4);
    enemy.originY = rect.y;
    enemy.wavePhase = opts.phase || 0;
    enemy.update = function(player, world, dtMs){
      if (enemy.dead || !player) return;
      if (tickHitStopActor(enemy, dtMs || 16)) {
        syncEnemyVisual(enemy);
        return;
      }
      var time = scene.time && scene.time.now ? scene.time.now : 0;
      enemy.rect.y = enemy.originY + Math.sin((time * 0.004) + enemy.wavePhase) * 4;
      enemy.label.x = enemy.rect.x; enemy.label.y = enemy.rect.y - 16;
      stepPhase(enemy, dtMs || 16, opts.rng, true);
      if (enemy.phase === 'active' && intersects(player, enemy.rect)) {
        if (world && world.applyPizzaParty) world.applyPizzaParty(enemy);
        enemy.destroy();
      }
    };
    syncEnemyVisual(enemy);
    return enemy;
  }

  function spawnDeductible(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, 26, 26, 0x6b4a4a, 0.96, 12);
    var enemy = mkEnemy('deductibleWeight', rect, makeLabel(scene, rect.x, rect.y - 18, 'DEDUCT', '#fff9e0'), 180, 90, 140, 650, 1, 'mobility');
    attachArt(scene, enemy, 'enemy_deadline_wraith', 60, 60, -2);
    attachTelegraph(scene, enemy, 64, 64, -6);
    enemy.baseX = rect.x;
    enemy.range = opts.range || 36;
    enemy.speed = opts.speed || 0.0018;
    enemy.wavePhase = opts.phase || 0;
    enemy.update = function(player, world, dtMs){
      if (enemy.dead || !player) return;
      if (tickHitStopActor(enemy, dtMs || 16)) {
        syncEnemyVisual(enemy);
        return;
      }
      var time = scene.time && scene.time.now ? scene.time.now : 0;
      enemy.rect.x = enemy.baseX + Math.sin((time * enemy.speed) + enemy.wavePhase) * enemy.range;
      enemy.label.x = enemy.rect.x; enemy.label.y = enemy.rect.y - 18;
      stepPhase(enemy, dtMs || 16, opts.rng, true);
      if (enemy.phase === 'active' && intersects(player, enemy.rect)) {
        if (!acceptPlayerDamage(player, 'deductible', enemy)) return;
        emitCameraShake('deductible', enemy);
        if (world && world.applyDeductibleHit) world.applyDeductibleHit(enemy);
        syncPlayerIFrames(player);
      }
    };
    syncEnemyVisual(enemy);
    return enemy;
  }

  ns.Enemies = {
    ensureWindupFrames: ensureWindupFrames,
    spawn: function(scene, type, opts){
      switch (type) {
        case 'scantron': return spawnScantron(scene, opts);
        case 'pizzaParty': return spawnPizza(scene, opts);
        case 'deductibleWeight': return spawnDeductible(scene, opts);
        default: return null;
      }
    }
  };
})(CEHP);
CEHP._register('60_enemies');
