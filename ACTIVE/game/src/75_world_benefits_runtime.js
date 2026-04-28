/* MODULE: 75_WORLD_BENEFITS_RUNTIME - W3 playable world.
   Premium-gated upper routes, dangerous uninsured lanes,
   three enemy types, run-scoped jump shrink. */

(function(ns){
  'use strict';

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function staticRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0x6a6671, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    scene.physics.add.existing(rect, true);
    rect.body.allowGravity = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function sensorZone(scene, x, y, w, h){
    var zone = scene.add.zone(x, y, w, h).setDepth(3);
    scene.physics.add.existing(zone, true);
    zone.body.allowGravity = false;
    zone.body.moves = false;
    return zone;
  }

  function textLabel(scene, x, y, text, size, color, depth){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: (size || 8) + 'px',
      color: color || '#fff9e0',
      align: 'left'
    }).setDepth(depth == null ? 8 : depth);
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function addBackdropImage(scene, key, x, y, w, h, depth, alpha){
    var image;

    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;

    image = scene.add.image(x, y, key).setDepth(depth == null ? 1.6 : depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(w, h);
    if (image.setAlpha) image.setAlpha(alpha == null ? 1 : alpha);
    return image;
  }

  function addOfficeDressing(world, room){
    var scene = world.scene;
    var width = room.endX - room.startX;
    var i;
    var tile;

    if (textureExists(scene, 'carpet_tile_seamless') && scene.add && scene.add.tileSprite) {
      tile = scene.add.tileSprite(room.startX + (width / 2), world.horizon + 4, width - 24, 40, 'carpet_tile_seamless').setDepth(1.5);
      if (tile.setAlpha) tile.setAlpha(0.32);
    }

    if (textureExists(scene, 'fluorescent_light_fixture')) {
      for (i = 0; i < 3; i++) {
        addBackdropImage(scene, 'fluorescent_light_fixture', room.startX + 220 + (i * 350), 42, 150, 74, 1.55, 0.24);
      }
    }

    addBackdropImage(scene, 'paper_safety_poster', room.startX + 110, 118, 74, 74, 1.6, 0.58);
    addBackdropImage(scene, 'paper_expired_id', room.startX + 254, 130, 86, 58, 1.6, 0.5);
    addBackdropImage(scene, 'prop_filing_cabinet', room.endX - 112, world.horizon - 70, 86, 128, 1.9, 0.58);
    addBackdropImage(scene, 'prop_coffee_cup', room.endX - 82, world.horizon - 142, 30, 30, 2.1, 0.94);
  }

  function destroyThing(obj){
    if (obj && obj.destroy) obj.destroy();
  }

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function intersects(a, b){
    return ns.Collision && ns.Collision.intersects ? ns.Collision.intersects(a, b) : false;
  }

  function rememberRoom(world, roomId){
    if (world.visitedRooms[roomId]) return;
    world.visitedRooms[roomId] = true;
    world.roomOrder.push(roomId);
  }

  function updateRunState(world){
    world.runState.worldStats = world.stats;
    world.runState.receiptFlags = world.receiptFlags;
  }

  function setJumpPenalty(world, value){
    world.stats.jumpPenalty = clamp(value, 0, 48);
    world.player.jumpVelocity = clamp(ns.TUNING.JUMP_VELOCITY + world.stats.jumpPenalty, -340, -292);
    updateRunState(world);
  }

  function finalizeRoom(world, room){
    if (!room || room.finalized) return;
    room.finalized = true;
    if (room.safeCompleted) {
      world.stats.premiumRoomsCleared += 1;
      if (!world.receiptFlags.uninsuredVeteran && world.stats.premiumRoomsCleared >= 4) {
        world.receiptFlags.premiumSecured = true;
      }
      updateRunState(world);
    }
  }

  function setRoomRespawn(world, room){
    if (!room || !world.player) return;
    world.player.spawnX = room.startX + 78;
    world.player.spawnY = world.horizon - 34;
  }

  function syncCurrentRoom(world){
    var x = world.player.x;
    for (var i = 0; i < world.rooms.length; i++) {
      if (x >= world.rooms[i].startX && x < world.rooms[i].endX) {
        if (world.currentRoom && world.currentRoom !== world.rooms[i]) finalizeRoom(world, world.currentRoom);
        world.currentRoom = world.rooms[i];
        world.currentRoomId = world.rooms[i].id;
        world.runState.roomId = world.rooms[i].id;
        rememberRoom(world, world.rooms[i].id);
        setRoomRespawn(world, world.rooms[i]);
        return;
      }
    }
    if (world.rooms.length) {
      world.currentRoom = world.rooms[world.rooms.length - 1];
      world.currentRoomId = world.currentRoom.id;
      world.runState.roomId = world.currentRoomId;
    }
  }

  function readSign(world, sign){
    if (!sign || !world.player || !sign.sensor) return;
    if (intersects(world.player, sign.sensor)) {
      sign.peek({ signId: sign.id, words: sign.text.split(/\s+/).length });
      if (ns.Input.justPressed('up')) {
        sign.read({ signId: sign.id, words: sign.text.split(/\s+/).length });
      }
    }
  }

  function addPlatform(world, room, x, y, w, h, color, alpha, depth){
    var rect = staticRect(world.scene, x, y, w, h, color, alpha, depth);
    world.platforms.push(rect);
    room.platforms.push(rect);
    return rect;
  }

  function addBackdrop(world, room, color, accent){
    var width = room.endX - room.startX;
    world.scene.add.rectangle(room.startX + (width / 2), ns.GAME_H / 2, width - 24, ns.GAME_H - 32, color, 1).setDepth(0);
    world.scene.add.rectangle(room.startX + 18, ns.GAME_H / 2, 16, ns.GAME_H - 32, accent, 1).setDepth(1);
    addOfficeDressing(world, room);
    textLabel(world.scene, room.startX + 34, 22, room.title, 8, '#fff9e0', 8);
  }

  function makeRoom(world, spec, startX, width){
    var room = {
      id: spec.id,
      title: spec.title,
      startX: startX,
      endX: startX + width,
      premiumTarget: spec.premiumTarget || 0,
      premiumCount: 0,
      platforms: [],
      signs: [],
      premiums: [],
      enemies: [],
      hazards: [],
      gate: null,
      branchOutcome: '',
      safeCompleted: false,
      uninsuredCommitted: false,
      damageTagged: false,
      finalized: false,
      completeX: startX + width - 110
    };
    world.rooms.push(room);
    return room;
  }

  function addSign(world, room, x, y, text, opts){
    var sign = ns.Signs.place(world.scene, x, y, text, opts || {});
    room.signs.push(sign);
    world.signs.push(sign);
    return sign;
  }

  function makePremium(world, room, x, y){
    var stamp = world.scene.add.rectangle(x, y, 16, 16, 0xfff9e0, 0.98).setDepth(12).setStrokeStyle(1, 0xc23b3b, 1);
    var mark = world.scene.add.text(x, y, '$', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#c23b3b',
      align: 'center'
    }).setOrigin(0.5).setDepth(13);
    var pickupId = room.id + '|premium|' + room.premiums.length;
    stamp.setVisible(false); mark.setVisible(false);
    var premium = {
      rect: stamp,
      label: mark,
      room: room,
      pickupId: pickupId,
      collected: false,
      collect: function(){
        if (premium.collected) return;
        premium.collected = true;
        if (ns.Feel && ns.Feel.onPickup) {
          ns.Feel.onPickup(world.scene, x, y, world.runState.caseSeed || (ns.RunState && ns.RunState.caseSeed), premium.pickupId);
        }
        premium.rect.setVisible(false);
        premium.label.setVisible(false);
        room.premiumCount += 1;
        world.stats.premiumsCollected += 1;
        if (ns.Events && ns.Events.emit) ns.Events.emit('form:used', { kind: 'premium', x: x, y: y });
        updateRunState(world);
      },
      destroy: function(){
        destroyThing(premium.rect);
        destroyThing(premium.label);
      }
    };
    room.premiums.push(premium);
    world.premiums.push(premium);
    return premium;
  }

  function makeHazard(world, room, x, y, w, h, kind){
    var zone = world.scene.add.rectangle(x, y, w, h, 0x7a2e2e, 0.45).setDepth(5);
    var hazard = {
      rect: zone,
      room: room,
      kind: kind || 'hazard',
      update: function(player){
        if (!player || player.invulnMs > 0 || !intersects(player, zone)) return;
        if (ns.Events && ns.Events.emit) ns.Events.emit('combat:damageTaken', { kind: hazard.kind, amount: 1 });
        if (room.uninsuredCommitted) {
          room.damageTagged = true;
          world.receiptFlags.uninsuredVeteran = true;
          world.receiptFlags.premiumSecured = false;
          updateRunState(world);
        }
        if (player.takeHit) player.takeHit(hazard.kind);
      },
      destroy: function(){ destroyThing(zone); }
    };
    room.hazards.push(hazard);
    world.hazards.push(hazard);
    return hazard;
  }

  function addEnemy(world, room, type, opts){
    opts = opts || {};
    opts.rng = opts.rng || world.enemyRng;
    var d = ns.EncounterDirector;
    if (d && d.admit && !d.admit({ type: type })) return null;
    var enemy = ns.Enemies && ns.Enemies.spawn ? ns.Enemies.spawn(world.scene, type, opts) : null;
    if (!enemy) return null;
    if (d && d.release) {
      var od = enemy.destroy;
      enemy.destroy = function(){ d.release(enemy); od.call(enemy); };
    }
    room.enemies.push(enemy);
    world.enemies.push(enemy);
    return enemy;
  }

  function pathwayGate(world, room, spec, cfg){
    var scene = world.scene;
    var horizon = world.horizon;
    var baseX = cfg.baseX;
    var sign = addSign(world, room, baseX + 18, horizon - 82, spec.contradictionSign, { id: room.id + '-coverage-sign' });
    var lamp = scene.add.rectangle(baseX + 82, horizon - 92, 10, 10, 0x8b6f74, 1).setDepth(11);
    var upperDoor = staticRect(scene, baseX + 470, horizon - 106, 20, 84, 0xc23b3b, 1, 6);
    var lowerTrigger = sensorZone(scene, baseX + 620, horizon - 26, 220, 86);
    var upperClear = sensorZone(scene, baseX + 880, horizon - 122, 220, 88);

    addPlatform(world, room, baseX + 248, horizon - 34, 96, 14, 0xffe7be, 1, 4);
    addPlatform(world, room, baseX + 334, horizon - 70, 96, 14, 0xffe7be, 1, 4);
    addPlatform(world, room, baseX + 420, horizon - 106, 96, 14, 0xffe7be, 1, 4);
    addPlatform(world, room, baseX + 608, horizon - 126, 208, 18, 0xfff1c8, 1, 4);
    addPlatform(world, room, baseX + 854, horizon - 126, 190, 18, 0xfff1c8, 1, 4);

    room.gate = {
      sign: sign,
      lamp: lamp,
      upperDoor: upperDoor,
      lowerTrigger: lowerTrigger,
      upperClear: upperClear,
      unlocked: false,
      skipped: false,
      followed: false,
      unlock: function(){
        if (room.gate.unlocked) return;
        room.gate.unlocked = true;
        destroyThing(room.gate.upperDoor);
        room.gate.lamp.fillColor = 0x5b8f6a;
        room.branchOutcome = 'insured';
        if (ns.Events && ns.Events.emit) ns.Events.emit('module:passed', {
          roomId: room.id,
          moduleId: room.id + '-premium-path'
        });
      },
      commitLower: function(){
        if (room.gate.unlocked || room.gate.skipped) return;
        room.gate.skipped = true;
        room.uninsuredCommitted = true;
        room.branchOutcome = 'uninsured';
        room.gate.lamp.fillColor = 0xe04a3a;
        world.lastContradictionOutcome = 'defy';
        if (ns.Events && ns.Events.emit) {
          ns.Events.emit('module:skipped', {
            roomId: room.id,
            moduleId: room.id + '-premium-path'
          });
          ns.Events.emit('contradiction:defy', { gateId: sign.id, action: 'move', elapsedMs: 120 });
        }
      },
      markSafe: function(){
        if (!room.gate.unlocked || room.safeCompleted) return;
        room.safeCompleted = true;
        room.branchOutcome = 'insured';
        world.lastContradictionOutcome = 'follow';
        if (!room.gate.followed && ns.Events && ns.Events.emit) {
          room.gate.followed = true;
          ns.Events.emit('contradiction:follow', { gateId: sign.id, action: 'wait', elapsedMs: 900 });
        }
      }
    };

    return room.gate;
  }

  function applyPizzaParty(world){
    setJumpPenalty(world, world.stats.jumpPenalty - 16);
    world.stats.occlusionUntil = world.scene.time.now + 2800;
    updateRunState(world);
  }

  function applyDeductibleHit(world){
    world.player.invulnMs = 420;
    world.stats.deductibleHits += 1;
    if (ns.Events && ns.Events.emit) ns.Events.emit('combat:damageTaken', { kind: 'deductible', amount: 1 });
    setJumpPenalty(world, world.stats.jumpPenalty + 16);
    if (world.currentRoom && world.currentRoom.uninsuredCommitted) {
      world.currentRoom.damageTagged = true;
      world.receiptFlags.uninsuredVeteran = true;
      world.receiptFlags.premiumSecured = false;
      updateRunState(world);
    }
  }

  function hitByEnemy(world, kind){
    if (ns.Events && ns.Events.emit) ns.Events.emit('combat:damageTaken', { kind: kind, amount: 1 });
    if (world.currentRoom && world.currentRoom.uninsuredCommitted) {
      world.currentRoom.damageTagged = true;
      world.receiptFlags.uninsuredVeteran = true;
      world.receiptFlags.premiumSecured = false;
      updateRunState(world);
    }
    if (world.player && world.player.takeHit) world.player.takeHit(kind);
  }

  function addCommonGeometry(world, room, spec, startX, width, colors){
    addBackdrop(world, room, colors[0], colors[1]);
    addPlatform(world, room, startX + 180, world.horizon, width - 90, 28, 0x7a7480, 1, 2);
    pathwayGate(world, room, spec, { baseX: startX + 210 });
    addSign(world, room, startX + 172, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 936, world.horizon - 188, spec.actionSigns[1], { id: room.id + '-sign-2' });
  }

  function buildEnrollment(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x3a262a, 0xf2c6d1]);
    makePremium(world, room, startX + 302, world.horizon - 48);
    makePremium(world, room, startX + 418, world.horizon - 84);
    addEnemy(world, room, 'pizzaParty', { x: startX + 910, y: world.horizon - 148, phase: 0.2 });
    makeHazard(world, room, startX + 826, world.horizon - 10, 40, 22, 'uninsured-lane');
    makeHazard(world, room, startX + 972, world.horizon - 10, 40, 22, 'uninsured-lane');
    return room;
  }

  function buildPathways(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x352229, 0xe3a0ab]);
    makePremium(world, room, startX + 286, world.horizon - 48);
    makePremium(world, room, startX + 396, world.horizon - 84);
    addEnemy(world, room, 'scantron', {
      teleportPoints: [
        { x: startX + 716, y: world.horizon - 108 },
        { x: startX + 900, y: world.horizon - 108 },
        { x: startX + 980, y: world.horizon - 12 }
      ]
    });
    makeHazard(world, room, startX + 930, world.horizon - 10, 36, 22, 'uninsured-lane');
    makeHazard(world, room, startX + 1070, world.horizon - 10, 36, 22, 'uninsured-lane');
    return room;
  }

  function buildNetwork(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x321f28, 0xc23b3b]);
    makePremium(world, room, startX + 264, world.horizon - 48);
    makePremium(world, room, startX + 356, world.horizon - 84);
    makePremium(world, room, startX + 464, world.horizon - 120);
    addEnemy(world, room, 'scantron', {
      teleportPoints: [
        { x: startX + 706, y: world.horizon - 108 },
        { x: startX + 882, y: world.horizon - 108 },
        { x: startX + 1036, y: world.horizon - 12 }
      ]
    });
    addEnemy(world, room, 'scantron', {
      teleportPoints: [
        { x: startX + 768, y: world.horizon - 126 },
        { x: startX + 972, y: world.horizon - 108 },
        { x: startX + 1126, y: world.horizon - 12 }
      ]
    });
    makeHazard(world, room, startX + 884, world.horizon - 10, 40, 22, 'uninsured-lane');
    makeHazard(world, room, startX + 1042, world.horizon - 10, 40, 22, 'uninsured-lane');
    return room;
  }

  function buildDeductible(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x302129, 0xf0d48f]);
    makePremium(world, room, startX + 300, world.horizon - 48);
    makePremium(world, room, startX + 420, world.horizon - 120);
    addEnemy(world, room, 'deductibleWeight', { x: startX + 826, y: world.horizon - 144, range: 48, speed: 0.0022, phase: 0.4 });
    addEnemy(world, room, 'deductibleWeight', { x: startX + 1032, y: world.horizon - 24, range: 32, speed: 0.0026, phase: 1.1 });
    makeHazard(world, room, startX + 920, world.horizon - 10, 34, 22, 'uninsured-lane');
    return room;
  }

  function buildWellness(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x3a2830, 0xf2c6d1]);
    makePremium(world, room, startX + 262, world.horizon - 48);
    makePremium(world, room, startX + 360, world.horizon - 84);
    makePremium(world, room, startX + 456, world.horizon - 120);
    addEnemy(world, room, 'scantron', {
      teleportPoints: [
        { x: startX + 724, y: world.horizon - 108 },
        { x: startX + 932, y: world.horizon - 108 },
        { x: startX + 1090, y: world.horizon - 12 }
      ]
    });
    addEnemy(world, room, 'deductibleWeight', { x: startX + 844, y: world.horizon - 24, range: 36, speed: 0.0024, phase: 0.8 });
    addEnemy(world, room, 'pizzaParty', { x: startX + 986, y: world.horizon - 148, phase: 0.5 });
    makeHazard(world, room, startX + 932, world.horizon - 10, 36, 22, 'uninsured-lane');
    return room;
  }

  function buildFinal(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addCommonGeometry(world, room, spec, startX, width, [0x2b1d24, 0xc23b3b]);
    makePremium(world, room, startX + 294, world.horizon - 48);
    makePremium(world, room, startX + 432, world.horizon - 120);
    addEnemy(world, room, 'scantron', {
      teleportPoints: [
        { x: startX + 716, y: world.horizon - 108 },
        { x: startX + 900, y: world.horizon - 126 },
        { x: startX + 1068, y: world.horizon - 12 }
      ]
    });
    addEnemy(world, room, 'deductibleWeight', { x: startX + 840, y: world.horizon - 24, range: 38, speed: 0.0023, phase: 0.6 });
    addEnemy(world, room, 'pizzaParty', { x: startX + 944, y: world.horizon - 148, phase: 0.9 });
    makeHazard(world, room, startX + 1036, world.horizon - 10, 42, 22, 'uninsured-lane');
    room.finalSign = addSign(world, room, startX + 1102, world.horizon - 190, spec.actionSigns[1], { id: room.id + '-final-sign' });
    world.goal = sensorZone(world.scene, startX + 1168, world.horizon - 120, 160, 220);
    return room;
  }

  function updatePremiums(world){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.premiums.length; i++) {
      if (!room.premiums[i].collected && intersects(world.player, room.premiums[i].rect)) {
        room.premiums[i].collect();
      }
    }
  }

  function updateSigns(world){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.signs.length; i++) readSign(world, room.signs[i]);
    if (room.gate && room.gate.sign) readSign(world, room.gate.sign);
    if (room.finalSign) readSign(world, room.finalSign);
  }

  function updateGate(world){
    var room = world.currentRoom;
    if (!room || !room.gate) return;
    if (!room.gate.unlocked && room.premiumCount >= room.premiumTarget) room.gate.unlock();
    if (!room.gate.unlocked && intersects(world.player, room.gate.lowerTrigger)) room.gate.commitLower();
    if (room.gate.unlocked && intersects(world.player, room.gate.upperClear)) room.gate.markSafe();
  }

  function updateHazards(world){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.hazards.length; i++) room.hazards[i].update(world.player);
  }

  function updateEnemies(world, dtMs){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.enemies.length; i++) {
      if (room.enemies[i] && room.enemies[i].update) room.enemies[i].update(world.player, world, dtMs);
    }
  }

  function resetDebug(world){
    ns.Axes.reset();
    if (ns.Metrics && ns.Metrics.reset) ns.Metrics.reset();
    world.scene.recorder.clear();
    world.scene.pendingDeath = null;
    world.scene.runComplete = false;
    world.scene.runStartMs = world.scene.time.now;
    world.lastContradictionOutcome = '';
    world.visitedRooms = {};
    world.roomOrder.length = 0;
    world.currentRoom = null;
    world.currentRoomId = world.rooms[0].id;
    world.runState.roomOrder = world.roomOrder;
    world.runState.actionsLearned = [];
    world.runState.receipt = null;
    world.runState.receiptFlags = { uninsuredVeteran:false, premiumSecured:false };
    world.runState.worldStats = {
      premiumsCollected: 0,
      premiumRoomsCleared: 0,
      deductibleHits: 0,
      jumpPenalty: 0,
      occlusionUntil: 0
    };
    world.receiptFlags = world.runState.receiptFlags;
    world.stats = world.runState.worldStats;
    world.enemyRng = ns.makeRNG ? ns.makeRNG(world.runState.caseSeed + '|benefits|enemies') : null;
    setJumpPenalty(world, 0);
    world.player.invulnMs = 0;
    ns.Movement.respawn(world.player);
    for (var i = 0; i < world.rooms.length; i++) {
      world.rooms[i].premiumCount = 0;
      world.rooms[i].safeCompleted = false;
      world.rooms[i].uninsuredCommitted = false;
      world.rooms[i].damageTagged = false;
      world.rooms[i].branchOutcome = '';
      world.rooms[i].finalized = false;
      if (world.rooms[i].gate) {
        world.rooms[i].gate.unlocked = false;
        world.rooms[i].gate.skipped = false;
        world.rooms[i].gate.followed = false;
        world.rooms[i].gate.lamp.fillColor = 0x8b6f74;
        if (world.rooms[i].gate.upperDoor && !world.rooms[i].gate.upperDoor.scene) {
          world.rooms[i].gate.upperDoor = staticRect(world.scene, world.rooms[i].gate.upperClear.x - 410, world.horizon - 106, 20, 84, 0xc23b3b, 1, 6);
        }
      }
      for (var j = 0; j < world.rooms[i].premiums.length; j++) {
        world.rooms[i].premiums[j].collected = false;
        world.rooms[i].premiums[j].rect.setVisible(true);
        world.rooms[i].premiums[j].label.setVisible(true);
      }
    }
    rememberRoom(world, world.rooms[0].id);
    world.currentRoom = world.rooms[0];
    setRoomRespawn(world, world.rooms[0]);
  }

  function scriptRoom(world, room, style, markers){
    var insured = style === 'insured';
    var laneY = insured ? world.horizon - 140 : world.horizon - 28;
    var roomIndex = world.rooms.indexOf(room);
    world.player.x = room.startX + 80;
    world.player.y = laneY;
    syncCurrentRoom(world);
    world.scene.recorder.mark(markers[0], world.player.x, world.player.y, 1);

    for (var i = 0; i < room.signs.length; i++) {
      room.signs[i].peek({ signId: room.signs[i].id, words: room.signs[i].text.split(/\s+/).length });
      room.signs[i].read({ signId: room.signs[i].id, words: room.signs[i].text.split(/\s+/).length });
    }
    if (room.gate && room.gate.sign) {
      room.gate.sign.peek({ signId: room.gate.sign.id, words: room.gate.sign.text.split(/\s+/).length });
      room.gate.sign.read({ signId: room.gate.sign.id, words: room.gate.sign.text.split(/\s+/).length });
    }

    if (insured) {
      for (i = 0; i < room.premiums.length; i++) room.premiums[i].collect();
      room.gate.unlock();
      room.gate.markSafe();
      if (room.id === 'wellness-incentive' || room.id === 'final-processing') applyPizzaParty(world);
      if (room.id === 'deductible-adjustment') applyDeductibleHit(world);
      if (room.id === 'wellness-incentive') setJumpPenalty(world, Math.max(0, world.stats.jumpPenalty - 16));
      if (ns.Events && ns.Events.emit) ns.Events.emit('music:sync', { x: room.endX - 160, y: world.horizon - 140 });
      world.scene.recorder.mark(markers[1], room.startX + 420, world.horizon - 96, 1);
      world.scene.recorder.mark(markers[2], room.startX + 860, world.horizon - 126, 1);
    } else {
      room.gate.commitLower();
      if (room.id === 'enrollment-intake' || room.id === 'premium-pathways' || room.id === 'network-validation') {
        room.damageTagged = true;
        world.receiptFlags.uninsuredVeteran = true;
        world.receiptFlags.premiumSecured = false;
        if (ns.Events && ns.Events.emit) {
          ns.Events.emit('combat:damageTaken', { kind: 'uninsured-lane', amount: 1 });
          ns.Events.emit('player:death', { source: 'uninsured-lane' });
        }
      }
      if (room.id === 'deductible-adjustment' || room.id === 'wellness-incentive' || room.id === 'final-processing') {
        applyDeductibleHit(world);
      }
      if (ns.Events && ns.Events.emit) ns.Events.emit('movement:nearMiss', { x: room.startX + 940, y: world.horizon - 12 });
      world.scene.recorder.mark(markers[1], room.startX + 430, world.horizon - 20, 1);
      world.scene.recorder.mark(markers[2], room.startX + 940, world.horizon - 12, 1);
    }

    updateRunState(world);
    world.player.x = room.endX - 120;
    world.player.y = insured ? world.horizon - 126 : world.horizon - 28;
    syncCurrentRoom(world);
    finalizeRoom(world, room);
    world.scene.recorder.mark(markers[3], world.player.x, world.player.y, 1);
  }

  function runStyle(world, scene, style){
    if (scene.runComplete && world.runState.receipt) {
      return {
        receipt: clone(world.runState.receipt),
        axes: clone(ns.Axes.snapshot()),
        frames: clone(scene.recorder.dump()),
        contradictionOutcome: world.lastContradictionOutcome || '',
        worldId: world.runState.worldId,
        roomOrder: clone(world.roomOrder),
        worldStats: clone(world.stats),
        receiptFlags: clone(world.receiptFlags)
      };
    }

    style = style || 'insured';
    resetDebug(world);

    var markers = [
      [0, 180, 380, 560],
      [620, 800, 980, 1160],
      [1220, 1400, 1580, 1760],
      [1820, 2000, 2180, 2360],
      [2420, 2600, 2780, 2960],
      [3020, 3200, 3380, 3560]
    ];

    for (var i = 0; i < world.rooms.length; i++) scriptRoom(world, world.rooms[i], style, markers[i]);

    if (!world.receiptFlags.uninsuredVeteran && world.stats.premiumRoomsCleared >= 4) {
      world.receiptFlags.premiumSecured = true;
      updateRunState(world);
    }
    world.player.x = world.goal.x;
    world.player.y = world.goal.y;
    finalizeRoom(world, world.currentRoom);
    scene.completeRun('debug:' + style);

    return {
      receipt: clone(world.runState.receipt),
      axes: clone(ns.Axes.snapshot()),
      frames: clone(scene.recorder.dump()),
      contradictionOutcome: world.lastContradictionOutcome || '',
      worldId: world.runState.worldId,
      roomOrder: clone(world.roomOrder),
      worldStats: clone(world.stats),
      receiptFlags: clone(world.receiptFlags)
    };
  }

  function create(scene, runState){
    var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get('benefits') : null;
    var roomWidth = 1280;
    var horizon = ns.GAME_H - 24;
    var world = {
      id: 'benefits-world',
      worldId: 'benefits',
      scene: scene,
      runState: runState,
      manifest: manifest,
      horizon: horizon,
      width: roomWidth * 6,
      rooms: [],
      platforms: [],
      premiums: [],
      enemies: [],
      hazards: [],
      signs: [],
      goal: null,
      currentRoom: null,
      currentRoomId: 'enrollment-intake',
      roomOrder: [],
      visitedRooms: {},
      lastContradictionOutcome: '',
      stats: runState.worldStats || {
        premiumsCollected: 0,
        premiumRoomsCleared: 0,
        deductibleHits: 0,
        jumpPenalty: 0,
        occlusionUntil: 0
      },
      receiptFlags: runState.receiptFlags || {
        uninsuredVeteran:false,
        premiumSecured:false
      },
      enemyRng: ns.makeRNG ? ns.makeRNG(runState.caseSeed + '|benefits|enemies') : null
    };
    world.applyPizzaParty = function(){ applyPizzaParty(world); };
    world.applyDeductibleHit = function(){ applyDeductibleHit(world); };
    world.hitByEnemy = function(kind){ hitByEnemy(world, kind); };

    scene.cameras.main.setBackgroundColor('#21151a');
    scene.physics.world.setBounds(0, 0, world.width, ns.GAME_H);
    scene.cameras.main.setBounds(0, 0, world.width, ns.GAME_H);

    world.player = ns.Movement.createEd(scene, 72, horizon - 28);
    world.player.jumpVelocity = ns.TUNING.JUMP_VELOCITY;
    scene.player = world.player;

    runState.worldId = 'benefits';
    runState.roomId = manifest.rooms[0].id;
    runState.roomOrder = world.roomOrder;
    runState.actionsLearned = [];
    runState.worldFlags = manifest || {};
    updateRunState(world);

    if (ns.EncounterDirector && ns.EncounterDirector.prime) ns.EncounterDirector.prime(scene, 'benefits', manifest.rooms[0].id);
    if (ns.Curiosity && ns.Curiosity.prime) ns.Curiosity.prime(scene, 'benefits');

    buildEnrollment(world, manifest.rooms[0], 0, roomWidth);
    buildPathways(world, manifest.rooms[1], roomWidth, roomWidth);
    buildNetwork(world, manifest.rooms[2], roomWidth * 2, roomWidth);
    buildDeductible(world, manifest.rooms[3], roomWidth * 3, roomWidth);
    buildWellness(world, manifest.rooms[4], roomWidth * 4, roomWidth);
    buildFinal(world, manifest.rooms[5], roomWidth * 5, roomWidth);

    for (var i = 0; i < world.platforms.length; i++) {
      scene.physics.add.collider(world.player, world.platforms[i]);
    }

    scene.physics.add.overlap(world.player, world.goal, function(){
      finalizeRoom(world, world.currentRoom);
      if (!world.receiptFlags.uninsuredVeteran && world.stats.premiumRoomsCleared >= 4) {
        world.receiptFlags.premiumSecured = true;
        updateRunState(world);
      }
      scene.completeRun('goal');
    });

    rememberRoom(world, manifest.rooms[0].id);
    world.currentRoom = world.rooms[0];
    setRoomRespawn(world, world.rooms[0]);
    return world;
  }

  function update(scene, dtMs){
    var world = scene.room;
    if (!world || !world.player) return;
    syncCurrentRoom(world);
    updateSigns(world);
    updatePremiums(world);
    updateGate(world);
    updateHazards(world);
    updateEnemies(world, dtMs);
    if (ns.EncounterDirector && ns.EncounterDirector.tick) ns.EncounterDirector.tick(scene, dtMs);
    if (ns.Curiosity && ns.Curiosity.update) ns.Curiosity.update(scene, dtMs);
  }

  function destroy(world){
    if (!world) return;
    for (var i = 0; i < world.enemies.length; i++) {
      if (world.enemies[i] && world.enemies[i].destroy) world.enemies[i].destroy();
    }
    for (i = 0; i < world.premiums.length; i++) {
      if (world.premiums[i] && world.premiums[i].destroy) world.premiums[i].destroy();
    }
    for (i = 0; i < world.hazards.length; i++) {
      if (world.hazards[i] && world.hazards[i].destroy) world.hazards[i].destroy();
    }
  }

  ns.WorldBenefits = {
    create: create,
    update: update,
    destroy: destroy,
    runStyle: runStyle,
    applyPizzaParty: applyPizzaParty,
    applyDeductibleHit: applyDeductibleHit,
    hitByEnemy: hitByEnemy
  };
})(CEHP);
CEHP._register('75_world_benefits_runtime');
