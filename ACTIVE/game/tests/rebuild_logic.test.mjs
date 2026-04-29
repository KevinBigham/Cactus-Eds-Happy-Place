import test from 'node:test';
import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const gameDir = path.resolve('/Users/tkevinbigham/Projects/CEHP/ACTIVE/game');
const srcDir = path.join(gameDir, 'src');

function buildSandbox(extra) {
  const store = {};
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };

  const sandbox = {
    console,
    Math,
    Date,
    JSON,
    localStorage,
    location: { search: '' },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  };
  Object.assign(sandbox, extra || {});
  if (!sandbox.window) sandbox.window = sandbox;
  if (!sandbox.document) sandbox.document = {
    readyState: 'loading',
    getElementById() {
      return null;
    }
  };

  vm.createContext(sandbox);
  return sandbox;
}

function loadSandbox(files, extra) {
  const sandbox = buildSandbox(extra);
  const source = files.map(function(file) {
    return fs.readFileSync(path.join(srcDir, file), 'utf8');
  }).join('\n');
  vm.runInContext(source, sandbox);
  return sandbox;
}

function loadModules(files, extra) {
  return loadSandbox(files, extra).CEHP;
}

const LOGIC_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '04_save.js',
  '05_caseseed.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js',
  '10_axes.js',
  '11_metrics.js',
  '70_worlds.js',
  '71_world_orientation.js',
  '72_world_benefits.js',
  '73_world_rasta.js',
  '51_contradiction.js',
  '80_receipts.js',
  '81_docket.js',
  '82_appeals.js'
];

const SAVE_MODULES = [
  '00_index.js',
  '01_const.js',
  '04_save.js'
];

const APPEALS_REPLAY_MODULES = [
  '00_index.js',
  '01_const.js',
  '82_appeals.js'
];

function plain(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function makeStorage(seed) {
  const store = Object.assign({}, seed || {});
  return {
    _store: store,
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };
}

const LENS_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '85_lens.js'
];

const LIGHT_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '86_light.js'
];

const PROP_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '87_props.js'
];

const FEEL_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '88_feel.js'
];

const ED_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '89_ed_perform.js'
];

const AIR_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '8A_air.js'
];

const SCENE_MODULES = [
  '00_index.js',
  '80_receipts.js',
  '91_scenes.js'
];

const FIXED_STEP_SCENE_MODULES = [
  '00_index.js',
  '03_events.js',
  '04_fixed_step.js',
  '80_receipts.js',
  '91_scenes.js'
];

const FORMS_MODULES = [
  '00_index.js',
  '50_forms.js'
];

const AUDIO_MODULES = [
  '00_index.js',
  '03_events.js',
  '30_audio.js'
];

function makeFakeAudioEnvironment() {
  const contexts = [];

  function makeParam(value) {
    return {
      value,
      events: [],
      setValueAtTime(next, time) {
        this.value = next;
        this.events.push({ kind: 'set', value: next, time });
      },
      linearRampToValueAtTime(next, time) {
        this.value = next;
        this.events.push({ kind: 'linear', value: next, time });
      },
      exponentialRampToValueAtTime(next, time) {
        this.value = next;
        this.events.push({ kind: 'exponential', value: next, time });
      },
      cancelScheduledValues(time) {
        this.events.push({ kind: 'cancel', time });
      }
    };
  }

  function connectable(node) {
    node.connections = [];
    node.disconnects = 0;
    node.connect = function(target) {
      this.connections.push(target);
      return target;
    };
    node.disconnect = function() {
      this.disconnects += 1;
    };
    return node;
  }

  function FakeAudioContext() {
    this.currentTime = 12;
    this.state = 'running';
    this.destination = connectable({ kind: 'destination' });
    this.oscillators = [];
    this.gains = [];
    this.filters = [];
    this.resumes = 0;
    contexts.push(this);
  }

  FakeAudioContext.prototype.createGain = function() {
    const gain = connectable({ kind: 'gain', gain: makeParam(1) });
    this.gains.push(gain);
    return gain;
  };

  FakeAudioContext.prototype.createBiquadFilter = function() {
    const filter = connectable({
      kind: 'filter',
      type: 'lowpass',
      frequency: makeParam(0),
      Q: makeParam(0)
    });
    this.filters.push(filter);
    return filter;
  };

  FakeAudioContext.prototype.createOscillator = function() {
    const oscillator = connectable({
      kind: 'oscillator',
      type: 'sine',
      frequency: makeParam(0),
      starts: [],
      stops: [],
      start(when) {
        this.starts.push(when == null ? null : when);
      },
      stop(when) {
        this.stops.push(when == null ? null : when);
      }
    });
    this.oscillators.push(oscillator);
    return oscillator;
  };

  FakeAudioContext.prototype.resume = function() {
    this.resumes += 1;
  };

  return {
    contexts,
    extra: {
      AudioContext: FakeAudioContext,
      webkitAudioContext: FakeAudioContext,
      matchMedia: function() {
        return { matches: false };
      }
    }
  };
}

const STATE_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js'
];

const STATE_RUNTIME_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js',
  '20_input.js',
  '21_movement.js'
];

test('phase 1 fixed step chunks dt into deterministic 60hz frames', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  let i;

  assert.equal(typeof CEHP.FixedStep, 'object');

  function run(dtValues) {
    const state = CEHP.FixedStep.create();
    const frames = [];
    const results = [];
    for (i = 0; i < dtValues.length; i++) {
      results.push(CEHP.FixedStep.advance(state, dtValues[i], function(frame, stepMs) {
        frames.push({ frame, stepMs });
      }));
    }
    return { state, frames, results };
  }

  const first = run([16.6666666667, 40, -5, 200]);
  const second = run([16.6666666667, 40, -5, 200]);

  assert.deepEqual(first.frames, second.frames);
  assert.deepEqual(first.results, second.results);
  assert.equal(first.state.frame, 8);
  assert.equal(first.results[2].steps, 0);
  assert.ok(first.results[3].droppedMs > 0);
  assert.ok(first.state.alpha >= 0 && first.state.alpha < 1);
});

test('phase 1 input buffer ages and consumes entries by frame count deterministically', () => {
  const CEHP = loadModules(LOGIC_MODULES);

  assert.equal(typeof CEHP.InputBuffer, 'object');

  function run() {
    const buffer = CEHP.InputBuffer.create({ capacity: 3 });
    CEHP.InputBuffer.push(buffer, 'jump', 10, { source: 'early' });
    CEHP.InputBuffer.push(buffer, 'dash', 11, { source: 'mid' });
    CEHP.InputBuffer.push(buffer, 'jump', 12, { source: 'late' });
    CEHP.InputBuffer.push(buffer, 'jump', 13, { source: 'latest' });
    return {
      peekBefore: CEHP.InputBuffer.peek(buffer, 'jump', 14, 4),
      consume: CEHP.InputBuffer.consume(buffer, 'jump', 14, 4),
      peekAfterConsume: CEHP.InputBuffer.peek(buffer, 'jump', 14, 4),
      pruned: CEHP.InputBuffer.prune(buffer, 18, 3),
      clearCount: CEHP.InputBuffer.clear(buffer, 'dash'),
      entries: JSON.parse(JSON.stringify(buffer.entries))
    };
  }

  const first = run();
  const second = run();

  assert.deepEqual(first, second);
  assert.equal(first.peekBefore.meta.source, 'late');
  assert.equal(first.consume.meta.source, 'late');
  assert.equal(first.peekAfterConsume.meta.source, 'latest');
  assert.equal(first.pruned, 2);
  assert.equal(first.clearCount, 0);
  assert.equal(first.entries.length, 0);
});

test('phase 1 cancel matrix exposes cloned rules without leaking live references', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const jumpRuleA = CEHP.CancelMatrix && CEHP.CancelMatrix.get ? CEHP.CancelMatrix.get('idle', 'jump') : null;
  const jumpRuleB = CEHP.CancelMatrix && CEHP.CancelMatrix.get ? CEHP.CancelMatrix.get('idle', 'jump') : null;
  const allRules = CEHP.CancelMatrix && CEHP.CancelMatrix.rules ? CEHP.CancelMatrix.rules() : null;
  const plainRuleA = jumpRuleA ? JSON.parse(JSON.stringify(jumpRuleA)) : null;

  assert.equal(typeof CEHP.CancelMatrix, 'object');
  assert.deepEqual(plainRuleA, {
    toState: 'jumpRise',
    bufferFrames: 6,
    cooldownFrames: 0,
    window: { startFrame: 0, endFrame: -1 }
  });
  assert.equal(CEHP.CancelMatrix.has('wallSlide', 'jump'), true);
  assert.equal(CEHP.CancelMatrix.has('idle', 'wallJump'), false);
  jumpRuleA.window.startFrame = 99;
  assert.equal(jumpRuleB.window.startFrame, 0);
  allRules.idle.jump.toState = 'broken';
  assert.equal(CEHP.CancelMatrix.get('idle', 'jump').toState, 'jumpRise');
});

test('receipts expose stable fragment ids and diverge by behavior profile', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-20260420-001-CURIOSITY-R2';
  const compliantAxes = {
    primary: {
      compliance: 0.9,
      intuition: 0.2,
      curiosity: 0.2,
      grace: 0.3,
      chaos: 0.1,
      efficiency: 0.8
    },
    micro: { contradictionFollow: 2, contradictionDefy: 0, signPeeks: 1 }
  };
  const defiantAxes = {
    primary: {
      compliance: 0.1,
      intuition: 0.4,
      curiosity: 0.9,
      grace: 0.4,
      chaos: 0.8,
      efficiency: 0.2
    },
    micro: { contradictionFollow: 0, contradictionDefy: 2, signPeeks: 4 }
  };

  const receiptA = CEHP.Receipts.generate({ seed, axes: compliantAxes, tensions: { obedience: 0.8, style: 1.1, auditRisk: 0.0 } });
  const receiptB = CEHP.Receipts.generate({ seed, axes: defiantAxes, tensions: { obedience: -0.7, style: 0.6, auditRisk: 0.5 } });

  assert.equal(Array.isArray(receiptA.fragmentIds), true);
  assert.equal(receiptA.fragmentIds.length, 3);
  assert.equal(Array.isArray(receiptB.fragmentIds), true);
  assert.equal(receiptB.fragmentIds.length, 3);
  assert.notDeepEqual(receiptA.fragmentIds, receiptB.fragmentIds);
});

test('receipts register fragments into public pools through makeFragment', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const before = CEHP.Receipts.POOLS.VERDICTS.length;

  const fragment = CEHP.Receipts.registerFragment('VERDICTS', 'TEST_REGISTER_VERDICT', 'REGISTERED LINE.', {
    tone: 'benign',
    worlds: { benefits: 99 }
  });
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-20260427-001-COMPLIANCE-R2',
    axes: {
      primary: { compliance: 0, intuition: 0, curiosity: 0, grace: 0, chaos: 0, efficiency: 0 },
      micro: {}
    },
    tensions: { obedience: 0, style: 0, auditRisk: 0 },
    worldId: 'benefits'
  });

  assert.equal(CEHP.Receipts.POOLS.VERDICTS.length, before + 1);
  assert.equal(fragment.id, 'TEST_REGISTER_VERDICT');
  assert.equal(fragment.text, 'REGISTERED LINE.');
  assert.equal(receipt.fragmentIds[0], 'TEST_REGISTER_VERDICT');
});

test('W11 receipt fragments are registered verbatim with existing opts shape', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const fragments = [
    ['VERDICTS', 'W11_BENEFITS_VERDICT_ATRIUM_01', 'THE ATRIUM PRICED YOUR HESITATION.', { worlds: { benefits: 3.2 }, axes: { compliance: 0.5, intuition: 0.4 }, micro: { idleMs: 0.5 }, tone: 'benign' }],
    ['VERDICTS', 'W11_BENEFITS_VERDICT_NETWORK_01', 'THE NETWORK COUNTED YOUR SHOULDERS.', { worlds: { benefits: 3.1 }, axes: { grace: 0.5, efficiency: 0.3 }, micro: { nearMisses: 0.5 }, tone: 'benign' }],
    ['VERDICTS', 'W11_BENEFITS_VERDICT_AUTH_01', 'PREAUTHORIZATION MISTOOK DELAY FOR VALUE.', { worlds: { benefits: 3.1 }, flags: { premiumSecured: true }, axes: { compliance: 0.6 }, micro: { contradictionFollow: 0.6 }, tone: 'benign' }],
    ['TENSIONS', 'W11_BENEFITS_TENSION_BRANCH_01', 'EVERY BRANCH COST A DIFFERENT BODY.', { worlds: { benefits: 3.0 }, tensions: { auditRisk: 0.4, style: 0.2 }, micro: { modulesPassed: 0.4 } }],
    ['TENSIONS', 'W11_BENEFITS_TENSION_SLOW_01', 'THE CLAIM REWARDED LOWER VELOCITY.', { worlds: { benefits: 3.1 }, tensions: { obedience: 0.5 }, axes: { compliance: 0.4, intuition: 0.2 }, tone: 'benign' }],
    ['TENSIONS', 'W11_BENEFITS_TENSION_EXPOSED_01', 'YOUR EXPOSURE IMPROVED THE MARGIN.', { worlds: { benefits: 3.2 }, flags: { uninsuredVeteran: true }, tensions: { obedience: -0.6, auditRisk: 0.4 }, micro: { damageTaken: 0.6 } }],
    ['CLOSERS', 'W11_BENEFITS_CLOSER_PLAN_01', 'THE PLAN CLOSED WITHOUT LOOKING DOWN.', { worlds: { benefits: 3.2 }, flags: { premiumSecured: true }, axes: { compliance: 0.3 }, tone: 'benign' }],
    ['CLOSERS', 'W11_BENEFITS_CLOSER_BILLING_01', 'THE EXIT KEPT A BILLING ADDRESS.', { worlds: { benefits: 3.0 }, axes: { efficiency: 0.2, chaos: 0.2 } }],
    ['VERDICTS', 'W11_RASTA_VERDICT_BELT_01', 'THE BELT ACCEPTED YOUR STILLNESS.', { worlds: { rasta: 3.3 }, flags: { restOpened: true, cigaretteLit: false }, axes: { intuition: 0.5, grace: 0.3 }, micro: { musicSync: 0.5 }, tone: 'benign' }],
    ['TENSIONS', 'W11_RASTA_TENSION_DOOR_01', 'THE KIND DOOR REASSESSED URGENCY.', { worlds: { rasta: 3.2 }, flags: { rushedRest: true }, micro: { contradictionDefy: 0.6 }, axes: { intuition: 0.3 }, tone: 'benign' }],
    ['CLOSERS', 'W11_RASTA_CLOSER_FLOOR_01', 'THE FLOOR RELEASED YOUR BREATH.', { worlds: { rasta: 3.3 }, flags: { restOpened: true, cigaretteLit: false }, axes: { grace: 0.4 }, tone: 'benign' }],
    ['CLOSERS', 'W11_RASTA_CLOSER_NAME_01', 'SOFT MACHINES RETURNED YOUR NAME.', { worlds: { rasta: 3.1 }, flags: { rushedRest: true }, axes: { intuition: 0.3, grace: 0.2 }, tone: 'benign' }]
  ];

  fragments.forEach(function(entry) {
    const pool = CEHP.Receipts.POOLS[entry[0]];
    const fragment = pool.find(function(item) {
      return item.id === entry[1];
    });
    const opts = entry[3];

    assert.ok(fragment, 'missing ' + entry[1]);
    assert.equal(fragment.text, entry[2]);
    assert.equal(fragment.text.indexOf('!'), -1);
    assert.equal(fragment.text.split(/\s+/).length <= 8, true);
    assert.deepEqual(plain(fragment.worlds), opts.worlds || null);
    assert.deepEqual(plain(fragment.axes), opts.axes || null);
    assert.deepEqual(plain(fragment.tensions), opts.tensions || null);
    assert.deepEqual(plain(fragment.micro), opts.micro || null);
    assert.deepEqual(plain(fragment.flags), opts.flags || null);
    assert.equal(fragment.tone, opts.tone || null);
  });
});

test('W11 benefits rooms are in world order with voice-safe signs', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const rooms = CEHP.Worlds.MANIFEST.benefits.rooms;
  const expected = [
    {
      id: 'benefits-risk-atrium',
      contradictionSign: 'WAIT FOR COVERAGE TO NOTICE YOU',
      actionSigns: ['EVERY DOORWAY HAS TERMS', 'THE LOWER PLAN SAVES STAIRS']
    },
    {
      id: 'benefits-claim-window',
      actionSigns: ['FORMS BECOME SOLID AFTER REJECTION', 'PLEASE CROSS THE DENIED CLAIM']
    },
    {
      id: 'benefits-network-narrow',
      actionSigns: ['THE NETWORK PREFERS SMALLER MOTION', 'OUT OF NETWORK MEANS FLOOR']
    }
  ];

  expected.forEach(function(spec, index) {
    const room = rooms[index];

    assert.equal(room.id, spec.id);
    if (spec.contradictionSign) assert.equal(room.contradictionSign, spec.contradictionSign);
    assert.deepEqual(plain(room.actionSigns), spec.actionSigns);
    [room.contradictionSign].concat(room.actionSigns || []).filter(Boolean).forEach(function(line) {
      assert.equal(line.indexOf('!'), -1);
      assert.equal(line.split(/\s+/).length <= 8, true);
    });
  });
});

test('W11 rasta soft belt is in world order with voice-safe signs', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const rooms = CEHP.Worlds.MANIFEST.rasta.rooms;
  const room = rooms[rooms.length - 2];

  assert.equal(room.id, 'rasta-soft-belt');
  assert.equal(rooms[rooms.length - 1].id, 'warm-exit');
  assert.equal(room.contradictionSign, 'REST UNTIL THE BELT BELIEVES YOU');
  assert.deepEqual(plain(room.actionSigns), ['THE KIND DOOR HATES SPEED', 'NO FIRE IS ALSO COVERAGE']);
  [room.contradictionSign].concat(room.actionSigns || []).forEach(function(line) {
    assert.equal(line.indexOf('!'), -1);
    assert.equal(line.split(/\s+/).length <= 8, true);
  });
});

