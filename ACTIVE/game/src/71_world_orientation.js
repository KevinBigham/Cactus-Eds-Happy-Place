/* ================================================================
   MODULE: 71_WORLD_ORIENTATION — Week 2 target
   Teaches all 11 actions via mandatory compliance modules.
   Establishes institution + tone.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  if (!ns.Worlds) return;

  ns.Worlds.MANIFEST.orientation = {
    id:    'orientation',
    title: 'ORIENTATION BUREAU',
    palette: { primary:'#3a5ca8', accent:'#e04a3a', paper:'#e8e3d1', ink:'#111' },
    tempoBpm: 60,
    signs: [
      'ELEVATION REQUIRES LEVERAGE. KICK THE SYSTEM.',
      'MOVEMENT IS ENCOURAGED BETWEEN 9:00 AND 9:04.',
      'YOUR COOPERATION HAS BEEN PRE-INTERPRETED.'
    ],
    closerFragments: [
      'ORIENTATION COMPLETE. FILE SEVERED.',
      'YOU LEARNED ELEVEN THINGS. THE INSTITUTION LEARNED SIXTY.'
    ],
    rooms: [
      {
        id: 'intake',
        title: 'INTAKE',
        contradictionSign: 'WAIT FOR BADGE.',
        actionSigns: ['MOVE TO WINDOW THREE.', 'JUMP FOR WINDOW TWO.']
      },
      {
        id: 'base-locomotion',
        title: 'BASE LOCOMOTION',
        contradictionSign: 'WAIT FOR TURNSTILE.',
        actionSigns: ['KICK THE SYSTEM.', 'CHARGE BEFORE FORWARD.']
      },
      {
        id: 'vertical-compliance',
        title: 'VERTICAL COMPLIANCE',
        contradictionSign: 'WAIT FOR ELEVATOR.',
        actionSigns: ['SECOND ATTEMPT REQUIRED.', 'THIRD ATTEMPT REQUIRED.', 'THE WALL RETURNS YOU.']
      },
      {
        id: 'corrective-handling',
        title: 'CORRECTIVE HANDLING',
        contradictionSign: 'WAIT FOR REVIEW.',
        actionSigns: ['PUNCH FOR RECORDS.', 'DESCEND WITH AUTHORITY.']
      },
      {
        id: 'aerial-exception',
        title: 'AERIAL EXCEPTION',
        contradictionSign: 'WAIT FOR CLEARANCE.',
        actionSigns: ['FALL SLOWLY.', 'HOVER BRIEFLY.']
      },
      {
        id: 'final-certification',
        title: 'FINAL CERTIFICATION',
        contradictionSign: 'PROCEED NORMALLY.',
        actionSigns: ['ELEVEN THINGS WERE SUFFICIENT.']
      }
    ]
  };
})(CEHP);
CEHP._register('71_world_orientation');
