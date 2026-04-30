/* MODULE: 66_POST_BOSS_LOGISTICS - W15M-P5 W3 mini-boss. */
(function(ns){
  'use strict';

  var FID = 'W15_LOGISTICS_CLOSER_01';
  var FT = 'THE LEDGER NOTICED YOUR SOFT EXIT.';

  ns.flags = ns.flags || {};
  if (ns.flags.W3_LOGISTICS_BOSS == null) ns.flags.W3_LOGISTICS_BOSS = true;
  ns.bosses = ns.bosses || {};

  function registerReceipt(){
    if (ns.bosses._logisticsReceiptRegistered) return;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return;
    ns.Receipts.registerFragment('CLOSERS', FID, FT, {
      worlds: { rasta: 6 },
      flags: { logisticsDefeated: true },
      micro: { modulesPassed: 0.8, damageDealt: 0.4 },
      axes: { intuition: 0.4, grace: 0.2 },
      tone: 'benign'
    });
    ns.bosses._logisticsReceiptRegistered = true;
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
      color: '#f2e3c5',
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
    if (id === 'manifest') return { x: x - 98, y: y + 34, w: 342, h: 72, c: 0xc49a4a };
    if (id === 'ledger') return { x: x - 44, y: y + 20, w: 148, h: 126, c: 0xe8d9b1 };
    return { x: x - 184, y: y - 10, w: 304, h: 24, c: 0xf2e3c5 };
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
      boss.sprite.y = boss.rect.y - 2;
      alpha(boss.sprite, boss.defeated ? 0.18 : 0.5);
    }
    if (boss.hazard) {
      resize(boss.hazard, shape.x, shape.y, shape.w, shape.h);
      boss.hazard.fillColor = shape.c;
      visible(boss.hazard, on && !boss.defeated);
      alpha(boss.hazard, snapshot.state === 'strike' ? 0.66 : 0.22);
    }
    alpha(boss.rect, boss.defeated ? 0.34 : (snapshot.state === 'telegraph' ? 0.74 : 0.9));
  }

  function applyStrike(boss, snapshot){
    var player;
    if (!boss || boss.defeated || !snapshot || snapshot.state !== 'strike') return;
    player = boss.world && boss.world.player;
    if (!player || player.invulnMs > 0) return;
    if (!ns.Collision || !ns.Collision.intersects || !ns.Collision.intersects(player, boss.hazard)) return;
    if (snapshot.phaseId === 'ledger' && boss._action && actionHits(boss, boss._action)) {
      boss.defeat('ledger-stamp');
      return;
    }
    if (player.takeHit) player.takeHit('logistics');
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
      id: 'logistics',
      seed: seed || 'cehp-logistics',
      rng: rng || null,
      phases: [
        { id: 'inspection', telegraphWindowMs: { min: 180, max: 240 }, strikeMs: 70, cooldownMs: 120 },
        { id: 'manifest', telegraphWindowMs: { min: 230, max: 320 }, strikeMs: 80, cooldownMs: 140 },
        { id: 'ledger', telegraphWindowMs: { min: 280, max: 380 }, strikeMs: 90, cooldownMs: 160 }
      ],
      receiptTags: [
        { topic: 'combat:damageDealt', payload: { kind: 'boss', bossId: 'logistics', amount: 1 } },
        { topic: 'module:passed', payload: { kind: 'boss', bossId: 'logistics', moduleId: 'logistics-final-manifest' } },
        { topic: 'boss:receiptTag', payload: { kind: 'boss', bossId: 'logistics', receiptFlag: 'logisticsDefeated' } }
      ]
    });
  }

  function spawnLogistics(scene, world, opts){
    var room;
    var x;
    var y;
    var boss;

    opts = opts || {};
    if (!scene || !world || !ns.bossFramework || !ns.bossFramework.create) return null;
    registerReceipt();
    room = world.rooms && world.rooms.length ? world.rooms[world.rooms.length - 1] : null;
    x = opts.x || (world.goal ? world.goal.x - 260 : (room && room.startX != null ? room.startX + 1004 : 8600));
    y = opts.y || ((world.horizon || 400) - 82);
    boss = {
      id: 'logistics',
      world: world,
      scene: scene,
      rect: rect(scene, x, y, 60, 88, 0x263321, 0.9, 12.8),
      label: label(scene, x, y - 58, 'LOGISTICS'),
      sprite: image(scene, 'prop_archive_box', x, y - 2, 96, 76, 12.7, 0.5),
      hazard: rect(scene, x - 184, y - 10, 304, 24, 0xf2e3c5, 0.22, 13.6),
      blocker: rect(scene, world.goal ? world.goal.x - 150 : x + 140, (world.horizon || 400) - 34, 18, 72, 0xc49a4a, 1, 6),
      framework: makeFramework(opts.seed || (world.runState && world.runState.caseSeed ? world.runState.caseSeed + '|logistics' : 'cehp-logistics'), opts.rng || null),
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
      if (snapshot.phaseId === 'ledger' && (snapshot.state === 'telegraph' || snapshot.state === 'strike') &&
          boss._action && actionHits(boss, boss._action)) {
        return boss.defeat('ledger-stamp');
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
      flags.logisticsDefeated = true;
      world.logisticsDefeated = true;
      boss.defeated = true;
      destroy(boss.blocker);
      visible(boss.hazard, false);
      syncVisuals(boss, boss.framework.snapshot());
      return boss.framework.defeat({ reason: reason || 'defeat' });
    };

    boss.debugDefeat = function(){
      var guard = 0;
      var snapshot = boss.framework.snapshot();
      while (!snapshot.defeated && snapshot.phaseId !== 'ledger' && guard < 80) {
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
    world.logisticsBoss = boss;
    listenForActions(boss);
    syncVisuals(boss, boss.framework.snapshot());
    return boss;
  }

  ns.bosses.registerLogisticsReceipt = registerReceipt;
  ns.bosses.spawnLogistics = spawnLogistics;
})(CEHP);
CEHP._register('66_post_boss_logistics');
