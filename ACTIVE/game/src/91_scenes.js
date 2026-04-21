/* ================================================================
   MODULE: 91_SCENES
   Phaser scenes: Boot, Play, Overlay, Receipt.
   Week 1 runtime routes directly into the throwaway test room.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var scenes = [];

  function queryValue(search, key){
    search = search || '';
    var q = search.indexOf('?');
    var query = q >= 0 ? search.slice(q + 1) : search;
    var parts = query.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] === key) return decodeURIComponent(kv[1] || '');
    }
    return '';
  }

  function drawGhosts(scene, area, pathA, pathB){
    var g = scene.add.graphics().setDepth(3);
    var compare = ns.Appeals.compare({ frames: pathA || [], receipt: {} }, { frames: pathB || [], receipt: {} });
    var bounds = compare.bounds;
    var width = Math.max(1, bounds.maxX - bounds.minX);
    var height = Math.max(1, bounds.maxY - bounds.minY);

    function drawPath(path, color){
      if (!path || path.length < 2) return;
      g.lineStyle(2, color, 0.9);
      g.beginPath();
      for (var i = 0; i < path.length; i++) {
        var px = area.x + ((path[i][1] - bounds.minX) / width) * area.w;
        var py = area.y + ((path[i][2] - bounds.minY) / height) * area.h;
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.strokePath();
    }

    drawPath(pathA, 0xf7c948);
    drawPath(pathB, 0x67a7d9);
  }

  function isThermal(search){
    if (ns.Receipts && ns.Receipts.isThermalSearch) return ns.Receipts.isThermalSearch(search);
    return queryValue(search, 'thermal') === '1';
  }

  function addReceiptCard(scene, keyBase, receipt, opts){
    var textureKey = keyBase + '-' + ((ns._receiptTextureSeq = (ns._receiptTextureSeq || 0) + 1));
    var canvas = ns.ReceiptRender.render(receipt, {
      worldId: opts.worldId,
      thermal: !!opts.thermal,
      width: opts.width,
      height: opts.height
    });
    if (scene.textures.exists(textureKey)) scene.textures.remove(textureKey);
    scene.textures.addCanvas(textureKey, canvas);
    scene.events.once('shutdown', function(){
      if (scene.textures.exists(textureKey)) scene.textures.remove(textureKey);
    });
    return scene.add.image(opts.x, opts.y, textureKey).setOrigin(0.5).setDepth(opts.depth || 10);
  }

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function requestedWorld(search){
    var roomOverride = queryValue(search, 'room');
    var worldOverride = queryValue(search, 'world');
    if (roomOverride === 'test') return 'test';
    if (worldOverride === 'rasta') return 'rasta';
    if (worldOverride === 'benefits') return 'benefits';
    return 'orientation';
  }

  function runtimeFor(worldId){
    if (worldId === 'rasta' && ns.WorldRasta) return ns.WorldRasta;
    if (worldId === 'benefits' && ns.WorldBenefits) return ns.WorldBenefits;
    if (worldId === 'orientation' && ns.WorldOrientation) return ns.WorldOrientation;
    return null;
  }

  if (typeof Phaser !== 'undefined') {
    var BootScene = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function BootScene(){ Phaser.Scene.call(this, { key: 'Boot' }); },
      create: function(){
        var w = ns.GAME_W;
        var h = ns.GAME_H;
        this.cameras.main.setBackgroundColor('#0b0d12');
        this.add.text(w / 2, h / 2 - 32, 'COUNTERFEIT EDUCATIONAL', {
          fontFamily: 'monospace', fontSize: '16px', color: '#f7c948'
        }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 - 8, 'CASE INTAKE', {
          fontFamily: 'monospace', fontSize: '10px', color: '#88aacc'
        }).setOrigin(0.5);
        this.add.text(w / 2, h / 2 + 16, 'RULESET ' + (ns.RULESET || 'R2') + '   BUILD ' + (ns.VERSION || ''), {
          fontFamily: 'monospace', fontSize: '8px', color: '#556677'
        }).setOrigin(0.5);
        this.time.delayedCall(140, function(){
          this.scene.start('Play');
        }, [], this);
      }
    });

    var PlayScene = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function PlayScene(){ Phaser.Scene.call(this, { key: 'Play' }); },
      init: function(data){
        this._seedOverride = data && data.caseSeed ? data.caseSeed : '';
      },
      create: function(){
        var search = typeof location !== 'undefined' ? location.search : '';
        var parsed = !this._seedOverride && ns.CaseSeed && typeof location !== 'undefined' ? ns.CaseSeed.fromURL(location.search) : null;
        var worldId = requestedWorld(search);
        var roomOverride = queryValue(search, 'room');
        var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get(worldId === 'test' ? 'orientation' : worldId) : null;
        var runtime = runtimeFor(worldId);
        var currentSave = ns.SAVE && ns.SAVE.boot ? ns.SAVE.boot() : null;
        var assistMode = ns.SAVE && ns.SAVE.assistMode ? ns.SAVE.assistMode(currentSave) : {};
        var assistTuning = ns.SAVE && ns.SAVE.assistTuning ? ns.SAVE.assistTuning(assistMode) : {};
        var caseSeed = this._seedOverride || (parsed ? parsed.raw : (ns.CaseSeed ? ns.CaseSeed.make({
          date: new Date(Date.UTC(2026, 3, 20)),
          counter: 1,
          axis: 'CURIOSITY'
        }) : 'CASE-20260420-001-CURIOSITY-R2'));

        ns.Axes.reset();
        if (ns.Metrics && ns.Metrics.reset) ns.Metrics.reset();
        ns.Input.bind(this);

        ns.RunState = {
          caseSeed: caseSeed,
          roomId: roomOverride === 'test' ? 'test-room' : (manifest && manifest.rooms && manifest.rooms[0] ? manifest.rooms[0].id : 'intake'),
          worldId: worldId === 'test' ? 'orientation' : worldId,
          worldFlags: manifest || {},
          renderFlags: { thermal: isThermal(search) },
          assistMode: assistMode,
          assistTuning: assistTuning,
          receipt: null,
          deaths: 0,
          runs: currentSave && currentSave.runs ? currentSave.runs : 0,
          ui: ns.UI.makeState(null),
          appealBaseline: ns.Appeals && ns.Appeals.fromURL ? ns.Appeals.fromURL(typeof location !== 'undefined' ? location.search : '') : null,
          comparison: null,
          cigarette: null,
          receiptFlags: { uninsuredVeteran:false, premiumSecured:false },
          worldStats: {
            premiumsCollected: 0,
            premiumRoomsCleared: 0,
            deductibleHits: 0,
            jumpPenalty: 0,
            occlusionUntil: 0
          },
          roomOrder: [],
          actionsLearned: []
        };
        ns.RunState.ui.runState = ns.RunState;
        this._assistMode = assistMode;
        this._assistTuning = assistTuning;

        this.runStartMs = this.time.now;
        this.recorder = new ns.Appeals.Recorder();
        this.room = roomOverride === 'test' || !runtime || !runtime.create
          ? ns.TestRoom.create(this, ns.RunState)
          : runtime.create(this, ns.RunState);
        this.player = this.room.player;
        this.pendingDeath = null;
        this.runComplete = false;

        ns.FX.attach(this);
        ns.FX.setMood(ns.RunState.worldId || 'orientation');
        ns.Audio.stop();

        var sceneRef = this;
        this.events.once('shutdown', function(){
          ns.Audio.stop();
          var destroyRuntime = runtimeFor(sceneRef.room && sceneRef.room.worldId ? sceneRef.room.worldId : '');
          if (sceneRef.room && destroyRuntime && destroyRuntime.destroy) {
            destroyRuntime.destroy(sceneRef.room);
          }
        });

        if (this.scene.isActive('Overlay')) this.scene.stop('Overlay');
        this.scene.launch('Overlay', { runState: ns.RunState });
        this.scene.bringToTop('Overlay');

        if (this.time) this.time.timeScale = assistTuning.timeScale || 1;
        if (this.physics && this.physics.world) this.physics.world.timeScale = assistTuning.physicsTimeScale || 1;

        this.cameras.main.startFollow(this.player, true, assistTuning.cameraLerp || 0.12, assistTuning.cameraLerp || 0.12);

        this.player.takeHit = function(source){
          if (this.pendingDeath || this.runComplete) return;
          this.queueDeath(source || 'hazard');
        }.bind(this);

        this.input.keyboard.once('keydown', function(){
          ns.Audio.start(ns.RunState.worldId);
        });
        this.input.once('pointerdown', function(){
          ns.Audio.start(ns.RunState.worldId);
        });

        ns.Debug = ns.Debug || {};
        ns.Debug.runStyle = function(style){
          var play = ns._game && ns._game.scene && ns._game.scene.getScene ? ns._game.scene.getScene('Play') : null;
          if (!play || !play.runStyle) return null;
          return play.runStyle(style);
        };
      },
      queueDeath: function(source){
        var death = ns.FX.noteDeath(this, this.time.now);
        this.pendingDeath = {
          source: source,
          respawnAt: this.time.now + 250,
          iframesMs: death.iframesMs
        };
        ns.RunState.deaths += 1;
        if (ns.Events && ns.Events.emit) ns.Events.emit('player:death', { source: source });
      },
      completeRun: function(reason){
        if (this.runComplete) return;
        this.runComplete = true;

        if (ns.Events && ns.Events.emit) ns.Events.emit('run:complete', { reason: reason || 'goal' });

        var snapshot = ns.Axes.snapshot();
        var frames = this.recorder.dump();
        var receipt = ns.Receipts.generate({
          seed: ns.RunState.caseSeed,
          axes: snapshot,
          tensions: ns.Axes.tensions(),
          worldId: ns.RunState.worldId,
          flags: ns.RunState.receiptFlags || {},
          cigaretteLit: !(ns.RunState.worldFlags && ns.RunState.worldFlags.cigaretteWillNotLight)
        });
        var current = { receipt: receipt, frames: frames };
        var compare = ns.RunState.appealBaseline ? ns.Appeals.compare(ns.RunState.appealBaseline, current) : null;

        ns.RunState.receipt = receipt;
        ns.RunState.appealPayload = ns.Appeals.encode(current);
        ns.RunState.comparison = compare;
        if (ns.Docket && ns.Docket.currentWeekSeed && ns.Docket.recordReceipt && ns.RunState.caseSeed === ns.Docket.currentWeekSeed()) {
          var docketWeek = ns.Docket.weekInfo(ns.Docket._now ? ns.Docket._now() : new Date());
          ns.Docket.recordReceipt({
            year: docketWeek.year,
            isoWeek: docketWeek.isoWeek,
            seed: ns.RunState.caseSeed,
            worldId: ns.RunState.worldId,
            lines: receipt.lines,
            fragmentIds: receipt.fragmentIds,
            flags: ns.RunState.receiptFlags || {},
            ts: Date.now()
          });
        }

        this.scene.stop('Overlay');
        ns.Audio.stop();
        this.scene.start('Receipt', {
          runState: ns.RunState,
          current: current,
          baseline: ns.RunState.appealBaseline
        });
      },
      runStyle: function(style){
        var runtime = runtimeFor(this.room && this.room.worldId ? this.room.worldId : '');
        if (this.room && runtime && runtime.runStyle) {
          return runtime.runStyle(this.room, this, style);
        }

        if (this.runComplete && ns.RunState && ns.RunState.receipt) {
          return {
            receipt: clone(ns.RunState.receipt),
            axes: ns.Axes.snapshot(),
            frames: this.recorder.dump(),
            contradictionOutcome: this.room.contradictionOutcome || ''
          };
        }

        style = style || 'obedient';
        ns.Axes.reset();
        if (ns.Metrics && ns.Metrics.reset) ns.Metrics.reset();
        this.recorder.clear();
        this.runStartMs = this.time.now;
        this.pendingDeath = null;
        this.runComplete = false;
        this.room.contradictionOutcome = '';
        this.player.invulnMs = 0;
        ns.Movement.respawn(this.player);

        this.room.sign.peek({ signId: this.room.sign.id, words: 3 });
        this.room.sign.read({ signId: this.room.sign.id, words: 3 });
        this.room.bridge.activate(this.player);
        this.room.trampoline.activate(this.player);

        if (style === 'obedient') {
          this.room.gate.evaluate({ action: 'wait', elapsedMs: 900 });
          if (ns.Events && ns.Events.emit) {
            ns.Events.emit('movement:jump', { x: 120, y: 340 });
            ns.Events.emit('movement:glide', { x: 760, y: 240 });
            ns.Events.emit('music:sync', { x: 1410, y: 360 });
          }
          this.recorder.mark(0, 72, 396, 1);
          this.recorder.mark(320, 340, 396, 1);
          this.recorder.mark(640, 760, 396, 1);
          this.recorder.mark(980, 1120, 300, 1);
          this.recorder.mark(1320, 1450, 248, 1);
          this.recorder.mark(1660, 1880, 150, 1);
        } else {
          this.room.gate.evaluate({ action: 'jump', elapsedMs: 120 });
          if (ns.Events && ns.Events.emit) {
            ns.Events.emit('movement:jump', { x: 120, y: 340 });
            ns.Events.emit('movement:kick', { x: 660, y: 392 });
            ns.Events.emit('movement:spinDash', { x: 840, y: 392, tier: 3 });
            ns.Events.emit('movement:backtrack', { distance: 32, x: 820, y: 392 });
            ns.Events.emit('movement:punch', { x: 1120, y: 392 });
            ns.Events.emit('movement:nearMiss', { x: 1115, y: 392 });
          }
          this.recorder.mark(0, 72, 396, 1);
          this.recorder.mark(260, 380, 396, 1);
          this.recorder.mark(520, 720, 396, 1);
          this.recorder.mark(760, 1080, 396, 1);
          this.recorder.mark(980, 1440, 396, 1);
          this.recorder.mark(1240, 1820, 378, 1);
        }

        this.completeRun('debug:' + style);

        return {
          receipt: clone(ns.RunState.receipt),
          axes: clone(ns.Axes.snapshot()),
          frames: clone(this.recorder.dump()),
          contradictionOutcome: this.room.contradictionOutcome || ''
        };
      },
      update: function(time, delta){
        ns.Input.update();

        if (ns.Input.justPressed('pause')) {
          if (ns.RunState.ui.open) ns.UI.back(ns.RunState.ui);
          else ns.UI.openClipboard(ns.RunState.ui);
        }

        if (!this.runComplete && !ns.RunState.ui.open && !this.pendingDeath) {
          ns.Movement.apply(this.player, ns.Input, delta);
        } else if (ns.RunState.ui.open || this.pendingDeath) {
          this.player.body.setVelocityX(0);
        }

        if (this.pendingDeath && time >= this.pendingDeath.respawnAt) {
          ns.Movement.respawn(this.player);
          this.player.invulnMs = this.pendingDeath.iframesMs;
          this.pendingDeath = null;
          if (ns.Events && ns.Events.emit) ns.Events.emit('player:respawn', { x: this.player.x, y: this.player.y });
        }

        if (!this.pendingDeath && this.player.y > ns.GAME_H + 120) {
          this.queueDeath('pit');
        }

        if (this.room && this.room.id === 'orientation-world' && ns.WorldOrientation && ns.WorldOrientation.update) {
          ns.WorldOrientation.update(this, delta);
        } else if (this.room && this.room.id === 'rasta-world' && ns.WorldRasta && ns.WorldRasta.update) {
          ns.WorldRasta.update(this, delta);
        } else if (this.room && this.room.id === 'benefits-world' && ns.WorldBenefits && ns.WorldBenefits.update) {
          ns.WorldBenefits.update(this, delta);
        } else if (ns.TestRoom && ns.TestRoom.update) {
          ns.TestRoom.update(this, delta);
        }

        if (!this.runComplete) {
          this.recorder.sample(time - this.runStartMs, this.player.x, this.player.y, this.player.facing || 1);
        }

        var moving = Math.abs(this.player.body.velocity.x) > 4 || Math.abs(this.player.body.velocity.y) > 4;
        if (ns.Metrics && ns.Metrics.tick) {
          ns.Metrics.tick(delta, {
            moving: moving,
            x: this.player.x,
            y: this.player.y,
            facing: this.player.facing || 1
          });
        }

        var snapshot = ns.Axes.snapshot();
        ns.FX.setAxes(snapshot);
        ns.FX.update(this, ns.RunState, delta);
        if (ns.Audio.isRunning()) ns.Audio.updateFromAxes(snapshot, { worldId: ns.RunState.worldId });
      }
    });

    var OverlayScene = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function OverlayScene(){ Phaser.Scene.call(this, { key: 'Overlay' }); },
      create: function(data){
        this.runState = data && data.runState ? data.runState : ns.RunState;
        this.bg = this.add.rectangle(ns.GAME_W / 2, ns.GAME_H / 2, ns.GAME_W, ns.GAME_H, 0x05070a, 0.82)
          .setScrollFactor(0)
          .setDepth(120)
          .setVisible(false);
        this.txt = this.add.text(24, 24, '', {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#e8e3d1',
          lineSpacing: 8
        }).setScrollFactor(0).setDepth(121).setVisible(false);
      },
      update: function(){
        var state = this.runState && this.runState.ui ? this.runState.ui : null;
        if (!state || !state.open) {
          this.bg.setVisible(false);
          this.txt.setVisible(false);
          return;
        }

        this.bg.setVisible(true);
        this.txt.setVisible(true);

        if (ns.Input.justPressed('menuUp')) ns.UI.move(state, -1);
        if (ns.Input.justPressed('menuDown')) ns.UI.move(state, 1);
        if (ns.Input.justPressed('confirm')) ns.UI.activate(state);
        if (ns.Input.justPressed('back')) ns.UI.back(state);

        this.txt.setText(ns.UI.lines(state).join('\n'));
      }
    });

    var ReceiptScene = new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function ReceiptScene(){ Phaser.Scene.call(this, { key: 'Receipt' }); },
      create: function(data){
        var runState = data && data.runState ? data.runState : ns.RunState;
        var current = data && data.current ? data.current : null;
        var baseline = data && data.baseline ? data.baseline : null;
        var compare = baseline ? ns.Appeals.compare(baseline, current) : null;
        var w = ns.GAME_W;
        var h = ns.GAME_H;
        var thermal = !!(runState && runState.renderFlags && runState.renderFlags.thermal);

        this.cameras.main.setBackgroundColor('#f5f0df');
        this.add.rectangle(w / 2, h / 2, w, h, thermal ? 0xefe3c6 : 0xf5f0df, 1);

        if (baseline) {
          this.add.text(30, 68, 'PREVIOUS CASE', {
            fontFamily: 'monospace', fontSize: '8px', color: '#5a4a36'
          });
          this.add.text(w / 2 + 10, 68, 'CURRENT CASE', {
            fontFamily: 'monospace', fontSize: '8px', color: '#5a4a36'
          });
          addReceiptCard(this, 'receipt-prev', baseline.receipt, {
            x: 134,
            y: 170,
            width: 188,
            height: 235,
            thermal: thermal,
            worldId: runState.worldId
          });
          addReceiptCard(this, 'receipt-current', current.receipt, {
            x: 378,
            y: 170,
            width: 188,
            height: 235,
            thermal: thermal,
            worldId: runState.worldId
          });
          this.add.text(30, 184, 'COMPARE', {
            fontFamily: 'monospace', fontSize: '8px', color: '#5a4a36'
          });
          drawGhosts(this, { x: 30, y: 198, w: w - 60, h: 110 }, baseline.frames, current.frames);
          this.add.text(30, 318, 'DELTA ' + JSON.stringify(compare.axisDelta), {
            fontFamily: 'monospace', fontSize: '7px', color: '#4c4133', wordWrap: { width: w - 60 }
          });
        } else if (current) {
          addReceiptCard(this, 'receipt-single', current.receipt, {
            x: w / 2,
            y: 192,
            width: 286,
            height: 358,
            thermal: thermal,
            worldId: runState.worldId
          });
        }

        this.add.text(30, h - 28, 'ENTER TO REFILE', {
          fontFamily: 'monospace', fontSize: '8px', color: '#5a4a36'
        });

        this.input.keyboard.once('keydown-ENTER', function(){
          this.scene.start('Play', { caseSeed: runState.caseSeed });
        }, this);
      }
    });

    scenes.push(BootScene, PlayScene, OverlayScene, ReceiptScene);
  }

  ns.Scenes = {
    list: function(){ return scenes; },
    add:  function(sc){ scenes.push(sc); }
  };
})(CEHP);
CEHP._register('91_scenes');