test('W11 benefits room insertion indexes stay pinned', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const rooms = CEHP.Worlds.MANIFEST.benefits.rooms.map(function(room) { return room.id; });

  assert.deepEqual(plain(rooms.slice(0, 3)), [
    'benefits-risk-atrium',
    'benefits-claim-window',
    'benefits-network-narrow'
  ]);
});

test('W11 rasta soft belt stays before warm exit', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const rooms = CEHP.Worlds.MANIFEST.rasta.rooms.map(function(room) { return room.id; });

  assert.equal(rooms.indexOf('rasta-soft-belt'), rooms.indexOf('warm-exit') - 1);
});

test('receipts score generic world flags for benefits routes', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-20260427-001-COMPLIANCE-R2';
  const axes = {
    primary: {
      compliance: 0.6,
      intuition: 0.3,
      curiosity: 0.4,
      grace: 0.3,
      chaos: 0.2,
      efficiency: 0.5
    },
    micro: {
      contradictionFollow: 2,
      modulesPassed: 5,
      modulesSkipped: 0
    }
  };
  const tensions = { obedience: 0.4, style: 0.8, auditRisk: 0.1 };

  const insured = CEHP.Receipts.generate({
    seed,
    axes,
    tensions,
    worldId: 'benefits',
    flags: { premiumSecured: true, uninsuredVeteran: false }
  });
  const uninsured = CEHP.Receipts.generate({
    seed,
    axes,
    tensions,
    worldId: 'benefits',
    flags: { premiumSecured: false, uninsuredVeteran: true }
  });

  assert.equal(Array.isArray(insured.fragmentIds), true);
  assert.equal(Array.isArray(uninsured.fragmentIds), true);
  assert.notDeepEqual(insured.fragmentIds, uninsured.fragmentIds);
});

test('W11 benefits atrium follow path sets premium flag and receipt branch', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const flags = { premiumSecured: false, uninsuredVeteran: false };
  const gate = CEHP.Contradiction.gate({
    sign: { id: 'benefits-risk-wait' },
    expectedBehavior: 'wait',
    windowMs: 900,
    onFollow: function() {
      flags.premiumSecured = true;
      return 'upper';
    },
    onDefy: function() {
      flags.uninsuredVeteran = true;
      return 'lower';
    }
  });

  CEHP.Axes.reset();
  CEHP.Events.emit('sign:read', { signId: 'benefits-risk-wait', words: 6 });
  gate.evaluate({ action: 'wait', elapsedMs: 920 });

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W11-BENEFITS-FOLLOW',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    worldId: 'benefits',
    flags
  });

  assert.equal(flags.premiumSecured, true);
  assert.equal(receipt.fragmentIds.includes('W11_BENEFITS_CLOSER_PLAN_01'), true, receipt.fragmentIds.join(', '));
});

test('W11 benefits atrium defy path sets uninsured flag and receipt branch', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const flags = { premiumSecured: false, uninsuredVeteran: false };
  const gate = CEHP.Contradiction.gate({
    sign: { id: 'benefits-risk-wait' },
    expectedBehavior: 'wait',
    windowMs: 900,
    onFollow: function() {
      flags.premiumSecured = true;
      return 'upper';
    },
    onDefy: function() {
      flags.uninsuredVeteran = true;
      return 'lower';
    }
  });

  CEHP.Axes.reset();
  CEHP.Events.emit('sign:read', { signId: 'benefits-risk-wait', words: 6 });
  gate.evaluate({ action: 'move', elapsedMs: 120 });
  CEHP.Events.emit('combat:damageTaken', { kind: 'blade', amount: 1 });

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W11-BENEFITS-DEFY',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    worldId: 'benefits',
    flags
  });

  assert.equal(flags.uninsuredVeteran, true);
  assert.equal(receipt.fragmentIds.includes('W11_BENEFITS_TENSION_EXPOSED_01'), true, receipt.fragmentIds.join(', '));
});

test('W11 rasta soft belt rest path keeps cigarette dark and receipt branch', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const flags = { restOpened: false, rushedRest: false, cigaretteLit: true };
  const worldFlags = { cigaretteWillNotLight: false };
  const gate = CEHP.Contradiction.gate({
    sign: { id: 'rasta-belt-rest' },
    expectedBehavior: 'wait',
    windowMs: 800,
    onFollow: function() {
      flags.restOpened = true;
      flags.cigaretteLit = false;
      worldFlags.cigaretteWillNotLight = true;
      return 'open';
    },
    onDefy: function() {
      flags.rushedRest = true;
      return 'loop';
    }
  });

  CEHP.Axes.reset();
  gate.evaluate({ action: 'wait', elapsedMs: 820 });
  CEHP.Events.emit('music:sync', { x: 720, y: 392 });

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W11-RASTA-REST',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    worldId: 'rasta',
    flags,
    cigaretteLit: !worldFlags.cigaretteWillNotLight
  });

  assert.equal(flags.restOpened, true);
  assert.equal(flags.cigaretteLit, false);
  assert.equal(receipt.cigaretteLit, false);
  assert.equal(receipt.fragmentIds.includes('W11_RASTA_VERDICT_BELT_01'), true, receipt.fragmentIds.join(', '));
});

test('W11 rasta rushed path does not receive rest-only verdict bias', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const flags = { restOpened: false, rushedRest: true, cigaretteLit: false };

  CEHP.Axes.reset();
  CEHP.Events.emit('contradiction:defy', { gateId: 'rasta-belt-rest', action: 'move', elapsedMs: 120 });

  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-W11-RASTA-RUSH',
    axes: CEHP.Axes.snapshot(),
    tensions: CEHP.Axes.tensions(),
    worldId: 'rasta',
    flags,
    cigaretteLit: false
  });

  assert.equal(receipt.fragmentIds.includes('W11_RASTA_VERDICT_BELT_01'), false, receipt.fragmentIds.join(', '));
  assert.equal(receipt.fragmentIds.includes('W11_RASTA_TENSION_DOOR_01'), true, receipt.fragmentIds.join(', '));
});

function matchingPathFragments(CEHP, poolName, pathSpec) {
  const required = pathSpec.flags || {};
  const requiredKeys = Object.keys(required);
  const pool = CEHP.Receipts.POOLS[poolName];

  return pool.filter(function(fragment) {
    const flags = fragment.flags || {};
    const flagKeys = Object.keys(flags);

    if (!fragment.worlds || !fragment.worlds[pathSpec.worldId]) return false;
    if (flagKeys.length !== requiredKeys.length) return false;
    return requiredKeys.every(function(key) {
      return flags[key] === required[key];
    });
  }).map(function(fragment) {
    return fragment.id;
  });
}

test('W12 P2 receipt completion paths have registered verdict tension and closer coverage', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const paths = [
    {
      label: 'orientation completion',
      worldId: 'orientation',
      flags: {},
      expected: {
        VERDICTS: ['VERDICT_ORIENTATION_01'],
        TENSIONS: ['TENSION_ORIENTATION_01'],
        CLOSERS: ['CLOSER_ORIENTATION_01']
      }
    },
    {
      label: 'benefits default completion',
      worldId: 'benefits',
      flags: {},
      expected: {
        VERDICTS: ['VERDICT_BENEFITS_01', 'W11_BENEFITS_VERDICT_ATRIUM_01'],
        TENSIONS: ['TENSION_BENEFITS_01', 'W11_BENEFITS_TENSION_BRANCH_01'],
        CLOSERS: ['CLOSER_BENEFITS_01', 'W11_BENEFITS_CLOSER_BILLING_01']
      }
    },
    {
      label: 'benefits premium-secured completion',
      worldId: 'benefits',
      flags: { premiumSecured: true },
      expected: {
        VERDICTS: ['VERDICT_BENEFITS_SECURED_01', 'W11_BENEFITS_VERDICT_AUTH_01'],
        TENSIONS: ['TENSION_BENEFITS_SECURED_01'],
        CLOSERS: ['CLOSER_BENEFITS_SECURED_01', 'W11_BENEFITS_CLOSER_PLAN_01']
      }
    },
    {
      label: 'benefits uninsured completion',
      worldId: 'benefits',
      flags: { uninsuredVeteran: true },
      expected: {
        VERDICTS: ['VERDICT_BENEFITS_UNINSURED_01'],
        TENSIONS: ['TENSION_BENEFITS_UNINSURED_01', 'W11_BENEFITS_TENSION_EXPOSED_01'],
        CLOSERS: ['CLOSER_BENEFITS_UNINSURED_01']
      }
    },
    {
      label: 'rasta dark-cigarette baseline completion',
      worldId: 'rasta',
      flags: { cigaretteLit: false },
      expected: {
        VERDICTS: ['W12_RASTA_VERDICT_DARK_01'],
        TENSIONS: ['W12_RASTA_TENSION_DARK_01'],
        CLOSERS: ['CLOSER_WARMTH_01']
      }
    },
    {
      label: 'rasta rest-open completion',
      worldId: 'rasta',
      flags: { restOpened: true, cigaretteLit: false },
      expected: {
        VERDICTS: ['VERDICT_RASTA_REST_01', 'W11_RASTA_VERDICT_BELT_01'],
        TENSIONS: ['TENSION_RASTA_REST_01'],
        CLOSERS: ['CLOSER_RASTA_REST_01', 'W11_RASTA_CLOSER_FLOOR_01']
      }
    },
    {
      label: 'rasta rushed completion',
      worldId: 'rasta',
      flags: { rushedRest: true },
      expected: {
        VERDICTS: ['VERDICT_RASTA_RUSH_01'],
        TENSIONS: ['TENSION_RASTA_RUSH_01', 'W11_RASTA_TENSION_DOOR_01'],
        CLOSERS: ['CLOSER_RASTA_RUSH_01', 'W11_RASTA_CLOSER_NAME_01']
      }
    }
  ];

  paths.forEach(function(pathSpec) {
    ['VERDICTS', 'TENSIONS', 'CLOSERS'].forEach(function(poolName) {
      const ids = matchingPathFragments(CEHP, poolName, pathSpec);
      assert.equal(ids.length >= 1, true, pathSpec.label + ' missing ' + poolName + ' coverage');
      pathSpec.expected[poolName].forEach(function(expectedId) {
        assert.equal(ids.includes(expectedId), true, pathSpec.label + ' missing ' + expectedId);
      });
    });
  });
});

test('W12 P2 completion paths resolve to expected flag-state receipt fragments', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const cases = [
    {
      label: 'benefits default completion',
      expectedIds: ['W11_BENEFITS_VERDICT_NETWORK_01', 'W11_BENEFITS_TENSION_SLOW_01', 'W11_BENEFITS_CLOSER_BILLING_01'],
      opts: {
        seed: 'CASE-W12-P2-BENEFITS-DEFAULT',
        worldId: 'benefits',
        axes: { primary: { compliance: 0.8, intuition: 0.8, efficiency: 0.8, chaos: 0.4, grace: 0.6 }, micro: { modulesPassed: 3, nearMisses: 3 } },
        tensions: { obedience: 0.5, style: 0.5, auditRisk: 0.5 },
        flags: {}
      }
    },
    {
      label: 'benefits premium completion',
      expectedIds: ['W11_BENEFITS_VERDICT_AUTH_01', 'TENSION_BENEFITS_SECURED_01', 'W11_BENEFITS_CLOSER_PLAN_01'],
      opts: {
        seed: 'CASE-W12-P2-BENEFITS-PREMIUM',
        worldId: 'benefits',
        axes: { primary: { compliance: 1, efficiency: 1, intuition: 0.5 }, micro: { contradictionFollow: 3 } },
        tensions: { obedience: 1, style: 0.5, auditRisk: 0 },
        flags: { premiumSecured: true }
      }
    },
    {
      label: 'benefits uninsured completion',
      expectedIds: ['VERDICT_BENEFITS_UNINSURED_01', 'W11_BENEFITS_TENSION_EXPOSED_01', 'CLOSER_BENEFITS_UNINSURED_04'],
      opts: {
        seed: 'CASE-W12-P2-BENEFITS-UNINSURED',
        worldId: 'benefits',
        axes: { primary: { chaos: 1, intuition: 1, compliance: 0.2 }, micro: { damageTaken: 3 } },
        tensions: { obedience: -1, style: 0, auditRisk: 1 },
        flags: { uninsuredVeteran: true }
      }
    },
    {
      label: 'rasta dark-cigarette baseline completion',
      expectedIds: ['W12_RASTA_VERDICT_DARK_01', 'W12_RASTA_TENSION_DARK_01'],
      opts: {
        seed: 'CASE-W12-P2-RASTA-DARK',
        worldId: 'rasta',
        axes: { primary: { intuition: 1, grace: 1 }, micro: { musicSync: 1 } },
        tensions: { obedience: 0, style: 0, auditRisk: -1 },
        flags: { cigaretteLit: false },
        cigaretteLit: false
      }
    },
    {
      label: 'rasta rest-open completion',
      expectedIds: ['VERDICT_RASTA_REST_01', 'TENSION_RASTA_REST_04', 'CLOSER_RASTA_REST_01'],
      opts: {
        seed: 'CASE-W12-P2-RASTA-REST',
        worldId: 'rasta',
        axes: { primary: { intuition: 1, grace: 1 }, micro: { musicSync: 3, contradictionFollow: 3 } },
        tensions: { obedience: 0.5, style: 0.5, auditRisk: -1 },
        flags: { restOpened: true, cigaretteLit: false },
        cigaretteLit: false
      }
    },
    {
      label: 'rasta rushed completion',
      expectedIds: ['VERDICT_RASTA_RUSH_04', 'W11_RASTA_TENSION_DOOR_01', 'CLOSER_RASTA_RUSH_01'],
      opts: {
        seed: 'CASE-W12-P2-RASTA-RUSHED',
        worldId: 'rasta',
        axes: { primary: { intuition: 1, grace: 0.7, chaos: 0.3 }, micro: { contradictionDefy: 3, modulesSkipped: 3 } },
        tensions: { obedience: -0.5, style: 0.2, auditRisk: -0.5 },
        flags: { rushedRest: true, cigaretteLit: false },
        cigaretteLit: false
      }
    }
  ];

  cases.forEach(function(entry) {
    const receipt = CEHP.Receipts.generate(entry.opts);
    entry.expectedIds.forEach(function(expectedId) {
      assert.equal(receipt.fragmentIds.includes(expectedId), true, entry.label + ' got ' + receipt.fragmentIds.join(', '));
    });
  });
});

test('W11_CONTENT_BIAS favors equivalent W11 fragments when flags match', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-W11-BIAS-0';
  CEHP.Receipts.registerFragment('CLOSERS', 'CONTROL_BIAS_CLOSER', 'CONTROL BIAS LINE.', {
    worlds: { orientation: 99 }
  });
  CEHP.Receipts.registerFragment('CLOSERS', 'W11_TEST_BIAS_CLOSER', 'W11 BIAS LINE.', {
    worlds: { orientation: 99 }
  });

  assert.equal(
    CEHP.seedFromString(seed + '|CONTROL_BIAS_CLOSER') < CEHP.seedFromString(seed + '|W11_TEST_BIAS_CLOSER'),
    true
  );

  const receipt = CEHP.Receipts.generate({
    seed,
    worldId: 'orientation',
    axes: { primary: {}, micro: {} },
    tensions: { obedience: 0, style: 0, auditRisk: 0 },
    flags: {}
  });

  assert.equal(receipt.fragmentIds.includes('W11_TEST_BIAS_CLOSER'), true, receipt.fragmentIds.join(', '));
});

[
  {
    id: 'W11_BENEFITS_VERDICT_ATRIUM_01',
    opts: {
      seed: 'CASE-W11-FRAG-ATRIUM',
      worldId: 'benefits',
      axes: { primary: { compliance: 1, intuition: 1 }, micro: { idleMs: 3 } },
      tensions: { obedience: 0.5, style: 0.2, auditRisk: 0.2 },
      flags: {}
    }
  },
  {
    id: 'W11_BENEFITS_VERDICT_NETWORK_01',
    opts: {
      seed: 'CASE-W11-FRAG-NETWORK',
      worldId: 'benefits',
      axes: { primary: { grace: 1, efficiency: 1 }, micro: { nearMisses: 3 } },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: {}
    }
  },
  {
    id: 'W11_BENEFITS_VERDICT_AUTH_01',
    opts: {
      seed: 'CASE-W11-FRAG-AUTH',
      worldId: 'benefits',
      axes: { primary: { compliance: 1 }, micro: { contradictionFollow: 3 } },
      tensions: { obedience: 1, style: 0, auditRisk: 0 },
      flags: { premiumSecured: true }
    }
  },
  {
    id: 'W11_BENEFITS_TENSION_BRANCH_01',
    opts: {
      seed: 'CASE-W11-FRAG-BRANCH',
      worldId: 'benefits',
      axes: { primary: {}, micro: { modulesPassed: 3 } },
      tensions: { obedience: 0, style: 1, auditRisk: 1 },
      flags: {}
    }
  },
  {
    id: 'W11_BENEFITS_TENSION_SLOW_01',
    opts: {
      seed: 'CASE-W11-FRAG-SLOW',
      worldId: 'benefits',
      axes: { primary: { compliance: 1, intuition: 1 }, micro: {} },
      tensions: { obedience: 1, style: 0, auditRisk: 0 },
      flags: {}
    }
  },
  {
    id: 'W11_BENEFITS_TENSION_EXPOSED_01',
    opts: {
      seed: 'CASE-W11-FRAG-EXPOSED',
      worldId: 'benefits',
      axes: { primary: {}, micro: { damageTaken: 3 } },
      tensions: { obedience: -1, style: 0, auditRisk: 1 },
      flags: { uninsuredVeteran: true }
    }
  },
  {
    id: 'W11_BENEFITS_CLOSER_PLAN_01',
    opts: {
      seed: 'CASE-W11-FRAG-PLAN',
      worldId: 'benefits',
      axes: { primary: { compliance: 1 }, micro: {} },
      tensions: { obedience: 1, style: 0, auditRisk: 0 },
      flags: { premiumSecured: true }
    }
  },
  {
    id: 'W11_BENEFITS_CLOSER_BILLING_01',
    opts: {
      seed: 'CASE-W11-FRAG-BILLING',
      worldId: 'benefits',
      axes: { primary: { efficiency: 1, chaos: 1 }, micro: {} },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: {}
    }
  },
  {
    id: 'W11_RASTA_VERDICT_BELT_01',
    opts: {
      seed: 'CASE-W11-FRAG-BELT',
      worldId: 'rasta',
      axes: { primary: { intuition: 1, grace: 1 }, micro: { musicSync: 3 } },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: { restOpened: true, cigaretteLit: false },
      cigaretteLit: false
    }
  },
  {
    id: 'W11_RASTA_TENSION_DOOR_01',
    opts: {
      seed: 'CASE-W11-FRAG-DOOR',
      worldId: 'rasta',
      axes: { primary: { intuition: 1 }, micro: { contradictionDefy: 3 } },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: { rushedRest: true },
      cigaretteLit: false
    }
  },
  {
    id: 'W11_RASTA_CLOSER_FLOOR_01',
    opts: {
      seed: 'CASE-W11-FRAG-FLOOR',
      worldId: 'rasta',
      axes: { primary: { grace: 1 }, micro: { musicSync: 3 } },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: { restOpened: true, cigaretteLit: false },
      cigaretteLit: false
    }
  },
  {
    id: 'W11_RASTA_CLOSER_NAME_01',
    opts: {
      seed: 'CASE-W11-FRAG-NAME',
      worldId: 'rasta',
      axes: { primary: { intuition: 1, grace: 1 }, micro: { contradictionDefy: 3 } },
      tensions: { obedience: 0, style: 0, auditRisk: 0 },
      flags: { rushedRest: true },
      cigaretteLit: false
    }
  }
].forEach(function(entry) {
  test(entry.id + ' surfaces under its W11 selection conditions', () => {
    const CEHP = loadModules(LOGIC_MODULES);
    const receipt = CEHP.Receipts.generate(entry.opts);

    assert.equal(receipt.fragmentIds.includes(entry.id), true, receipt.fragmentIds.join(', '));
  });
});

