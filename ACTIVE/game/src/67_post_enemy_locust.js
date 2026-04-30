/* MODULE: 67_POST_ENEMY_LOCUST - W15M-P6 W3 Reply-All Locust swarm. */
(function(ns){
  'use strict';

  var W = 18;
  var H = 12;

  ns.flags = ns.flags || {};
  if (ns.flags.W3_REPLY_ALL_LOCUST == null) ns.flags.W3_REPLY_ALL_LOCUST = true;
  ns.Enemies = ns.Enemies || {};

  function clamp(v, min, max){ return v < min ? min : (v > max ? max : v); }

  function rect(scene, x, y, w, h, color, alpha, depth){
    var r = scene.add.rectangle(x, y, w, h, color, alpha == null ? 1 : alpha).setDepth(depth == null ? 12 : depth);
    r.body = null;
    return r;
  }

  function alpha(node, value){
    if (!node) return;
    if (node.setAlpha) node.setAlpha(value);
    else node.alpha = value;
  }

  function destroy(node){ if (node && node.destroy) node.destroy(); }

  function removeFrom(list, item){
    var i;
    if (!list) return;
    for (i = list.length - 1; i >= 0; i--) if (list[i] === item) list.splice(i, 1);
  }

  function locustCount(rng){
    return 3 + ((rng.next() >>> 2) % 3);
  }

  function makePositions(swarm, count){
    var positions = [];
    var xBase = swarm.edge === 'right' ? swarm.sx + 15 : swarm.sx - 15;
    var center = (count - 1) / 2;
    var i;
    for (i = 0; i < count; i++) {
      positions.push({
        x: xBase + swarm.rng.int(-1, 2),
        y: swarm.sy + ((i - center) * 20) + swarm.rng.int(-2, 3)
      });
    }
    return positions;
  }

  function makeLocust(scene, position, rng){
    return {
      rect: rect(scene, position.x, position.y, W, H, 0xc49a4a, 0.84, 12.8),
      speed: 90 + rng.int(0, 21)
    };
  }

  function syncLocust(locust, fade){
    if (!locust || !locust.rect) return;
    alpha(locust.rect, 0.18 + (0.66 * fade));
  }

  function activate(swarm){
    var positions;
    var i;
    if (swarm.state !== 'telegraph') return;
    destroy(swarm.warning);
    swarm.warning = null;
    swarm.state = 'active';
    positions = makePositions(swarm, locustCount(swarm.rng));
    for (i = 0; i < positions.length; i++) {
      swarm.locusts.push(makeLocust(swarm.scene, positions[i], swarm.rng));
    }
  }

  function updateWarning(swarm){
    var t;
    if (!swarm.warning) return;
    t = swarm.teleBase > 0 ? 1 - (Math.max(0, swarm.telegraphMs) / swarm.teleBase) : 1;
    alpha(swarm.warning, 0.12 + (Math.sin(t * Math.PI) * 0.18));
  }

  function moveLocust(swarm, locust, player, dtMs, fade){
    var dx;
    var dy;
    var dist;
    var step;
    if (!player || !locust || !locust.rect) return;
    dx = player.x - locust.rect.x;
    dy = player.y - locust.rect.y;
    dist = Math.sqrt((dx * dx) + (dy * dy)) || 1;
    step = (dtMs || 16) / 1000;
    locust.rect.x += (dx / dist) * locust.speed * step;
    locust.rect.y += (dy / dist) * locust.speed * step;
    syncLocust(locust, fade);
  }

  function settleSpread(swarm, fade){
    var pass, i, j, a, b, dx, dy, dist, nx, ny, push;
    for (pass = 0; pass < 2; pass++) for (i = 0; i < swarm.locusts.length; i++) for (j = i + 1; j < swarm.locusts.length; j++) {
      a = swarm.locusts[i].rect;
      b = swarm.locusts[j].rect;
      dx = a.x - b.x;
      dy = a.y - b.y;
      dist = Math.sqrt((dx * dx) + (dy * dy));
          if (dist >= 20) continue;
      nx = dist > 0 ? dx / dist : -1;
      ny = dist > 0 ? dy / dist : 0;
          push = (20 - (dist || 1)) / 2;
      a.x += nx * push;
      a.y += ny * push;
      b.x -= nx * push;
      b.y -= ny * push;
      syncLocust(swarm.locusts[i], fade);
      syncLocust(swarm.locusts[j], fade);
    }
  }

  function damagePlayer(swarm, locust, player){
    if (!player || !locust || !locust.rect || swarm.hitMs > 0 || player.invulnMs > 0) return false;
    if (!ns.Collision || !ns.Collision.intersects || !ns.Collision.intersects(player, locust.rect)) return false;
    swarm.clean = false;
    swarm.hitMs = 650;
    if (player.takeHit) player.takeHit('locust');
    return true;
  }

  function markSurvived(swarm){
    var flags;
    if (!swarm.clean) return;
    flags = swarm.world && swarm.world.receiptFlags ? swarm.world.receiptFlags : {};
    flags.locustSurvived = true;
    if (swarm.world) {
      swarm.world.receiptFlags = flags;
      if (swarm.world.runState) swarm.world.runState.receiptFlags = flags;
    }
  }

  function cleanup(swarm){
    var i;
    destroy(swarm.warning);
    swarm.warning = null;
    for (i = 0; i < swarm.locusts.length; i++) destroy(swarm.locusts[i].rect);
    removeFrom(swarm.world && swarm.world.enemies, swarm);
    removeFrom(swarm.room && swarm.room.enemies, swarm);
  }

  function expire(swarm){
    if (!swarm || swarm.dead) return;
    markSurvived(swarm);
    swarm.dead = true;
    cleanup(swarm);
  }

  function updateActive(swarm, player, dtMs){
    var fade;
    var i;
    swarm.leftMs -= dtMs || 16;
    if (swarm.leftMs <= 0) {
      expire(swarm);
      return;
    }
    if (swarm.hitMs > 0) swarm.hitMs = Math.max(0, swarm.hitMs - (dtMs || 16));
    fade = clamp(swarm.leftMs / swarm.decayMs, 0, 1);
    for (i = 0; i < swarm.locusts.length; i++) moveLocust(swarm, swarm.locusts[i], player, dtMs, fade);
    settleSpread(swarm, fade);
    for (i = 0; i < swarm.locusts.length; i++) if (damagePlayer(swarm, swarm.locusts[i], player)) return;
  }

  function registerSwarm(swarm){
    if (swarm.world && swarm.world.enemies) swarm.world.enemies.push(swarm);
    if (swarm.room && swarm.room.enemies) swarm.room.enemies.push(swarm);
  }

  function spawnReplyAllLocust(scene, world, opts){
    var room;
    var telegraphMs;
    var swarm;
    opts = opts || {};
    if (!scene || !world) return null;
    room = opts.room || world.currentRoom || null;
    telegraphMs = clamp(opts.telegraphMs == null ? 260 : opts.telegraphMs, 120, 400);
    swarm = {
      scene: scene, world: world, room: room,
      rng: opts.rng || (ns.makeRNG ? ns.makeRNG(opts.seed || 'cehp-locust') : null),
      state: 'telegraph',
      sx: opts.x == null ? (room ? room.startX + 76 : 0) : opts.x,
      sy: opts.y == null ? ((world.horizon || 400) - 96) : opts.y,
      edge: opts.edge || 'left',
      telegraphMs: telegraphMs, teleBase: telegraphMs,
      decayMs: opts.decayMs || 9600, leftMs: opts.decayMs || 9600,
      warning: null, locusts: [], hitMs: 0,
      clean: true, dead: false
    };
    if (!swarm.rng) return null;
    swarm.warning = rect(scene, swarm.sx, swarm.sy, 112, 38, 0xf2e3c5, 0.16, 13);
    swarm.update = function(player, w, dtMs){
      if (swarm.dead) return;
      if (swarm.state === 'telegraph') {
        swarm.telegraphMs -= dtMs || 16;
        updateWarning(swarm);
        if (swarm.telegraphMs <= 0) activate(swarm);
        return;
      }
      updateActive(swarm, player, dtMs || 16);
    };
    swarm.destroy = function(){
      if (swarm.dead) return;
      swarm.dead = true;
      cleanup(swarm);
    };
    registerSwarm(swarm);
    return swarm;
  }

  ns.Enemies.spawnReplyAllLocust = spawnReplyAllLocust;
})(CEHP);
CEHP._register('67_post_enemy_locust');
