import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

var gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
var srcDir = path.join(gameDir, 'src');

var BOSS_ANIM_MODULES = [
  '00_index.js',
  '66B_post_boss_anim.js'
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

function makeScene(assistMode) {
  var scene = {
    _assistMode: assistMode || {},
    tweenConfigs: [],
    tweens: {
      add: function(config) {
        scene.tweenConfigs.push(config);
        return {
          stop: function() {},
          remove: function() {}
        };
      }
    }
  };
  return scene;
}

function makeSprite() {
  return {
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    setScale: function(x, y) {
      this.scaleX = x;
      this.scaleY = y;
      return this;
    }
  };
}

function makeBoss(id, scene, snapshots) {
  return {
    id: id,
    scene: scene,
    sprite: makeSprite(),
    hazard: { width: 100, height: 20 },
    defeated: false,
    update: function() {
      return snapshots.shift();
    },
    snapshot: function() {
      return snapshots[0] || { bossId: id, state: 'idle', phaseId: 'idle', timerMs: 0 };
    }
  };
}

test('ART3 boss tells start in telegraph and complete before the attack window', function() {
  var CEHP = loadModules(BOSS_ANIM_MODULES);
  var scene = makeScene({});
  var cases = [
    { id: 'supervisor', phaseId: 'stamp', prop: 'angle', value: 8 },
    { id: 'enrollment', phaseId: 'denial', prop: 'scaleX', value: 1.1 },
    { id: 'logistics', phaseId: 'ledger', prop: 'angle', value: 10 }
  ];
  var i;
  var boss;
  var config;

  for (i = 0; i < cases.length; i++) {
    scene.tweenConfigs = [];
    boss = makeBoss(cases[i].id, scene, [
      { bossId: cases[i].id, state: 'telegraph', phaseId: cases[i].phaseId, timerMs: 280 },
      { bossId: cases[i].id, state: 'strike', phaseId: cases[i].phaseId, timerMs: 90 }
    ]);
    CEHP.bosses.wrapAnimBoss(boss);
    boss.update(16);
    config = scene.tweenConfigs[0];

    assert.equal(config.targets, boss.sprite);
    assert.equal(config[cases[i].prop], cases[i].value);
    assert.ok(config.duration * (config.repeat + 1) <= 150);
    assert.ok(boss._cehpArt3TellLeadMs >= 250);
    assert.equal(boss.hazard.width, 100);
    assert.equal(boss.hazard.height, 20);

    boss.update(280);
    assert.equal(scene.tweenConfigs.length, 1);
  }
});

test('ART3 boss tells honor reduceShake by dampening amplitude', function() {
  var CEHP = loadModules(BOSS_ANIM_MODULES);
  var scene = makeScene({ reduceShake: true });
  var boss = makeBoss('logistics', scene, [
    { bossId: 'logistics', state: 'telegraph', phaseId: 'ledger', timerMs: 280 }
  ]);

  CEHP.bosses.wrapAnimBoss(boss);
  boss.update(16);

  assert.equal(scene.tweenConfigs.length, 1);
  assert.equal(scene.tweenConfigs[0].angle, 3);
});
