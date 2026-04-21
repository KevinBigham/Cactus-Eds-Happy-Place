/* ================================================================
   MODULE: 60_ENEMIES
   Week 3 enemy set. Deterministic manual updates so route + seed
   stay reproducible without hidden Phaser randomness.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function intersects(a, b){
    return ns.Collision && ns.Collision.intersects ? ns.Collision.intersects(a, b) : false;
  }

  function makeLabel(scene, x, y, text, color){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: color || '#221111',
      align: 'center'
    }).setOrigin(0.5).setDepth(13);
  }

  function makeRect(scene, x, y, w, h, color, alpha, depth){
    return scene.add.rectangle(x, y, w, h, color, alpha == null ? 1 : alpha).setDepth(depth == null ? 12 : depth);
  }

  function destroyMany(list){
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].destroy) list[i].destroy();
    }
  }

  function sharedEnemy(scene, kind, rect, label){
    return {
      kind: kind,
      rect: rect,
      label: label,
      dead: false,
      destroy: function(){
        if (this.dead) return;
        this.dead = true;
        destroyMany([this.rect, this.label]);
      }
    };
  }

  function spawnScantron(scene, opts){
    opts = opts || {};
    var points = opts.teleportPoints || [{ x: opts.x || 0, y: opts.y || 0 }];
    var rng = opts.rng || (ns.makeRNG ? ns.makeRNG('scantron') : null);
    var rect = makeRect(scene, points[0].x, points[0].y, 28, 22, 0xc23b3b, 0.96, 12);
    var label = makeLabel(scene, rect.x, rect.y - 18, 'SCANTRON', '#fff9e0');
    var enemy = sharedEnemy(scene, 'scantron', rect, label);
    enemy.cooldownMs = 0;
    enemy.pointIndex = 0;
    enemy.teleport = function(index){
      enemy.pointIndex = index;
      enemy.rect.x = points[index].x;
      enemy.rect.y = points[index].y;
      enemy.label.x = enemy.rect.x;
      enemy.label.y = enemy.rect.y - 18;
      enemy.rect.alpha = 0.82;
      enemy.cooldownMs = 720;
    };
    enemy.update = function(player, world, dtMs){
      if (enemy.dead || !player || !player.body) return;
      enemy.cooldownMs = Math.max(0, enemy.cooldownMs - (dtMs || 16));
      enemy.rect.alpha += (0.96 - enemy.rect.alpha) * 0.16;

      if (enemy.cooldownMs <= 0 &&
          player.body.velocity.y > 30 &&
          player.y < enemy.rect.y - 6 &&
          Math.abs(player.x - enemy.rect.x) < 170) {
        var next = 0;
        if (rng && rng.int) next = rng.int(0, points.length);
        if (points.length > 1 && next === enemy.pointIndex) next = (next + 1) % points.length;
        enemy.teleport(next);
      }

      if (intersects(player, enemy.rect) && player.invulnMs <= 0) {
        if (world && world.hitByEnemy) world.hitByEnemy('scantron', enemy);
        else if (player.takeHit) player.takeHit('scantron');
      }
    };
    return enemy;
  }

  function spawnPizza(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, 24, 16, 0xf0c46c, 0.95, 12);
    var label = makeLabel(scene, rect.x, rect.y - 16, 'PIZZA', '#221111');
    var enemy = sharedEnemy(scene, 'pizzaParty', rect, label);
    enemy.originY = rect.y;
    enemy.phase = opts.phase || 0;
    enemy.update = function(player, world){
      if (enemy.dead || !player) return;
      var time = scene.time && scene.time.now ? scene.time.now : 0;
      enemy.rect.y = enemy.originY + Math.sin((time * 0.004) + enemy.phase) * 4;
      enemy.label.x = enemy.rect.x;
      enemy.label.y = enemy.rect.y - 16;
      if (intersects(player, enemy.rect)) {
        if (world && world.applyPizzaParty) world.applyPizzaParty(enemy);
        enemy.destroy();
      }
    };
    return enemy;
  }

  function spawnDeductible(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, 26, 26, 0x6b4a4a, 0.96, 12);
    var label = makeLabel(scene, rect.x, rect.y - 18, 'DEDUCT', '#fff9e0');
    var enemy = sharedEnemy(scene, 'deductibleWeight', rect, label);
    enemy.baseX = rect.x;
    enemy.range = opts.range || 36;
    enemy.speed = opts.speed || 0.0018;
    enemy.cooldownMs = 0;
    enemy.phase = opts.phase || 0;
    enemy.update = function(player, world, dtMs){
      if (enemy.dead || !player) return;
      var time = scene.time && scene.time.now ? scene.time.now : 0;
      enemy.cooldownMs = Math.max(0, enemy.cooldownMs - (dtMs || 16));
      enemy.rect.x = enemy.baseX + Math.sin((time * enemy.speed) + enemy.phase) * enemy.range;
      enemy.label.x = enemy.rect.x;
      enemy.label.y = enemy.rect.y - 18;
      if (intersects(player, enemy.rect) && enemy.cooldownMs <= 0) {
        enemy.cooldownMs = 650;
        if (world && world.applyDeductibleHit) world.applyDeductibleHit(enemy);
      }
    };
    return enemy;
  }

  ns.Enemies = {
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
