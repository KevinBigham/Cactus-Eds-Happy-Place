/* MODULE: 05_INPUT_BUFFER - frame-count input queue for deterministic replay.
   Dormant infrastructure for W10 Phase 1. */

(function(ns){
  'use strict';

  var DEFAULT_CAPACITY = 8;
  var MAX_AGE_FRAMES = 2147483647;
  var ACTION_SLOTS = {
    jump: 'jump',
    jumpQueue: 'jumpQueue',
    dash: 'dash',
    melee: 'melee',
    ranged: 'ranged'
  };

  function cleanFrame(value){
    value = Math.floor(Number(value));
    if (!isFinite(value)) return 0;
    return value;
  }

  function cleanCapacity(value){
    value = cleanFrame(value);
    return value > 0 ? value : DEFAULT_CAPACITY;
  }

  function cleanMaxAge(value){
    value = cleanFrame(value);
    return value >= 0 ? value : MAX_AGE_FRAMES;
  }

  function cloneMeta(meta){
    if (!meta || typeof meta !== 'object') return meta;
    try { return JSON.parse(JSON.stringify(meta)); }
    catch (e) {}
    var out = {};
    var key;
    for (key in meta) {
      if (ns.has(meta, key)) out[key] = meta[key];
    }
    return out;
  }

  function cloneEntry(entry){
    if (!entry) return null;
    return {
      action: entry.action,
      frame: entry.frame,
      meta: cloneMeta(entry.meta),
      consumed: !!entry.consumed
    };
  }

  function ensureBuffer(buffer){
    if (!buffer || typeof buffer !== 'object') buffer = create();
    if (!buffer.entries) buffer.entries = [];
    if (!buffer.capacity) buffer.capacity = DEFAULT_CAPACITY;
    return buffer;
  }

  function age(entry, nowFrame){
    return cleanFrame(nowFrame) - cleanFrame(entry && entry.frame);
  }

  function isMatch(entry, action, nowFrame, maxAgeFrames){
    var entryAge;
    if (!entry || entry.consumed) return false;
    if (entry.action !== action) return false;
    entryAge = age(entry, nowFrame);
    if (entryAge < 0) return false;
    return entryAge <= cleanMaxAge(maxAgeFrames);
  }

  function findIndex(buffer, action, nowFrame, maxAgeFrames){
    var i;
    buffer = ensureBuffer(buffer);
    for (i = 0; i < buffer.entries.length; i++) {
      if (isMatch(buffer.entries[i], action, nowFrame, maxAgeFrames)) return i;
    }
    return -1;
  }

  function create(opts){
    opts = opts || {};
    return {
      capacity: cleanCapacity(opts.capacity),
      entries: []
    };
  }

  function push(buffer, action, frame, meta){
    var entry;
    buffer = ensureBuffer(buffer);
    entry = {
      action: String(action || ''),
      frame: cleanFrame(frame),
      meta: cloneMeta(meta),
      consumed: false
    };
    buffer.entries.push(entry);
    while (buffer.entries.length > buffer.capacity) buffer.entries.shift();
    return cloneEntry(entry);
  }

  function peek(buffer, action, nowFrame, maxAgeFrames){
    var index = findIndex(buffer, action, nowFrame, maxAgeFrames);
    buffer = ensureBuffer(buffer);
    return index >= 0 ? cloneEntry(buffer.entries[index]) : null;
  }

  function consume(buffer, action, nowFrame, maxAgeFrames){
    var entry;
    var index = findIndex(buffer, action, nowFrame, maxAgeFrames);
    buffer = ensureBuffer(buffer);
    if (index < 0) return null;
    entry = buffer.entries.splice(index, 1)[0];
    entry.consumed = true;
    return cloneEntry(entry);
  }

  function prune(buffer, nowFrame, maxAgeFrames){
    var count = 0;
    var i;
    var limit = cleanMaxAge(maxAgeFrames);
    buffer = ensureBuffer(buffer);
    for (i = buffer.entries.length - 1; i >= 0; i--) {
      if (buffer.entries[i].consumed || age(buffer.entries[i], nowFrame) > limit) {
        buffer.entries.splice(i, 1);
        count += 1;
      }
    }
    return count;
  }

  function clear(buffer, action){
    var count = 0;
    var i;
    buffer = ensureBuffer(buffer);
    for (i = buffer.entries.length - 1; i >= 0; i--) {
      if (buffer.entries[i].action === action) {
        buffer.entries.splice(i, 1);
        count += 1;
      }
    }
    return count;
  }

  ns.InputBuffer = {
    ACTION_SLOTS: ACTION_SLOTS,
    create: create,
    push: push,
    peek: peek,
    consume: consume,
    prune: prune,
    clear: clear
  };
})(CEHP);
CEHP._register('05_input_buffer');