test('play scene initializes W11 receipt flags without changing save schema', () => {
  const source = fs.readFileSync(path.join(srcDir, '91_scenes.js'), 'utf8');

  assert.match(
    source,
    /receiptFlags:\{uninsuredVeteran:!1,premiumSecured:!1,restOpened:!1,rushedRest:!1,cigaretteLit:!1\}/
  );
});

test('save boot without stored data returns sane v2 defaults', () => {
  const storage = makeStorage();
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  const save = plain(CEHP.SAVE.boot());

  assert.equal(save.version, 2);
  assert.equal(save.ruleset, CEHP.RULESET);
  assert.equal(save.world, 1);
  assert.equal(save.health, 3);
  assert.deepEqual(save.axes, {
    compliance: 0,
    intuition: 0,
    curiosity: 0,
    grace: 0,
    chaos: 0,
    efficiency: 0
  });
  assert.deepEqual(save.cases, []);
  assert.equal(save.legacy, null);
  assert.equal(storage.getItem(CEHP.SAVE._key), null);
});

test('v1 save with missing fields migrates with defaults and preserves legacy blob', () => {
  const legacy = {
    timestamp: 12345,
    health: 2,
    behavior: { compliance: 0.7, chaos: 0.4 },
    assistMode: { slowerGame: true },
    extraV1Field: 'kept'
  };
  const storage = makeStorage({ cactusEd_save_v1: JSON.stringify(legacy) });
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  const migrated = plain(CEHP.SAVE.boot());

  assert.equal(migrated.version, 2);
  assert.equal(migrated.ts, 12345);
  assert.equal(migrated.world, 1);
  assert.equal(migrated.health, 2);
  assert.equal(migrated.runs, 0);
  assert.equal(migrated.axes.compliance, 0.7);
  assert.equal(migrated.axes.chaos, 0.4);
  assert.equal(migrated.assistMode.slowerGame, true);
  assert.equal(migrated.assistMode.reduceShake, false);
  assert.deepEqual(migrated.legacy, legacy);
  assert.deepEqual(JSON.parse(storage.getItem(CEHP.SAVE._key)).legacy, legacy);
  assert.equal(storage.getItem(CEHP.SAVE._keyV1), JSON.stringify(legacy));
});

test('v2 save with extra fields round-trips without losing unknown data', () => {
  const storage = makeStorage();
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  const payload = CEHP.SAVE._emptyV2();
  payload.world = 2;
  payload.extraTopLevel = { review: 'preserved', nested: { ok: true } };
  payload.cases.push({ seed: 'CASE-SAVE-EXTRA', result: 'kept' });

  assert.equal(CEHP.SAVE.save(payload), true);

  const reloaded = loadModules(SAVE_MODULES, { localStorage: storage });
  assert.deepEqual(plain(reloaded.SAVE.boot().extraTopLevel), {
    review: 'preserved',
    nested: { ok: true }
  });
  assert.deepEqual(plain(reloaded.SAVE.load().cases), [{ seed: 'CASE-SAVE-EXTRA', result: 'kept' }]);
});

test('corrupt save JSON recovers to defaults without throwing', () => {
  const storage = makeStorage({ cactusEd_save_v2: '{not-valid-json' });
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  let save = null;

  assert.doesNotThrow(function() {
    save = CEHP.SAVE.boot();
  });
  assert.equal(save.version, 2);
  assert.equal(save.health, 3);
  assert.deepEqual(plain(save.cases), []);
});

test('v1 save with mismatched ruleset migrates to live ruleset and keeps audit trail', () => {
  const legacy = {
    timestamp: 67890,
    ruleset: 'R1',
    world: 3,
    health: 1
  };
  const storage = makeStorage({ cactusEd_save_v1: JSON.stringify(legacy) });
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  const migrated = plain(CEHP.SAVE.boot());

  assert.equal(migrated.ruleset, CEHP.RULESET);
  assert.equal(migrated.world, 3);
  assert.equal(migrated.health, 1);
  assert.equal(migrated.legacy.ruleset, 'R1');
});

test('v2 save then reload returns the same saved state', () => {
  const storage = makeStorage();
  const CEHP = loadModules(SAVE_MODULES, { localStorage: storage });
  const payload = CEHP.SAVE._emptyV2();
  payload.world = 3;
  payload.health = 1;
  payload.axes.compliance = 0.25;
  payload.axes.grace = 0.5;
  payload.micro = { contradictionFollow: 2 };
  payload.cases = [{ seed: 'CASE-SAVE-ROUNDTRIP', worldId: 'rasta' }];
  payload.assistMode.reduceFlash = true;

  assert.equal(CEHP.SAVE.save(payload), true);
  assert.deepEqual(plain(CEHP.SAVE.load()), plain(payload));

  const reloaded = loadModules(SAVE_MODULES, { localStorage: storage });
  assert.deepEqual(plain(reloaded.SAVE.boot()), plain(payload));
});

test('receipt card helpers keep receipt content stable across thermal presentation', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-20260427-001-COMPLIANCE-R2',
    worldId: 'benefits',
    axes: {
      primary: {
        compliance: 0.6,
        intuition: 0.3,
        curiosity: 0.4,
        grace: 0.3,
        chaos: 0.2,
        efficiency: 0.5
      },
      micro: {
        modulesPassed: 5,
        contradictionFollow: 2
      }
    },
    tensions: { obedience: 0.4, style: 0.8, auditRisk: 0.1 },
    flags: { premiumSecured: true, uninsuredVeteran: false }
  });

  const normalCard = CEHP.Receipts.cardModel(receipt, {
    worldId: 'benefits',
    playUrl: 'https://counterfeit-educational.org/?case=' + encodeURIComponent(receipt.seed),
    thermal: false
  });
  const thermalCard = CEHP.Receipts.cardModel(receipt, {
    worldId: 'benefits',
    playUrl: 'https://counterfeit-educational.org/?case=' + encodeURIComponent(receipt.seed),
    thermal: true
  });

  assert.deepEqual(normalCard.lines, thermalCard.lines);
  assert.deepEqual(normalCard.fragmentIds, thermalCard.fragmentIds);
  assert.equal(normalCard.theme.mode, 'normal');
  assert.equal(thermalCard.theme.mode, 'thermal');
  assert.notEqual(normalCard.theme.paper, thermalCard.theme.paper);
});

test('docket seeds are deterministic by ISO week and archive dedupes receipt entries', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const info = CEHP.Docket.weekInfo(new Date(Date.UTC(2026, 3, 20)));
  const docketA = CEHP.Docket.seedForWeek(info.year, info.isoWeek);
  const docketB = CEHP.Docket.seedForWeek(info.year, info.isoWeek);

  assert.equal(info.isoWeek, 17);
  assert.equal(info.year, 2026);
  assert.equal(info.mondayDate, '2026-04-20');
  assert.equal(docketA.seed, docketB.seed);
  assert.equal(CEHP.CaseSeed.parse(docketA.seed).date, '20260420');
  assert.equal(CEHP.CaseSeed.parse(docketA.seed).counter, 17);

  CEHP.Docket.recordReceipt({
    year: info.year,
    isoWeek: info.isoWeek,
    seed: docketA.seed,
    worldId: 'orientation',
    lines: ['LINE 1', 'LINE 2', 'LINE 3'],
    fragmentIds: ['VERDICT_X', 'TENSION_Y', 'CLOSER_Z'],
    flags: { thermal: false },
    ts: 101
  });
  CEHP.Docket.recordReceipt({
    year: info.year,
    isoWeek: info.isoWeek,
    seed: docketA.seed,
    worldId: 'orientation',
    lines: ['LINE 1', 'LINE 2', 'LINE 3'],
    fragmentIds: ['VERDICT_X', 'TENSION_Y', 'CLOSER_Z'],
    flags: { thermal: false },
    ts: 101
  });

  const archive = CEHP.Docket.loadArchive();

  assert.equal(Array.isArray(archive.weeks), true);
  assert.equal(archive.weeks.length, 1);
  assert.equal(archive.weeks[0].seed, docketA.seed);
  assert.equal(archive.weeks[0].receipts.length, 1);
});

test('appeals compare returns diffs, bounds, and encoded payload helpers', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const recA = {
    seed: 'CASE-20260420-001-CURIOSITY-R2',
    lines: ['ROUTINE COMPLIANCE OBSERVED.', 'OBEDIENCE HIGH. STYLE UNDECLARED.', 'RETURN TO ASSIGNED HALLWAY.'],
    axes: { primary: { compliance: 0.8, intuition: 0.1, curiosity: 0.2, grace: 0.4, chaos: 0.1, efficiency: 0.7 }, micro: {} }
  };
  const recB = {
    seed: 'CASE-20260420-001-CURIOSITY-R2',
    lines: ['INCIDENT PRE-APPROVED.', 'AUDIT RISK EXCEEDS PERMITTED RANGE.', 'CASE HELD OPEN FOR REVIEW.'],
    axes: { primary: { compliance: 0.2, intuition: 0.2, curiosity: 0.8, grace: 0.3, chaos: 0.7, efficiency: 0.2 }, micro: {} }
  };
  const pathA = [[0, 10, 20, 1], [120, 32, 18, 1], [240, 60, 12, 1]];
  const pathB = [[0, 10, 20, 1], [120, 16, 36, -1], [240, 12, 64, -1]];

  const encoded = CEHP.Appeals.encode({ receipt: recA, frames: pathA });
  const decoded = CEHP.Appeals.decode(encoded);
  const diff = CEHP.Appeals.compare(
    { receipt: recA, frames: pathA },
    { receipt: recB, frames: pathB }
  );

  assert.equal(typeof encoded, 'string');
  assert.deepEqual(decoded.frames, pathA);
  assert.deepEqual(decoded.receipt.lines, recA.lines);
  assert.equal(Array.isArray(diff.lineDiff), true);
  assert.equal(typeof diff.axisDelta.compliance, 'number');
  assert.deepEqual(diff.pathA, pathA);
  assert.deepEqual(diff.pathB, pathB);
  assert.equal(
    JSON.stringify(diff.bounds),
    JSON.stringify({ minX: 10, minY: 12, maxX: 60, maxY: 64 })
  );
});

test('axes and metrics respond to deterministic event traffic', () => {
  const CEHP = loadModules(LOGIC_MODULES);

  CEHP.Axes.reset();
  CEHP.Metrics.reset();

  CEHP.Events.emit('sign:read', { words: 4 });
  CEHP.Events.emit('movement:jump', { height: 1 });
  CEHP.Events.emit('movement:kick', {});
  CEHP.Events.emit('movement:backtrack', { distance: 24 });
  CEHP.Events.emit('contradiction:defy', { gateId: 'gate-1' });
  CEHP.Metrics.tick(600, { moving: false, x: 10, y: 20, facing: 1 });
  CEHP.Metrics.tick(600, { moving: false, x: 10, y: 20, facing: 1 });

  const snapshot = CEHP.Axes.snapshot();

  assert.ok(snapshot.primary.curiosity > 0);
  assert.ok(snapshot.primary.chaos > 0);
  assert.ok(snapshot.micro.signsRead > 0);
  assert.ok(snapshot.micro.jumpCount > 0);
  assert.ok(snapshot.micro.kickCount > 0);
  assert.ok(snapshot.micro.backtracks > 0);
  assert.ok(snapshot.micro.idleMs > 0);
});

test('contradiction gates resolve follow and defy exactly once', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  let followCount = 0;
  let defyCount = 0;

  const gate = CEHP.Contradiction.gate({
    sign: { id: 'do-not-jump' },
    expectedBehavior: 'wait',
    windowMs: 800,
    onFollow: function() { followCount += 1; return 'upper'; },
    onDefy: function() { defyCount += 1; return 'lower'; }
  });

  assert.equal(gate.evaluate({ action: 'jump', elapsedMs: 120 }), 'defy');
  assert.equal(gate.resolved, true);
  assert.equal(gate.evaluate({ action: 'wait', elapsedMs: 600 }), 'defy');
  assert.equal(followCount, 0);
  assert.equal(defyCount, 1);
});

test('lens kit exposes the locked palette and scrolls a deterministic scanline layer', () => {
  function makeCanvas() {
    const context = {
      fillStyle: '#000000',
      globalAlpha: 1,
      operations: [],
      createRadialGradient() {
        return {
          stops: [],
          addColorStop(offset, color) {
            this.stops.push({ offset, color });
          }
        };
      },
      fillRect(x, y, w, h) {
        this.operations.push({ type: 'fillRect', x, y, w, h, fillStyle: this.fillStyle, globalAlpha: this.globalAlpha });
      }
    };
    return {
      width: 0,
      height: 0,
      getContext(type) {
        if (type !== '2d') throw new Error('Unexpected context ' + type);
        return context;
      },
      _context: context
    };
  }

  function makeTileSprite(x, y, width, height, key) {
    return {
      x,
      y,
      width,
      height,
      key,
      alpha: 1,
      depth: 0,
      blendMode: null,
      tilePositionX: 0,
      tilePositionY: 0,
      scrollFactor: 1,
      setOrigin() { return this; },
      setScrollFactor(value) { this.scrollFactor = value; return this; },
      setDepth(value) { this.depth = value; return this; },
      setAlpha(value) { this.alpha = value; return this; },
      setBlendMode(value) { this.blendMode = value; return this; }
    };
  }

  function makeImage(x, y, key) {
    return {
      x,
      y,
      key,
      alpha: 1,
      depth: 0,
      blendMode: null,
      scrollFactor: 1,
      setOrigin() { return this; },
      setScrollFactor(value) { this.scrollFactor = value; return this; },
      setDepth(value) { this.depth = value; return this; },
      setAlpha(value) { this.alpha = value; return this; },
      setBlendMode(value) { this.blendMode = value; return this; }
    };
  }

  function makeGraphics() {
    return {
      alpha: 1,
      depth: 0,
      scrollFactor: 1,
      textureKey: '',
      setScrollFactor(value) { this.scrollFactor = value; return this; },
      setDepth(value) { this.depth = value; return this; },
      setAlpha(value) { this.alpha = value; return this; },
      fillGradientStyle() { return this; },
      fillRect() { return this; },
      generateTexture(key) { this.textureKey = key; return this; },
      destroy() {}
    };
  }

  const textures = {
    added: [],
    removed: [],
    exists() { return false; },
    addCanvas(key, canvas) {
      this.added.push({ key, canvas });
      return canvas;
    },
    remove(key) {
      this.removed.push(key);
    }
  };

  const sandbox = loadSandbox(LENS_MODULES, {
    document: {
      readyState: 'loading',
      getElementById() {
        return null;
      },
      createElement(type) {
        if (type !== 'canvas') throw new Error('Unexpected element ' + type);
        return makeCanvas();
      }
    },
    Phaser: {
      BlendModes: {
        MULTIPLY: 'MULTIPLY'
      }
    }
  });
  const CEHP = sandbox.CEHP;
  const scene = {
    textures,
    cameras: {
      main: {
        width: 512,
        height: 448
      }
    },
    add: {
      tileSprite(x, y, width, height, key) {
        return makeTileSprite(x, y, width, height, key);
      },
      image(x, y, key) {
        return makeImage(x, y, key);
      },
      graphics() {
        return makeGraphics();
      }
    },
    events: {
      once() {}
    }
  };

  const layer = CEHP.Lens.attach(scene, { seed: 'CASE-20260420-001-CURIOSITY-R2' });

  assert.equal(CEHP.PALETTE.BRUISE_NAVY, 0x0a1220);
  assert.equal(CEHP.PALETTE.PAPER_TAN, 0xd4c7a5);
  assert.equal(layer.dither.alpha, 0.18);
  assert.equal(layer.dither.blendMode, 'MULTIPLY');
  assert.equal(layer.scanlines.alpha, 0.07);
  assert.equal(layer.vignette.blendMode, 'MULTIPLY');
  assert.equal(textures.added.some(function(entry) { return entry.key === 'cehp-lens-dither'; }), true);
  assert.equal(textures.added.some(function(entry) { return entry.key === 'cehp-lens-scanline'; }), true);

  CEHP.Lens.update(scene, 16);
  assert.equal(layer.scanlines.tilePositionY > 0, true);
});

