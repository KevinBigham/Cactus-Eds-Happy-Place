import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

var gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
var srcDir = path.join(gameDir, 'src');

var HERO_ANIM_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '89_ed_perform.js',
  '89A_ed_anim.js'
];

function buildSandbox() {
  var sandbox = {
    console: console,
    Math: Math,
    JSON: JSON,
    window: null,
    document: {
      readyState: 'loading',
      getElementById: function() {
        return null;
      }
    }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  return sandbox;
}

function loadModules(files) {
  var sandbox = buildSandbox();
  var source = files.map(function(file) {
    var filePath = path.join(srcDir, file);
    assert.equal(fs.existsSync(filePath), true, file + ' should exist');
    return fs.readFileSync(filePath, 'utf8');
  }).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox.CEHP;
}

function makeVisualNode() {
  return {
    alpha: 1,
    tint: 0xffffff,
    scaleX: 1,
    scaleY: 1,
    setAlpha: function(value) {
      this.alpha = value;
      return this;
    },
    setTint: function(value) {
      this.tint = value;
      return this;
    },
    clearTint: function() {
      this.tint = 0xffffff;
      return this;
    }
  };
}

function makeScene(assistMode) {
  var scene = {
    tweenConfigs: [],
    _assistMode: assistMode || {},
    events: {
      once: function() {}
    },
    tweens: {
      add: function(config) {
        scene.tweenConfigs.push(config);
        if (config.onStart) config.onStart();
        return {
          stop: function() {},
          remove: function() {}
        };
      },
      killTweensOf: function() {}
    }
  };
  return scene;
}

function installLayer(CEHP, scene, actor) {
  CEHP.Ed.prime(scene, { seed: 'CASE-ART3-HERO' });
  scene._cehpEd.actors.push(actor);
}

test('ART3 hero hurt-flash starts on damage event and restores tint within 200ms', function() {
  var CEHP = loadModules(HERO_ANIM_MODULES);
  var scene = makeScene({});
  var bodyImage = makeVisualNode();
  var actor = {
    scene: scene,
    active: true,
    _cehpBodyImage: bodyImage
  };

  installLayer(CEHP, scene, actor);
  CEHP.Events.emit('player:death', { actor: actor });

  assert.equal(scene.tweenConfigs.length, 1);
  assert.equal(bodyImage.tint, 0xff4040);
  assert.ok(scene.tweenConfigs[0].duration <= 200);

  scene.tweenConfigs[0].onComplete();

  assert.equal(bodyImage.tint, 0xffffff);
  assert.equal(bodyImage.alpha, 1);
});

test('ART3 hero hurt-flash dampens alpha pulse when reduceFlash is enabled', function() {
  var CEHP = loadModules(HERO_ANIM_MODULES);
  var scene = makeScene({ reduceFlash: true });
  var bodyImage = makeVisualNode();
  var actor = {
    scene: scene,
    active: true,
    _cehpBodyImage: bodyImage
  };

  installLayer(CEHP, scene, actor);
  CEHP.Events.emit('player:death', { actor: actor });

  assert.equal(scene.tweenConfigs.length, 1);
  assert.ok(scene.tweenConfigs[0].alpha >= 0.72);
});

test('ART3 hero idle breathing resets visual scale within one frame of movement', function() {
  var CEHP = loadModules(HERO_ANIM_MODULES);
  var scene = makeScene({});
  var bodyImage = makeVisualNode();
  var actor = {
    scene: scene,
    active: true,
    _cehpBodyImage: bodyImage,
    _cehpState: { current: 'idle' },
    body: {
      velocity: { x: 0, y: 0 },
      blocked: { down: true },
      touching: { down: true }
    }
  };

  CEHP.EdAnim.updateIdleBreathing(actor, 16);

  assert.equal(scene.tweenConfigs.length, 1);
  assert.equal(scene.tweenConfigs[0].y, 1.02);
  assert.equal(scene.tweenConfigs[0].repeat, -1);

  actor._cehpArt3IdleState.y = 1.02;
  scene.tweenConfigs[0].onUpdate();
  assert.equal(Number(bodyImage.scaleY.toFixed(2)), 1.02);

  actor.body.velocity.x = 90;
  CEHP.EdAnim.updateIdleBreathing(actor, 16);

  assert.equal(Number(bodyImage.scaleY.toFixed(2)), 1);
  assert.equal(actor._cehpArt3IdleTween, null);
});
