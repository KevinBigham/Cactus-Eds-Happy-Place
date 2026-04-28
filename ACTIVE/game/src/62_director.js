/* MODULE: 62_DIRECTOR - W8-R02 admit/release seam.
   Caps: enemy<=15, projectile<=8, angles<=2 per 600ms.
   Guardrail not culling; admit true at current density. */

(function(ns){
  'use strict';

  var CAP_E = 15, CAP_P = 8, CAP_A = 2, WIN = 600;
  var s = null;

  function prune(){
    var cut = s.now - WIN, keep = [], i;
    for (i = 0; i < s.angles.length; i++) if (s.angles[i] >= cut) keep.push(s.angles[i]);
    s.angles = keep;
  }

  ns.EncounterDirector = {
    prime: function(scene, worldId, roomId){
      var seed = scene && scene.data && scene.data.get && scene.data.get('caseSeed');
      s = {
        enemy: 0, projectile: 0, angles: [], now: 0,
        rng: ns.makeRNG ? ns.makeRNG((seed || 'cehp') + '|director|' + (worldId || '') + '|' + (roomId || '')) : null
      };
    },
    admit: function(req){
      if (!s) return true;
      req = req || {};
      prune();
      if (req.kind === 'projectile'){
        if (s.projectile >= CAP_P) return false;
        s.projectile++; return true;
      }
      if (s.enemy >= CAP_E) return false;
      if (req.telegraph !== false){
        if (s.angles.length >= CAP_A) return false;
        s.angles.push(s.now);
      }
      s.enemy++; return true;
    },
    release: function(e){
      if (!s) return;
      if (e && e.kind === 'projectile'){ if (s.projectile > 0) s.projectile--; return; }
      if (s.enemy > 0) s.enemy--;
    },
    tick: function(scene, dtMs){ if (s){ s.now += dtMs || 0; prune(); } }
  };
})(CEHP);
CEHP._register('62_director');