function makePhase5LensScene() {
  function makeNode() {
    return {
      alpha: 1,
      blendMode: '',
      depth: 0,
      tilePositionY: 0,
      setOrigin: function() { return this; },
      setScrollFactor: function() { return this; },
      setDepth: function(value) { this.depth = value; return this; },
      setAlpha: function(value) { this.alpha = value; return this; },
      setBlendMode: function(value) { this.blendMode = value; return this; },
      destroy: function() {}
    };
  }

  return {
    textures: {
      exists: function() { return false; },
      addCanvas: function(key, canvas) { return canvas || {}; },
      remove: function() {}
    },
    cameras: {
      main: {
        width: 512,
        height: 448,
        offsets: [],
        setFollowOffset: function(x, y) {
          this.offsets.push({ x: x, y: y });
          this.followOffsetX = x;
          this.followOffsetY = y;
        }
      }
    },
    add: {
      tileSprite: function() { return makeNode(); },
      image: function() { return makeNode(); }
    },
    events: {
      once: function() {}
    }
  };
}

test('phase 5 camera horizontal lead caps and scales linearly', () => {
  const CEHP = loadModules(LENS_MODULES);

  assert.equal(CEHP.Lens.cameraLeadX(500), 150);
  assert.equal(CEHP.Lens.cameraLeadX(100), 45);
  assert.equal(CEHP.Lens.cameraLeadX(-100), -45);
});

test('phase 5 camera vertical lead uses fall, apex, and grounded bands', () => {
  const CEHP = loadModules(LENS_MODULES);

  assert.equal(CEHP.Lens.cameraLeadY(200, false), 140);
  assert.equal(CEHP.Lens.cameraLeadY(20, false), 90);
  assert.equal(CEHP.Lens.cameraLeadY(200, true), 0);
});

test('phase 5 landing dip scales with fall class and ignores active retriggers', () => {
  const CEHP = loadModules(LENS_MODULES);
  const state = CEHP.Lens.makeCameraState('CASE-P5-DIP');

  assert.equal(CEHP.Lens.landingDipPx('soft'), 0);
  assert.equal(CEHP.Lens.landingDipPx('medium'), 2);
  assert.equal(CEHP.Lens.landingDipPx('hard'), 4);

  assert.equal(CEHP.Lens.startLandingDip(state, 'medium'), true);
  assert.equal(state.dipPx, 2);
  assert.equal(CEHP.Lens.startLandingDip(state, 'hard'), false);
  assert.equal(state.dipPx, 2);

  CEHP.Lens.updateLandingDip(state, 90);
  assert.equal(state.dipMs, 0);
  assert.equal(state.dipOffset, 0);
});

test('phase 5 camera shake is deterministic under fixed seed and ignores self-hit classes', () => {
  const CEHP = loadModules(LENS_MODULES);

  function run() {
    const state = CEHP.Lens.makeCameraState('CASE-P5-SHAKE');
    return [
      CEHP.Lens.startCameraShake(state, { kind: 'damage' }),
      CEHP.Lens.startCameraShake(state, { kind: 'damage' })
    ];
  }

  assert.deepEqual(run(), run());

  const scene = makePhase5LensScene();
  const layer = CEHP.Lens.attach(scene, { seed: 'CASE-P5-SHAKE' });
  CEHP.Events.emit('combat:damageDealt', { kind: 'melee' });
  assert.equal(layer.response.shakeMs, 0);
});

test('phase 6 rim-light pulse is deterministic and skips i-frame blink-off', () => {
  const CEHP = loadModules(LENS_MODULES);
  function makeActor(alpha) {
    return {
      alpha,
      _cehpRimCyan: { visible: true, x: 0, alpha: 0 },
      _cehpRimMagenta: { visible: true, x: 0, alpha: 0 },
      _cehpState: { phase4: { iframesMs: alpha < 0.5 ? 500 : 0 } }
    };
  }

  const a = CEHP.Lens.rimLight(makeActor(1), 250, CEHP.Lens.makeRimLightState('CASE-P6-RIM'));
  const b = CEHP.Lens.rimLight(makeActor(1), 250, CEHP.Lens.makeRimLightState('CASE-P6-RIM'));
  assert.equal(a.offset, b.offset);
  assert.equal(a.visible, true);
  assert.equal(Math.abs(a.offset) <= 1, true);

  const blinkOffActor = makeActor(0.35);
  const paused = CEHP.Lens.rimLight(blinkOffActor, 250, CEHP.Lens.makeRimLightState('CASE-P6-RIM'));
  assert.equal(paused.visible, false);
  assert.equal(blinkOffActor._cehpRimCyan.visible, false);
  assert.equal(blinkOffActor._cehpRimMagenta.visible, false);
});

test('boot keeps pixel-art rendering and disables antialiasing', () => {
  let capturedConfig = null;
  const sandbox = loadSandbox([
    '00_index.js',
    '01_const.js',
    '99_boot.js'
  ], {
    document: {
      readyState: 'loading',
      getElementById() {
        return null;
      }
    },
    addEventListener() {},
    Phaser: {
      AUTO: 'AUTO',
      Game: function Game(config) {
        capturedConfig = config;
        return { config };
      }
    }
  });

  const game = sandbox.CEHP.boot();

  assert.equal(game.config, capturedConfig);
  assert.equal(capturedConfig.pixelArt, true);
  assert.equal(capturedConfig.roundPixels, true);
  assert.equal(capturedConfig.antialias, false);
});

test('scene helpers choose world splash assets and preserve thermal bypass', () => {
  const CEHP = loadModules(SCENE_MODULES);

  assert.equal(CEHP.Scenes.bootSplashKeyForWorld('orientation'), 'splash_world_orientation');
  assert.equal(CEHP.Scenes.bootSplashKeyForWorld('benefits'), 'splash_world_benefits');
  assert.equal(CEHP.Scenes.bootSplashKeyForWorld('rasta'), 'splash_world_rasta');
  assert.equal(CEHP.Scenes.bootSplashKeyForWorld('unknown'), 'splash_title');

  assert.equal(CEHP.Scenes.shouldPreloadPresentationArt('?world=orientation'), true);
  assert.equal(CEHP.Scenes.shouldPreloadPresentationArt('?world=orientation&splash=0'), false);
  assert.equal(CEHP.Scenes.shouldPreloadPresentationArt('?world=orientation&thermal=1'), false);
});

test('scene helpers route end-of-run flow through ShiftEnd unless thermal', () => {
  const CEHP = loadModules(SCENE_MODULES);

  assert.equal(CEHP.Scenes.nextRunCompleteScene({ renderFlags: { thermal: false } }), 'ShiftEnd');
  assert.equal(CEHP.Scenes.nextRunCompleteScene({ renderFlags: { thermal: true } }), 'Receipt');
  assert.equal(CEHP.Scenes.nextRunCompleteScene({}), 'ShiftEnd');
});

test('scene helpers gate ShiftEnd skipping on a 500ms wall-clock delay', () => {
  const CEHP = loadModules(SCENE_MODULES);

  assert.equal(CEHP.Scenes.shiftEndSkipDeadline(1000), 1500);
  assert.equal(CEHP.Scenes.shiftEndCanSkip(1500, 1499), false);
  assert.equal(CEHP.Scenes.shiftEndCanSkip(1500, 1500), true);
});

test('boot preload loads optional Track A art only for non-thermal runs', () => {
  function makePhaserStub() {
    function Scene() {}
    function Class(definition) {
      function Klass() {
        if (definition.initialize) definition.initialize.apply(this, arguments);
      }
      Klass.prototype = Object.create((definition.Extends || Scene).prototype);
      Klass.prototype.constructor = Klass;
      Object.keys(definition).forEach(function(key) {
        if (key === 'Extends' || key === 'initialize') return;
        Klass.prototype[key] = definition[key];
      });
      return Klass;
    }
    return { Scene, Class };
  }

  function preloadKeys(search) {
    const sandbox = loadSandbox(SCENE_MODULES, {
      location: { search },
      Phaser: makePhaserStub()
    });
    const BootScene = sandbox.CEHP.Scenes.list()[0];
    const boot = new BootScene();
    const loaded = [];

    boot.load = {
      image(key) {
        loaded.push(key);
      },
      on() {}
    };

    boot.preload();
    return loaded;
  }

  const normalKeys = preloadKeys('?world=benefits');
  const thermalKeys = preloadKeys('?world=benefits&thermal=1');

  assert.equal(normalKeys.includes('carpet_tile_seamless'), true);
  assert.equal(normalKeys.includes('enemy_compliance_auditor'), true);
  assert.equal(normalKeys.includes('prop_stamp_pad'), true);
  assert.equal(normalKeys.includes('enemy_telegraph_windup'), true);
  assert.equal(normalKeys.includes('paper_expired_id'), true);
  assert.equal(normalKeys.includes('receipt_brand_mascot'), true);
  assert.equal(normalKeys.includes('ed_sheet_60px'), true);

  assert.equal(thermalKeys.includes('carpet_tile_seamless'), false);
  assert.equal(thermalKeys.includes('enemy_compliance_auditor'), false);
  assert.equal(thermalKeys.includes('prop_stamp_pad'), false);
  assert.equal(thermalKeys.includes('enemy_telegraph_windup'), false);
  assert.equal(thermalKeys.includes('paper_expired_id'), false);
  assert.equal(thermalKeys.includes('receipt_brand_mascot'), false);
  assert.equal(thermalKeys.includes('ed_sheet_60px'), false);
});

test('W12 P5 procedural audio exposes ambient beds and legacy aliases', () => {
  const harness = makeFakeAudioEnvironment();
  const CEHP = loadModules(AUDIO_MODULES, harness.extra);
  const expected = {
    orientation: { fundamental: 60, filter: 200, lfo: 0.05 },
    benefits: { fundamental: 90, filter: 250, lfo: 0.08 },
    rasta: { fundamental: 50, filter: 180, lfo: 0.035 }
  };

  assert.equal(typeof CEHP.Audio.playAmbient, 'function');
  assert.equal(typeof CEHP.Audio.stopAmbient, 'function');
  assert.equal(typeof CEHP.Audio.event, 'function');
  assert.equal(typeof CEHP.Audio.start, 'function');
  assert.equal(typeof CEHP.Audio.stop, 'function');

  Object.keys(expected).forEach(function(worldKey) {
    const context = harness.contexts[0];
    const oscCount = context ? context.oscillators.length : 0;
    const filterCount = context ? context.filters.length : 0;

    assert.equal(CEHP.Audio.playAmbient(worldKey), true);
    assert.equal(CEHP.Audio.isRunning(), true);
    assert.ok(CEHP.Audio.layers.ambient, worldKey + ' missing ambient layer');

    const activeContext = harness.contexts[0];
    const oscillators = activeContext.oscillators.slice(oscCount);
    const filters = activeContext.filters.slice(filterCount);
    assert.equal(
      oscillators.some(function(node) { return node.frequency.value === expected[worldKey].fundamental; }),
      true,
      worldKey + ' missing fundamental'
    );
    assert.equal(
      oscillators.some(function(node) { return node.frequency.value === expected[worldKey].lfo; }),
      true,
      worldKey + ' missing LFO'
    );
    assert.equal(
      filters.some(function(node) { return node.type === 'lowpass' && node.frequency.value === expected[worldKey].filter; }),
      true,
      worldKey + ' missing low-pass'
    );
    CEHP.Audio.stopAmbient();
    assert.equal(CEHP.Audio.isRunning(), false);
  });

  assert.equal(CEHP.Audio.start('orientation'), true);
  assert.equal(CEHP.Audio.isRunning(), true);
  CEHP.Audio.stop();
  assert.equal(CEHP.Audio.isRunning(), false);
});

test('W12 P5 procedural audio events duck ambient and stay under 300ms', () => {
  const harness = makeFakeAudioEnvironment();
  const CEHP = loadModules(AUDIO_MODULES, harness.extra);
  const eventKeys = ['door_open', 'door_close', 'stamp_thud', 'paper_rustle', 'receipt_print', 'boss_telegraph'];

  assert.equal(CEHP.Audio.playAmbient('benefits'), true);
  const context = harness.contexts[0];
  const ambientGain = CEHP.Audio.layers.ambient.gain;

  eventKeys.forEach(function(eventKey) {
    context.currentTime += 1;
    const oscCount = context.oscillators.length;
    const eventNow = context.currentTime;

    assert.equal(CEHP.Audio.event(eventKey), true, eventKey + ' did not play');
    const oscillator = context.oscillators.slice(oscCount)[0];
    assert.ok(oscillator, eventKey + ' missing oscillator');
    assert.equal(oscillator.stops.length, 1, eventKey + ' missing stop envelope');
    assert.equal(oscillator.stops[0] - eventNow <= 0.3, true, eventKey + ' exceeds 300ms');
  });

  const duckSet = ambientGain.events.find(function(entry) {
    return entry.kind === 'set' && entry.time === context.currentTime;
  });
  const duckRestore = ambientGain.events.find(function(entry) {
    return entry.kind === 'linear' && Math.abs(entry.time - (context.currentTime + 0.3)) < 0.0001;
  });
  assert.ok(duckSet, 'missing duck set');
  assert.ok(duckRestore, 'missing duck restore');
  assert.equal(Math.round(duckSet.value * 10000), Math.round(duckRestore.value * 0.5 * 10000));
  assert.equal(CEHP.Audio.event('unknown_event'), false);
});

test('W12 P5 audio maps shipped game events to procedural hits', () => {
  const harness = makeFakeAudioEnvironment();
  const CEHP = loadModules(AUDIO_MODULES, harness.extra);

  assert.equal(CEHP.Audio.playAmbient('orientation'), true);
  const context = harness.contexts[0];
  const before = context.oscillators.length;

  CEHP.Events.emit('module:passed', {});
  CEHP.Events.emit('run:complete', {});
  CEHP.Events.emit('camera:shake', {});

  const eventOscillators = context.oscillators.slice(before);
  assert.equal(eventOscillators.length, 3);
  assert.equal(
    eventOscillators.every(function(node) {
      return node.stops.length === 1 && node.stops[0] - context.currentTime <= 0.3;
    }),
    true
  );
});

function makeScenePhaserStub() {
  function Scene() {}
  function Class(definition) {
    function Klass() {
      if (definition.initialize) definition.initialize.apply(this, arguments);
    }
    Klass.prototype = Object.create((definition.Extends || Scene).prototype);
    Klass.prototype.constructor = Klass;
    Object.keys(definition).forEach(function(key) {
      if (key === 'Extends' || key === 'initialize') return;
      Klass.prototype[key] = definition[key];
    });
    return Klass;
  }
  return { Scene, Class };
}

test('play scene fixed step drives sim while presentation stays render-delta', () => {
  // Render-delta sim ticks let wall-edge contact sampling choose wallJump vs jump differently across replays.
  const sandbox = loadSandbox(FIXED_STEP_SCENE_MODULES, {
    location: { search: '' },
    Phaser: makeScenePhaserStub()
  });
  const CEHP = sandbox.CEHP;
  const PlayScene = CEHP.Scenes.list()[1];
  const play = new PlayScene();
  const calls = [];
  const player = {
    x: 10,
    y: 20,
    facing: 1,
    body: {
      velocity: { x: 5, y: 0 },
      setVelocityX: function(value) {
        this.velocity.x = value;
        calls.push({ kind: 'setVelocityX', value: value });
      }
    }
  };

  CEHP.RunState = { ui: { open: false }, worldId: 'benefits' };
  CEHP.Input = {
    update: function() { calls.push({ kind: 'input:update' }); },
    justPressed: function() { return false; }
  };
  CEHP.UI = { back: function() {}, openClipboard: function() {} };
  CEHP.Movement = {
    apply: function(actor, input, dtMs) {
      calls.push({ kind: 'movement', dt: dtMs });
      actor.x += 1;
    },
    respawn: function() { calls.push({ kind: 'respawn' }); }
  };
  CEHP.WorldBenefits = {
    update: function(scene, dtMs) { calls.push({ kind: 'world', dt: dtMs }); }
  };
  CEHP.Metrics = {
    tick: function(dtMs, payload) {
      calls.push({ kind: 'metrics', dt: dtMs, moving: payload.moving });
    }
  };
  CEHP.Axes = {
    snapshot: function() {
      calls.push({ kind: 'axes' });
      return { primary: {} };
    }
  };
  CEHP.FX = {
    setAxes: function() { calls.push({ kind: 'fx:setAxes' }); },
    update: function(scene, runState, dtMs) { calls.push({ kind: 'fx', dt: dtMs }); }
  };
  CEHP.Feel = { updateCamera: function(scene, dtMs) { calls.push({ kind: 'feel', dt: dtMs }); } };
  CEHP.Ed = { update: function(scene, dtMs) { calls.push({ kind: 'ed', dt: dtMs }); } };
  CEHP.Light = { update: function(scene, dtMs) { calls.push({ kind: 'light', dt: dtMs }); } };
  CEHP.Lens = { update: function(scene, dtMs) { calls.push({ kind: 'lens', dt: dtMs }); } };
  CEHP.Air = { update: function(scene, dtMs) { calls.push({ kind: 'air', dt: dtMs }); } };
  CEHP.Audio = {
    isRunning: function() { return true; },
    updateFromAxes: function(axes, opts) { calls.push({ kind: 'audio', worldId: opts.worldId }); }
  };

  play._fixedStep = CEHP.FixedStep.create();
  play.player = player;
  play.pendingDeath = null;
  play.runComplete = false;
  play.room = { id: 'benefits-world' };
  play.recorder = {
    sampleInput: function(frame, input) {
      calls.push({
        kind: 'sampleInput',
        frame: frame,
        jump: input.justPressed('jump')
      });
    },
    sample: function(t, x, y, facing) {
      calls.push({
        kind: 'sample',
        t: Math.round(t * 1000) / 1000,
        x: x,
        y: y,
        facing: facing
      });
    }
  };
  play.runStartMs = 9000;
  play.queueDeath = function(source) { calls.push({ kind: 'death', source: source }); };

  play.update(9000, 40);

  const simKinds = calls
    .filter(function(entry) {
      return entry.kind === 'input:update' ||
        entry.kind === 'movement' ||
        entry.kind === 'world' ||
        entry.kind === 'sampleInput' ||
        entry.kind === 'sample';
    })
    .map(function(entry) { return entry.kind; });
  const movement = calls.filter(function(entry) { return entry.kind === 'movement'; });
  const world = calls.filter(function(entry) { return entry.kind === 'world'; });
  const samples = calls.filter(function(entry) { return entry.kind === 'sample'; });
  const presentationKinds = calls
    .filter(function(entry) {
      return entry.kind === 'metrics' || entry.kind === 'fx' || entry.kind === 'feel' ||
        entry.kind === 'ed' || entry.kind === 'light' || entry.kind === 'lens' ||
        entry.kind === 'air';
    })
    .map(function(entry) { return entry.kind + ':' + entry.dt; });

  assert.deepEqual(simKinds, [
    'input:update', 'movement', 'world', 'sampleInput', 'sample',
    'input:update', 'movement', 'world', 'sampleInput', 'sample'
  ]);
  assert.equal(movement.length, 2);
  assert.equal(world.length, 2);
  assert.equal(Math.abs(movement[0].dt - CEHP.FixedStep.STEP_MS) < 0.0001, true);
  assert.equal(Math.abs(world[1].dt - CEHP.FixedStep.STEP_MS) < 0.0001, true);
  assert.deepEqual(samples.map(function(entry) { return entry.t; }), [16.667, 33.333]);
  assert.deepEqual(presentationKinds, [
    'metrics:40',
    'fx:40',
    'feel:40',
    'ed:40',
    'light:40',
    'lens:40',
    'air:40'
  ]);
  assert.equal(calls.filter(function(entry) { return entry.kind === 'audio'; }).length, 1);
});

