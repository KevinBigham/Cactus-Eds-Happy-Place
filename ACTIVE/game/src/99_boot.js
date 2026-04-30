/* MODULE: 99_BOOT - entry point; must be last concatenated file.
   Hydrates save, wires settings hatch, starts Phaser.
   Headless-safe: only touches window/document if present. */

(function(ns){
  'use strict';

  function boot(){
    var state = ns.SAVE ? ns.SAVE.boot() : null;
    var search = typeof location !== 'undefined' ? (location.search || '') : '';
    var sceneList;

    if (/[?&]docket=1/.test(search)) {
      var docketEl = (typeof document !== 'undefined') && document.getElementById('cehp-docket');
      if (docketEl) {
        docketEl.classList.add('on');
        if (ns.Docket && ns.Docket.renderInto) ns.Docket.renderInto(docketEl, search);
      }
      ns._state = state;
      return null;
    }

    if (/[?&]settings=1/.test(search)) {
      var el = (typeof document !== 'undefined') && document.getElementById('cehp-settings');
      if (el) el.classList.add('on');
    }

    if (typeof Phaser === 'undefined') {
      ns._state = state;
      return null; /* headless contexts (Node, tests) */
    }

    sceneList = (ns.Scenes && ns.Scenes.list) ? ns.Scenes.list() : [];
    if (ns.Art && ns.Art.withPreloadHook) sceneList = ns.Art.withPreloadHook(sceneList);

    var cfg = {
      type:            Phaser.AUTO,
      width:           ns.GAME_W,
      height:          ns.GAME_H,
      pixelArt:        true,
      roundPixels:     true,
      antialias:       false,
      backgroundColor: '#000',
      parent:          'cehp-host',
      physics: { default: 'arcade', arcade: { gravity: { y: ns.TUNING.GRAVITY }, debug: false } },
      scene: sceneList
    };

    ns._game  = new Phaser.Game(cfg);
    ns._state = state;
    return ns._game;
  }

  ns.boot = boot;

  if (typeof window !== 'undefined') {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(boot, 0);
    } else {
      window.addEventListener('DOMContentLoaded', boot);
    }
  }
})(CEHP);
CEHP._register('99_boot');
