/* MODULE: 90_UI - full-diegetic surfaces.
   pause=clipboard, save=locker, controls=training poster.
   Plain-HTML escape hatch at ?settings=1 (not here). */

(function(ns){
  'use strict';

  function makeState(runState){
    return {
      open: false,
      surface: 'clipboard',
      cursor: 0,
      runState: runState || null
    };
  }

  function clipboardItems(){
    return ['RESUME', 'LOCKER', 'POSTER'];
  }

  function lines(state){
    var runState = state.runState || {};
    var receipt = runState.receipt || null;
    if (state.surface === 'clipboard') {
      return [
        'CLIPBOARD PAUSE',
        (state.cursor === 0 ? '> ' : '  ') + 'RESUME',
        (state.cursor === 1 ? '> ' : '  ') + 'LOCKER',
        (state.cursor === 2 ? '> ' : '  ') + 'POSTER'
      ];
    }

    if (state.surface === 'locker') {
      return [
        'LOCKER SAVE MENU',
        'CASE ' + (runState.caseSeed || 'UNFILED'),
        'RUNS ' + (runState.runs || 0),
        'DEATHS ' + (runState.deaths || 0),
        receipt ? receipt.lines[0] : 'NO RECEIPT FILED'
      ];
    }

    return [
      'TRAINING POSTER',
      'Z SPACE JUMP',
      'J PUNCH  K KICK',
      'L HOLD DASH',
      'C COPTER V SLAM',
      'B GLIDE ESC PAUSE'
    ];
  }

  function openSurface(state, surface){
    state.open = true;
    state.surface = surface;
    state.cursor = 0;
    return state;
  }

  function move(state, dir){
    if (state.surface !== 'clipboard') return state;
    var items = clipboardItems();
    state.cursor = (state.cursor + dir + items.length) % items.length;
    return state;
  }

  function activate(state){
    if (state.surface !== 'clipboard') return openSurface(state, 'clipboard');
    var items = clipboardItems();
    var next = items[state.cursor];
    if (next === 'RESUME') {
      state.open = false;
      return state;
    }
    if (next === 'LOCKER') return openSurface(state, 'locker');
    if (next === 'POSTER') return openSurface(state, 'poster');
    return state;
  }

  function back(state){
    if (state.surface === 'clipboard') {
      state.open = false;
      return state;
    }
    return openSurface(state, 'clipboard');
  }

  function bindSettingsForm(){
    if (typeof document === 'undefined') return;
    var form = document.getElementById('cehp-settings-form');
    if (!form || form._cehpBound) return;
    form._cehpBound = true;

    var save = ns.SAVE && ns.SAVE.boot ? ns.SAVE.boot() : null;
    if (save && save.assistMode) {
      for (var key in save.assistMode) {
        if (!Object.prototype.hasOwnProperty.call(save.assistMode, key)) continue;
        if (form.elements[key]) form.elements[key].checked = !!save.assistMode[key];
      }
    }

    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      if (!ns.SAVE || !ns.SAVE.boot || !ns.SAVE.save) return;
      var payload = ns.SAVE.boot();
      for (var k in payload.assistMode) {
        if (!Object.prototype.hasOwnProperty.call(payload.assistMode, k)) continue;
        if (form.elements[k]) payload.assistMode[k] = !!form.elements[k].checked;
      }
      ns.SAVE.save(payload);
    });
  }

  bindSettingsForm();

  ns.UI = {
    makeState: makeState,
    lines: lines,
    move: move,
    activate: activate,
    back: back,
    openClipboard: function(state){ return openSurface(state, 'clipboard'); },
    openLocker: function(state){ return openSurface(state, 'locker'); },
    openPoster: function(state){ return openSurface(state, 'poster'); }
  };
})(CEHP);
CEHP._register('90_ui');
