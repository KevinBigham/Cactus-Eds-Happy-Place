/* ================================================================
   MODULE: 74_WORLD_ORIENTATION_RUNTIME
   Week 2 playable world. Six-room orientation slice that replaces
   the Week 1 test room as the default boot target.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function staticRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0x44546a, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
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
      color: color || '#dfe6ef',
      align: 'left'
    }).setDepth(depth == null ? 8 : depth);
  }

  function applicantSilhouette(scene, x, y, variant){
    var g = scene.add.graphics().setDepth(3);
    var ink = 0x263246;
    var accent = 0x5f748f;
    g.fillStyle(ink, 0.84);
    g.fillCircle(x, y - 54, 12);
    if (variant === 1) {
      g.fillRect(x - 18, y - 38, 36, 58);
      g.fillStyle(accent, 0.32);
      g.fillRect(x + 10, y - 26, 14, 30);
      g.fillStyle(ink, 0.84);
      g.fillRect(x - 26, y - 14, 10, 34);
      g.fillRect(x + 16, y - 14, 10, 34);
    } else if (variant === 2) {
      g.beginPath();
      g.moveTo(x - 22, y - 34);
      g.lineTo(x + 16, y - 34);
      g.lineTo(x + 28, y + 18);
      g.lineTo(x - 28, y + 18);
      g.closePath();
      g.fillPath();
      g.fillStyle(accent, 0.32);
      g.fillRect(x - 32, y - 8, 12, 28);
      g.fillStyle(ink, 0.84);
      g.fillRect(x - 18, y + 18, 10, 34);
      g.fillRect(x + 8, y + 18, 10, 34);
    } else {
      g.beginPath();
      g.moveTo(x - 24, y - 34);
      g.lineTo(x + 24, y - 34);
      g.lineTo(x + 18, y + 22);
      g.lineTo(x - 18, y + 22);
      g.closePath();
      g.fillPath();
      g.fillStyle(accent, 0.32);
      g.fillRect(x - 34, y - 18, 12, 34);
      g.fillStyle(ink, 0.84);
      g.fillRect(x - 14, y + 22, 10, 30);
      g.fillRect(x + 4, y + 22, 10, 30);
    }
    return g;
  }

  function placeApplicants(world, room, specs){
    var i;
    for (i = 0; i < specs.length; i++) {
      applicantSilhouette(world.scene, specs[i].x, specs[i].y, specs[i].variant);
    }
  }

  function destroyThing(obj){
    if (obj && obj.destroy) obj.destroy();
  }

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function containsPoint(area, x, y){
    if (!area) return false;
    return x >= (area.x - (area.width / 2)) &&
      x <= (area.x + (area.width / 2)) &&
      y >= (area.y - (area.height / 2)) &&
      y <= (area.y + (area.height / 2));
  }

  function intersects(player, area){
    return ns.Collision && ns.Collision.intersects ? ns.Collision.intersects(player, area) : false;
  }

  function rememberRoom(world, roomId){
    if (world.visitedRooms[roomId]) return;
    world.visitedRooms[roomId] = true;
    world.roomOrder.push(roomId);
  }

  function learnAction(world, actionName){
    if (!actionName || world.learnedMap[actionName]) return;
    world.learnedMap[actionName] = true;
    world.actionsLearned.push(actionName);
    world.actionsLearned.sort(function(a, b){
      var list = ns.Movement && ns.Movement.ACTIONS ? ns.Movement.ACTIONS : [];
      return list.indexOf(a) - list.indexOf(b);
    });
  }

  function markModule(world, room, moduleId){
    if (world.completedModules[moduleId]) return;
    world.completedModules[moduleId] = true;
    if (ns.Events && ns.Events.emit) ns.Events.emit('module:passed', {
      roomId: room.id,
      moduleId: moduleId
    });
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

  function trimActions(world){
    var now = world.scene.time.now;
    var keep = [];
    for (var i = 0; i < world.actionQueue.length; i++) {
      if ((now - world.actionQueue[i].at) <= 320) keep.push(world.actionQueue[i]);
    }
    world.actionQueue = keep;
  }

  function consumeAction(world, actionName, area){
    for (var i = 0; i < world.actionQueue.length; i++) {
      var item = world.actionQueue[i];
      var px = item.payload && item.payload.x != null ? item.payload.x : world.player.x;
      var py = item.payload && item.payload.y != null ? item.payload.y : world.player.y;
      if (item.action !== actionName) continue;
      if (area && !containsPoint(area, px, py)) continue;
      world.actionQueue.splice(i, 1);
      return true;
    }
    return false;
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
    textLabel(world.scene, room.startX + 34, 22, room.title, 8, '#e8e3d1', 8);
  }

  function makeRoom(world, spec, startX, width){
    var room = {
      id: spec.id,
      title: spec.title,
      startX: startX,
      endX: startX + width,
      platforms: [],
      modules: [],
      contradictions: [],
      contradictionOutcome: '',
      completeX: startX + width - 88
    };
    world.rooms.push(room);
    return room;
  }

  function makeActionGate(world, room, cfg){
    var scene = world.scene;
    var sign = ns.Signs.place(scene, cfg.signX, cfg.signY, cfg.text, { id: cfg.id + '-sign' });
    var sensor = sensorZone(scene, cfg.sensorX, cfg.sensorY, cfg.sensorW || 100, cfg.sensorH || 70);
    var blocker = cfg.blocker ? staticRect(scene, cfg.blocker.x, cfg.blocker.y, cfg.blocker.w, cfg.blocker.h, cfg.blocker.color || 0xc23b3b, 1, 6) : null;
    var lamp = scene.add.rectangle(cfg.signX + 62, cfg.signY - 8, 10, 10, 0x6c7078, 1).setDepth(11);
    var gate = {
      id: cfg.id,
      actionName: cfg.actionName,
      sign: sign,
      sensor: sensor,
      blocker: blocker,
      lamp: lamp,
      resolved: false,
      note: cfg.note || '',
      onResolve: cfg.onResolve || null,
      resolve: function(reason){
        if (gate.resolved) return;
        gate.resolved = true;
        destroyThing(gate.blocker);
        gate.lamp.fillColor = 0x5b8f6a;
        learnAction(world, gate.actionName);
        markModule(world, room, gate.id);
        if (gate.onResolve) gate.onResolve(reason || 'live', gate);
      }
    };

    room.modules.push(gate);
    world.modules.push(gate);
    return gate;
  }

  function makeContradictionFork(world, room, cfg){
    var scene = world.scene;
    var horizon = world.horizon;
    var baseX = cfg.baseX;
    var sign = ns.Signs.place(scene, baseX + 28, horizon - 78, cfg.text, { id: cfg.id + '-sign' });
    var trigger = sensorZone(scene, baseX + 86, horizon - 40, 120, 80);
    var lamp = scene.add.rectangle(baseX + 96, horizon - 94, 10, 10, 0x6c7078, 1).setDepth(11);

    addPlatform(world, room, baseX + 166, horizon - 36, 86, 14, 0x56657b, 1, 4);
    addPlatform(world, room, baseX + 236, horizon - 68, 86, 14, 0x56657b, 1, 4);
    addPlatform(world, room, baseX + 306, horizon - 100, 86, 14, 0x56657b, 1, 4);
    addPlatform(world, room, baseX + 470, horizon - 116, 260, 18, 0x6a7890, 1, 4);

    var upperDoor = staticRect(scene, baseX + 564, horizon - 145, 18, 60, 0xc23b3b, 1, 6);
    var lowerDoor = staticRect(scene, baseX + 564, horizon - 30, 18, 60, 0xc23b3b, 1, 6);

    var fork = {
      id: cfg.id,
      sign: sign,
      trigger: trigger,
      lamp: lamp,
      upperDoor: upperDoor,
      lowerDoor: lowerDoor,
      defyAction: cfg.defyAction || 'move',
      enteredAt: 0,
      applied: false,
      gate: ns.Contradiction.gate({
        sign: { id: sign.id },
        expectedBehavior: 'wait',
        windowMs: cfg.windowMs || 900,
        onFollow: function(){ return 'upper'; },
        onDefy: function(){ return 'lower'; }
      }),
      applyOutcome: function(){
        if (fork.applied || !fork.gate.resolved) return;
        fork.applied = true;
        room.contradictionOutcome = fork.gate.outcome || '';
        world.lastContradictionOutcome = room.contradictionOutcome;
        if (fork.gate.outcome === 'follow') {
          destroyThing(fork.upperDoor);
          fork.lamp.fillColor = 0x5b8f6a;
        } else {
          destroyThing(fork.lowerDoor);
          fork.lamp.fillColor = 0xe04a3a;
        }
      },
      follow: function(){
        fork.gate.evaluate({ action: 'wait', elapsedMs: (cfg.windowMs || 900) + 20 });
        fork.applyOutcome();
      },
      defy: function(){
        fork.gate.evaluate({ action: fork.defyAction, elapsedMs: 120 });
        fork.applyOutcome();
      }
    };

    room.contradictions.push(fork);
    world.contradictions.push(fork);
    return fork;
  }

  function gateCondition(world, gate){
    if (!intersects(world.player, gate.sensor)) return false;
    switch (gate.actionName) {
      case 'move':
        return Math.abs(world.player.body.velocity.x) > 20;
      case 'jump':
        return consumeAction(world, 'jump', gate.sensor);
      case 'doubleJump':
        return consumeAction(world, 'doubleJump', gate.sensor);
      case 'tripleJump':
        return consumeAction(world, 'tripleJump', gate.sensor);
      case 'wallSlideJump':
        return consumeAction(world, 'wallSlideJump', gate.sensor);
      case 'punch':
        return consumeAction(world, 'punch', gate.sensor);
      case 'kick':
        return consumeAction(world, 'kick', gate.sensor);
      case 'spinDash':
        return consumeAction(world, 'spinDash', gate.sensor);
      case 'cigCopter':
        return consumeAction(world, 'cigCopter', gate.sensor);
      case 'groundSlam':
        return consumeAction(world, 'groundSlam', gate.sensor);
      case 'glide':
        return consumeAction(world, 'glide', gate.sensor);
      default:
        return false;
    }
  }

  function syncCurrentRoom(world){
    var x = world.player.x;
    for (var i = 0; i < world.rooms.length; i++) {
      if (x >= world.rooms[i].startX && x < world.rooms[i].endX) {
        world.currentRoomId = world.rooms[i].id;
        world.runState.roomId = world.rooms[i].id;
        rememberRoom(world, world.rooms[i].id);
        return;
      }
    }
    if (world.rooms.length) {
      world.currentRoomId = world.rooms[world.rooms.length - 1].id;
      world.runState.roomId = world.currentRoomId;
    }
  }

  function updateContradictions(world, time){
    var player = world.player;
    for (var i = 0; i < world.contradictions.length; i++) {
      var fork = world.contradictions[i];
      readSign(world, fork.sign);
      if (fork.applied) continue;
      if (!intersects(player, fork.trigger)) {
        fork.enteredAt = 0;
        continue;
      }
      if (!fork.enteredAt) fork.enteredAt = time;

      var action = '';
      if (fork.defyAction === 'move') {
        if (Math.abs(player.body.velocity.x) > 18) action = 'move';
      } else if (consumeAction(world, fork.defyAction, fork.trigger)) {
        action = fork.defyAction;
      }

      fork.gate.evaluate({
        action: action,
        elapsedMs: time - fork.enteredAt
      });
      fork.applyOutcome();
    }
  }

  function updateModules(world){
    for (var i = 0; i < world.modules.length; i++) {
      readSign(world, world.modules[i].sign);
      if (world.modules[i].resolved) continue;
      if (gateCondition(world, world.modules[i])) world.modules[i].resolve('live');
    }
  }

  function unlockFinalDoor(world){
    if (world.finalDoorUnlocked) return;
    if (world.actionsLearned.length < ns.Movement.ACTIONS.length) return;
    world.finalDoorUnlocked = true;
    destroyThing(world.finalDoor);
    world.finalLamp.fillColor = 0x5b8f6a;
  }

  function queueAction(world, action, payload){
    world.actionQueue.push({
      action: action,
      payload: payload || {},
      at: world.scene.time.now
    });
  }

  function bindActionQueue(world){
    var topics = [
      ['movement:jump', 'jump'],
      ['movement:doubleJump', 'doubleJump'],
      ['movement:tripleJump', 'tripleJump'],
      ['movement:wallJump', 'wallSlideJump'],
      ['movement:punch', 'punch'],
      ['movement:kick', 'kick'],
      ['movement:spinDash', 'spinDash'],
      ['movement:cigCopter', 'cigCopter'],
      ['movement:groundSlam', 'groundSlam'],
      ['movement:glide', 'glide']
    ];
    for (var i = 0; i < topics.length; i++) {
      (function(topic, actionName){
        world.offFns.push(ns.Events.on(topic, function(payload){
          queueAction(world, actionName, payload);
        }));
      })(topics[i][0], topics[i][1]);
    }
  }

  function buildIntake(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x172238, 0x3a5ca8);
    placeApplicants(world, room, [
      { x: startX + 188, y: world.horizon - 8, variant: 0 },
      { x: startX + 842, y: world.horizon - 8, variant: 1 }
    ]);
    addPlatform(world, room, startX + 180, world.horizon, width - 80, 28, 0x44546a, 1, 2);
    makeActionGate(world, room, {
      id: 'intake-move',
      actionName: 'move',
      text: spec.actionSigns[0],
      signX: startX + 120,
      signY: world.horizon - 78,
      sensorX: startX + 190,
      sensorY: world.horizon - 24,
      blocker: { x: startX + 254, y: world.horizon - 32, w: 18, h: 66 }
    });
    makeContradictionFork(world, room, {
      id: 'intake-badge',
      baseX: startX + 330,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 850
    });
    makeActionGate(world, room, {
      id: 'intake-jump',
      actionName: 'jump',
      text: spec.actionSigns[1],
      signX: startX + 968,
      signY: world.horizon - 78,
      sensorX: startX + 1030,
      sensorY: world.horizon - 38,
      blocker: { x: startX + 1102, y: world.horizon - 32, w: 18, h: 66 }
    });
    return room;
  }

  function buildBase(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x141e30, 0x52657a);
    placeApplicants(world, room, [
      { x: startX + 218, y: world.horizon - 8, variant: 2 },
      { x: startX + 918, y: world.horizon - 8, variant: 0 }
    ]);
    addPlatform(world, room, startX + 180, world.horizon, width - 80, 28, 0x44546a, 1, 2);
    makeContradictionFork(world, room, {
      id: 'base-turnstile',
      baseX: startX + 80,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 860
    });

    room.bridge = ns.Forms.bridge(world.scene, { x: startX + 650, y: world.horizon - 10, width: 132, height: 14 });
    world.platforms.push(room.bridge.rect);
    room.platforms.push(room.bridge.rect);

    makeActionGate(world, room, {
      id: 'base-kick',
      actionName: 'kick',
      text: spec.actionSigns[0],
      signX: startX + 620,
      signY: world.horizon - 80,
      sensorX: startX + 690,
      sensorY: world.horizon - 28,
      blocker: { x: startX + 766, y: world.horizon - 32, w: 18, h: 66 }
    });

    makeActionGate(world, room, {
      id: 'base-spin',
      actionName: 'spinDash',
      text: spec.actionSigns[1],
      signX: startX + 936,
      signY: world.horizon - 80,
      sensorX: startX + 1040,
      sensorY: world.horizon - 28,
      sensorW: 170,
      blocker: { x: startX + 1166, y: world.horizon - 32, w: 18, h: 66 }
    });

    return room;
  }

  function buildVertical(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x162232, 0x88aacc);
    placeApplicants(world, room, [
      { x: startX + 342, y: world.horizon - 8, variant: 1 },
      { x: startX + 1546, y: world.horizon - 104, variant: 2 }
    ]);
    addPlatform(world, room, startX + 300, world.horizon, 560, 28, 0x44546a, 1, 2);
    addPlatform(world, room, startX + 760, world.horizon, 360, 28, 0x44546a, 1, 2);
    addPlatform(world, room, startX + 940, world.horizon - 96, 110, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1120, world.horizon - 148, 110, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1300, world.horizon - 196, 140, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1466, world.horizon - 110, 160, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1602, world.horizon - 48, 180, 18, 0x60728a, 1, 4);

    room.trampoline = ns.Forms.trampoline(world.scene, { x: startX + 290, y: world.horizon - 16, width: 74, height: 12, power: 420 });
    world.platforms.push(room.trampoline.rect);
    room.platforms.push(room.trampoline.rect);

    makeContradictionFork(world, room, {
      id: 'vertical-elevator',
      baseX: startX + 210,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 900
    });

    makeActionGate(world, room, {
      id: 'vertical-double',
      actionName: 'doubleJump',
      text: spec.actionSigns[0],
      signX: startX + 620,
      signY: world.horizon - 82,
      sensorX: startX + 740,
      sensorY: world.horizon - 84,
      sensorW: 180,
      sensorH: 180,
      blocker: { x: startX + 896, y: world.horizon - 96, w: 18, h: 66 }
    });

    makeActionGate(world, room, {
      id: 'vertical-triple',
      actionName: 'tripleJump',
      text: spec.actionSigns[1],
      signX: startX + 990,
      signY: world.horizon - 176,
      sensorX: startX + 1080,
      sensorY: world.horizon - 150,
      sensorW: 220,
      sensorH: 200,
      blocker: { x: startX + 1210, y: world.horizon - 148, w: 18, h: 66 }
    });

    addPlatform(world, room, startX + 1360, world.horizon - 118, 18, 188, 0x7184a0, 1, 4);
    addPlatform(world, room, startX + 1438, world.horizon - 118, 18, 188, 0x7184a0, 1, 4);

    makeActionGate(world, room, {
      id: 'vertical-wall',
      actionName: 'wallSlideJump',
      text: spec.actionSigns[2],
      signX: startX + 1502,
      signY: world.horizon - 208,
      sensorX: startX + 1398,
      sensorY: world.horizon - 132,
      sensorW: 120,
      sensorH: 220,
      blocker: { x: startX + 1516, y: world.horizon - 146, w: 18, h: 66 }
    });

    return room;
  }

  function buildCorrective(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x191f2f, 0xe04a3a);
    placeApplicants(world, room, [
      { x: startX + 214, y: world.horizon - 8, variant: 0 },
      { x: startX + 944, y: world.horizon - 138, variant: 2 }
    ]);
    addPlatform(world, room, startX + 180, world.horizon, width - 80, 28, 0x44546a, 1, 2);
    addPlatform(world, room, startX + 910, world.horizon - 130, 180, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1110, world.horizon - 130, 140, 18, 0x60728a, 1, 4);

    makeContradictionFork(world, room, {
      id: 'corrective-review',
      baseX: startX + 80,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 880
    });

    makeActionGate(world, room, {
      id: 'corrective-punch',
      actionName: 'punch',
      text: spec.actionSigns[0],
      signX: startX + 638,
      signY: world.horizon - 80,
      sensorX: startX + 720,
      sensorY: world.horizon - 28,
      blocker: { x: startX + 794, y: world.horizon - 32, w: 18, h: 66 }
    });

    room.blade = ns.Forms.blade(world.scene, { x: startX + 876, y: world.horizon - 110, width: 40, height: 14 });

    makeActionGate(world, room, {
      id: 'corrective-slam',
      actionName: 'groundSlam',
      text: spec.actionSigns[1],
      signX: startX + 1016,
      signY: world.horizon - 208,
      sensorX: startX + 1100,
      sensorY: world.horizon - 106,
      sensorW: 140,
      sensorH: 220,
      blocker: { x: startX + 1188, y: world.horizon - 32, w: 18, h: 66 }
    });

    return room;
  }

  function buildAerial(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x16253a, 0x88aacc);
    placeApplicants(world, room, [
      { x: startX + 208, y: world.horizon - 8, variant: 1 },
      { x: startX + 1240, y: world.horizon - 170, variant: 0 }
    ]);
    addPlatform(world, room, startX + 170, world.horizon, 360, 28, 0x44546a, 1, 2);
    addPlatform(world, room, startX + 664, world.horizon - 118, 180, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 930, world.horizon - 72, 150, 18, 0x60728a, 1, 4);
    addPlatform(world, room, startX + 1180, world.horizon - 162, 130, 18, 0x60728a, 1, 4);

    room.trampoline = ns.Forms.trampoline(world.scene, { x: startX + 314, y: world.horizon - 16, width: 74, height: 12, power: 430 });
    world.platforms.push(room.trampoline.rect);
    room.platforms.push(room.trampoline.rect);

    makeContradictionFork(world, room, {
      id: 'aerial-clearance',
      baseX: startX + 44,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 840
    });

    makeActionGate(world, room, {
      id: 'aerial-glide',
      actionName: 'glide',
      text: spec.actionSigns[0],
      signX: startX + 524,
      signY: world.horizon - 178,
      sensorX: startX + 620,
      sensorY: world.horizon - 120,
      sensorW: 220,
      sensorH: 180,
      blocker: { x: startX + 812, y: world.horizon - 72, w: 18, h: 66 }
    });

    makeActionGate(world, room, {
      id: 'aerial-copter',
      actionName: 'cigCopter',
      text: spec.actionSigns[1],
      signX: startX + 1038,
      signY: world.horizon - 214,
      sensorX: startX + 1110,
      sensorY: world.horizon - 138,
      sensorW: 160,
      sensorH: 220,
      blocker: { x: startX + 1246, y: world.horizon - 164, w: 18, h: 66 }
    });

    return room;
  }

  function buildFinal(world, spec, startX, width){
    var room = makeRoom(world, spec, startX, width);
    addBackdrop(world, room, 0x151d2a, 0xe04a3a);
    placeApplicants(world, room, [
      { x: startX + 248, y: world.horizon - 8, variant: 2 },
      { x: startX + 814, y: world.horizon - 8, variant: 1 }
    ]);
    addPlatform(world, room, startX + 170, world.horizon, width - 120, 28, 0x44546a, 1, 2);
    makeContradictionFork(world, room, {
      id: 'final-protocol',
      baseX: startX + 120,
      text: spec.contradictionSign,
      defyAction: 'move',
      windowMs: 900
    });

    room.finalSign = ns.Signs.place(world.scene, startX + 784, world.horizon - 84, spec.actionSigns[0], { id: 'final-cert-sign' });
    room.finalLamp = world.scene.add.rectangle(startX + 848, world.horizon - 92, 10, 10, 0x6c7078, 1).setDepth(11);
    world.finalLamp = room.finalLamp;
    world.finalDoor = staticRect(world.scene, startX + 926, world.horizon - 34, 18, 72, 0xc23b3b, 1, 6);
    world.goal = sensorZone(world.scene, startX + 1120, world.horizon - 88, 140, 180);

    return room;
  }

  function emitAction(actionName, payload){
    payload = payload || {};
    if (!ns.Events || !ns.Events.emit) return;
    switch (actionName) {
      case 'jump':
        ns.Events.emit('movement:jump', payload);
        return;
      case 'doubleJump':
        ns.Events.emit('movement:doubleJump', payload);
        return;
      case 'tripleJump':
        ns.Events.emit('movement:tripleJump', payload);
        return;
      case 'wallSlideJump':
        ns.Events.emit('movement:wallJump', payload);
        return;
      case 'punch':
        ns.Events.emit('movement:punch', payload);
        return;
      case 'kick':
        ns.Events.emit('movement:kick', payload);
        return;
      case 'spinDash':
        ns.Events.emit('movement:spinDash', payload);
        return;
      case 'cigCopter':
        ns.Events.emit('movement:cigCopter', payload);
        return;
      case 'groundSlam':
        ns.Events.emit('movement:groundSlam', payload);
        return;
      case 'glide':
        ns.Events.emit('movement:glide', payload);
        return;
      default:
        return;
    }
  }

  function resetDebug(world){
    ns.Axes.reset();
    if (ns.Metrics && ns.Metrics.reset) ns.Metrics.reset();
    world.actionQueue = [];
    world.visitedRooms = {};
    world.learnedMap = {};
    world.completedModules = {};
    world.roomOrder.length = 0;
    world.actionsLearned.length = 0;
    world.runState.roomOrder = world.roomOrder;
    world.runState.actionsLearned = world.actionsLearned;
    world.runState.roomId = 'intake';
    world.runState.receipt = null;
    world.lastContradictionOutcome = '';
    world.scene.runComplete = false;
    world.scene.pendingDeath = null;
    world.scene.runStartMs = world.scene.time.now;
    world.scene.recorder.clear();
    ns.Movement.respawn(world.player);
    rememberRoom(world, 'intake');
  }

  function actionPayload(room, index, style){
    var biasY = style === 'obedient' ? worldYForStyle(room, 'upper') : worldYForStyle(room, 'lower');
    return {
      x: room.startX + 300 + (index * 96),
      y: biasY
    };
  }

  function worldYForStyle(room, lane){
    if (room.id === 'vertical-compliance') {
      return lane === 'upper' ? 238 : 330;
    }
    if (room.id === 'aerial-exception') {
      return lane === 'upper' ? 248 : 346;
    }
    return lane === 'upper' ? 276 : 392;
  }

  function scriptRoom(world, room, style, recorderMs){
    var lane = style === 'obedient' ? 'upper' : 'lower';
    var xBase = room.startX + 64;
    world.player.x = xBase;
    world.player.y = worldYForStyle(room, lane);
    syncCurrentRoom(world);
    world.scene.recorder.mark(recorderMs[0], room.startX + 64, worldYForStyle(room, lane), 1);

    if (room.contradictions.length) {
      if (style === 'obedient') room.contradictions[0].follow();
      else room.contradictions[0].defy();
    }

    for (var i = 0; i < room.modules.length; i++) {
      readSign(world, room.modules[i].sign);
      room.modules[i].sign.peek({ signId: room.modules[i].sign.id, words: room.modules[i].sign.text.split(/\s+/).length });
      room.modules[i].sign.read({ signId: room.modules[i].sign.id, words: room.modules[i].sign.text.split(/\s+/).length });
      emitAction(room.modules[i].actionName, actionPayload(room, i, style));
      if (room.modules[i].actionName === 'move') {
        world.player.body.setVelocityX(style === 'obedient' ? 120 : 180);
      }
      room.modules[i].resolve('debug');
      world.scene.recorder.mark(recorderMs[i + 1], room.startX + 220 + (i * 120), worldYForStyle(room, lane), 1);
    }

    if (room.bridge && room.bridge.activate) room.bridge.activate(world.player);
    if (room.trampoline && room.trampoline.activate) room.trampoline.activate(world.player);
    if (room.blade && style === 'defiant' && room.blade.activate) {
      if (ns.Events && ns.Events.emit) ns.Events.emit('movement:nearMiss', { x: room.blade.rect.x, y: room.blade.rect.y });
    }
    if (ns.Events && ns.Events.emit) ns.Events.emit('music:sync', { x: room.endX - 120, y: worldYForStyle(room, lane) });

    world.player.x = room.endX - 90;
    world.player.y = worldYForStyle(room, lane);
    syncCurrentRoom(world);
    world.scene.recorder.mark(recorderMs[recorderMs.length - 1], room.endX - 90, worldYForStyle(room, lane), 1);
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
        actionsLearned: clone(world.actionsLearned)
      };
    }

    style = style || 'obedient';
    resetDebug(world);

    var markers = [
      [0, 110, 220, 360],
      [420, 560, 720, 880],
      [920, 1180, 1360, 1540, 1720],
      [1760, 1960, 2140, 2320],
      [2360, 2560, 2740, 2920],
      [2960, 3160, 3340]
    ];

    for (var i = 0; i < world.rooms.length; i++) {
      scriptRoom(world, world.rooms[i], style, markers[i]);
    }

    unlockFinalDoor(world);
    if (world.finalSign) {
      world.finalSign.peek({ signId: world.finalSign.id, words: world.finalSign.text.split(/\s+/).length });
      world.finalSign.read({ signId: world.finalSign.id, words: world.finalSign.text.split(/\s+/).length });
    }
    world.player.x = world.goal.x;
    world.player.y = world.goal.y;
    syncCurrentRoom(world);
    scene.completeRun('debug:' + style);

    return {
      receipt: clone(world.runState.receipt),
      axes: clone(ns.Axes.snapshot()),
      frames: clone(scene.recorder.dump()),
      contradictionOutcome: world.lastContradictionOutcome || '',
      worldId: world.runState.worldId,
      roomOrder: clone(world.roomOrder),
      actionsLearned: clone(world.actionsLearned)
    };
  }

  function create(scene, runState){
    var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get('orientation') : null;
    var horizon = ns.GAME_H - 24;
    var roomWidth = 1320;
    var sceneWorld = {
      id: 'orientation-world',
      worldId: 'orientation',
      scene: scene,
      runState: runState,
      manifest: manifest,
      horizon: horizon,
      width: roomWidth * 6,
      rooms: [],
      modules: [],
      contradictions: [],
      platforms: [],
      actionQueue: [],
      offFns: [],
      visitedRooms: {},
      learnedMap: {},
      completedModules: {},
      roomOrder: [],
      actionsLearned: [],
      currentRoomId: 'intake',
      finalDoor: null,
      finalDoorUnlocked: false,
      finalLamp: null,
      goal: null,
      lastContradictionOutcome: ''
    };

    scene.cameras.main.setBackgroundColor('#101824');
    scene.physics.world.setBounds(0, 0, sceneWorld.width, ns.GAME_H);
    scene.cameras.main.setBounds(0, 0, sceneWorld.width, ns.GAME_H);

    sceneWorld.player = ns.Movement.createEd(scene, 72, horizon - 28);
    scene.player = sceneWorld.player;

    runState.worldId = 'orientation';
    runState.roomId = 'intake';
    runState.roomOrder = sceneWorld.roomOrder;
    runState.actionsLearned = sceneWorld.actionsLearned;
    runState.worldFlags = manifest || {};

    buildIntake(sceneWorld, manifest.rooms[0], 0, roomWidth);
    buildBase(sceneWorld, manifest.rooms[1], roomWidth, roomWidth);
    buildVertical(sceneWorld, manifest.rooms[2], roomWidth * 2, roomWidth);
    buildCorrective(sceneWorld, manifest.rooms[3], roomWidth * 3, roomWidth);
    buildAerial(sceneWorld, manifest.rooms[4], roomWidth * 4, roomWidth);
    buildFinal(sceneWorld, manifest.rooms[5], roomWidth * 5, roomWidth);

    for (var i = 0; i < sceneWorld.platforms.length; i++) {
      scene.physics.add.collider(sceneWorld.player, sceneWorld.platforms[i], function(player, platform){
        if (sceneWorld.player !== player) return;
        if (sceneWorld.rooms[1].bridge && platform === sceneWorld.rooms[1].bridge.rect) sceneWorld.rooms[1].bridge.activate(player);
        if (sceneWorld.rooms[2].trampoline && platform === sceneWorld.rooms[2].trampoline.rect && player.body.velocity.y >= 0) sceneWorld.rooms[2].trampoline.activate(player);
        if (sceneWorld.rooms[4].trampoline && platform === sceneWorld.rooms[4].trampoline.rect && player.body.velocity.y >= 0) sceneWorld.rooms[4].trampoline.activate(player);
      });
    }

    if (sceneWorld.rooms[3].blade) {
      scene.physics.add.overlap(sceneWorld.player, sceneWorld.rooms[3].blade.rect, function(){
        sceneWorld.rooms[3].blade.activate(sceneWorld.player);
      });
    }

    scene.physics.add.overlap(sceneWorld.player, sceneWorld.goal, function(){
      if (sceneWorld.finalDoorUnlocked) scene.completeRun('goal');
    });

    bindActionQueue(sceneWorld);
    rememberRoom(sceneWorld, 'intake');
    return sceneWorld;
  }

  function update(scene, dtMs){
    var world = scene.room;
    if (!world || !world.player) return;
    trimActions(world);
    syncCurrentRoom(world);
    updateContradictions(world, scene.time.now);
    updateModules(world);
    unlockFinalDoor(world);
    if (world.finalSign) readSign(world, world.finalSign);
  }

  function destroy(world){
    if (!world || !world.offFns) return;
    for (var i = 0; i < world.offFns.length; i++) {
      if (typeof world.offFns[i] === 'function') world.offFns[i]();
    }
    world.offFns = [];
  }

  ns.WorldOrientation = {
    create: create,
    update: update,
    destroy: destroy,
    runStyle: runStyle
  };
})(CEHP);
CEHP._register('74_world_orientation_runtime');
