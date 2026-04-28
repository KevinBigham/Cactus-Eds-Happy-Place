/* MODULE: 03_EVENTS - tiny synchronous pub/sub.
   Topic keys are strings; handlers fire in subscription order;
   errors are caught so one bad handler never takes down the bus. */

(function(ns){
  'use strict';

  var topics = {};

  function on(topic, fn){
    if (!topics[topic]) topics[topic] = [];
    topics[topic].push(fn);
    return function off(){
      var list = topics[topic];
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        if (list[i] === fn) { list.splice(i, 1); return; }
      }
    };
  }

  function emit(topic, payload){
    var list = topics[topic];
    if (!list) return;
    var snap = list.slice();
    for (var i = 0; i < snap.length; i++) {
      try { snap[i](payload); }
      catch (e) {
        if (typeof console !== 'undefined') console.error('[Events] ' + topic, e);
      }
    }
  }

  function clear(){ topics = {}; }

  ns.Events = { on: on, emit: emit, clear: clear };
})(CEHP);
CEHP._register('03_events');
