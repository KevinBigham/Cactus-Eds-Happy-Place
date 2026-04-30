/* MODULE: 65_POST_BOSS_ENROLLMENT - W15M-P4 W2 mini-boss. */
(function(ns){
  'use strict';

  var FID = 'W15_ENROLLMENT_CLOSER_01';
  var FT = 'ENROLLMENT ACCEPTED YOU WITHOUT EXAMINATION.';

  ns.flags = ns.flags || {};
  if (ns.flags.W2_ENROLLMENT_BOSS == null) ns.flags.W2_ENROLLMENT_BOSS = true;
  ns.bosses = ns.bosses || {};

  function registerReceipt(){
    if (ns.bosses._enrollmentReceiptRegistered) return;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return;
    ns.Receipts.registerFragment('CLOSERS', FID, FT, {
      worlds: { benefits: 6 },
      flags: { enrollmentDefeated: true },
      micro: { modulesPassed: 0.8, damageDealt: 0.4 },
      tone: 'benign'
    });
    ns.bosses._enrollmentReceiptRegistered = true;
  }

  function syncBody(node){
    if (!node || !node.body) return;
    node.body.x = node.x - (node.width || 0) / 2;
    node.body.y = node.y - (node.height || 0) / 2;
    node.body.width = node.width || node.body.width || 0;
    node.body.height = node.height || node.body.height || 0;
    if (node.body.updateFromGameObject) node.body.updateFromGameObject();
  }

  function rect(scene, x, y, w, h, color, alpha, depth){
    var r = scene.add.rectangle(x, y, w, h, color, alpha == null ? 1 : alpha).setDepth(depth == null ? 12 : depth);
    if (scene.physics && scene.physics.add && scene.physics.add.existing) {
      scene.physics.add.existing(r, true);
      if (r.body) {
        r.body.allowGravity = false;
        r.body.moves = false;
        syncBody(r);
      }
    }
    return r;
  }

  function label(scene, x, y, text){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#fff9e0',
      align: 'center'
    }).setOrigin(0.5).setDepth(14);
  }

  function image(scene, key, x, y, w, h, depth, alpha){
    var img;
    if (!scene || !scene.textures || !scene.textures.exists || !scene.textures.exists(key) || !scene.add || !scene.add.image) return null;
    img = scene.add.image(x, y, key).setDepth(depth == null ? 12.5 : depth);
    if (img.setOrigin) img.setOrigin(0.5);
    if (img.setDisplaySize) img.setDisplaySize(w, h);
    if (img.setAlpha) img.setAlpha(alpha == null ? 1 : alpha);
    return img;
  }

  function visible(node, isVisible){
    if (!node) return;
    if (node.setVisible) node.setVisible(isVisible);
    else node.visible = isVisible;
  }

  function alpha(node, value){
    if (!node) return;
    if (node.setAlpha) node.setAlpha(value);
    else node.alpha = value;
  }

  function destroy(node){
    if (node && node.destroy) node.destroy();
  }

  function resize(node, x, y, w, h){
    if (!node) return;
    node.x = x;
    node.y = y;
    node.width = w;
    node.height = h;
    if (node.setSize) node.setSize(w, h);
    syncBody(node);
  }

  function pointInside(node, x, y, pad){
    var w;
    var h;
    if (!node || x == null || y == null) return false;
    pad = pad || 0;
    w = (node.width || 0) / 2 + pad;
    h = (node.height || 0) / 2 + pad;
    return x >= node.x - w && x <= node.x + w && y >= node.y - h && y <= node.y + h;
  }

  function actionHits(boss, payload){
    var player = boss.world && boss.world.player;
    var x = payload && payload.x != null ? payload.x : (player ? player.x : null);
    var y = payload && payload.y != null ? payload.y : (player ? player.y : null);
    return pointInside(boss.rect, x, y, 72) || pointInside(boss.hazard, x, y, 18);
  }

  function receiptFlags(world){
    world.runState = world.runState || {};
    world.runState.receiptFlags = world.runState.receiptFlags || {};
    return world.runState.receiptFlags;
  }

  function phaseShape(boss, id){
    var x = boss.rect.x;
    var y = boss.rect.y;
    if (id === 'eligibility') return { x: x - 74, y: y + 26, w: 320, h: 76, c: 0xc23b3b };
    if (id === 'denial') return { x: x - 34, y: y + 18, w: 150, h: 126, c: 0xe04a3a };
    return { x: x - 176, y: y - 12, w: 286, h: 24, c: 0xfff9e0 };
  }

  function syncVisuals(boss, snapshot){
    var shape;
    var on;
    if (!boss || !boss.rect) return;
    snapshot = snapshot || boss.framework.snapshot();
    shape = phaseShape(boss, snapshot.phaseId);
    on = snapshot.state === 'telegraph' || snapshot.state === 'strike';
    if (boss.label) {
      boss.label.x = boss.rect.x;
      boss.label.y = boss.rect.y - 58;
    }
    if (boss.sprite) {
      boss.sprite.x = boss.rect.x;
      boss.sprite.y = boss.rect.y - 4;
      alpha(boss.sprite, boss.defeated ? 0.18 : 0.46);
    }
    if (boss.hazard) {
      resize(boss.hazard, shape.x, shape.y, shape.w, shape.h);
      boss.hazard.fillColor = shape.c;
      visible(boss.hazard, on && !boss.defeated);
      alpha(boss.hazard, snapshot.state === 'strike' ? 0.72 : 0.24);
    }
    alpha(boss.rect, boss.defeated ? 0.34 : (snapshot.state === 'telegraph' ? 0.78 : 0.94));
  }

  function applyStrike(boss, snapshot){
    var player;
    if (!boss || boss.defeated || !snapshot || snapshot.state !== 'strike') return;
    player = boss.world && boss.world.player;
    if (!player || player.invulnMs > 0) return;
    if (!ns.Collision || !ns.Collision.intersects || !ns.Collision.intersects(player, boss.hazard)) return;
    if (snapshot.phaseId === 'denial' && boss._action && actionHits(boss, boss._action)) {
      boss.defeat('denial-stamp');
      return;
    }
    if (player.takeHit) player.takeHit('enrollment');
  }

  function listenForActions(boss){
    var topics = ['movement:punch', 'movement:kick', 'movement:groundSlam'];
    var i;
    if (!ns.Events || !ns.Events.on) return;
    for (i = 0; i < topics.length; i++) {
      (function(topic){
        boss.offFns.push(ns.Events.on(topic, function(payload){
          if (!boss.defeated) boss._action = payload || {};
        }));
      })(topics[i]);
    }
  }

  function makeFramework(seed, rng){
    return ns.bossFramework.create({
      id: 'enrollment',
      seed: seed || 'cehp-enrollment',
      rng: rng || null,
      phases: [
        { id: 'intake', telegraphWindowMs: { min: 160, max: 220 }, strikeMs: 70, cooldownMs: 110 },
        { id: 'eligibility', telegraphWindowMs: { min: 210, max: 300 }, strikeMs: 80, cooldownMs: 130 },
        { id: 'denial', telegraphWindowMs: { min: 260, max: 360 }, strikeMs: 90, cooldownMs: 150 }
      ],
      receiptTags: [
        { topic: 'combat:damageDealt', payload: { kind: 'boss', bossId: 'enrollment', amount: 1 } },
        { topic: 'module:passed', payload: { kind: 'boss', bossId: 'enrollment', moduleId: 'enrollment-final-processing' } },
        { topic: 'boss:receiptTag', payload: { kind: 'boss', bossId: 'enrollment', receiptFlag: 'enrollmentDefeated' } }
      ]
    });
  }

  function spawnEnrollment(scene, world, opts){
    var room;
    var x;
    var y;
    var boss;

    opts = opts || {};
    if (!scene || !world || !ns.bossFramework || !ns.bossFramework.create) return null;
    registerReceipt();
    room = world.rooms && world.rooms.length ? world.rooms[world.rooms.length - 1] : null;
    x = opts.x || (room && room.startX != null ? room.startX + 1004 : (world.goal ? world.goal.x - 260 : 11248));
    y = opts.y || ((world.horizon || 400) - 82);
    boss = {
      id: 'enrollment',
      world: world,
      scene: scene,
      rect: rect(scene, x, y, 58, 88, 0x2b1d24, 0.94, 12.8),
      label: label(scene, x, y - 58, 'ENROLLMENT'),
      sprite: image(scene, 'enemy_compliance_auditor', x, y - 4, 82, 96, 12.7, 0.46),
      hazard: rect(scene, x - 176, y - 12, 286, 24, 0xfff9e0, 0.24, 13.6),
      blocker: rect(scene, world.goal ? world.goal.x - 150 : x + 140, (world.horizon || 400) - 34, 18, 72, 0xc23b3b, 1, 6),
      framework: makeFramework(opts.seed || (world.runState && world.runState.caseSeed ? world.runState.caseSeed + '|enrollment' : 'cehp-enrollment'), opts.rng || null),
      offFns: [],
      defeated: false,
      _action: null
    };

    boss.update = function(dt){
      var snapshot;
      if (boss.defeated) {
        syncVisuals(boss, boss.framework.snapshot());
        return boss.framework.snapshot();
      }
      snapshot = boss.framework.update(dt || 16);
      if (snapshot.phaseId === 'denial' && (snapshot.state === 'telegraph' || snapshot.state === 'strike') &&
          boss._action && actionHits(boss, boss._action)) {
        return boss.defeat('denial-stamp');
      }
      syncVisuals(boss, snapshot);
      applyStrike(boss, snapshot);
      if (snapshot.state !== 'telegraph' && snapshot.state !== 'strike') boss._action = null;
      return snapshot;
    };

    boss.snapshot = function(){
      return boss.framework.snapshot();
    };

    boss.defeat = function(reason){
      var flags;
      if (boss.defeated) return boss.framework.snapshot();
      registerReceipt();
      flags = receiptFlags(world);
      flags.enrollmentDefeated = true;
      world.enrollmentDefeated = true;
      boss.defeated = true;
      destroy(boss.blocker);
      visible(boss.hazard, false);
      syncVisuals(boss, boss.framework.snapshot());
      return boss.framework.defeat({ reason: reason || 'defeat' });
    };

    boss.debugDefeat = function(){
      var guard = 0;
      var snapshot = boss.framework.snapshot();
      while (!snapshot.defeated && snapshot.phaseId !== 'denial' && guard < 80) {
        snapshot = boss.update(50);
        guard += 1;
      }
      return boss.defeat('debug');
    };

    boss.destroy = function(){
      var i;
      for (i = 0; i < boss.offFns.length; i++) {
        if (typeof boss.offFns[i] === 'function') boss.offFns[i]();
      }
      boss.offFns = [];
      destroy(boss.rect);
      destroy(boss.label);
      destroy(boss.sprite);
      destroy(boss.hazard);
      destroy(boss.blocker);
    };

    visible(boss.hazard, false);
    if (world.platforms) world.platforms.push(boss.blocker);
    if (room && room.platforms) room.platforms.push(boss.blocker);
    world.enrollmentBoss = boss;
    listenForActions(boss);
    syncVisuals(boss, boss.framework.snapshot());
    return boss;
  }

  ns.bosses.registerEnrollmentReceipt = registerReceipt;
  ns.bosses.spawnEnrollment = spawnEnrollment;
})(CEHP);
CEHP._register('65_post_boss_enrollment');
