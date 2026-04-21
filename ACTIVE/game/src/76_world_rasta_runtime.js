/* ================================================================
   MODULE: 76_WORLD_RASTA_RUNTIME
   Week 4 playable world. Deterministic synchronicity platforms,
   polite sorting helpers, and a sincere REST HERE contradiction.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function staticRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0x6c8a5c, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    scene.physics.add.existing(rect, true);
    rect.body.allowGravity = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function movingRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0xe8d9b1, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    scene.physics.add.existing(rect);
    rect.body.allowGravity = false;
    rect.body.setImmovable(true);
    rect.body.moves = false;
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
      color: color || '#f2e3c5',
      align: 'left'
    }).setDepth(depth == null ? 8 : depth);
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
    if (ns.Events && ns.Events.emit) {
      ns.Events.emit('movement:correction', {
        x: x,
        y: y,
        distance: Math.abs(machine.nudgeX || 0)
      });
    }
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
        if (source === 'debug' && ns.Events && ns.Events.emit) {
          ns.Events.emit('music:sync', { x: player.x, y: player.y });
        }
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
    if (ns.Events && ns.Events.emit) ns.Events.emit('music:sync', { x: x, y: y });
    if (ns.Axes && ns.Axes.bump) ns.Axes.bump('intuition', 0.01);
    updateRunState(world);
  }

  function makeRestGate(world, room, cfg){
    var scene = world.scene;
    var sign = addSign(world, room, cfg.signX, cfg.signY, cfg.text, { id: room.id + '-rest-sign' });
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
        updateRunState(world);
        if (ns.Events && ns.Events.emit) {
          ns.Events.emit('contradiction:follow', { gateId: sign.id, action: 'wait', elapsedMs: gate.windowMs });
          ns.Events.emit('module:passed', { roomId: room.id, moduleId: sign.id });
        }
        if (source === 'debug') awardSync(world, gate, world.player.x, world.player.y);
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
        if (!gate.rushLogged && ns.Events && ns.Events.emit) {
          gate.rushLogged = true;
          ns.Events.emit('contradiction:defy', { gateId: sign.id, action: 'move', elapsedMs: 120 });
          ns.Events.emit('module:skipped', { roomId: room.id, moduleId: sign.id });
        }
        if (source === 'debug' && ns.Events && ns.Events.emit) {
          ns.Events.emit('movement:backtrack', { distance: 24, x: world.player.x, y: world.player.y });
        }
      },
      reset: function(){
        gate.restingMs = 0;
        gate.opened = false;
        gate.rushLogged = false;
        gate.lastRushMs = 0;
        gate.lamp.fillColor = 0x8a7d62;
        destroyThing(gate.door);
        gate.door = null;
        gate.createDoor();
      }
    };
    gate.createDoor();
    room.restGate = gate;
    world.restGate = gate;
    return gate;
  }

  function buildReceiving(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x293122, 0xc49a4a);
    addSign(world, room, startX + 168, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 732, world.horizon - 170, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 210, world.horizon - 10, 360, 18, 0x61784f, 1, 4);
    addPlatform(world, room, startX + 1110, world.horizon - 10, 260, 18, 0x61784f, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 600, baseY: world.horizon - 86,
      ampY: 26, modeY: 'sine', modeX: 'triangle', ampX: 18,
      rateX: 0.00022, rateY: 0.00031
    });
    makeSyncPlatform(world, room, {
      baseX: startX + 870, baseY: world.horizon - 138,
      ampX: 46, ampY: 16, modeX: 'triangle', modeY: 'cosine',
      rateX: 0.00018, rateY: 0.00026
    });
    addPlatform(world, room, startX + 1010, world.horizon - 122, 120, 14, 0xe8d9b1, 1, 4);
    return room;
  }

  function buildSyncBelt(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x25301f, 0xc49a4a);
    addSign(world, room, startX + 126, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 786, world.horizon - 124, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 136, world.horizon - 10, 220, 18, 0x61784f, 1, 4);
    addPlatform(world, room, startX + 1140, world.horizon - 10, 220, 18, 0x61784f, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 430, baseY: world.horizon - 78,
      ampY: 22, modeY: 'cosine', rateY: 0.00029
    });
    makeSyncPlatform(world, room, {
      baseX: startX + 642, baseY: world.horizon - 122,
      ampX: 42, ampY: 14, modeX: 'triangle', modeY: 'sine',
      rateX: 0.00016, rateY: 0.00024
    });
    makeSyncPlatform(world, room, {
      baseX: startX + 946, baseY: world.horizon - 86,
      ampY: 18, modeY: 'triangle', modeX: 'cosine', ampX: 16,
      rateX: 0.00021, rateY: 0.00027
    });
    makeSortingMachine(world, room, startX + 836, world.horizon - 42, {
      label: 'SORT',
      nudgeX: 92,
      nudgeY: -34
    });
    return room;
  }

  function buildRestLanding(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x283222, 0xc49a4a);
    addSign(world, room, startX + 156, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 716, world.horizon - 164, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 248, world.horizon - 10, 250, 18, 0x61784f, 1, 4);
    addPlatform(world, room, startX + 1090, world.horizon - 10, 250, 18, 0x61784f, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 560, baseY: world.horizon - 72,
      ampY: 18, modeY: 'sine', modeX: 'triangle', ampX: 10,
      rateX: 0.00018, rateY: 0.00025
    });
    addPlatform(world, room, startX + 792, world.horizon - 138, 164, 14, 0xe8d9b1, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 996, baseY: world.horizon - 108,
      ampX: 34, ampY: 20, modeX: 'cosine', modeY: 'triangle',
      rateX: 0.00017, rateY: 0.00022
    });
    return room;
  }

  function buildSortingFloor(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x24301f, 0xc49a4a);
    addSign(world, room, startX + 130, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 792, world.horizon - 84, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 220, world.horizon - 10, 250, 18, 0x61784f, 1, 4);
    addPlatform(world, room, startX + 1030, world.horizon - 10, 330, 18, 0x61784f, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 520, baseY: world.horizon - 92,
      ampY: 24, modeY: 'triangle', modeX: 'cosine', ampX: 18,
      rateX: 0.00016, rateY: 0.00028
    });
    makeSyncPlatform(world, room, {
      baseX: startX + 730, baseY: world.horizon - 144,
      ampX: 48, ampY: 16, modeX: 'triangle', modeY: 'sine',
      rateX: 0.00017, rateY: 0.00025
    });
    makeSortingMachine(world, room, startX + 622, world.horizon - 42, {
      label: 'SORT',
      nudgeX: 86,
      nudgeY: -38
    });
    makeSortingMachine(world, room, startX + 936, world.horizon - 42, {
      label: 'GUIDE',
      nudgeX: 92,
      nudgeY: -30
    });
    return room;
  }

  function buildHumming(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x2a3524, 0xc49a4a);
    addSign(world, room, startX + 132, world.horizon - 84, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 796, world.horizon - 162, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 196, world.horizon - 10, 320, 18, 0x61784f, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 560, baseY: world.horizon - 110,
      ampX: 52, ampY: 12, modeX: 'cosine', modeY: 'triangle',
      rateX: 0.00015, rateY: 0.00022
    });
    addPlatform(world, room, startX + 860, world.horizon - 168, 180, 14, 0xe8d9b1, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 1060, baseY: world.horizon - 96,
      ampY: 26, ampX: 12, modeY: 'sine', modeX: 'triangle',
      rateX: 0.00018, rateY: 0.00029
    });
    addPlatform(world, room, startX + 1210, world.horizon - 10, 120, 18, 0x61784f, 1, 4);
    return room;
  }

  function buildWarmExit(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x2b3525, 0xc49a4a);
    addSign(world, room, startX + 810, world.horizon - 166, spec.actionSigns[0], { id: room.id + '-sign-1' });
    addSign(world, room, startX + 1012, world.horizon - 126, spec.actionSigns[1], { id: room.id + '-sign-2' });
    addPlatform(world, room, startX + 220, world.horizon - 10, 420, 18, 0x61784f, 1, 4);
    addPlatform(world, room, startX + 770, world.horizon - 118, 168, 14, 0xe8d9b1, 1, 4);
    addPlatform(world, room, startX + 1062, world.horizon - 118, 220, 14, 0xe8d9b1, 1, 4);
    makeSyncPlatform(world, room, {
      baseX: startX + 580, baseY: world.horizon - 92,
      ampY: 22, ampX: 14, modeY: 'cosine', modeX: 'triangle',
      rateX: 0.00016, rateY: 0.00025
    });
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

  function restingInputActive(){
    return ns.Input.down('left') || ns.Input.down('right') || ns.Input.down('jump') ||
      ns.Input.down('punch') || ns.Input.down('kick') || ns.Input.down('spinDash') ||
      ns.Input.down('cigCopter') || ns.Input.down('groundSlam') || ns.Input.down('glide');
  }

  function updateRestGate(world, dtMs){
    var gate = world.restGate;
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
    for (var i = 0; i < world.syncPlatforms.length; i++) {
      world.syncPlatforms[i].emitLockUntil = 0;
    }
    for (i = 0; i < world.sortingMachines.length; i++) {
      world.sortingMachines[i].cooldownUntil = 0;
    }
    if (world.restGate) world.restGate.reset();
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

    if (room.id === 'warm-exit' && room.restGate) {
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
    resetDebug(world);

    var markers = [
      [0, 180, 340, 520],
      [580, 760, 920, 1120],
      [1180, 1360, 1540, 1720],
      [1780, 1960, 2140, 2320],
      [2380, 2560, 2740, 2920],
      [2980, 3160, 3340, 3520]
    ];

    for (var i = 0; i < world.rooms.length; i++) {
      scriptRoom(world, world.rooms[i], style, markers[i]);
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
      width: roomWidth * 6,
      rooms: [],
      platforms: [],
      syncPlatforms: [],
      sortingMachines: [],
      signs: [],
      goal: null,
      restGate: null,
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
    buildWarmExit(world, manifest.rooms[5], roomWidth * 5, roomWidth);

    for (var i = 0; i < world.platforms.length; i++) {
      scene.physics.add.collider(world.player, world.platforms[i]);
    }
    for (i = 0; i < world.syncPlatforms.length; i++) {
      scene.physics.add.collider(world.player, world.syncPlatforms[i].rect);
    }

    scene.physics.add.overlap(world.player, world.goal, function(){
      if (world.restGate && world.restGate.opened) scene.completeRun('goal');
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
    updateSyncPlatforms(world);
    updateSortingMachines(world);
    updateRestGate(world, dtMs);
  }

  function destroy(world){
    if (!world) return;
    for (var i = 0; i < world.sortingMachines.length; i++) {
      if (world.sortingMachines[i] && world.sortingMachines[i].destroy) world.sortingMachines[i].destroy();
    }
    if (world.restGate) {
      destroyThing(world.restGate.door);
      destroyThing(world.restGate.sensor);
      destroyThing(world.restGate.pad);
      destroyThing(world.restGate.lamp);
    }
  }

  ns.WorldRasta = {
    create: create,
    update: update,
    destroy: destroy,
    runStyle: runStyle
  };
})(CEHP);
CEHP._register('76_world_rasta_runtime');
