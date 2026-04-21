/* ================================================================
   MODULE: 92_TESTROOM
   Throwaway Week 1 room exercising movement, contradiction gates,
   forms-as-objects, audio, cigarette rendering, and receipts.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function staticRect(scene, x, y, w, h, color, alpha){
    var rect = scene.add.rectangle(x, y, w, h, color || 0x2f3542, alpha == null ? 1 : alpha).setDepth(4);
    scene.physics.add.existing(rect, true);
    rect.body.allowGravity = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function signText(scene, x, y, text){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#dfe6ef'
    }).setDepth(8);
  }

  function create(scene, runState){
    var width = 2048;
    var horizon = ns.GAME_H - 24;
    var room = {
      id: 'test-room',
      width: width,
      gateStartMs: 0,
      contradictionOutcome: ''
    };
    var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get('orientation') : null;

    scene.cameras.main.setBackgroundColor('#121722');
    scene.physics.world.setBounds(0, 0, width, ns.GAME_H);
    scene.cameras.main.setBounds(0, 0, width, ns.GAME_H);

    scene.add.rectangle(width / 2, ns.GAME_H / 2, width, ns.GAME_H, 0x121722, 1).setDepth(0);
    scene.add.rectangle(width / 2, horizon + 14, width, 60, 0x253146, 1).setDepth(1);

    room.player = ns.Movement.createEd(scene, 72, horizon - 28);
    scene.player = room.player;

    room.platforms = [
      staticRect(scene, 80, horizon, 130, 28, 0x44546a, 1),
      staticRect(scene, 410, horizon, 250, 28, 0x44546a, 1),
      staticRect(scene, 680, horizon, 200, 28, 0x44546a, 1),
      staticRect(scene, 1120, horizon - 8, 310, 44, 0x3f5064, 1),
      staticRect(scene, 1160, 300, 220, 18, 0x52657a, 1),
      staticRect(scene, 1320, 248, 100, 18, 0x52657a, 1),
      staticRect(scene, 1660, 208, 350, 18, 0x52657a, 1),
      staticRect(scene, 1730, 378, 150, 18, 0x52657a, 1),
      staticRect(scene, 460, 320, 18, 140, 0x7184a0, 1)
    ];

    room.bridge = ns.Forms.bridge(scene, { x: 245, y: horizon - 10, width: 110, height: 14 });
    room.blade = ns.Forms.blade(scene, { x: 1115, y: horizon - 24, width: 44, height: 14 });
    room.trampoline = ns.Forms.trampoline(scene, { x: 1405, y: horizon - 18, width: 70, height: 12, power: 560 });

    room.platforms.push(room.bridge.rect);
    room.platforms.push(room.trampoline.rect);

    room.upperDoor = staticRect(scene, 930, 332, 18, 66, 0xc23b3b, 1);
    room.lowerDoor = staticRect(scene, 930, horizon - 10, 18, 60, 0xc23b3b, 1);
    room.platforms.push(room.upperDoor);
    room.platforms.push(room.lowerDoor);

    room.sign = ns.Signs.place(scene, 676, 330, 'DO NOT JUMP.', { id: 'do-not-jump' });
    room.signB = ns.Signs.place(scene, 1505, 150, 'KICK THE SYSTEM.', { id: 'kick-system' });

    room.goal = scene.add.zone(1880, 140, 120, 220);
    scene.physics.add.existing(room.goal, true);
    room.goal.body.allowGravity = false;
    room.goal.body.updateFromGameObject();

    room.gate = ns.Contradiction.gate({
      sign: { id: 'do-not-jump' },
      expectedBehavior: 'wait',
      windowMs: 800,
      onFollow: function(){
        room.contradictionOutcome = 'follow';
        if (room.upperDoor && room.upperDoor.destroy) room.upperDoor.destroy();
        room.upperDoor = null;
        return 'upper';
      },
      onDefy: function(){
        room.contradictionOutcome = 'defy';
        if (room.lowerDoor && room.lowerDoor.destroy) room.lowerDoor.destroy();
        room.lowerDoor = null;
        return 'lower';
      }
    });

    scene.physics.add.overlap(room.player, room.blade.rect, function(){
      room.blade.activate(room.player);
    });

    scene.physics.add.collider(room.player, room.trampoline.rect, function(player){
      if (player.body.velocity.y >= 0) room.trampoline.activate(player);
    });

    scene.physics.add.overlap(room.player, room.goal, function(){
      scene.completeRun('goal');
    });

    for (var i = 0; i < room.platforms.length; i++) {
      scene.physics.add.collider(room.player, room.platforms[i], function(player, platform){
        if (platform === room.bridge.rect) room.bridge.activate(player);
      });
    }

    signText(scene, 46, 56, 'J PUNCH');
    signText(scene, 46, 70, 'K KICK');
    signText(scene, 46, 84, 'L DASH');
    signText(scene, 46, 98, 'C COPTER');
    signText(scene, 46, 112, 'V SLAM');
    signText(scene, 46, 126, 'B GLIDE');
    if (manifest && manifest.title) {
      signText(scene, 46, 22, manifest.title);
    }

    runState.roomId = room.id;
    return room;
  }

  function update(scene, dtMs){
    var room = scene.room;
    var player = scene.player;
    var time = scene.time.now;

    if (ns.Collision.intersects(player, room.sign.sensor)) {
      room.sign.peek({ signId: room.sign.id, words: 3 });
      if (ns.Input.justPressed('up')) room.sign.read({ signId: room.sign.id, words: 3 });
    }

    if (ns.Collision.intersects(player, room.signB.sensor)) {
      room.signB.peek({ signId: room.signB.id, words: 3 });
      if (ns.Input.justPressed('up')) room.signB.read({ signId: room.signB.id, words: 3, defiant: true });
    }

    if (!room.gate.resolved && player.x > 560 && player.x < 760) {
      if (!room.gateStartMs) room.gateStartMs = time;
      room.gate.evaluate({
        action: ns.Input.justPressed('jump') ? 'jump' : '',
        elapsedMs: time - room.gateStartMs
      });
    }

    room.sign.updateFromAxes(ns.Axes.snapshot());
    room.signB.updateFromAxes(ns.Axes.snapshot());

    if (player.body.blocked.down && Math.abs(player.body.velocity.x) > 160) {
      if (ns.Events && ns.Events.emit) ns.Events.emit('music:sync', { x: player.x, y: player.y });
    }
  }

  ns.TestRoom = {
    create: create,
    update: update
  };
})(CEHP);
CEHP._register('92_testroom');