test('appeals recorder preserves legacy path dump while recording per-frame input replay', () => {
  const CEHP = loadModules(APPEALS_REPLAY_MODULES);
  const recorder = new CEHP.Appeals.Recorder();
  const input = {
    down: function(action) {
      return action === 'right' || action === 'jump';
    },
    justPressed: function(action) {
      return action === 'jump';
    },
    justReleased: function() { return false; }
  };

  recorder.sample(0, 12.7, 34.2, 1);
  recorder.sampleInput(7, input);

  assert.deepEqual(JSON.parse(JSON.stringify(recorder.dump())), [[0, 12, 34, 1]]);
  assert.deepEqual(JSON.parse(JSON.stringify(recorder.dumpReplay())), [{
    frame: 7,
    input: {
      left: false,
      right: true,
      up: false,
      down: false,
      jump: true,
      punch: false,
      kick: false,
      spinDash: false,
      cigCopter: false,
      groundSlam: false,
      glide: false,
      pause: false,
      confirm: false,
      back: false
    },
    edges: ['justPressed:jump']
  }]);

  recorder.clear();
  assert.deepEqual(JSON.parse(JSON.stringify(recorder.dump())), []);
  assert.deepEqual(JSON.parse(JSON.stringify(recorder.dumpReplay())), []);
});

test('replay run comparison reports first divergent checkpoint frame and field', () => {
  const CEHP = loadModules(APPEALS_REPLAY_MODULES);
  const fixture = {
    schema_version: 1,
    level_id: 'test-room',
    expected_checkpoints: [
      { frame: 10, x: 50, y: 300, facing: 1, signature: 'a' },
      { frame: 20, x: 75, y: 300, facing: 1, signature: 'b' }
    ],
    expected_final: {
      frame: 30,
      recorder_signature: 'final-a',
      axes_snapshot: { primary: { compliance: 1 } },
      receipt_lines: ['A']
    }
  };
  const scene = {
    _replayActual: {
      expected_checkpoints: [
        { frame: 10, x: 50, y: 300, facing: 1, signature: 'a' },
        { frame: 20, x: 76, y: 300, facing: 1, signature: 'b' }
      ],
      expected_final: {
        frame: 30,
        recorder_signature: 'final-a',
        axes_snapshot: { primary: { compliance: 1 } },
        receipt_lines: ['A']
      }
    }
  };

  const result = CEHP.Replay.runReplay(fixture, scene);

  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    passed: false,
    divergent_frame: 20,
    expected: 75,
    actual: 76,
    field: 'expected_checkpoints[1].x'
  });
});

test('build.js keeps compact bundle module banners in index.html', () => {
  childProcess.execFileSync('node', ['build.js'], { cwd: gameDir, stdio: 'pipe' });
  const builtHtml = fs.readFileSync(path.join(gameDir, 'index.html'), 'utf8');

  assert.equal(
    builtHtml.includes('/* MODULE: 00_INDEX.JS */'),
    true
  );
  assert.equal(
    builtHtml.includes('/* MODULE: 89_ED_PERFORM.JS */'),
    true
  );
});

test('light kit extends the locked palette with cool kiosk and warm exit', () => {
  const CEHP = loadModules([
    '00_index.js',
    '01_const.js'
  ]);

  assert.equal(CEHP.PALETTE.COOL_KIOSK, 0xa8b8c4);
  assert.equal(CEHP.PALETTE.WARM_EXIT, 0xe8a868);
});

test('light kit uses a Phaser 3.70 compatible tween API', () => {
  const source = fs.readFileSync(path.join(srcDir, '86_light.js'), 'utf8');
  const chainMatches = source.match(/scene\.tweens\.chain/g) || [];

  assert.equal(source.includes('scene.tweens.timeline'), false);
  assert.equal(chainMatches.length >= 2, true);
});

test('light kit flicker schedules are deterministic for the same seed and sign key', () => {
  const CEHP = loadModules(LIGHT_MODULES);
  const first = CEHP.Light.makeFlickerState('CASE-20260504-001-GRACE-R2', 'warm-exit-sign');
  const second = CEHP.Light.makeFlickerState('CASE-20260504-001-GRACE-R2', 'warm-exit-sign');

  assert.deepEqual(
    [first.nextNormalMs, first.drawNormalMs(), first.drawNormalMs()],
    [second.nextNormalMs, second.drawNormalMs(), second.drawNormalMs()]
  );
  assert.deepEqual(
    [first.nextBadMs, first.drawBadMs(), first.drawBadMs()],
    [second.nextBadMs, second.drawBadMs(), second.drawBadMs()]
  );
});

