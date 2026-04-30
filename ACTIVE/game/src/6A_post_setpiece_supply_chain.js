/* MODULE: 6A_POST_SETPIECE_SUPPLY_CHAIN - W15M-P8c W3 setpiece. */
(function(ns){
  'use strict';

  var FID = 'W15_SUPPLY_CHAIN_CLOSER_01';
  var FT = 'THE BOX ARRIVED WITHOUT OWNING YOU.';

  ns.flags = ns.flags || {};
  if (ns.flags.W3_SUPPLY_CHAIN == null) ns.flags.W3_SUPPLY_CHAIN = true;
  ns.Setpieces = ns.Setpieces || {};

  function registerReceipt(){
    if (ns.Setpieces._supplyChainReceiptRegistered) return;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return;
    ns.Receipts.registerFragment('CLOSERS', FID, FT, {
      worlds: { rasta: 8 },
      flags: { supplyChainRouted: true },
      axes: { intuition: 0.4, grace: 0.4 },
      tone: 'benign'
    });
    ns.Setpieces._supplyChainReceiptRegistered = true;
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
    if (rect.setStrokeStyle) rect.setStrokeStyle(1, 0xf2e3c5, 0.35);
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

  function destroy(node){
    if (node && node.destroy) node.destroy();
  }

  function overlaps(a, b){
    var aw;
    var ah;
    var bw;
    var bh;
    var ax;
    var ay;
    var bx;
    var by;
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
    if (!seed) seed = 'cehp-supply-chain';
    return String(seed) + '|supply-chain';
  }

  function makePlan(world, room, opts){
    var rng = ns.makeRNG ? ns.makeRNG(seedFor(world, opts)) : null;
    var baseX = room.startX + 336;
    var baseY = (world.horizon || 516) - 88;
    if (rng) {
      baseX += rng.int(-8, 9);
      baseY += rng.int(-4, 5);
    }
    return {
      xs: [baseX, baseX + 216, baseX + 432],
      y: baseY,
      exitX: baseX + 570,
      exitY: baseY - 64
    };
  }

  function complete(setpiece){
    var flags;
    if (setpiece.state === 'completed') return;
    flags = receiptFlags(setpiece.world);
    flags.supplyChainRouted = true;
    setpiece.state = 'completed';
    if (ns.Events && ns.Events.emit) ns.Events.emit('module:passed', {
      roomId: setpiece.room.id,
      moduleId: 'supply-chain'
    });
  }

  function allVisited(setpiece){
    return !!(setpiece.visited[0] && setpiece.visited[1] && setpiece.visited[2]);
  }

  function attachSupplyChain(scene, world, opts){
    var room;
    var plan;
    var setpiece;
    var updateHook;
    var i;
    opts = opts || {};
    if (!scene || !world || (!ns.flags || ns.flags.W3_SUPPLY_CHAIN === false)) return null;
    registerReceipt();
    room = opts.room || (world.rooms && (world.rooms[3] || world.rooms[0])) || world.currentRoom;
    if (!room) return null;
    plan = makePlan(world, room, opts);
    setpiece = {
      id: 'supply-chain',
      scene: scene,
      world: world,
      room: room,
      conveyors: [],
      crates: [],
      sensors: [],
      exit: sensorZone(scene, plan.exitX, plan.exitY, 126, 98),
      label: scene.add.text(plan.xs[0] - 62, plan.y - 112, 'SUPPLY CHAIN', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#f2e3c5',
        align: 'center'
      }).setDepth(14),
      visited: [false, false, false],
      state: 'idle',
      visit: function(index){
        if (index < 0 || index >= setpiece.visited.length) return;
        setpiece.visited[index] = true;
        if (allVisited(setpiece)) complete(setpiece);
      },
      update: function(){
        var player = world.player;
        if (!player || setpiece.state === 'completed') return;
        for (var j = 0; j < setpiece.sensors.length; j++) {
          if (overlaps(player, setpiece.sensors[j])) setpiece.visit(j);
        }
        if (allVisited(setpiece) && overlaps(player, setpiece.exit)) complete(setpiece);
      },
      debugRoute: function(){
        for (var j = 0; j < setpiece.visited.length; j++) setpiece.visit(j);
        if (world.player) {
          world.player.x = setpiece.exit.x;
          world.player.y = setpiece.exit.y;
          if (world.player.body) syncBody(world.player);
        }
        return receiptFlags(world);
      },
      reset: function(){
        var flags = receiptFlags(world);
        setpiece.state = 'idle';
        setpiece.visited = [false, false, false];
        delete flags.supplyChainRouted;
      },
      destroy: function(){
        if (updateHook && scene.events && scene.events.off) scene.events.off('update', updateHook);
        updateHook = null;
        for (var j = 0; j < setpiece.conveyors.length; j++) destroy(setpiece.conveyors[j]);
        for (j = 0; j < setpiece.crates.length; j++) destroy(setpiece.crates[j]);
        for (j = 0; j < setpiece.sensors.length; j++) destroy(setpiece.sensors[j]);
        destroy(setpiece.exit);
        destroy(setpiece.label);
      }
    };
    for (i = 0; i < 3; i++) {
      setpiece.conveyors.push(staticRect(scene, plan.xs[i], plan.y + (i % 2 ? -42 : 0), 148, 14, 0x61784f, 0.82, 4));
      setpiece.crates.push(staticRect(scene, plan.xs[i] + 18, plan.y + (i % 2 ? -66 : -24), 34, 28, 0x8a7d62, 0.88, 9));
      setpiece.sensors.push(sensorZone(scene, plan.xs[i], plan.y + (i % 2 ? -64 : -22), 118, 88));
      if (world.platforms) world.platforms.push(setpiece.conveyors[i]);
      if (room.platforms) room.platforms.push(setpiece.conveyors[i]);
    }
    updateHook = function(){
      setpiece.update();
    };
    if (scene.events && scene.events.on) scene.events.on('update', updateHook);
    world.supplyChain = setpiece;
    room.supplyChain = setpiece;
    return setpiece;
  }

  ns.Setpieces.registerSupplyChainReceipt = registerReceipt;
  ns.Setpieces.attachSupplyChain = attachSupplyChain;
})(CEHP);
CEHP._register('6A_post_setpiece_supply_chain');
