/* MODULE: 76_WORLD_RASTA_RUNTIME - W4 playable world.
   Deterministic synchronicity platforms, polite sorting helpers,
   sincere REST HERE contradiction. */

(function(ns){
  'use strict';

  var WH = ns.WorldRuntime;
  var staticRect = WH.staticRect;
  var movingRect = WH.movingRect;
  var sensorZone = WH.sensorZone;
  var addBackdropImage = WH.addBackdropImage;
  var destroyThing = WH.destroyThing;
  var clone = WH.clone;
  var intersects = WH.intersects;

  function textLabel(scene, x, y, text, size, color, depth){
    return WH.textLabel(scene, x, y, text, size, color, depth, '#f2e3c5');
  }

  function triangleWave(v){
    var n = v - Math.floor(v);
    return n < 0.5 ? ((n * 4) - 1) : (3 - (n * 4));
  }

  function waveValue(mode, time, rate, phase){
    var t = (time * (rate || 0.0003)) + (phase || 0);
    if (mode === 'cosine') return Math.cos(t * Math.PI * 2);
    if (mode === 'triangle') return triangleWave(t);
    return Math.sin(t * Math.PI * 2);
  }

  function defaultStats(){
    return {
      syncMoments: 0,
      restOpens: 0,
      rushRebounds: 0,
      sortingRedirects: 0
    };
  }

  function defaultFlags(){
    return {
      restOpened: false,
      rushedRest: false,
      cigaretteLit: false,
      syncedFlow: false
    };
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

  function setRoomRespawn(world, room){
    if (!room || !world.player) return;
    world.player.spawnX = room.startX + 84;
    world.player.spawnY = world.horizon - 36;
  }

  function syncCurrentRoom(world){
    var x = world.player.x;
    for (var i = 0; i < world.rooms.length; i++) {
      if (x >= world.rooms[i].startX && x < world.rooms[i].endX) {
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

  function addPlatforms(world, room, startX, values){
    for (var i = 0; i < values.length; i += 5) {
      addPlatform(world, room, startX + values[i], world.horizon - values[i + 1], values[i + 2], values[i + 3], values[i + 4], 1, 4);
    }
  }

  function addRoomSigns(world, room, startX, spec, values){
    for (var i = 0; i < values.length; i += 2) {
      addSign(world, room, startX + values[i], world.horizon - values[i + 1], spec.actionSigns[i / 2], { id: room.id + '-sign-' + ((i / 2) + 1) });
    }
  }

  var SYNC_MODES = ['sine', 'cosine', 'triangle'];

  function addSyncs(world, room, startX, values){
    for (var i = 0; i < values.length; i += 8) {
      makeSyncPlatform(world, room, {
        baseX: startX + values[i],
        baseY: world.horizon - values[i + 1],
        ampX: values[i + 2],
        ampY: values[i + 3],
        modeX: SYNC_MODES[values[i + 4]],
        modeY: SYNC_MODES[values[i + 5]],
        rateX: values[i + 6],
        rateY: values[i + 7]
      });
    }
  }

  function addSortingMachines(world, room, startX, values){
    for (var i = 0; i < values.length; i += 5) {
      makeSortingMachine(world, room, startX + values[i], world.horizon - values[i + 1], {
        label: values[i + 2],
        nudgeX: values[i + 3],
        nudgeY: values[i + 4]
      });
    }
  }

  function addLocustSensor(world, room, startX){
    room.locustSensor = sensorZone(world.scene, startX + 338, world.horizon - 72, 190, 142);
    return room.locustSensor;
  }

  function triggerLocust(world, room){
    var swarm;
    if (!world || !room || room.locustTriggered) return null;
    if (!ns.Enemies || !ns.Enemies['spawnReplyAllLocust']) return null;
    if (!(!ns.flags || ns.flags.W3_REPLY_ALL_LOCUST !== false)) return null;
    room.locustTriggered = true;
    swarm = ns.Enemies['spawnReplyAllLocust'](world.scene, world, {
      room: room,
      seed: (world.runState && world.runState.caseSeed ? world.runState.caseSeed : 'cehp-rasta') + '|' + room.id + '|reply-all',
      x: room.startX + 76,
      y: world.horizon - 96,
      edge: 'left',
      telegraphMs: 260,
      decayMs: 9600
    });
    return swarm;
  }

  function addBackdrop(world, room, color, accent){
    var width = room.endX - room.startX;
    world.scene.add.rectangle(room.startX + (width / 2), ns.GAME_H / 2, width - 24, ns.GAME_H - 32, color, 1).setDepth(0);
    world.scene.add.rectangle(room.startX + 18, ns.GAME_H / 2, 16, ns.GAME_H - 32, accent, 1).setDepth(1);
    world.scene.add.rectangle(room.startX + (width / 2), 72, width - 88, 48, 0xf2e3c5, 0.05).setDepth(1);
    textLabel(world.scene, room.startX + 34, 22, room.title, 8, '#f2e3c5', 8);
  }

  function makeRoom(world, spec, startX, width){
    var room = {
      id: spec.id,
      title: spec.title,
      startX: startX,
      endX: startX + width,
      platforms: [],
      signs: [],
      syncPlatforms: [],
      sortingMachines: [],
      enemies: [],
      locustSensor: null,
      locustTriggered: false,
      restGate: null,
      completeX: startX + width - 110
    };
    world.rooms.push(room);
    return room;
  }

  function addSign(world, room, x, y, text, opts){
    var sign = ns.Signs.place(world.scene, x, y, text, opts || {});
    sign.room = room;
    room.signs.push(sign);
    world.signs.push(sign);
    return sign;
  }

  function makeSyncPlatform(world, room, cfg){
    var rect = movingRect(world.scene, cfg.baseX, cfg.baseY, cfg.w || 90, cfg.h || 14, cfg.color || 0xe8d9b1, cfg.alpha == null ? 1 : cfg.alpha, cfg.depth == null ? 4 : cfg.depth);
    rect.setStrokeStyle(1, cfg.stroke || 0xc49a4a, 1);
    var platform = {
      rect: rect,
      room: room,
      baseX: cfg.baseX,
      baseY: cfg.baseY,
      ampX: cfg.ampX || 0,
      ampY: cfg.ampY || 0,
      modeX: cfg.modeX || 'sine',
      modeY: cfg.modeY || 'cosine',
      rateX: cfg.rateX || 0.00028,
      rateY: cfg.rateY || 0.00034,
      phaseX: world.syncRng ? world.syncRng.float() : 0,
      phaseY: world.syncRng ? world.syncRng.float() : 0,
      beat: 0,
      emitLockUntil: 0
    };
    room.syncPlatforms.push(platform);
    world.syncPlatforms.push(platform);
    return platform;
  }

  function noteSortingRedirect(world, machine, x, y){
    world.stats.sortingRedirects += 1;
    ns.emit('movement:correction', {
      x: x,
      y: y,
      distance: Math.abs(machine.nudgeX || 0)
    });
    updateRunState(world);
  }

  function makeSortingMachine(world, room, x, y, cfg){
    cfg = cfg || {};
    var shell = world.scene.add.rectangle(x, y, cfg.w || 44, cfg.h || 32, 0x7e8f63, 0.95).setDepth(9).setStrokeStyle(1, 0xc49a4a, 1);
    var arm = world.scene.add.rectangle(x + 14, y - 6, 18, 6, 0xe8d9b1, 0.9).setDepth(10);
    var label = textLabel(world.scene, x - 28, y - 34, cfg.label || 'SORT', 6, '#f2e3c5', 11);
    var sensor = sensorZone(world.scene, x, y, (cfg.w || 44) + 16, (cfg.h || 32) + 16);
    var machine = {
      shell: shell,
      arm: arm,
      label: label,
      sensor: sensor,
      room: room,
      nudgeX: cfg.nudgeX == null ? 96 : cfg.nudgeX,
      nudgeY: cfg.nudgeY == null ? -26 : cfg.nudgeY,
      cooldownUntil: 0,
      redirect: function(player, source){
        var now = world.scene.time.now;
        if (!player || !player.body || now < machine.cooldownUntil) return;
        machine.cooldownUntil = now + 360;
        player.body.setVelocityX((player.body.velocity.x * 0.2) + machine.nudgeX);
        if (player.body.velocity.y > machine.nudgeY) player.body.setVelocityY(machine.nudgeY);
        noteSortingRedirect(world, machine, player.x, player.y);
        if (source === 'debug') ns.emit('music:sync', { x: player.x, y: player.y });
      },
      destroy: function(){
        destroyThing(shell);
        destroyThing(arm);
        destroyThing(label);
        destroyThing(sensor);
      }
    };
    room.sortingMachines.push(machine);
    world.sortingMachines.push(machine);
    return machine;
  }

  function awardSync(world, source, x, y){
    var now = world.scene.time.now;
    if (source && source.emitLockUntil && now < source.emitLockUntil) return;
    if (source) source.emitLockUntil = now + 280;
    world.stats.syncMoments += 1;
    if (world.stats.syncMoments >= 3) world.receiptFlags.syncedFlow = true;
    ns.emit('music:sync', { x: x, y: y });
    if (ns.Axes && ns.Axes.bump) ns.Axes.bump('intuition', 0.01);
    updateRunState(world);
  }

  function makeRestGate(world, room, cfg){
    var scene = world.scene;
    var sign = addSign(world, room, cfg.signX, cfg.signY, cfg.text, { id: cfg.id || (room.id + '-rest-sign') });
    var pad = scene.add.rectangle(cfg.padX, cfg.padY, cfg.padW || 120, cfg.padH || 10, 0xf2e3c5, 0.22).setDepth(3).setStrokeStyle(1, 0xc49a4a, 0.9);
    var sensor = sensorZone(scene, cfg.sensorX, cfg.sensorY, cfg.sensorW || 150, cfg.sensorH || 84);
    var lamp = scene.add.rectangle(cfg.signX + 54, cfg.signY - 8, 10, 10, 0x8a7d62, 1).setDepth(11);
    var gate = {
      room: room,
      sign: sign,
      pad: pad,
      sensor: sensor,
      lamp: lamp,
      door: null,
      doorSpec: {
        x: cfg.doorX,
        y: cfg.doorY,
        w: cfg.doorW || 18,
        h: cfg.doorH || 88,
        color: cfg.doorColor || 0xc49a4a
      },
      windowMs: cfg.windowMs || 800,
      restingMs: 0,
      opened: false,
      rushLogged: false,
      lastRushMs: 0,
      createDoor: function(){
        gate.door = staticRect(scene, gate.doorSpec.x, gate.doorSpec.y, gate.doorSpec.w, gate.doorSpec.h, gate.doorSpec.color, 1, 6);
      },
      open: function(source){
        if (gate.opened) return;
        gate.opened = true;
        destroyThing(gate.door);
        gate.door = null;
        gate.lamp.fillColor = 0x5b8f6a;
        world.stats.restOpens += 1;
        world.receiptFlags.restOpened = true;
        world.receiptFlags.cigaretteLit = false;
        if (world.runState.worldFlags) world.runState.worldFlags.cigaretteWillNotLight = true;
        updateRunState(world);
        gate.core.evaluate({ action: 'wait', elapsedMs: gate.windowMs });
        ns.emit('module:passed', { roomId: room.id, moduleId: sign.id });
        awardSync(world, gate, world.player.x, world.player.y);
      },
      rush: function(source){
        var now = world.scene.time.now;
        if (gate.lastRushMs && now < gate.lastRushMs + 320) return;
        gate.restingMs = 0;
        gate.lastRushMs = now;
        if (world.player && world.player.body) {
          world.player.body.setVelocityX(-88);
          if (world.player.body.velocity.y > -24) world.player.body.setVelocityY(-24);
        }
        world.stats.rushRebounds += 1;
        world.receiptFlags.rushedRest = true;
        updateRunState(world);
        gate.core.evaluate({ action: 'move', elapsedMs: 120 });
        if (!gate.rushLogged) {
          gate.rushLogged = true;
          ns.emit('module:skipped', { roomId: room.id, moduleId: sign.id });
        }
        if (cfg.rushUnlocks && !gate.opened) {
          gate.opened = true;
          destroyThing(gate.door);
          gate.door = null;
          gate.lamp.fillColor = 0xc49a4a;
        }
        if (source === 'debug') ns.emit('movement:backtrack', { distance: 24, x: world.player.x, y: world.player.y });
      },
      reset: function(){
        gate.restingMs = 0;
        gate.opened = false;
        gate.rushLogged = false;
        gate.lastRushMs = 0;
        gate.lamp.fillColor = 0x8a7d62;
        gate.core.resolved = false;
        gate.core.outcome = null;
        destroyThing(gate.door);
        gate.door = null;
        gate.createDoor();
      }
    };
    gate.core = ns.Contradiction.gate({
      sign: { id: sign.id },
      expectedBehavior: 'wait',
      windowMs: gate.windowMs,
      onFollow: function(){
        world.receiptFlags.restOpened = true;
        world.receiptFlags.cigaretteLit = false;
        if (world.runState.worldFlags) world.runState.worldFlags.cigaretteWillNotLight = true;
        updateRunState(world);
        return 'open';
      },
      onDefy: function(){
        world.receiptFlags.rushedRest = true;
        updateRunState(world);
        return 'loop';
      }
    });
    gate.createDoor();
    room.restGate = gate;
    world.restGate = gate;
    world.restGates.push(gate);
    return gate;
  }

  function buildSoftBelt(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x263321, 0xc49a4a);
    addBackdropImage(world.scene, 'carpet_tile_seamless', startX + 720, 456, 360, 40, 1.5, 0.34);
    addBackdropImage(world.scene, 'fluorescent_light_fixture', startX + 720, 42, 150, 74, 1.55, 0.24);
    addPlatforms(world, room, startX, [200, -8, 480, 28, 0x61784f, 720, -8, 360, 18, 0x61784f, 1120, 64, 260, 28, 0xe8d9b1]);
    addSign(world, room, startX + 430, 392, spec.actionSigns[0], { id: 'rasta-belt-speed', width: 130 });
    addSign(world, room, startX + 945, 322, spec.actionSigns[1], { id: 'rasta-belt-fire', width: 124 });
    makeRestGate(world, room, {
      id: 'rasta-belt-rest',
      signX: startX + 170,
      signY: 360,
      text: spec.contradictionSign,
      padX: startX + 720,
      padY: 420,
      sensorX: startX + 720,
      sensorY: 392,
      sensorW: 220,
      sensorH: 90,
      doorX: startX + 1012,
      doorY: 386,
      rushUnlocks: true
    });
    return room;
  }

  function buildReceiving(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x293122, 0xc49a4a);
    addBackdropImage(world.scene, 'prop_archive_box', startX + 124, world.horizon - 44, 92, 62, 2.1, 0.78);
    addBackdropImage(world.scene, 'prop_archive_box', startX + 220, world.horizon - 44, 84, 56, 2.1, 0.72);
    addRoomSigns(world, room, startX, spec, [168, 84, 732, 170]);
    addPlatforms(world, room, startX, [210, 10, 360, 18, 0x61784f, 1110, 10, 260, 18, 0x61784f]);
    addSyncs(world, room, startX, [600, 86, 18, 26, 2, 0, 0.00022, 0.00031, 870, 138, 46, 16, 2, 1, 0.00018, 0.00026]);
    addPlatforms(world, room, startX, [1010, 122, 120, 14, 0xe8d9b1]);
    return room;
  }

  function buildSyncBelt(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x25301f, 0xc49a4a);
    addRoomSigns(world, room, startX, spec, [126, 84, 786, 124]);
    addPlatforms(world, room, startX, [136, 10, 220, 18, 0x61784f, 1140, 10, 220, 18, 0x61784f]);
    addSyncs(world, room, startX, [430, 78, 0, 22, 0, 1, 0.00028, 0.00029, 642, 122, 42, 14, 2, 0, 0.00016, 0.00024, 946, 86, 16, 18, 1, 2, 0.00021, 0.00027]);
    addSortingMachines(world, room, startX, [836, 42, 'SORT', 92, -34]);
    return room;
  }

  function buildRestLanding(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x283222, 0xc49a4a);
    addRoomSigns(world, room, startX, spec, [156, 84, 716, 164]);
    addPlatforms(world, room, startX, [248, 10, 250, 18, 0x61784f, 1090, 10, 250, 18, 0x61784f]);
    addSyncs(world, room, startX, [560, 72, 10, 18, 2, 0, 0.00018, 0.00025]);
    addPlatforms(world, room, startX, [792, 138, 164, 14, 0xe8d9b1]);
    addSyncs(world, room, startX, [996, 108, 34, 20, 1, 2, 0.00017, 0.00022]);
    return room;
  }

  function buildSortingFloor(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x24301f, 0xc49a4a);
    addBackdropImage(world.scene, 'prop_archive_box', startX + 1110, world.horizon - 46, 88, 58, 2.1, 0.76);
    addRoomSigns(world, room, startX, spec, [130, 84, 792, 84]);
    addPlatforms(world, room, startX, [220, 10, 250, 18, 0x61784f, 1030, 10, 330, 18, 0x61784f]);
    addSyncs(world, room, startX, [520, 92, 18, 24, 1, 2, 0.00016, 0.00028, 730, 144, 48, 16, 2, 0, 0.00017, 0.00025]);
    addSortingMachines(world, room, startX, [622, 42, 'SORT', 86, -38, 936, 42, 'GUIDE', 92, -30]);
    addLocustSensor(world, room, startX);
    return room;
  }

  function buildHumming(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x2a3524, 0xc49a4a);
    addRoomSigns(world, room, startX, spec, [132, 84, 796, 162]);
    addPlatforms(world, room, startX, [196, 10, 320, 18, 0x61784f]);
    addSyncs(world, room, startX, [560, 110, 52, 12, 1, 2, 0.00015, 0.00022]);
    addPlatforms(world, room, startX, [860, 168, 180, 14, 0xe8d9b1]);
    addSyncs(world, room, startX, [1060, 96, 12, 26, 2, 0, 0.00018, 0.00029]);
    addPlatforms(world, room, startX, [1210, 10, 120, 18, 0x61784f]);
    return room;
  }

  function buildWarmExit(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x2b3525, 0xc49a4a);
    addRoomSigns(world, room, startX, spec, [810, 166, 1012, 126]);
    addPlatforms(world, room, startX, [220, 10, 420, 18, 0x61784f, 770, 118, 168, 14, 0xe8d9b1, 1062, 118, 220, 14, 0xe8d9b1]);
    addSyncs(world, room, startX, [580, 92, 14, 22, 2, 1, 0.00016, 0.00025]);
    makeRestGate(world, room, {
      signX: startX + 272,
      signY: world.horizon - 84,
      text: spec.contradictionSign,
      padX: startX + 618,
      padY: world.horizon - 18,
      sensorX: startX + 618,
      sensorY: world.horizon - 42,
      doorX: startX + 952,
      doorY: world.horizon - 96
    });
    world.goal = sensorZone(world.scene, startX + 1180, world.horizon - 120, 160, 220);
    return room;
  }

  function updateSigns(world){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.signs.length; i++) readSign(world, room.signs[i]);
    if (room.restGate && room.restGate.sign) readSign(world, room.restGate.sign);
  }

  function updateSyncPlatforms(world){
    var now = world.scene.time.now;
    var player = world.player;
    for (var i = 0; i < world.syncPlatforms.length; i++) {
      var platform = world.syncPlatforms[i];
      var waveX = waveValue(platform.modeX, now, platform.rateX, platform.phaseX);
      var waveY = waveValue(platform.modeY, now, platform.rateY, platform.phaseY);
      platform.rect.x = platform.baseX + (platform.ampX * waveX);
      platform.rect.y = platform.baseY + (platform.ampY * waveY);
      platform.rect.body.updateFromGameObject();
      platform.beat = Math.max(Math.abs(waveX), Math.abs(waveY));
      if (platform.room === world.currentRoom && intersects(player, platform.rect) && platform.beat >= 0.86 && Math.abs(player.body.velocity.y) < 140) {
        awardSync(world, platform, player.x, player.y);
      }
    }
  }

  function updateSortingMachines(world){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.sortingMachines.length; i++) {
      if (intersects(world.player, room.sortingMachines[i].sensor)) {
        room.sortingMachines[i].redirect(world.player, 'live');
      }
    }
  }

  function updateLocustSensors(world){
    var room = world.currentRoom;
    if (!room || !room.locustSensor) return;
    if (intersects(world.player, room.locustSensor)) triggerLocust(world, room);
  }

  function updateEnemies(world, dtMs){
    var room = world.currentRoom;
    if (!room) return;
    for (var i = 0; i < room.enemies.length; i++) {
      if (room.enemies[i] && room.enemies[i].update) room.enemies[i].update(world.player, world, dtMs);
    }
  }

  function restingInputActive(){
    return ns.Input.down('left') || ns.Input.down('right') || ns.Input.down('jump') ||
      ns.Input.down('punch') || ns.Input.down('kick') || ns.Input.down('spinDash') ||
      ns.Input.down('cigCopter') || ns.Input.down('groundSlam') || ns.Input.down('glide');
  }

  function updateRestGate(world, dtMs){
    var gate = world.currentRoom && world.currentRoom.restGate ? world.currentRoom.restGate : null;
    if (!gate || gate.opened || world.currentRoom !== gate.room) return;
    if (!intersects(world.player, gate.sensor)) {
      gate.restingMs = 0;
      return;
    }

    var moving = Math.abs(world.player.body.velocity.x) > 18 || Math.abs(world.player.body.velocity.y) > 24;
    if (moving || restingInputActive()) {
      gate.rush('live');
      gate.restingMs = 0;
      return;
    }

    gate.restingMs += dtMs || 0;
    if (gate.restingMs >= gate.windowMs) gate.open('live');
  }

  function resetDebug(world){
    var enemies;
    var i;
    ns.Axes.reset();
    if (ns.Metrics && ns.Metrics.reset) ns.Metrics.reset();
    world.scene.recorder.clear();
    world.scene.pendingDeath = null;
    world.scene.runComplete = false;
    world.scene.runStartMs = world.scene.time.now;
    world.visitedRooms = {};
    world.roomOrder.length = 0;
    world.currentRoom = null;
    world.currentRoomId = world.rooms[0].id;
    world.runState.roomOrder = world.roomOrder;
    world.runState.actionsLearned = [];
    world.runState.receipt = null;
    world.runState.receiptFlags = defaultFlags();
    world.runState.worldStats = defaultStats();
    world.receiptFlags = world.runState.receiptFlags;
    world.stats = world.runState.worldStats;
    world.player.invulnMs = 0;
    ns.Movement.respawn(world.player);
    for (i = 0; i < world.syncPlatforms.length; i++) {
      world.syncPlatforms[i].emitLockUntil = 0;
    }
    for (i = 0; i < world.sortingMachines.length; i++) {
      world.sortingMachines[i].cooldownUntil = 0;
    }
    enemies = world.enemies.slice();
    for (i = 0; i < enemies.length; i++) {
      if (enemies[i] && enemies[i].destroy) enemies[i].destroy();
    }
    world.enemies = [];
    for (i = 0; i < world.rooms.length; i++) {
      world.rooms[i].locustTriggered = false;
      world.rooms[i].enemies = [];
    }
    for (i = 0; i < world.restGates.length; i++) {
      if (world.restGates[i] && world.restGates[i].reset) world.restGates[i].reset();
    }
    updateRunState(world);
    rememberRoom(world, world.rooms[0].id);
    world.currentRoom = world.rooms[0];
    setRoomRespawn(world, world.rooms[0]);
  }

  function scriptRoom(world, room, style, markers){
    var ambient = style === 'ambient';
    var baseY = ambient ? world.horizon - 120 : world.horizon - 28;
    world.player.x = room.startX + 84;
    world.player.y = baseY;
    syncCurrentRoom(world);
    world.scene.recorder.mark(markers[0], world.player.x, world.player.y, 1);

    for (var i = 0; i < room.signs.length; i++) {
      room.signs[i].peek({ signId: room.signs[i].id, words: room.signs[i].text.split(/\s+/).length });
      if (ambient || i === 0) {
        room.signs[i].read({ signId: room.signs[i].id, words: room.signs[i].text.split(/\s+/).length });
      }
    }
    if (room.restGate && room.restGate.sign) {
      room.restGate.sign.peek({ signId: room.restGate.sign.id, words: room.restGate.sign.text.split(/\s+/).length });
      room.restGate.sign.read({ signId: room.restGate.sign.id, words: room.restGate.sign.text.split(/\s+/).length });
    }

    if (room.id === 'sync-belt' || room.id === 'rest-landing' || room.id === 'humming-mezzanine') {
      if (ambient) {
        awardSync(world, room, room.startX + 420, world.horizon - 96);
        awardSync(world, room, room.startX + 860, world.horizon - 126);
      } else if (room.id === 'sync-belt') {
        awardSync(world, room, room.startX + 420, world.horizon - 96);
      }
    }

    if (!ambient && room.sortingMachines.length) {
      for (i = 0; i < room.sortingMachines.length; i++) {
        world.player.x = room.sortingMachines[i].sensor.x;
        world.player.y = world.horizon - 28;
        room.sortingMachines[i].redirect(world.player, 'debug');
      }
    }

    if ((room.id === 'warm-exit' || room.id === 'rasta-soft-belt') && room.restGate) {
      world.player.x = room.restGate.sensor.x;
      world.player.y = world.horizon - 28;
      if (ambient) {
        room.restGate.open('debug');
      } else {
        room.restGate.rush('debug');
      }
    }

    world.player.x = room.id === 'warm-exit' && ambient ? world.goal.x : (room.endX - 120);
    world.player.y = room.id === 'warm-exit' && ambient ? world.goal.y : (ambient ? world.horizon - 120 : world.horizon - 28);
    syncCurrentRoom(world);
    world.scene.recorder.mark(markers[1], room.startX + 420, ambient ? (world.horizon - 108) : (world.horizon - 28), 1);
    world.scene.recorder.mark(markers[2], room.startX + 860, ambient ? (world.horizon - 136) : (world.horizon - 28), 1);
    world.scene.recorder.mark(markers[3], world.player.x, world.player.y, 1);
  }

  function debugSurviveLocust(world){
    var room = world.rooms[3];
    var swarm;
    var guard = 0;
    if (!room) return;
    world.player.x = room.endX + 260;
    world.player.y = world.horizon - 136;
    syncCurrentRoom(world);
    swarm = triggerLocust(world, room);
    if (!swarm) return;
    while (!swarm.dead && guard < 130) {
      swarm.update(world.player, world, 100);
      guard += 1;
    }
    world.player.x = world.rooms[world.rooms.length - 1].endX - 120;
    world.player.y = world.horizon - 120;
    syncCurrentRoom(world);
  }

  function runStyle(world, scene, style){
    if (scene.runComplete && world.runState.receipt) {
      return {
        receipt: clone(world.runState.receipt),
        axes: clone(ns.Axes.snapshot()),
        frames: clone(scene.recorder.dump()),
        worldId: world.runState.worldId,
        roomOrder: clone(world.roomOrder),
        worldStats: clone(world.stats),
        receiptFlags: clone(world.receiptFlags)
      };
    }

    style = style || 'ambient';
    var run = style === 'logistics' ? 'ambient' : style;
    if (style === 'locust') run = 'ambient';
    resetDebug(world);

    for (var i = 0; i < world.rooms.length; i++) {
      var base = i * 580;
      scriptRoom(world, world.rooms[i], run, [base, base + 180, base + 340, base + 520]);
    }

    if (style === 'locust') debugSurviveLocust(world);
    if (style === 'logistics' && world.logisticsBoss && world.logisticsBoss.debugDefeat) {
      world.logisticsBoss.debugDefeat();
    }
    scene.completeRun('debug:' + style);

    return {
      receipt: clone(world.runState.receipt),
      axes: clone(ns.Axes.snapshot()),
      frames: clone(scene.recorder.dump()),
      worldId: world.runState.worldId,
      roomOrder: clone(world.roomOrder),
      worldStats: clone(world.stats),
      receiptFlags: clone(world.receiptFlags)
    };
  }

  function create(scene, runState){
    var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get('rasta') : null;
    var roomWidth = 1280;
    var horizon = ns.GAME_H - 24;
    var priorStats = runState.worldStats && runState.worldStats.syncMoments != null ? runState.worldStats : defaultStats();
    var priorFlags = runState.receiptFlags && runState.receiptFlags.restOpened != null ? runState.receiptFlags : defaultFlags();
    var world = {
      id: 'rasta-world',
      worldId: 'rasta',
      scene: scene,
      runState: runState,
      manifest: manifest,
      horizon: horizon,
      width: roomWidth * manifest.rooms.length,
      rooms: [],
      platforms: [],
      enemies: [],
      syncPlatforms: [],
      sortingMachines: [],
      signs: [],
      goal: null,
      restGate: null,
      restGates: [],
      currentRoom: null,
      currentRoomId: manifest && manifest.rooms && manifest.rooms[0] ? manifest.rooms[0].id : 'receiving-dock',
      roomOrder: [],
      visitedRooms: {},
      stats: priorStats,
      receiptFlags: priorFlags,
      syncRng: ns.makeRNG ? ns.makeRNG(runState.caseSeed + '|rasta|sync') : null
    };

    scene.cameras.main.setBackgroundColor('#1c2418');
    scene.physics.world.setBounds(0, 0, world.width, ns.GAME_H);
    scene.cameras.main.setBounds(0, 0, world.width, ns.GAME_H);

    world.player = ns.Movement.createEd(scene, 72, horizon - 28);
    scene.player = world.player;

    runState.worldId = 'rasta';
    runState.roomId = world.currentRoomId;
    runState.roomOrder = world.roomOrder;
    runState.actionsLearned = [];
    runState.worldFlags = manifest || {};
    updateRunState(world);

    buildReceiving(world, manifest.rooms[0], 0, roomWidth);
    buildSyncBelt(world, manifest.rooms[1], roomWidth, roomWidth);
    buildRestLanding(world, manifest.rooms[2], roomWidth * 2, roomWidth);
    buildSortingFloor(world, manifest.rooms[3], roomWidth * 3, roomWidth);
    buildHumming(world, manifest.rooms[4], roomWidth * 4, roomWidth);
    buildSoftBelt(world, manifest.rooms[5], roomWidth * 5, roomWidth);
    buildWarmExit(world, manifest.rooms[6], roomWidth * 6, roomWidth);
    if (ns.bosses && ns.bosses.spawnLogistics && (!ns.flags || ns.flags.W3_LOGISTICS_BOSS !== false)) {
      world.logisticsBoss = ns.bosses.spawnLogistics(scene, world);
    }

    for (var i = 0; i < world.platforms.length; i++) {
      scene.physics.add.collider(world.player, world.platforms[i]);
    }
    for (i = 0; i < world.syncPlatforms.length; i++) {
      scene.physics.add.collider(world.player, world.syncPlatforms[i].rect);
    }

    scene.physics.add.overlap(world.player, world.goal, function(){
      if (world.restGate && world.restGate.opened && (!world.logisticsBoss || world.logisticsBoss.defeated)) scene.completeRun('goal');
    });

    rememberRoom(world, manifest.rooms[0].id);
    world.currentRoom = world.rooms[0];
    setRoomRespawn(world, world.rooms[0]);
    if (ns.Curiosity && ns.Curiosity.prime) ns.Curiosity.prime(scene, 'rasta');
    return world;
  }

  function update(scene, dtMs){
    var world = scene.room;
    if (!world || !world.player) return;
    syncCurrentRoom(world);
    updateSigns(world);
    updateSyncPlatforms(world);
    updateSortingMachines(world);
    updateLocustSensors(world);
    updateEnemies(world, dtMs);
    updateRestGate(world, dtMs);
    if (world.logisticsBoss && world.logisticsBoss.update) world.logisticsBoss.update(dtMs);
    if (ns.Curiosity && ns.Curiosity.update) ns.Curiosity.update(scene, dtMs);
  }

  function destroy(world){
    var enemies;
    var i;
    if (!world) return;
    enemies = world.enemies.slice();
    for (i = 0; i < enemies.length; i++) {
      if (enemies[i] && enemies[i].destroy) enemies[i].destroy();
    }
    for (i = 0; i < world.sortingMachines.length; i++) {
      if (world.sortingMachines[i] && world.sortingMachines[i].destroy) world.sortingMachines[i].destroy();
    }
    for (i = 0; i < world.restGates.length; i++) {
      destroyThing(world.restGates[i].door);
      destroyThing(world.restGates[i].sensor);
      destroyThing(world.restGates[i].pad);
      destroyThing(world.restGates[i].lamp);
    }
    for (i = 0; i < world.rooms.length; i++) {
      destroyThing(world.rooms[i].locustSensor);
    }
    if (world.logisticsBoss && world.logisticsBoss.destroy) world.logisticsBoss.destroy();
  }

  ns.WorldRasta = {
    create: create,
    update: update,
    destroy: destroy,
    runStyle: runStyle
  };
})(CEHP);
CEHP._register('76_world_rasta_runtime');