test('prop kit exposes five families drawn from the locked palette', () => {
  const sourcePath = path.join(srcDir, '87_props.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const source = fs.readFileSync(sourcePath, 'utf8');
  const keyMatches = source.match(/cehp:prop:[a-z-]+/g) || [];
  const uniqueKeys = Array.from(new Set(keyMatches)).sort();
  const paletteRefs = source.match(/ns\.PALETTE\.[A-Z_]+/g) || [];
  const nonPaletteHex = source.match(/0x[0-9a-fA-F]+/g) || [];

  assert.deepEqual(uniqueKeys, [
    'cehp:prop:carbon-copy-ghost',
    'cehp:prop:receipt-slip',
    'cehp:prop:stamp-pad',
    'cehp:prop:ticket-chit',
    'cehp:prop:toner-cartridge'
  ]);
  assert.equal(paletteRefs.length > 0, true);
  assert.deepEqual(nonPaletteHex, []);
});

test('prop wobble and flutter schedules are deterministic for the same seed and instance id', () => {
  const sourcePath = path.join(srcDir, '87_props.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(PROP_MODULES);

  assert.equal(typeof CEHP.Prop, 'object');
  assert.equal(typeof CEHP.Prop.makeMotionSchedule, 'function');

  const first = CEHP.Prop.makeMotionSchedule('CASE-20260504-001-GRACE-R2', 'prop-001');
  const second = CEHP.Prop.makeMotionSchedule('CASE-20260504-001-GRACE-R2', 'prop-001');

  assert.deepEqual(
    [
      first.drawWobblePhase(),
      first.drawWobblePhase(),
      first.drawWobblePhase(),
      first.drawWobblePhase()
    ],
    [
      second.drawWobblePhase(),
      second.drawWobblePhase(),
      second.drawWobblePhase(),
      second.drawWobblePhase()
    ]
  );
  assert.deepEqual(
    [
      first.drawFlutterPhase(),
      first.drawFlutterPhase(),
      first.drawFlutterPhase(),
      first.drawFlutterPhase()
    ],
    [
      second.drawFlutterPhase(),
      second.drawFlutterPhase(),
      second.drawFlutterPhase(),
      second.drawFlutterPhase()
    ]
  );
});

test('feel kit shake budget rate-limits to one shake per eight hundred ms and respects sign-read', () => {
  const sourcePath = path.join(srcDir, '88_feel.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(FEEL_MODULES);
  const budget = CEHP.Feel.makeShakeBudget();

  assert.equal(budget.request(1000, { amplitude: 2, duration: 60, signReadActive: false }), true);
  assert.equal(budget.lastAmplitude, 2);
  assert.equal(budget.lastDuration, 60);
  assert.equal(budget.lastGrantedAt, 1000);
  assert.equal(budget.request(1500, { amplitude: 3, duration: 60, signReadActive: false }), false);
  assert.equal(budget.request(1801, { amplitude: 8, duration: 90, signReadActive: false }), true);
  assert.equal(budget.lastAmplitude, 6);
  assert.equal(budget.lastDuration, 90);
  assert.equal(budget.lastGrantedAt, 1801);
  assert.equal(budget.request(3000, { amplitude: 1, duration: 60, signReadActive: true }), false);

  budget.reset();
  assert.equal(budget.lastGrantedAt, -800);
});

test('feel kit paper fleck spawn is deterministic for same seed and pickup id', () => {
  const sourcePath = path.join(srcDir, '88_feel.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(FEEL_MODULES);
  const first = CEHP.Feel.spawnFleckVelocities('CASE-20260504-001-GRACE-R2', 'premium-pathways|premium|1');
  const second = CEHP.Feel.spawnFleckVelocities('CASE-20260504-001-GRACE-R2', 'premium-pathways|premium|1');

  assert.equal(Array.isArray(first), true);
  assert.equal(first.length, 4);
  assert.deepEqual(first, second);
});

test('feel kit early release modifier is run scoped and never mutates JUMP_VELOCITY or GRAVITY', () => {
  const movementSource = fs.readFileSync(path.join(srcDir, '21_movement.js'), 'utf8');
  const feelPath = path.join(srcDir, '88_feel.js');
  const feelExists = fs.existsSync(feelPath);

  assert.equal(feelExists, true);
  if (!feelExists) return;

  const feelSource = fs.readFileSync(feelPath, 'utf8');

  assert.deepEqual(movementSource.match(/ns\.TUNING\.JUMP_VELOCITY\s*=/g) || [], []);
  assert.deepEqual(movementSource.match(/ns\.TUNING\.GRAVITY\s*=/g) || [], []);
  assert.deepEqual(feelSource.match(/ns\.TUNING\.JUMP_VELOCITY\s*=/g) || [], []);
  assert.deepEqual(feelSource.match(/ns\.TUNING\.GRAVITY\s*=/g) || [], []);
  assert.equal(movementSource.indexOf('gravityMultiplier') >= 0, true);
  assert.equal(feelSource.indexOf('gravityMultiplier') >= 0, true);
});

test('ed kit blink schedule is deterministic for the same seed', () => {
  const sourcePath = path.join(srcDir, '89_ed_perform.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(ED_MODULES);
  const first = CEHP.Ed.makeBlinkSchedule('CASE-20260504-001-GRACE-R2');
  const second = CEHP.Ed.makeBlinkSchedule('CASE-20260504-001-GRACE-R2');
  const firstDraws = [];
  const secondDraws = [];
  let i;

  for (i = 0; i < 8; i++) {
    firstDraws.push(first.drawInterval());
    secondDraws.push(second.drawInterval());
  }

  assert.deepEqual(firstDraws, secondDraws);
  for (i = 0; i < firstDraws.length; i++) {
    assert.equal(firstDraws[i] >= 5000, true);
    assert.equal(firstDraws[i] <= 9000, true);
  }
});

test('ed kit idle breathe start phase is deterministic for the same seed', () => {
  const sourcePath = path.join(srcDir, '89_ed_perform.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(ED_MODULES);
  const first = CEHP.Ed.idleStartPhase('CASE-20260504-001-GRACE-R2');
  const second = CEHP.Ed.idleStartPhase('CASE-20260504-001-GRACE-R2');
  const other = CEHP.Ed.idleStartPhase('CASE-20260504-002-GRACE-R2');

  assert.equal(first, second);
  assert.equal(first >= 0, true);
  assert.equal(first < 1, true);
  assert.notEqual(first, other);
});

test('phase 5 fall classifier uses y-down fall distance bands', () => {
  const CEHP = loadModules(ED_MODULES);

  assert.equal(CEHP.Ed.fallClassForDistance(50), 'soft');
  assert.equal(CEHP.Ed.fallClassForDistance(150), 'medium');
  assert.equal(CEHP.Ed.fallClassForDistance(300), 'hard');
});

test('phase 5 squash/stretch applies scale multipliers and decays', () => {
  const CEHP = loadModules(ED_MODULES);
  const actor = {
    scaleX: 1,
    scaleY: 1,
    setScale: function(x, y) {
      this.scaleX = x;
      this.scaleY = y;
      return this;
    }
  };

  CEHP.Ed.applySquash(actor, 'doubleJump');
  assert.equal(actor.scaleX, 0.75);
  assert.equal(actor.scaleY, 1.3);

  CEHP.Ed.updateSquash(actor, 70);
  assert.equal(actor.scaleY < 1.05, true);
  assert.equal(actor.scaleX, 1);
  assert.equal(actor.scaleY, 1);
});

test('phase 5 squash events do not persist past decay window', () => {
  const CEHP = loadModules(ED_MODULES);
  const actor = {
    scaleX: 1,
    scaleY: 1,
    setScale: function(x, y) {
      this.scaleX = x;
      this.scaleY = y;
      return this;
    }
  };

  CEHP.Ed.applySquash(actor, 'jumpLaunch');
  assert.equal(actor.scaleX, 0.85);
  assert.equal(actor.scaleY, 1.2);

  CEHP.Ed.updateSquash(actor, 100);
  assert.equal(actor.scaleX, 1);
  assert.equal(actor.scaleY, 1);
});

test('phase 6 body shape helper splits standing crouch and slide colliders', () => {
  const CEHP = loadModules(ED_MODULES);
  function assertDims(stateName, w, h) {
    const dims = CEHP.Ed.bodyDimsForState(stateName);
    assert.equal(dims.w, w);
    assert.equal(dims.h, h);
  }

  assertDims('idle', 22, 46);
  assertDims('jumpFall', 22, 46);
  assertDims('crouch', 22, 30);
  assertDims('slide', 24, 24);
});

test('phase 6 body shape apply preserves body bottom across state changes', () => {
  const CEHP = loadModules(ED_MODULES);
  const actor = {
    _cehpState: { current: 'slide' },
    body: {
      y: 100,
      width: 22,
      height: 46,
      setSize: function(w, h, center) {
        this.width = w;
        this.height = h;
        this.centered = center;
      }
    }
  };

  assert.equal(CEHP.Ed.applyBodyShape(actor), true);
  assert.equal(actor.body.width, 24);
  assert.equal(actor.body.height, 24);
  assert.equal(actor.body.centered, true);
  assert.equal(actor.body.y + actor.body.height, 146);
  assert.equal(CEHP.Ed.applyBodyShape(actor), false);
});

test('phase 6 body shape cache gates setSize to resolved shape changes', () => {
  const CEHP = loadModules(ED_MODULES);
  let setSizeCalls = 0;
  const actor = {
    _cehpState: { current: 'idle' },
    body: {
      y: 100,
      width: 1,
      height: 46,
      setSize: function(w, h, center) {
        setSizeCalls++;
        this.width = w;
        this.height = h;
        this.centered = center;
      }
    }
  };

  assert.equal(CEHP.Ed.applyBodyShape(actor), true);
  assert.equal(setSizeCalls, 1);
  assert.equal(actor.body.width, 22);
  assert.equal(actor.body.height, 46);
  assert.equal(actor.body.y + actor.body.height, 146);

  actor.body.width = 17;
  assert.equal(CEHP.Ed.applyBodyShape(actor, 'jumpFall'), false);
  assert.equal(setSizeCalls, 1);
  assert.equal(actor.body.width, 17);
  assert.equal(actor.body.y + actor.body.height, 146);

  assert.equal(CEHP.Ed.applyBodyShape(actor, 'slide'), true);
  assert.equal(setSizeCalls, 2);
  assert.equal(actor.body.width, 24);
  assert.equal(actor.body.height, 24);
  assert.equal(actor.body.y + actor.body.height, 146);

  assert.equal(CEHP.Ed.applyBodyShape(actor, 'crouch'), true);
  assert.equal(setSizeCalls, 3);
  assert.equal(actor.body.width, 22);
  assert.equal(actor.body.height, 30);
  assert.equal(actor.body.y + actor.body.height, 146);
});

test('air kit paper drift schedule is deterministic for the same seed', () => {
  const sourcePath = path.join(srcDir, '8A_air.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(AIR_MODULES);
  const first = CEHP.Air.makePaperSchedule('CASE-20260504-001-GRACE-R2');
  const second = CEHP.Air.makePaperSchedule('CASE-20260504-001-GRACE-R2');
  const firstIntervals = [];
  const secondIntervals = [];
  const firstLifespans = [];
  const secondLifespans = [];
  let i;

  for (i = 0; i < 8; i++) {
    firstIntervals.push(first.drawInterval());
    secondIntervals.push(second.drawInterval());
    firstLifespans.push(first.drawLifespan());
    secondLifespans.push(second.drawLifespan());
  }

  assert.deepEqual(firstIntervals, secondIntervals);
  assert.deepEqual(firstLifespans, secondLifespans);

  for (i = 0; i < 8; i++) {
    assert.equal(firstIntervals[i] >= 3000, true);
    assert.equal(firstIntervals[i] <= 8000, true);
    assert.equal(firstLifespans[i] >= 25000, true);
    assert.equal(firstLifespans[i] <= 45000, true);
  }
});

test('air kit flicker beat schedule is deterministic for the same seed', () => {
  const sourcePath = path.join(srcDir, '8A_air.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(AIR_MODULES);
  const first = CEHP.Air.makeFlickerSchedule('CASE-20260504-001-GRACE-R2');
  const second = CEHP.Air.makeFlickerSchedule('CASE-20260504-001-GRACE-R2');
  const firstIntervals = [];
  const secondIntervals = [];
  let i;

  for (i = 0; i < 8; i++) {
    firstIntervals.push(first.drawInterval());
    secondIntervals.push(second.drawInterval());
  }

  assert.deepEqual(firstIntervals, secondIntervals);

  for (i = 0; i < 8; i++) {
    assert.equal(firstIntervals[i] >= 7000, true);
    assert.equal(firstIntervals[i] <= 14000, true);
  }
});

test('air kit cleanup is safe when called after state is already gone', () => {
  const CEHP = loadModules(AIR_MODULES);
  const scene = {
    cameras: { main: { alpha: 1, scrollY: 0 } },
    _cehpAir: 0
  };
  const cameraLess = {
    _cehpAir: {
      b: 0,
      y: 0,
      p: [],
      d: [],
      v: { destroy() {} }
    }
  };

  assert.doesNotThrow(() => {
    CEHP.Air.cleanup(scene);
    CEHP.Air.cleanup(scene);
    CEHP.Air.cleanup(cameraLess);
  });
});

test('trampoline keeps procedural fallback when stamp-pad art is unavailable', () => {
  function makeDisplayNode(x, y, key) {
    return {
      x,
      y,
      key: key || '',
      width: 0,
      height: 0,
      depth: 0,
      alpha: 1,
      displayWidth: 0,
      displayHeight: 0,
      setDepth(value) { this.depth = value; return this; },
      setOrigin() { return this; },
      setAlpha(value) { this.alpha = value; return this; },
      setDisplaySize(width, height) {
        this.displayWidth = width;
        this.displayHeight = height;
        return this;
      }
    };
  }

  function makeScene(hasArt) {
    const imageCalls = [];
    return {
      imageCalls,
      textures: {
        exists(key) {
          return hasArt && key === 'prop_stamp_pad';
        }
      },
      add: {
        rectangle(x, y, width, height) {
          const node = makeDisplayNode(x, y);
          node.width = width;
          node.height = height;
          return node;
        },
        text(x, y, text) {
          const node = makeDisplayNode(x, y);
          node.text = text;
          return node;
        },
        image(x, y, key) {
          const node = makeDisplayNode(x, y, key);
          imageCalls.push(node);
          return node;
        }
      },
      physics: {
        add: {
          existing(node) {
            node.body = {
              allowGravity: true,
              updateFromGameObject() {}
            };
          }
        }
      }
    };
  }

  const CEHP = loadModules(FORMS_MODULES);
  const withoutArtScene = makeScene(false);
  const withArtScene = makeScene(true);
  const fallback = CEHP.Forms.trampoline(withoutArtScene, { x: 64, y: 128, width: 70, height: 12, power: 530 });
  const skinned = CEHP.Forms.trampoline(withArtScene, { x: 64, y: 128, width: 70, height: 12, power: 530 });
  const actor = {
    body: {
      velocityY: 0,
      setVelocityY(value) {
        this.velocityY = value;
      }
    }
  };

  fallback.activate(actor);
  assert.equal(actor.body.velocityY, -530);
  assert.equal(fallback.kind, 'trampoline');
  assert.equal(fallback.label.text, 'STAMP PAD');
  assert.equal(fallback.art, null);
  assert.equal(withoutArtScene.imageCalls.length, 0);

  actor.body.velocityY = 0;
  skinned.activate(actor);
  assert.equal(actor.body.velocityY, -530);
  assert.equal(skinned.rect.body.allowGravity, false);
  assert.equal(skinned.art.key, 'prop_stamp_pad');
  assert.equal(skinned.art.displayWidth > skinned.rect.width, true);
  assert.equal(withArtScene.imageCalls.length, 1);
});

/* ==================================================================
   W8-R03: receipt tone bias (Perchtold 2019 benign-reframe alignment)
   ------------------------------------------------------------------ */

test('receipt tone bias favors benign verdicts under ambivalent signal', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const benignPrefixes = [
    'VERDICT_COMPLIANCE_',
    'VERDICT_CURIOSITY_',
    'VERDICT_GRACE_',
    'VERDICT_EFFICIENCY_',
    'VERDICT_INTUITION_',
    'VERDICT_ORIENTATION_',
    'VERDICT_BENEFITS_SECURED_',
    'VERDICT_RASTA_REST_',
    'VERDICT_RASTA_RUSH_'
  ];
  const axes = {
    primary: {
      compliance: 0.5, intuition: 0.5, curiosity: 0.5,
      grace: 0.5, chaos: 0.5, efficiency: 0.5
    },
    micro: { contradictionFollow: 0, contradictionDefy: 0, signPeeks: 0, signsRead: 0 }
  };
  const tensions = { obedience: 0.0, style: 0.0, auditRisk: 0.0 };
  const samples = 200;
  let benignCount = 0;
  for (let i = 0; i < samples; i += 1) {
    const seed = 'CASE-20260420-' + String(i + 1).padStart(3, '0') + '-CURIOSITY-R2';
    const receipt = CEHP.Receipts.generate({ seed, axes, tensions });
    const verdictId = receipt.fragmentIds[0] || '';
    const isBenign = benignPrefixes.some((p) => verdictId.startsWith(p));
    if (isBenign) benignCount += 1;
  }
  assert.ok(
    benignCount / samples >= 0.55,
    'expected >=55% benign verdicts under ambivalent signal; got ' + benignCount + '/' + samples
  );
});

test('receipt tone bias preserves determinism for the same seed', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const seed = 'CASE-20260420-007-CURIOSITY-R2';
  const axes = {
    primary: {
      compliance: 0.5, intuition: 0.5, curiosity: 0.5,
      grace: 0.5, chaos: 0.5, efficiency: 0.5
    },
    micro: { contradictionFollow: 1, signPeeks: 2 }
  };
  const tensions = { obedience: 0.0, style: 0.5, auditRisk: 0.0 };
  const first = CEHP.Receipts.generate({ seed, axes, tensions });
  const second = CEHP.Receipts.generate({ seed, axes, tensions });
  assert.deepEqual(first.fragmentIds, second.fragmentIds,
    'tone bias must not add non-determinism to scoreFragment');
  assert.deepEqual(first.lines, second.lines,
    'tone bias must not change which verdict text renders between identical calls');
});

test('receipt tone bias does not override clear axis signal', () => {
  const CEHP = loadModules(LOGIC_MODULES);
  const chaoticAxes = {
    primary: {
      compliance: 0.05, intuition: 0.2, curiosity: 0.4,
      grace: 0.1, chaos: 0.95, efficiency: 0.1
    },
    micro: { contradictionFollow: 0, contradictionDefy: 3, kickCount: 2, punchCount: 1 }
  };
  const receipt = CEHP.Receipts.generate({
    seed: 'CASE-20260420-099-CHAOS-R2',
    axes: chaoticAxes,
    tensions: { obedience: -1.2, style: 0.1, auditRisk: 0.5 }
  });
  assert.equal(
    receipt.fragmentIds[0].indexOf('VERDICT_CHAOS_'), 0,
    'strong chaos axis must beat malicious tone penalty; got ' + receipt.fragmentIds[0]
  );
});

function makeFeelScene() {
  const captured = { x: 0, y: 0 };
  const scene = {
    cameras: {
      main: {
        setFollowOffset: function(x, y) { captured.x = x; captured.y = y; },
        scrollY: 0,
        shake: function() {},
        flash: function() {}
      }
    },
    events: { once: function() {} },
    tweens: { add: function() {} }
  };
  return { scene: scene, captured: captured };
}

test('feel kit camera fall anticipation shifts follow offset downward when airborne and falling', () => {
  const CEHP = loadModules(FEEL_MODULES);
  const rig = makeFeelScene();
  const ed = {
    facing: 1,
    body: { velocity: { x: 0, y: 400 }, blocked: { down: false } }
  };
  let frame;
  for (frame = 0; frame < 30; frame++) CEHP.Feel.updateCamera(rig.scene, 16, ed);
  assert.equal(
    rig.captured.y >= 20, true,
    'expected follow offset.y >= 20 after sustained fall; got ' + rig.captured.y
  );
});

test('feel kit camera fall anticipation yields precedence to onLanding settle tween', () => {
  const CEHP = loadModules(FEEL_MODULES);
  const rig = makeFeelScene();
  const ed = {
    facing: 1,
    body: { velocity: { x: 0, y: 400 }, blocked: { down: false } }
  };
  CEHP.Feel.updateCamera(rig.scene, 16, ed);
  rig.scene._cehpFeel.settleTween = { stop: function() {}, remove: function() {} };
  rig.scene._cehpFeel.vertOffset = 0;
  let frame;
  for (frame = 0; frame < 30; frame++) CEHP.Feel.updateCamera(rig.scene, 16, ed);
  assert.equal(
    rig.captured.y, 0,
    'settle tween must suppress fall anticipation; got ' + rig.captured.y
  );
});

test('feel kit camera apex bias shifts follow offset upward during jump apex window', () => {
  const CEHP = loadModules(FEEL_MODULES);
  const rig = makeFeelScene();
  const rising = {
    facing: 1,
    body: { velocity: { x: 0, y: -150 }, blocked: { down: false } }
  };
  CEHP.Feel.updateCamera(rig.scene, 16, rising);
  const apex = {
    facing: 1,
    body: { velocity: { x: 0, y: -30 }, blocked: { down: false } }
  };
  let frame;
  for (frame = 0; frame < 25; frame++) CEHP.Feel.updateCamera(rig.scene, 16, apex);
  assert.equal(
    rig.captured.y <= -12, true,
    'expected follow offset.y <= -12 during apex window; got ' + rig.captured.y
  );
});

/* ==================================================================
   W8-R01: enemy telegraph cycle (windup->active->recovery->cooldown;
   damage gated to 'active' phase; ±40ms seeded jitter)
   ------------------------------------------------------------------ */

const ENEMY_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '60_enemies.js'
];

const ENEMY_STATE_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '04_fixed_step.js',
  '05_input_buffer.js',
  '06_cancel_matrix.js',
  '07_ed_state.js',
  '60_enemies.js'
];

function makeStateActor(overrides) {
  const actor = {
    x: 0,
    y: 0,
    facing: 1,
    jumpVelocity: -340,
    invulnMs: 0,
    attackMs: 0,
    wallSliding: false,
    jumpsUsed: 0,
    scene: { pendingDeath: null },
    body: {
      velocity: { x: 0, y: 0 },
      blocked: { down: true, left: false, right: false, up: false },
      touching: { down: true, left: false, right: false, up: false }
    }
  };
  return Object.assign(actor, overrides || {});
}

function makeStateInput(overrides) {
  overrides = overrides || {};
  return {
    axisX: function() { return overrides.axisX == null ? 0 : overrides.axisX; },
    axisY: function() { return overrides.axisY == null ? 0 : overrides.axisY; },
    down: function(action) { return !!(overrides.down && overrides.down[action]); },
    justPressed: function(action) { return !!(overrides.justPressed && overrides.justPressed[action]); },
    justReleased: function(action) { return !!(overrides.justReleased && overrides.justReleased[action]); }
  };
}

function makeMutableInput() {
  const state = {
    axisX: 0,
    axisY: 0,
    down: {},
    justPressed: {},
    justReleased: {}
  };

  return {
    state,
    input: {
      axisX: function() { return state.axisX; },
      axisY: function() { return state.axisY; },
      down: function(action) { return !!state.down[action]; },
      justPressed: function(action) { return !!state.justPressed[action]; },
      justReleased: function(action) { return !!state.justReleased[action]; }
    },
    clearEdges: function() {
      state.justPressed = {};
      state.justReleased = {};
    }
  };
}

function makeRuntimeScene() {
  const scene = {
    _assistTuning: null,
    add: {
      rectangle: function(x, y, width, height, fillColor, alpha) {
        return {
          x: x,
          y: y,
          width: width,
          height: height,
          fillColor: fillColor,
          alpha: alpha == null ? 1 : alpha,
          scene: null,
          body: null,
          setDepth: function() { return this; }
        };
      }
    },
    physics: {
      add: {
        existing: function(node) {
          node.scene = node.scene || scene;
          node.body = {
            blocked: { down: true, left: false, right: false, up: false },
            touching: { down: true, left: false, right: false, up: false },
            velocity: { x: 0, y: 0 },
            drag: { x: 0 },
            maxVelocity: { x: 0, y: 0 },
            setCollideWorldBounds: function() {},
            setSize: function() {},
            setDragX: function(value) { this.drag.x = value; },
            setMaxVelocity: function(x, y) {
              this.maxVelocity.x = x;
              this.maxVelocity.y = y;
            },
            setVelocity: function(x, y) {
              this.velocity.x = x;
              this.velocity.y = y;
            },
            setVelocityX: function(x) { this.velocity.x = x; },
            setVelocityY: function(y) { this.velocity.y = y; },
            setGravityY: function(value) { this.gravityY = value; },
            reset: function(x, y) {
              node.x = x;
              node.y = y;
              this.velocity.x = 0;
              this.velocity.y = 0;
            }
          };
        }
      }
    }
  };
  return scene;
}

test('phase 2 state module enter and exit preserve invariants', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_MODULES);
  const actor = makeStateActor();
  const state = CEHP.EdState.ensure(actor);

  assert.equal(typeof CEHP.EdState, 'object');
  assert.equal(state.current, 'idle');

  state.fixed.frame = 12;
  CEHP.EdState.enter(actor, 'run');

  assert.equal(state.current, 'run');
  assert.equal(state.previous, 'idle');
  assert.equal(state.enteredFrame, 12);
  assert.equal(state.stateFrame, 0);

  state.fixed.frame = 16;
  state.stateFrame = 4;
  CEHP.EdState.enter(actor, 'run');

  assert.equal(state.current, 'run');
  assert.equal(state.previous, 'idle');
  assert.equal(state.enteredFrame, 12);
  assert.equal(state.stateFrame, 4);

  CEHP.EdState.enter(actor, 'jumpRise');

  assert.equal(state.current, 'jumpRise');
  assert.equal(state.previous, 'run');
  assert.equal(state.enteredFrame, 16);
  assert.equal(state.stateFrame, 0);
});

test('phase 2 state priority stack gives supremacy to death and hurt overrides', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_MODULES);
  const actor = makeStateActor({
    invulnMs: 450,
    attackMs: 120,
    wallSliding: true,
    jumpsUsed: 2,
    scene: { pendingDeath: { source: 'hazard' } }
  });
  const input = makeStateInput({ axisX: -1 });
  const state = CEHP.EdState.ensure(actor);

  CEHP.EdState.tick(actor, input, 16);
  assert.equal(state.current, 'death');

  actor.scene.pendingDeath = null;
  state.latchedState.name = 'hitStop';
  state.latchedState.framesLeft = 2;
  CEHP.EdState.tick(actor, input, 16);
  assert.equal(state.current, 'hitStop');

  state.latchedState.name = '';
  state.latchedState.framesLeft = 0;
  CEHP.EdState.tick(actor, input, 16);
  assert.equal(state.current, 'iFrameHurt');
});

test('phase 2 state canTransition is driven by CancelMatrix rules only', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_MODULES);
  const actor = makeStateActor();
  const state = CEHP.EdState.ensure(actor);

  state.fixed.frame = 10;
  CEHP.InputBuffer.push(state.buffer, 'jump', 10, { source: 'test' });
  let rule = CEHP.EdState.canTransition(actor, 'jump');

  assert.equal(rule && rule.toState, 'jumpRise');
  assert.equal(rule && rule.entry && rule.entry.meta.source, 'test');

  CEHP.EdState.enter(actor, 'run');
  state.fixed.frame = 15;
  state.enteredFrame = 15;
  state.stateFrame = 0;
  CEHP.InputBuffer.push(state.buffer, 'dash', 15, { source: 'dash-now' });
  rule = CEHP.EdState.canTransition(actor, 'dash');

  assert.equal(rule && rule.toState, 'dash');

  state.stateFrame = 0;
  CEHP.InputBuffer.push(state.buffer, 'ranged', 15, { source: 'ranged-now' });
  assert.equal(CEHP.EdState.canTransition(actor, 'ranged').toState, 'ranged');

  CEHP.EdState.enter(actor, 'wallSlide');
  state.fixed.frame = 22;
  state.enteredFrame = 22;
  state.stateFrame = 0;
  CEHP.InputBuffer.push(state.buffer, 'jump', 22, { source: 'wall' });
  rule = CEHP.EdState.canTransition(actor, 'jump');
  assert.equal(rule && rule.toState, 'wallJump');

  CEHP.EdState.enter(actor, 'idle');
  state.fixed.frame = 30;
  state.enteredFrame = 30;
  state.stateFrame = 0;
  assert.equal(CEHP.EdState.canTransition(actor, 'wallJump'), null);

  CEHP.EdState.enter(actor, 'run');
  state.fixed.frame = 40;
  state.enteredFrame = 34;
  state.stateFrame = 0;
  state.buffer = CEHP.InputBuffer.create({ capacity: 3 });
  CEHP.InputBuffer.push(state.buffer, 'dash', 34, { source: 'late' });
  assert.equal(CEHP.EdState.canTransition(actor, 'dash'), null);
});

test('phase 2 state module self-wires movement createEd apply and respawn', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const input = makeStateInput({ axisX: 1, justPressed: { jump: true } });

  assert.equal(typeof CEHP.EdState, 'object');
  assert.equal(!!player._cehpState, true);
  assert.equal(player.spawnX, 72);
  assert.equal(player.spawnY, 96);
  assert.equal(player.jumpVelocity, undefined);

  CEHP.Movement.apply(player, input, 16);
  assert.equal(player._cehpState.current, 'jumpRise');
  assert.equal(player._cehpState.fixed.alpha > 0, true);

  player.x = 180;
  player.y = 220;
  player.body.velocity.x = 77;
  player.body.velocity.y = -20;
  player._cehpState.current = 'death';
  CEHP.Movement.respawn(player);

  assert.equal(player.x, 72);
  assert.equal(player.y, 96);
  assert.equal(player.body.velocity.x, 0);
  assert.equal(player.body.velocity.y, 0);
  assert.equal(player._cehpState.current, 'idle');
  assert.equal(player._cehpState.stateFrame, 0);
});

