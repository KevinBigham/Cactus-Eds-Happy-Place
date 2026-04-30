/* MODULE: 8C_POST_RUN_COMPLETE_MONOLOGUE - W15M-P13 Cactus Ed
   meta-receipt monologue. Fragments here only score when all three
   mini-bosses are defeated in one run, so the triple-flag match
   dominates the closer selection in any world the meta-receipt is
   generated for. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  // World weights uniform across the three worlds because the meta
  // receipt should dominate whichever world the receipt happens to
  // be generated for at the moment of completion.
  var META_WORLDS = { orientation: 6, benefits: 6, rasta: 6 };
  var META_FLAGS = { supervisorDefeated: true, enrollmentDefeated: true, logisticsDefeated: true };

  var FRAGMENTS = [
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_01',
      text: 'YOU WALKED THROUGH THE WHOLE ARCHIVE.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { compliance: 0.2, curiosity: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_02',
      text: 'EVERY DOOR REMEMBERED YOUR SHAPE.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_03',
      text: 'THE INSTITUTION FILED YOUR FULL ATTEMPT.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { compliance: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_04',
      text: 'ED SIGNED OFF QUIETLY.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { grace: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_05',
      text: 'THE BUILDING KEPT WHAT YOU LEFT.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { intuition: 0.2, grace: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_06',
      text: 'EVERY WORLD ANSWERED IN ITS WAY.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { compliance: 0.2, intuition: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_07',
      text: 'YOU MADE THE WHOLE FILE LEGIBLE.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { compliance: 0.3, efficiency: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_08',
      text: 'THE HALLWAY FINALLY STOPPED ASKING.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { grace: 0.3, intuition: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_RUN_COMPLETE_MONOLOGUE_09',
      text: 'YOU WERE COUNTED. ALL OF YOU.',
      opts: { worlds: META_WORLDS, flags: META_FLAGS, axes: { compliance: 0.2, grace: 0.2, intuition: 0.2 }, tone: 'benign' }
    }
  ];

  function registerAll(){
    var i, f;
    if (REGISTERED) return false;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return false;
    for (i = 0; i < FRAGMENTS.length; i++) {
      f = FRAGMENTS[i];
      ns.Receipts.registerFragment('CLOSERS', f.id, f.text, f.opts);
    }
    REGISTERED = true;
    return true;
  }

  ns.Closers = ns.Closers || {};
  ns.Closers.registerRunCompletePool = registerAll;
  ns.Closers.runCompleteFragments = function(){
    return FRAGMENTS.slice();
  };
  ns.Closers.runCompleteFlags = function(){
    return {
      supervisorDefeated: true,
      enrollmentDefeated: true,
      logisticsDefeated: true
    };
  };

  registerAll();
})(CEHP);
CEHP._register('8C_post_run_complete_monologue');
