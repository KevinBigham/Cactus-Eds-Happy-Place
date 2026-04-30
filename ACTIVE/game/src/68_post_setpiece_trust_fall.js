/* MODULE: 68_POST_SETPIECE_TRUST_FALL - W15M-P8a W1 setpiece. */
(function(ns){
  'use strict';

  var FID = 'W15_TRUST_FALL_CLOSER_01';
  var FT = 'THE FLOOR REMEMBERED YOUR COMMITMENT.';
  var HOLD_MS = 600;

  ns.flags = ns.flags || {};
  if (ns.flags.W1_TRUST_FALL == null) ns.flags.W1_TRUST_FALL = true;
  ns.Input = ns.Input || {};
  ns.Setpieces = ns.Setpieces || {};

  function registerReceipt(){
    if (ns.Setpieces._trustFallReceiptRegistered) return;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return;
    ns.Receipts.registerFragment('CLOSERS', FID, FT, {
      worlds: { orientation: 7 },
      flags: { trustFallAccepted: true },
      axes: { intuition: 0.4, grace: 0.3 },
      tone: 'benign'
    });
    ns.Setpieces._trustFallReceiptRegistered = true;
  }

  function syncBody(node){
    if (!node || !node.body) return;
    node.body.x = node.x - ((node.width || 0) / 2);
    node.body.y = node.y - ((node.height || 0) / 2);
    node.body.width = node.width || node.body.width || 0;
    node.body.height = node.height || node.body.height || 0;
    if (node.body.updateFromGameObject) node.body.updateFromGameObject();
  }

  function staticRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    if (rect.setStrokeStyle) rect.setStrokeStyle(1, 0xe8e3d1, 0.28);
    if (scene.physics && scene.physics.add && scene.physics.add.existing) {
      scene.physics.add.existing(rect, true);
      if (rect.body) {
        rect.body.allowGravity = false;
        rect.body.moves = false;
        syncBody(rect);
      }
    }
    return rect;
  }

  function sensorZone(scene, x, y, w, h){
    var zone;
    if (scene.add.zone) zone = scene.add.zone(x, y, w, h).setDepth(3);
    else zone = scene.add.rectangle(x, y, w, h, 0x000000, 0).setDepth(3);
    if (scene.physics && scene.physics.add && scene.physics.add.existing) {
      scene.physics.add.existing(zone, true);
      if (zone.body) {
        zone.body.allowGravity = false;
        zone.body.moves = false;
        syncBody(zone);
      }
    }
    return zone;
  }

  function setVisible(node, value){
    if (!node) return;
    if (node.setVisible) node.setVisible(value);
    else node.visible = value;
  }

  function destroy(node){
    if (node && node.destroy) node.destroy();
  }

  function overlaps(a, b){
    var ax;
    var ay;
    var aw;
    var ah;
    var bx;
    var by;
    var bw;
    var bh;
    if (!a || !b) return false;
    if (ns.Collision && ns.Collision.intersects) return ns.Collision.intersects(a, b);
    aw = a.width || (a.body && a.body.width) || 0;
    ah = a.height || (a.body && a.body.height) || 0;
    bw = b.width || (b.body && b.body.width) || 0;
    bh = b.height || (b.body && b.body.height) || 0;
    ax = a.x == null && a.body ? a.body.x + (aw / 2) : a.x;
    ay = a.y == null && a.body ? a.body.y + (ah / 2) : a.y;
    bx = b.x == null && b.body ? b.body.x + (bw / 2) : b.x;
    by = b.y == null && b.body ? b.body.y + (bh / 2) : b.y;
    return Math.abs(ax - bx) * 2 < aw + bw && Math.abs(ay - by) * 2 < ah + bh;
  }

  function receiptFlags(world){
    var flags = world && world.receiptFlags ? world.receiptFlags : null;
    if (!flags && world && world.runState) flags = world.runState.receiptFlags;
    flags = flags || {};
    if (world) world.receiptFlags = flags;
    if (world && world.runState) world.runState.receiptFlags = flags;
    return flags;
  }

  function seedFor(world, opts){
    var seed = opts && opts.seed;
    if (!seed && world && world.runState && world.runState.caseSeed) seed = world.runState.caseSeed;
    if (!seed) seed = 'cehp-trust-fall';
    return String(seed) + '|trust-fall';
  }

  function makeCorridor(scene, world, room, opts){
    var rng = ns.makeRNG ? ns.makeRNG(seedFor(world, opts)) : null;
    var baseX = room.startX + 724;
    var baseY = (world.horizon || 516) - 92;
    if (rng) {
      baseX += rng.int(-10, 11);
      baseY += rng.int(-4, 5);
    }
    return {
      floor: staticRect(scene, baseX, baseY, 348, 14, 0x2c3a52, 0.48, 3.5),
      exitX: baseX + 112,
      exitY: baseY - 38
    };
  }

  function movePlayer(world, x, y){
    var player = world && world.player;
    if (!player) return;
    player.x = x;
    player.y = y;
    if (player.body) {
      if (player.body.reset) player.body.reset(x, y);
      else {
        player.body.velocity = player.body.velocity || { x: 0, y: 0 };
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        syncBody(player);
      }
    }
  }

  function attachTrustFall(scene, world, opts){
    var room;
    var sensor;
    var overlay;
    var corridor;
    var setpiece;
    var updateHook;
    opts = opts || {};
    if (!scene || !world || (!ns.flags || ns.flags.W1_TRUST_FALL === false)) return null;
    registerReceipt();
    room = opts.room || (world.rooms && (world.rooms[4] || world.rooms[0])) || world.currentRoom;
    if (!room) return null;
    sensor = sensorZone(scene, opts.x || room.startX + 520, (world.horizon || 516) - 86, opts.w || 164, opts.h || 132);
    overlay = scene.add.text(sensor.x - 46, sensor.y - 96, 'TRUST FALL?', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#e8e3d1',
      align: 'center'
    }).setDepth(14);
    if (overlay.setAlpha) overlay.setAlpha(0.42);
    if (overlay.setOrigin) overlay.setOrigin(0.5);
    setVisible(overlay, false);
    corridor = makeCorridor(scene, world, room, opts);
    if (world.platforms) world.platforms.push(corridor.floor);
    if (room.platforms) room.platforms.push(corridor.floor);
    setpiece = {
      id: 'trust-fall',
      scene: scene,
      world: world,
      room: room,
      sensor: sensor,
      overlay: overlay,
      corridor: corridor,
      holdMs: 0,
      state: 'idle',
      update: function(dtMs){
        var inside;
        var flags;
        if (setpiece.state === 'accepted' || setpiece.state === 'declined') return;
        dtMs = Math.max(0, Math.round(Number(dtMs) || 16));
        inside = overlaps(world.player, sensor);
        setVisible(overlay, inside);
        if (inside && ns.Input.down && ns.Input.down('down')) {
          setpiece.holdMs += dtMs;
          if (setpiece.holdMs >= HOLD_MS) {
            flags = receiptFlags(world);
            flags.trustFallAccepted = true;
            delete flags.trustFallDeclined;
            setpiece.state = 'accepted';
            setVisible(overlay, false);
            movePlayer(world, corridor.exitX, corridor.exitY);
            if (ns.Events && ns.Events.emit) ns.Events.emit('module:passed', { roomId: room.id, moduleId: 'trust-fall' });
          }
          return;
        }
        if (inside) {
          setpiece.holdMs = 0;
          return;
        }
        if (world.player && world.player.x > sensor.x + (sensor.width / 2) + 24) {
          flags = receiptFlags(world);
          flags.trustFallDeclined = true;
          delete flags.trustFallAccepted;
          setpiece.state = 'declined';
          setVisible(overlay, false);
        }
      },
      debugAccept: function(){
        var flags = receiptFlags(world);
        flags.trustFallAccepted = true;
        delete flags.trustFallDeclined;
        setpiece.state = 'accepted';
        movePlayer(world, corridor.exitX, corridor.exitY);
        return flags;
      },
      debugDecline: function(){
        var flags = receiptFlags(world);
        flags.trustFallDeclined = true;
        delete flags.trustFallAccepted;
        setpiece.state = 'declined';
        return flags;
      },
      destroy: function(){
        if (updateHook && scene.events && scene.events.off) scene.events.off('update', updateHook);
        updateHook = null;
        destroy(sensor);
        destroy(overlay);
        destroy(corridor.floor);
      }
    };
    updateHook = function(time, delta){
      setpiece.update(delta || 16);
    };
    if (scene.events && scene.events.on) scene.events.on('update', updateHook);
    world.trustFall = setpiece;
    room.trustFall = setpiece;
    return setpiece;
  }

  ns.Setpieces.registerTrustFallReceipt = registerReceipt;
  ns.Setpieces.attachTrustFall = attachTrustFall;
})(CEHP);
CEHP._register('68_post_setpiece_trust_fall');
