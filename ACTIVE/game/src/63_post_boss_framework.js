/* MODULE: 63_POST_BOSS_FRAMEWORK - W15M-P2 abstract boss state machine.
   Three phases only; seeded LCG timing; receipt tags flow through Events. */

(function(root, ns){
  'use strict';

  var TELEGRAPH_MIN_MS = 120;
  var TELEGRAPH_MAX_MS = 400;
  var DEFAULT_STRIKE_MS = 80;
  var DEFAULT_COOLDOWN_MS = 180;
  var MAX_STEPS_PER_UPDATE = 8;

  function clamp(n, min, max){
    n = Math.round(Number(n) || 0);
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  function positiveMs(n, fallback){
    n = Math.round(Number(n) || 0);
    return n > 0 ? n : fallback;
  }

  function copyPayload(payload){
    var out = {};
    var key;
    payload = payload || {};
    for (key in payload) {
      if (ns.has(payload, key)) out[key] = payload[key];
    }
    return out;
  }

  function readWindow(phase){
    var windowMs = phase.telegraphWindowMs || phase.telegraphWindow || null;
    var min = phase.telegraphMinMs;
    var max = phase.telegraphMaxMs;

    if (phase.telegraphMs != null) {
      min = phase.telegraphMs;
      max = phase.telegraphMs;
    } else if (windowMs && typeof windowMs.length === 'number') {
      min = windowMs[0];
      max = windowMs[1];
    } else if (windowMs) {
      min = windowMs.minMs != null ? windowMs.minMs : windowMs.min;
      max = windowMs.maxMs != null ? windowMs.maxMs : windowMs.max;
    }

    if (min == null) min = 180;
    if (max == null) max = min;

    min = clamp(min, TELEGRAPH_MIN_MS, TELEGRAPH_MAX_MS);
    max = clamp(max, TELEGRAPH_MIN_MS, TELEGRAPH_MAX_MS);
    if (max < min) max = min;

    return { min: min, max: max };
  }

  function normalizePhases(phases, opts){
    var source = phases || [
      { id: 'phase-1', telegraphMs: 180 },
      { id: 'phase-2', telegraphMs: 220 },
      { id: 'phase-3', telegraphMs: 260 }
    ];
    var out = [];
    var i;
    var phase;
    var windowMs;

    if (!source || source.length !== 3) {
      throw new Error('bossFramework requires exactly 3 phases');
    }

    for (i = 0; i < 3; i++) {
      phase = source[i] || {};
      windowMs = readWindow(phase);
      out.push({
        id: phase.id || ('phase-' + (i + 1)),
        telegraphMinMs: windowMs.min,
        telegraphMaxMs: windowMs.max,
        strikeMs: positiveMs(phase.strikeMs, opts.strikeMs || DEFAULT_STRIKE_MS),
        cooldownMs: positiveMs(phase.cooldownMs, opts.cooldownMs || DEFAULT_COOLDOWN_MS),
        idleMs: positiveMs(phase.idleMs, opts.idleMs || 0),
        repeatsBeforeAdvance: Math.max(0, Math.round(Number(phase.repeatsBeforeAdvance) || 0))
      });
    }

    return out;
  }

  function clonePhases(phases){
    var out = [];
    var i;
    for (i = 0; i < phases.length; i++) {
      out.push(copyPayload(phases[i]));
    }
    return out;
  }

  function makeRng(opts){
    if (opts.rng && opts.rng.int) return opts.rng;
    if (ns.makeRNG) return ns.makeRNG(opts.seed || opts.id || 'cehp-boss-framework');
    return null;
  }

  function BossFramework(opts){
    opts = opts || {};
    this.id = opts.id || 'boss';
    this._rng = makeRng(opts);
    this._phases = normalizePhases(opts.phases, opts);
    this.phases = clonePhases(this._phases);
    this._phaseIndex = 0;
    this._phaseStrikes = [0, 0, 0];
    this._phaseVisits = [1, 0, 0];
    this._state = 'idle';
    this._timerMs = 0;
    this._stateAgeMs = 0;
    this._totalMs = 0;
    this._totalStrikes = 0;
    this._lastTelegraphMs = 0;
    this._lastAction = 'init';
    this._defeated = false;
    this._receiptTags = opts.receiptTags || opts.defeatTags || null;
  }

  BossFramework.prototype._phase = function(){
    return this._phases[this._phaseIndex];
  };

  BossFramework.prototype._emit = function(topic, payload){
    if (ns.Events && ns.Events.emit) ns.Events.emit(topic, payload || {});
  };

  BossFramework.prototype._transition = function(state, durationMs, action){
    var phase = this._phase();
    this._state = state;
    this._timerMs = Math.max(0, durationMs || 0);
    this._stateAgeMs = 0;
    this._lastAction = action || state;
    this._emit('boss:state', {
      bossId: this.id,
      state: state,
      phaseIndex: this._phaseIndex,
      phaseId: phase.id,
      durationMs: this._timerMs,
      action: this._lastAction
    });
  };

  BossFramework.prototype._chooseTelegraphMs = function(phase){
    if (!this._rng || !this._rng.int || phase.telegraphMinMs === phase.telegraphMaxMs) {
      return phase.telegraphMinMs;
    }
    return this._rng.int(phase.telegraphMinMs, phase.telegraphMaxMs + 1);
  };

  BossFramework.prototype._enterTelegraph = function(){
    var phase = this._phase();
    var durationMs = this._chooseTelegraphMs(phase);
    this._lastTelegraphMs = durationMs;
    this._transition('telegraph', durationMs, 'telegraph');
    this._emit('boss:telegraph', {
      bossId: this.id,
      phaseIndex: this._phaseIndex,
      phaseId: phase.id,
      durationMs: durationMs
    });
  };

  BossFramework.prototype._enterStrike = function(){
    var phase = this._phase();
    this._transition('strike', phase.strikeMs, 'strike');
    this._emit('boss:strike', {
      bossId: this.id,
      phaseIndex: this._phaseIndex,
      phaseId: phase.id,
      durationMs: phase.strikeMs
    });
  };

  BossFramework.prototype._enterCooldown = function(){
    var phase = this._phase();
    this._transition('cooldown', phase.cooldownMs, 'cooldown');
    this._emit('boss:cooldown', {
      bossId: this.id,
      phaseIndex: this._phaseIndex,
      phaseId: phase.id,
      durationMs: phase.cooldownMs
    });
  };

  BossFramework.prototype._resolveCooldown = function(ctx){
    var phase = this._phase();
    var action = 'repeat';

    ctx = ctx || {};
    if (ctx.defeatAfterCooldown) {
      this.defeat(ctx);
      return;
    }

    if (ctx.repeat === true) {
      action = 'repeat';
    } else if (this._phaseIndex < 2 &&
        (ctx.advance === true || this._phaseStrikes[this._phaseIndex] > phase.repeatsBeforeAdvance)) {
      this._phaseIndex += 1;
      this._phaseVisits[this._phaseIndex] += 1;
      action = 'advance';
      this._emit('boss:phase', {
        bossId: this.id,
        phaseIndex: this._phaseIndex,
        phaseId: this._phase().id
      });
    }

    this._transition('idle', this._phase().idleMs, action);
    this._emit(action === 'advance' ? 'boss:advance' : 'boss:repeat', {
      bossId: this.id,
      phaseIndex: this._phaseIndex,
      phaseId: this._phase().id
    });
  };

  BossFramework.prototype._fireReceiptTags = function(ctx){
    var phase = this._phase();
    var tags = this._receiptTags || [
      {
        topic: 'combat:damageDealt',
        payload: { kind: 'boss', bossId: this.id, phaseId: phase.id, amount: 1 }
      },
      {
        topic: 'module:passed',
        payload: { kind: 'boss', bossId: this.id, phaseId: phase.id }
      }
    ];
    var i;
    var tag;
    var payload;

    for (i = 0; i < tags.length; i++) {
      tag = tags[i];
      if (typeof tag === 'string') {
        this._emit(tag, {
          kind: 'boss',
          bossId: this.id,
          phaseId: phase.id,
          phaseIndex: this._phaseIndex
        });
      } else if (tag && tag.topic) {
        payload = copyPayload(tag.payload);
        if (payload.kind == null) payload.kind = 'boss';
        if (payload.bossId == null) payload.bossId = this.id;
        if (payload.phaseId == null) payload.phaseId = phase.id;
        this._emit(tag.topic, payload);
      }
    }
  };

  BossFramework.prototype.snapshot = function(){
    var phase = this._phase();
    return {
      bossId: this.id,
      state: this._state,
      phaseIndex: this._phaseIndex,
      phaseId: phase.id,
      timerMs: this._timerMs,
      stateAgeMs: this._stateAgeMs,
      telegraphMs: this._lastTelegraphMs,
      phaseStrikeCount: this._phaseStrikes[this._phaseIndex],
      totalStrikes: this._totalStrikes,
      defeated: this._defeated,
      action: this._lastAction,
      rngState: this._rng && this._rng.getState ? this._rng.getState() : null
    };
  };

  BossFramework.prototype.update = function(dt, ctx){
    var remaining = Math.max(0, Number(dt) || 0);
    var guard = 0;

    ctx = ctx || {};
    if (ctx.defeat) return this.defeat(ctx);
    if (this._defeated) return this.snapshot();

    this._totalMs += remaining;

    while (guard < MAX_STEPS_PER_UPDATE) {
      guard += 1;

      if (this._state === 'idle') {
        if (this._timerMs > remaining) {
          this._timerMs -= remaining;
          this._stateAgeMs += remaining;
          break;
        }
        remaining -= this._timerMs;
        this._stateAgeMs += this._timerMs;
        this._enterTelegraph(ctx);
        if (remaining <= 0) break;
      } else {
        if (remaining <= 0) break;
        if (this._timerMs > remaining) {
          this._timerMs -= remaining;
          this._stateAgeMs += remaining;
          break;
        }
        remaining -= this._timerMs;
        this._stateAgeMs += this._timerMs;
        this._timerMs = 0;

        if (this._state === 'telegraph') {
          this._enterStrike(ctx);
        } else if (this._state === 'strike') {
          this._phaseStrikes[this._phaseIndex] += 1;
          this._totalStrikes += 1;
          this._enterCooldown(ctx);
        } else if (this._state === 'cooldown') {
          this._resolveCooldown(ctx);
          break;
        } else {
          break;
        }
      }
    }

    return this.snapshot();
  };

  BossFramework.prototype.defeat = function(ctx){
    var phase = this._phase();

    ctx = ctx || {};
    if (this._defeated) return this.snapshot();

    this._defeated = true;
    this._state = 'defeat';
    this._timerMs = 0;
    this._stateAgeMs = 0;
    this._lastAction = 'defeat';
    this._fireReceiptTags(ctx);
    this._emit('boss:defeated', {
      bossId: this.id,
      phaseId: phase.id,
      phaseIndex: this._phaseIndex,
      reason: ctx.reason || 'defeat'
    });

    return this.snapshot();
  };

  ns.bossFramework = {
    TELEGRAPH_MIN_MS: TELEGRAPH_MIN_MS,
    TELEGRAPH_MAX_MS: TELEGRAPH_MAX_MS,
    create: function(opts){
      return new BossFramework(opts || {});
    }
  };

  if (root) root.CEHP = ns;
})(typeof window !== 'undefined' ? window : this, CEHP);
CEHP._register('63_post_boss_framework');