test('phase 2.5 state transitions emit in deterministic order with preserved triggers', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_MODULES);
  const actor = makeStateActor();
  const state = CEHP.EdState.ensure(actor);
  const transitions = [];

  CEHP.Events.on('state:transition', function(payload) {
    transitions.push(JSON.parse(JSON.stringify(payload)));
  });

  state.fixed.frame = 5;
  actor.body.velocity.x = 48;
  actor.body.velocity.y = 0;
  CEHP.EdState.enter(actor, 'run', 'input');

  state.fixed.frame = 8;
  actor.body.blocked.down = false;
  actor.body.touching.down = false;
  actor.body.velocity.x = 92;
  actor.body.velocity.y = -220;
  CEHP.EdState.enter(actor, 'jumpRise', 'input');

  state.fixed.frame = 8;
  CEHP.EdState.enter(actor, 'jumpRise', 'physics');

  state.fixed.frame = 12;
  actor.body.velocity.x = 88;
  actor.body.velocity.y = 36;
  CEHP.EdState.enter(actor, 'jumpFall', 'physics');

  state.fixed.frame = 15;
  actor.scene.pendingDeath = { source: 'test-hazard' };
  actor.body.velocity.x = 0;
  actor.body.velocity.y = 120;
  CEHP.EdState.enter(actor, 'death', 'event');

  assert.equal(transitions.length, 4);
  assert.deepEqual(transitions.map(function(entry) { return entry.from; }), ['idle', 'run', 'jumpRise', 'jumpFall']);
  assert.deepEqual(transitions.map(function(entry) { return entry.to; }), ['run', 'jumpRise', 'jumpFall', 'death']);
  assert.deepEqual(transitions.map(function(entry) { return entry.trigger; }), ['input', 'input', 'physics', 'event']);
  assert.deepEqual(transitions.map(function(entry) { return entry.frame; }), [5, 8, 12, 15]);
  assert.deepEqual(transitions.map(function(entry) { return entry.stateFrame; }), [5, 3, 4, 3]);
  assert.deepEqual(transitions.map(function(entry) { return entry.grounded; }), [true, false, false, false]);
  assert.deepEqual(transitions.map(function(entry) { return [entry.vx, entry.vy]; }), [[48, 0], [92, -220], [88, 36], [0, 120]]);
  assert.equal(transitions[1].frame >= transitions[0].frame, true);
  assert.equal(transitions[2].frame >= transitions[1].frame, true);
  assert.equal(transitions[3].frame >= transitions[2].frame, true);
  assert.equal(transitions[1].stateFrame > 0, true);
  assert.equal(transitions[2].stateFrame > 0, true);
  assert.equal(transitions[3].stateFrame > 0, true);
});

test('phase 2.5 state near-misses report gated_by reasons in rule order', () => {
  const sourcePath = path.join(srcDir, '07_ed_state.js');
  const exists = fs.existsSync(sourcePath);

  assert.equal(exists, true);
  if (!exists) return;

  const CEHP = loadModules(STATE_MODULES);
  const actor = makeStateActor({
    body: {
      velocity: { x: 0, y: 0 },
      blocked: { down: false, left: false, right: false, up: false },
      touching: { down: false, left: false, right: false, up: false }
    }
  });
  const state = CEHP.EdState.ensure(actor);
  const nearMisses = [];

  CEHP.Events.on('state:nearMiss', function(payload) {
    nearMisses.push(JSON.parse(JSON.stringify(payload)));
  });

  CEHP.CancelMatrix.rules = function() {
    return {
      jumpRise: {
        dash: {
          toState: 'dash',
          bufferFrames: 3,
          cooldownFrames: 60,
          window: { startFrame: 5, endFrame: 10 }
        }
      }
    };
  };

  CEHP.EdState.enter(actor, 'jumpRise', 'physics');

  state.fixed.frame = 20;
  state.stateFrame = 3;
  state.cooldowns = {};
  state.buffer = CEHP.InputBuffer.create({ capacity: 4 });
  CEHP.InputBuffer.push(state.buffer, 'dash', 20, { source: 'attempt-early' });
  assert.equal(CEHP.EdState.canTransition(actor, 'dash'), null);

  state.fixed.frame = 21;
  state.stateFrame = 12;
  state.cooldowns = {};
  state.buffer = CEHP.InputBuffer.create({ capacity: 4 });
  CEHP.InputBuffer.push(state.buffer, 'dash', 21, { source: 'attempt-late' });
  assert.equal(CEHP.EdState.canTransition(actor, 'dash'), null);

  state.fixed.frame = 22;
  state.stateFrame = 7;
  state.cooldowns = {};
  state.buffer = CEHP.InputBuffer.create({ capacity: 4 });
  CEHP.InputBuffer.push(state.buffer, 'dash', 18, { source: 'attempt-stale' });
  assert.equal(CEHP.EdState.canTransition(actor, 'dash'), null);

  state.fixed.frame = 23;
  state.stateFrame = 7;
  state.cooldowns = { dash: 99 };
  state.buffer = CEHP.InputBuffer.create({ capacity: 4 });
  CEHP.InputBuffer.push(state.buffer, 'dash', 23, { source: 'attempt-cooldown' });
  assert.equal(CEHP.EdState.canTransition(actor, 'dash'), null);

  assert.equal(nearMisses.length, 4);
  assert.deepEqual(nearMisses.map(function(entry) { return entry.gated_by; }), [
    'window_too_early',
    'window_too_late',
    'buffer_miss',
    'cooldown'
  ]);
  assert.deepEqual(nearMisses.map(function(entry) { return entry.action; }), ['dash', 'dash', 'dash', 'dash']);
  assert.deepEqual(nearMisses.map(function(entry) { return entry.state; }), ['jumpRise', 'jumpRise', 'jumpRise', 'jumpRise']);
  assert.deepEqual(nearMisses.map(function(entry) { return entry.frame; }), [20, 21, 22, 23]);
  assert.deepEqual(nearMisses.map(function(entry) { return entry.stateFrame; }), [3, 12, 7, 7]);
});

test('phase 3 dash and double jump are bounded verbs', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();

  rig.state.axisX = 1;
  rig.state.down.spinDash = true;
  rig.state.justPressed.spinDash = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();

  assert.equal(player._cehpState.verbs.dashPhase, 'windup');
  CEHP.Movement.apply(player, rig.input, 50);
  assert.equal(player._cehpState.verbs.dashPhase, 'active');
  assert.equal(player.body.velocity.x, 260);

  player._cehpState.verbs.dashPhase = '';
  player._cehpState.verbs.dashMs = 0;
  player._cehpState.verbs.dashRecoveryMs = 0;
  player.body.blocked.down = false;
  player.body.touching.down = false;
  player.body.velocity.x = 0;
  rig.state.justPressed.spinDash = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.notEqual(player._cehpState.verbs.dashPhase, 'active');

  rig.state.down.spinDash = false;
  rig.state.axisX = 0;
  player.jumpsUsed = 1;
  player._cehpState.verbs.airJumpsLeft = 1;
  player.body.velocity.x = 100;
  player.body.velocity.y = 40;
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();

  assert.equal(Math.abs(player.body.velocity.y - (-278.8)) < 0.001, true);
  assert.equal(player.body.velocity.x, 90);
  assert.equal(player.jumpsUsed, 2);
  assert.equal(player._cehpState.verbs.airJumpsLeft, 0);

  player.body.velocity.y = 20;
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player.body.velocity.y, CEHP.TUNING.TRIPLE_JUMP);
  assert.equal(player.jumpsUsed, 3);
});

test('phase 6 jump-family single owner ignores stale legacy jump buffer', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();
  const topics = [];

  ['movement:jump', 'movement:doubleJump', 'movement:tripleJump', 'movement:wallJump'].forEach(function(topic) {
    CEHP.Events.on(topic, function() {
      topics.push(topic);
    });
  });

  player.body.blocked.down = false;
  player.body.touching.down = false;
  player.body.blocked.right = true;
  player.body.velocity.y = 80;
  player.wallSliding = true;
  player.jumpBufferMs = CEHP.TUNING.JUMP_BUFFER_MS;
  player.jumpsUsed = 1;
  rig.state.axisX = 1;
  rig.state.down.right = true;
  rig.state.justPressed.jump = true;

  CEHP.Movement.apply(player, rig.input, 16);

  assert.deepEqual(topics, ['movement:wallJump']);
  assert.equal(player.body.velocity.x, -207);
  assert.equal(Math.abs(player.body.velocity.y - (-312.8)) < 0.001, true);
});

test('phase 6 state machine owns triple jump emission and impulse', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();
  const topics = [];

  CEHP.Events.on('movement:tripleJump', function(payload) {
    topics.push({ topic: 'movement:tripleJump', x: payload.x, y: payload.y });
  });

  player.body.blocked.down = false;
  player.body.touching.down = false;
  player.body.velocity.y = 20;
  player.jumpsUsed = 2;
  player._cehpState.verbs.airJumpsLeft = 0;
  rig.state.justPressed.jump = true;

  CEHP.Movement.apply(player, rig.input, 16);

  assert.deepEqual(topics.map(function(entry) { return entry.topic; }), ['movement:tripleJump']);
  assert.equal(player.body.velocity.y, CEHP.TUNING.TRIPLE_JUMP);
  assert.equal(player.jumpsUsed, 3);
});

test('phase 6 jump-family emission ownership stays in state machine and approved mappers', () => {
  const approved = new Set(['07_ed_state.js', '74_world_orientation_runtime.js']);
  const pattern = /(?:ns\.Events\.emit|emitMovementEvent|emitPlayerEvent)\('movement:(?:jump|doubleJump|tripleJump|wallJump)'|applyJump\([^\n]*'movement:(?:jump|doubleJump|tripleJump|wallJump)'/g;
  const offenders = [];

  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.js')) continue;
    const source = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const matches = source.match(pattern);
    if (matches && !approved.has(file)) {
      offenders.push(file + ': ' + matches.join(', '));
    }
  }

  assert.deepEqual(offenders, []);
});

test('phase 3 wall verbs require held wall input and explicit climb markers', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();

  scene.physics.world = { _cehpClimbBounds: false };
  player.body.blocked.down = false;
  player.body.touching.down = false;
  player.body.blocked.right = true;
  player.body.velocity.y = 500;
  rig.state.axisX = 1;
  rig.state.down.right = true;
  CEHP.Movement.apply(player, rig.input, 16);

  assert.equal(player.wallSliding, true);
  assert.equal(player.body.velocity.y, 224);

  rig.state.down.up = true;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player._cehpState.verbs.wallClimb, 0);

  scene.physics.world._cehpClimbBounds = true;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player._cehpState.verbs.wallClimb, 1);
  assert.equal(player.body.velocity.y, -90);

  scene.physics.world._cehpClimbBounds = false;
  rig.state.down.up = false;
  player.body.velocity.y = 80;
  player._cehpState.verbs.wallClimb = 0;
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();

  assert.equal(player.body.velocity.x, -207);
  assert.equal(Math.abs(player.body.velocity.y - (-312.8)) < 0.001, true);
  assert.equal(player._cehpState.verbs.wallJumpCommitMs > 0, true);

  rig.state.axisX = 1;
  player.body.velocity.x = 180;
  CEHP.Movement.apply(player, rig.input, 50);
  assert.equal(player.body.velocity.x, -207);
});

test('phase 3 slide cancel window and diagonal aim stay explicit', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();

  rig.state.axisX = 1;
  rig.state.down.down = true;
  rig.state.down.spinDash = true;
  rig.state.justPressed.spinDash = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  CEHP.Movement.apply(player, rig.input, 33);
  assert.equal(player._cehpState.verbs.slidePhase, 'active');

  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y >= 0, true);
  assert.equal(player._cehpState.verbs.slidePhase, 'active');

  CEHP.Movement.apply(player, rig.input, 120);
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y, CEHP.TUNING.JUMP_VELOCITY);
  assert.equal(player.body.velocity.x, 194.4);

  rig.state.down.down = false;
  rig.state.down.spinDash = false;
  rig.state.down.up = true;
  rig.state.justPressed.punch = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player._cehpAimDeg, -35);

  rig.state.down.up = false;
  rig.state.down.down = true;
  rig.state.justPressed.kick = true;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player._cehpAimDeg, 35);
});

function setPlayerGrounded(player, grounded) {
  player.body.blocked.down = grounded;
  player.body.touching.down = grounded;
}

test('phase 4 coyote and landing jump-buffer windows are exact', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  let scene = makeRuntimeScene();
  let player = CEHP.Movement.createEd(scene, 72, 96);
  let rig = makeMutableInput();

  CEHP.Movement.apply(player, rig.input, 16);
  setPlayerGrounded(player, false);
  player.body.velocity.y = 12;
  CEHP.Movement.apply(player, rig.input, 80);
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y, CEHP.TUNING.JUMP_VELOCITY);

  scene = makeRuntimeScene();
  player = CEHP.Movement.createEd(scene, 72, 96);
  rig = makeMutableInput();
  CEHP.Movement.apply(player, rig.input, 16);
  setPlayerGrounded(player, false);
  player.body.velocity.y = 12;
  CEHP.Movement.apply(player, rig.input, 120);
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y >= 0, true);

  scene = makeRuntimeScene();
  player = CEHP.Movement.createEd(scene, 72, 96);
  rig = makeMutableInput();
  setPlayerGrounded(player, false);
  player.jumpsUsed = 0;
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  CEHP.Movement.apply(player, rig.input, 44);
  setPlayerGrounded(player, true);
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player.body.velocity.y, CEHP.TUNING.JUMP_VELOCITY);

  scene = makeRuntimeScene();
  player = CEHP.Movement.createEd(scene, 72, 96);
  rig = makeMutableInput();
  setPlayerGrounded(player, false);
  player.jumpsUsed = 0;
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  CEHP.Movement.apply(player, rig.input, 134);
  setPlayerGrounded(player, true);
  CEHP.Movement.apply(player, rig.input, 16);
  assert.notEqual(player.body.velocity.y, CEHP.TUNING.JUMP_VELOCITY);
});

test('phase 4 variable jump cut clamps rising velocity once inside release window', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  let scene = makeRuntimeScene();
  let player = CEHP.Movement.createEd(scene, 72, 96);
  let rig = makeMutableInput();

  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  setPlayerGrounded(player, false);
  player.body.velocity.y = -400;
  CEHP.Movement.apply(player, rig.input, 84);
  rig.state.justReleased.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y, -240);

  player.body.velocity.y = -360;
  rig.state.justReleased.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  assert.equal(player.body.velocity.y, -360);

  scene = makeRuntimeScene();
  player = CEHP.Movement.createEd(scene, 72, 96);
  rig = makeMutableInput();
  rig.state.justPressed.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  rig.clearEdges();
  setPlayerGrounded(player, false);
  player.body.velocity.y = -400;
  CEHP.Movement.apply(player, rig.input, 184);
  rig.state.justReleased.jump = true;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player.body.velocity.y, -400);
});

test('phase 4 gravity deltas are read-time body gravity and never mutate globals', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();
  const baseGravity = CEHP.TUNING.GRAVITY;

  setPlayerGrounded(player, false);
  player.body.velocity.y = 0;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(CEHP.TUNING.GRAVITY, baseGravity);
  assert.equal(player._cehpState.phase4.effectiveGravity, baseGravity * 0.90);
  assert.equal(player.body.gravityY, -90);

  player.body.velocity.y = 80;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(CEHP.TUNING.GRAVITY, baseGravity);
  assert.equal(player._cehpState.phase4.effectiveGravity, baseGravity * 1.12);
  assert.equal(player.body.gravityY, 108);
});

test('phase 4 hit-stop durations freeze Ed and tag the striker actor', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();
  const striker = {};

  assert.equal(CEHP.EdState.hitStop(player, 'damage', striker), 67);
  assert.equal(CEHP.EdState.snapshot(player).phase4.hitStopMs, 67);
  assert.equal(striker._cehpHitStopMs, 67);
  player.body.velocity.x = 123;
  rig.state.axisX = 1;
  CEHP.Movement.apply(player, rig.input, 16);
  assert.equal(player.body.velocity.x, 123);
  assert.equal(CEHP.EdState.snapshot(player).phase4.hitStopMs, 51);

  player._cehpState.phase4.hitStopMs = 0;
  assert.equal(CEHP.EdState.hitStop(player, 'melee'), 50);
  assert.equal(CEHP.EdState.snapshot(player).phase4.hitStopMs, 50);
  assert.equal(CEHP.EdState.hitStop(player, 'projectile'), 17);
  assert.equal(CEHP.EdState.snapshot(player).phase4.hitStopMs, 50);
});

test('phase 4 i-frames reject repeat damage until the 900ms window expires', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();

  assert.equal(CEHP.EdState.damage(player, 'scantron'), true);
  assert.equal(CEHP.EdState.snapshot(player).phase4.iframesMs, 900);
  CEHP.Movement.apply(player, rig.input, 500);
  assert.equal(CEHP.EdState.damage(player, 'scantron'), false);
  CEHP.Movement.apply(player, rig.input, 450);
  assert.equal(CEHP.EdState.damage(player, 'scantron'), true);
});

test('phase 4 post-damage lock blocks axis then restores airborne nudge at 80ms', () => {
  const CEHP = loadModules(STATE_RUNTIME_MODULES);
  const scene = makeRuntimeScene();
  const player = CEHP.Movement.createEd(scene, 72, 96);
  const rig = makeMutableInput();

  setPlayerGrounded(player, false);
  assert.equal(CEHP.EdState.damage(player, 'deductible'), true);
  player._cehpState.phase4.hitStopMs = 0;
  player._cehpState.latchedState.name = '';
  player._cehpState.latchedState.framesLeft = 0;

  rig.state.axisX = 1;
  rig.state.down.right = true;
  CEHP.Movement.apply(player, rig.input, 50);
  assert.equal(player.body.velocity.x, 0);

  CEHP.Movement.apply(player, rig.input, 31);
  assert.equal(player.body.velocity.x, CEHP.TUNING.RUN_SPEED);
  assert.equal(CEHP.EdState.snapshot(player).phase4.controlLockMs > 0, true);
});

function makeEnemyScene() {
  return {
    add: {
      text: function() {
        return {
          alpha: 1, scaleX: 1, x: 0, y: 0,
          setOrigin: function() { return this; },
          setDepth: function() { return this; },
          destroy: function() {}
        };
      },
      rectangle: function(x, y, w, h, color, alpha) {
        return {
          x: x, y: y, width: w, height: h,
          alpha: alpha == null ? 1 : alpha, scaleX: 1,
          setDepth: function() { return this; },
          destroy: function() {}
        };
      }
    },
    time: { now: 0 }
  };
}

function makeEnemyPlayer() {
  return {
    x: 0, y: 0, invulnMs: 0,
    body: { velocity: { x: 0, y: 0 }, blocked: { down: true } }
  };
}

function makeEnemyWorld() {
  return {
    pizzaHits: 0,
    deductibleHits: 0,
    scantronHits: 0,
    applyPizzaParty: function() { this.pizzaHits += 1; },
    applyDeductibleHit: function() { this.deductibleHits += 1; },
    hitByEnemy: function() { this.scantronHits += 1; }
  };
}

