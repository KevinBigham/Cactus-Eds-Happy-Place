/* MODULE: 73_WORLD_RASTA - W4 target. Sincerity zone / contrast engine.
   NO enemies. Cigarette will NOT light here. Ed platforms raw.
   Without this world CEHP is cynical; with it CEHP is tragic. */

(function(ns){
  'use strict';

  if (!ns.Worlds) return;

  ns.Worlds.MANIFEST.rasta = {
    id:    'rasta',
    title: 'RASTA CORP LOGISTICS HUB',
    palette: { primary:'#4a6a3a', accent:'#c49a4a', paper:'#f2e3c5', ink:'#201' },
    tempoBpm: 72,
    cigaretteWillNotLight:     true,
    disableChromaticAberration:true,
    minimalCRTRoll:            true,
    removeNoiseLayer:          true,
    signs: [
      "TAKE WHAT HELPS. LEAVE WHAT DOESN'T.",
      'THIS DOOR OPENS WHEN ASKED.',
      'YOU DO NOT OWE THE WALL.'
    ],
    closerFragments: [
      'YOU ARE EXACTLY WHERE YOU BELONG.',
      'THE CIGARETTE DID NOT NEED TO BURN TODAY.',
      'FILE CLOSED. WITH WARMTH.'
    ],
    rooms: [
      {
        id: 'receiving-dock',
        title: 'RECEIVING DOCK',
        actionSigns: ['FOLLOW THE HUM.', 'THE FLOOR MOVES KINDLY.']
      },
      {
        id: 'sync-belt',
        title: 'SYNC BELT',
        actionSigns: ['STEP WHEN THE BELT AGREES.', 'THE MACHINE HELPS THE LANDING.']
      },
      {
        id: 'rest-landing',
        title: 'REST LANDING',
        actionSigns: ['PLEASE REST IF YOU NEED TO.', 'QUIET IS STILL A ROUTE.']
      },
      {
        id: 'sorting-floor',
        title: 'SORTING FLOOR',
        actionSigns: ['THE MACHINES WILL CARRY SOME.', 'NOT EVERYTHING IS A TEST.']
      },
      {
        id: 'humming-mezzanine',
        title: 'HUMMING MEZZANINE',
        actionSigns: ['LET THE PLATFORM ARRIVE.', 'THE CEILING IS NOT A JUDGE.']
      },
      {
        id: 'warm-exit',
        title: 'WARM EXIT',
        contradictionSign: 'REST HERE.',
        actionSigns: ['THE DOOR OPENS WHEN ASKED.', 'YOU CAN STAND HERE.']
      }
    ]
    /* TODO(codex): synchronicity platforms flow with music, sorting machines redirect politely. */
  };
})(CEHP);
CEHP._register('73_world_rasta');