test('W12 P3 enemy telegraph windup bases stay inside launch bounds after jitter', () => {
  const CEHP = loadModules(ENEMY_MODULES);
  const scene = makeEnemyScene();
  const specs = [
    { type: 'scantron', opts: { teleportPoints: [{ x: 0, y: 0 }, { x: 32, y: 0 }] } },
    { type: 'pizzaParty', opts: { x: 0, y: 0 } },
    { type: 'deductibleWeight', opts: { x: 0, y: 0 } }
  ];

  specs.forEach(function(spec) {
    const enemy = CEHP.Enemies.spawn(scene, spec.type, spec.opts);
    assert.equal(enemy.wBase - 40 >= 120, true,
      spec.type + ' jittered windup lower bound below 120ms: ' + (enemy.wBase - 40));
    assert.equal(enemy.wBase + 40 <= 400, true,
      spec.type + ' jittered windup upper bound above 400ms: ' + (enemy.wBase + 40));
  });
});

test('W8-R01 enemy telegraph windup gates damage intersection', () => {
  const CEHP = loadModules(ENEMY_MODULES);
  CEHP.Collision = { intersects: function() { return true; } };
  const scene = makeEnemyScene();
  const enemy = CEHP.Enemies.spawn(scene, 'pizzaParty', {
    x: 0, y: 0,
    rng: CEHP.makeRNG('CASE-R01-gate-probe')
  });
  const player = makeEnemyPlayer();
  const world = makeEnemyWorld();

  // Pizza initial windupMs = 160 (no jitter on initial spawn).
  // 9 frames * 16ms = 144ms -> still windup.
  let f;
  for (f = 0; f < 9; f++) enemy.update(player, world, 16);
  assert.equal(enemy.phase, 'windup', 'enemy must stay in windup through 144ms');
  assert.equal(world.pizzaHits, 0, 'damage must not fire while phase is windup');

  // 10th frame: 160ms -> windupMs = 0 -> transition to active -> intersect fires.
  enemy.update(player, world, 16);
  assert.equal(world.pizzaHits, 1, 'damage must fire when phase transitions to active');
  assert.equal(enemy.dead, true, 'Pizza destroys itself on active-phase hit');
});

test('phase 4 enemy damage starts i-frames before repeat scantron hits', () => {
  const CEHP = loadModules(ENEMY_STATE_MODULES);
  CEHP.Collision = { intersects: function() { return true; } };
  const scene = makeEnemyScene();
  const enemy = CEHP.Enemies.spawn(scene, 'scantron', {
    x: 0, y: 0,
    rng: CEHP.makeRNG('CASE-P4-scantron-iframes')
  });
  const player = makeEnemyPlayer();
  const world = makeEnemyWorld();

  enemy.phase = 'active';
  enemy.activeMs = 80;
  enemy.update(player, world, 16);
  assert.equal(world.scantronHits, 1);
  assert.equal(CEHP.EdState.snapshot(player).phase4.iframesMs, 900);
  assert.equal(player.invulnMs, 900);

  enemy.activeMs = 80;
  enemy.update(player, world, 16);
  assert.equal(world.scantronHits, 1);
});

test('W8-R01 enemy telegraph timings are deterministic under same seed', () => {
  const CEHP = loadModules(ENEMY_MODULES);
  CEHP.Collision = { intersects: function() { return false; } };

  function runCycle(seed) {
    const scene = makeEnemyScene();
    const enemy = CEHP.Enemies.spawn(scene, 'deductibleWeight', {
      x: 0, y: 0,
      rng: CEHP.makeRNG(seed)
    });
    const player = makeEnemyPlayer();
    const world = makeEnemyWorld();
    const transitions = [];
    let prev = enemy.phase;
    let i;
    for (i = 0; i < 500; i++) {
      enemy.update(player, world, 16);
      if (enemy.phase !== prev) {
        transitions.push({ frame: i, phase: enemy.phase, windupMs: enemy.windupMs });
        prev = enemy.phase;
      }
    }
    return transitions;
  }

  const seed = 'CASE-20260420-001-CURIOSITY-R2|benefits|enemies';
  const runA = runCycle(seed);
  const runB = runCycle(seed);
  assert.deepEqual(runA, runB,
    'same seed must produce identical phase transition schedule');
  assert.ok(runA.length >= 4,
    'expected at least one full cycle of transitions across 500 frames; got ' + runA.length);
});

test('W8-R01 enemy telegraph jitter stays within plus or minus 40ms of archetype default', () => {
  const CEHP = loadModules(ENEMY_MODULES);
  CEHP.Collision = { intersects: function() { return false; } };

  const scene = makeEnemyScene();
  const enemy = CEHP.Enemies.spawn(scene, 'pizzaParty', {
    x: 0, y: 0,
    rng: CEHP.makeRNG('CASE-R01-jitter-range-probe')
  });
  const player = makeEnemyPlayer();
  const world = makeEnemyWorld();
  const windupStarts = [];
  let prev = enemy.phase;
  let i;

  // Pizza cycle ~320ms -> 4000 frames = ~64s = ~200 cycles.
  for (i = 0; i < 4000; i++) {
    enemy.update(player, world, 16);
    if (prev === 'cooldown' && enemy.phase === 'windup') {
      windupStarts.push(enemy.windupMs);
    }
    prev = enemy.phase;
  }

  assert.ok(windupStarts.length >= 50,
    'expected >=50 cycle restarts across 4000 frames; got ' + windupStarts.length);
  for (i = 0; i < windupStarts.length; i++) {
    assert.ok(windupStarts[i] >= enemy.wBase - 40,
      'windup ' + windupStarts[i] + ' below wBase-40');
    assert.ok(windupStarts[i] <= enemy.wBase + 40,
      'windup ' + windupStarts[i] + ' above wBase+40');
  }
  const unique = {};
  for (i = 0; i < windupStarts.length; i++) unique[windupStarts[i]] = true;
  assert.ok(Object.keys(unique).length >= 10,
    'jitter should produce variance; got ' + Object.keys(unique).length + ' unique values');
});

test('enemy art attachment preserves telegraph timing state', () => {
  function makeNode(x, y, key, width, height) {
    return {
      x: x,
      y: y,
      key: key || '',
      width: width || 0,
      height: height || 0,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      depth: 0,
      visible: true,
      setDepth: function(value) { this.depth = value; return this; },
      setOrigin: function() { return this; },
      setDisplaySize: function(displayWidth, displayHeight) {
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
        return this;
      },
      setAlpha: function(value) { this.alpha = value; return this; },
      setVisible: function(value) { this.visible = value; return this; },
      setScale: function(xScale, yScale) {
        this.scaleX = xScale;
        this.scaleY = yScale == null ? xScale : yScale;
        return this;
      },
      setTexture: function(nextKey) { this.key = nextKey; return this; },
      destroy: function() { this.destroyed = true; }
    };
  }

  function makeScene(textureKeys) {
    const added = {};
    return {
      time: { now: 0 },
      add: {
        rectangle: function(x, y, width, height) {
          return makeNode(x, y, '', width, height);
        },
        text: function(x, y, text) {
          const node = makeNode(x, y);
          node.text = text;
          return node;
        },
        image: function(x, y, key) {
          return makeNode(x, y, key);
        }
      },
      textures: {
        exists: function(key) {
          return textureKeys.indexOf(key) >= 0 || Object.prototype.hasOwnProperty.call(added, key);
        },
        get: function(key) {
          return {
            getSourceImage: function() {
              if (Object.prototype.hasOwnProperty.call(added, key)) return added[key];
              return { width: 512, height: key === 'enemy_telegraph_windup' ? 233 : 512 };
            }
          };
        },
        addCanvas: function(key, canvas) {
          added[key] = canvas;
          return canvas;
        }
      }
    };
  }

  const CEHP = loadModules(ENEMY_MODULES);
  const plainScene = makeScene([]);
  const artScene = makeScene(['enemy_deadline_wraith']);
  const player = { x: -500, y: -500, invulnMs: 0, body: { velocityX: 0, velocityY: 0 } };
  const world = { applyDeductibleHit: function() {} };
  const plainEnemy = CEHP.Enemies.spawn(plainScene, 'deductibleWeight', {
    x: 128,
    y: 220,
    range: 0,
    speed: 0,
    phase: 0,
    rng: { int: function(min) { return min; } }
  });
  const artEnemy = CEHP.Enemies.spawn(artScene, 'deductibleWeight', {
    x: 128,
    y: 220,
    range: 0,
    speed: 0,
    phase: 0,
    rng: { int: function(min) { return min; } }
  });
  const plainStates = [];
  const artStates = [];
  let i;

  for (i = 0; i < 12; i++) {
    plainScene.time.now += 50;
    artScene.time.now += 50;
    plainEnemy.update(player, world, 50);
    artEnemy.update(player, world, 50);
    plainStates.push([plainEnemy.phase, plainEnemy.windupMs, plainEnemy.activeMs, plainEnemy.recoveryMs, plainEnemy.cooldownMs]);
    artStates.push([artEnemy.phase, artEnemy.windupMs, artEnemy.activeMs, artEnemy.recoveryMs, artEnemy.cooldownMs]);
  }

  assert.deepEqual(artStates, plainStates);
  assert.equal(plainEnemy.art, null);
  assert.equal(artEnemy.art.key, 'enemy_deadline_wraith');
});

test('enemy telegraph strip slices exact thirds from a 512x233 source at runtime', () => {
  const drawCalls = [];
  const added = {};
  const sandbox = loadSandbox(ENEMY_MODULES, {
    document: {
      readyState: 'loading',
      getElementById: function() {
        return null;
      },
      createElement: function(type) {
        assert.equal(type, 'canvas');
        return {
          width: 0,
          height: 0,
          getContext: function(kind) {
            assert.equal(kind, '2d');
            return {
              drawImage: function() {
                drawCalls.push(Array.prototype.slice.call(arguments));
              }
            };
          }
        };
      }
    }
  });
  const CEHP = sandbox.CEHP;
  const scene = {
    textures: {
      exists: function(key) {
        return key === 'enemy_telegraph_windup' || Object.prototype.hasOwnProperty.call(added, key);
      },
      get: function(key) {
        return {
          getSourceImage: function() {
            return key === 'enemy_telegraph_windup' ? { width: 512, height: 233 } : added[key];
          }
        };
      },
      addCanvas: function(key, canvas) {
        added[key] = canvas;
        return canvas;
      }
    }
  };

  const keys = Array.from(CEHP.Enemies.ensureWindupFrames(scene));
  const keysAgain = Array.from(CEHP.Enemies.ensureWindupFrames(scene));

  assert.deepEqual(keys, [
    'cehp:enemy:telegraph:0',
    'cehp:enemy:telegraph:1',
    'cehp:enemy:telegraph:2'
  ]);
  assert.deepEqual(keysAgain, keys);
  assert.deepEqual(
    keys.map(function(key) { return added[key].width; }),
    [171, 170, 171]
  );
  assert.deepEqual(
    keys.map(function(key) { return added[key].height; }),
    [233, 233, 233]
  );
  assert.deepEqual(
    drawCalls.map(function(call) { return [call[1], call[3], call[4]]; }),
    [
      [0, 171, 233],
      [171, 170, 233],
      [341, 171, 233]
    ]
  );
  assert.equal(Object.keys(added).length, 3);
});

/* ==================================================================
   W8-R02: Encounter Director admit/release/tick caps
   (enemy<=15, projectile<=8, angles<=2 per 600ms window)
   ------------------------------------------------------------------ */

const DIRECTOR_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '62_director.js'
];

function makeDirectorScene(seed) {
  return {
    data: { get: function(k){ return k === 'caseSeed' ? seed : null; } }
  };
}

test('W8-R02 director admits spawns until enemy-slot cap reached', () => {
  const CEHP = loadModules(DIRECTOR_MODULES);
  CEHP.EncounterDirector.prime(
    makeDirectorScene('CASE-R02-cap-probe'), 'benefits', 'enrollment-intake'
  );
  let admitted = 0, rejected = 0, i;
  // telegraph:false so the angles cap doesn't gate the enemy-slot cap test.
  for (i = 0; i < 20; i++) {
    if (CEHP.EncounterDirector.admit({ type: 'scantron', telegraph: false })) admitted += 1;
    else rejected += 1;
  }
  assert.equal(admitted, 15, 'expected 15 enemies admitted; got ' + admitted);
  assert.equal(rejected, 5, 'expected 5 enemies rejected past cap; got ' + rejected);
});

test('W8-R02 director rejects simultaneous telegraphs beyond max-angles then frees slot after 600ms window', () => {
  const CEHP = loadModules(DIRECTOR_MODULES);
  CEHP.EncounterDirector.prime(
    makeDirectorScene('CASE-R02-angles-probe'), 'benefits', 'wellness-incentive'
  );
  assert.equal(
    CEHP.EncounterDirector.admit({ type: 'scantron' }), true,
    '1st telegraph must admit'
  );
  assert.equal(
    CEHP.EncounterDirector.admit({ type: 'pizzaParty' }), true,
    '2nd telegraph must admit'
  );
  assert.equal(
    CEHP.EncounterDirector.admit({ type: 'deductibleWeight' }), false,
    '3rd telegraph inside 600ms window must reject'
  );
  // Slide 600ms window past earliest stamps; stale stamps prune on next admit.
  CEHP.EncounterDirector.tick(null, 700);
  assert.equal(
    CEHP.EncounterDirector.admit({ type: 'deductibleWeight' }), true,
    '4th telegraph must admit after window slide'
  );
});

test('W8-R02 director admits are deterministic under same seed', () => {
  const CEHP = loadModules(DIRECTOR_MODULES);

  function run(seed) {
    CEHP.EncounterDirector.prime(
      makeDirectorScene(seed), 'benefits', 'deductible-adjustment'
    );
    const steps = [
      { type: 'scantron' },
      { type: 'pizzaParty' },
      { type: 'deductibleWeight' },
      { type: 'scantron', telegraph: false },
      { kind: 'projectile' },
      { type: 'scantron', telegraph: false },
      { kind: 'projectile' }
    ];
    const trace = [];
    let i;
    for (i = 0; i < steps.length; i++) {
      trace.push(CEHP.EncounterDirector.admit(steps[i]));
      CEHP.EncounterDirector.tick(null, 80);
    }
    return trace;
  }

  const seed = 'CASE-20260420-001-CURIOSITY-R2';
  const a = run(seed);
  const b = run(seed);
  assert.deepEqual(a, b,
    'same seed must produce identical admit sequence');
  assert.ok(a.indexOf(false) >= 0,
    'admit sequence must exercise at least one rejection; got ' + JSON.stringify(a));
});

/* ==================================================================
   W8-R05: Curiosity-pays-rent second-payoff loop
   (3-5s reward echo on sign:peek / sign:read; must NOT bump axes)
   ------------------------------------------------------------------ */

const CURIOSITY_MODULES = [
  '00_index.js',
  '01_const.js',
  '02_rng.js',
  '03_events.js',
  '52_curiosity.js'
];

function makeCuriosityScene(seed) {
  return {
    runState: {},
    data: { get: function(k){ return k === 'caseSeed' ? seed : null; } }
  };
}

test('W8-R05 curiosity reward fires within 3000-5000ms of sign:peek', () => {
  const CEHP = loadModules(CURIOSITY_MODULES);
  const scene = makeCuriosityScene('CASE-R05-peek-probe');
  CEHP.Curiosity.prime(scene, 'orientation');
  const rewards = [];
  CEHP.Events.on('curiosity:reward', function(p){ rewards.push(p); });
  CEHP.Events.emit('sign:peek', { signId: 'sign-a' });
  CEHP.Curiosity.update(scene, 2999);
  assert.equal(rewards.length, 0, 'no reward before 3000ms');
  CEHP.Curiosity.update(scene, 2002);
  assert.equal(rewards.length, 1, 'exactly one reward by 5001ms');
  assert.equal(rewards[0].signId, 'sign-a', 'reward carries signId');
  assert.equal(rewards[0].worldId, 'orientation', 'reward carries worldId');
  assert.ok(['environmental','luminous','receipt'].indexOf(rewards[0].kind) >= 0,
    'reward kind is one of the three; got ' + rewards[0].kind);
});

test('W8-R05 curiosity does not double-bump axes', () => {
  const AXIS_MODULES = ['00_index.js','01_const.js','02_rng.js','03_events.js','10_axes.js'];
  const WITH_CURIOSITY = AXIS_MODULES.concat(['52_curiosity.js']);
  const baseline = loadModules(AXIS_MODULES);
  baseline.Axes.reset();
  baseline.Events.emit('sign:peek', { signId: 'x' });
  baseline.Events.emit('sign:read', { signId: 'x' });
  const baseCuriosity = baseline.Axes.snapshot().primary.curiosity;
  const combined = loadModules(WITH_CURIOSITY);
  combined.Curiosity.prime(makeCuriosityScene('CASE-R05-axis-probe'), 'orientation');
  combined.Axes.reset();
  combined.Events.emit('sign:peek', { signId: 'x' });
  combined.Events.emit('sign:read', { signId: 'x' });
  combined.Curiosity.update(makeCuriosityScene('CASE-R05-axis-probe'), 6000);
  const combinedCuriosity = combined.Axes.snapshot().primary.curiosity;
  assert.equal(combinedCuriosity, baseCuriosity,
    'curiosity axis delta must match baseline (52_curiosity must NOT bump axis)');
});

test('W8-R05 curiosity scheduling is deterministic under same seed', () => {
  function run(seed) {
    const CEHP = loadModules(CURIOSITY_MODULES);
    const scene = makeCuriosityScene(seed);
    CEHP.Curiosity.prime(scene, 'benefits');
    const rewards = [];
    CEHP.Events.on('curiosity:reward', function(p){ rewards.push(p.kind); });
    let i;
    for (i = 0; i < 6; i++) {
      CEHP.Events.emit('sign:peek', { signId: 'sign-' + i });
      CEHP.Curiosity.update(scene, 5500);
    }
    return rewards;
  }
  const seed = 'CASE-20260420-002-CURIOSITY-R2';
  assert.deepEqual(run(seed), run(seed),
    'same seed must yield identical reward-kind sequence');
});
