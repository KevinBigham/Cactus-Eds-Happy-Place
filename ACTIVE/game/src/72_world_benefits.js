/* MODULE: 72_WORLD_BENEFITS - W3 target.
   Institutional satire. Checkboxes as platforms.
   Deductibles shrink jump height. */

(function(ns){
  'use strict';

  if (!ns.Worlds) return;

  ns.Worlds.MANIFEST.benefits = {
    id:    'benefits',
    title: 'BENEFITS ENROLLMENT ATRIUM',
    palette: { primary:'#f2c6d1', accent:'#c23b3b', paper:'#fff9e0', ink:'#221' },
    tempoBpm: 60,
    signs: [
      'HARM IS SIMPLY A CHOICE.',
      'SMILE. IT IS MANDATORY.',
      'YOUR LIFESPAN IS NO LONGER PROFITABLE.'
    ],
    closerFragments: [
      'BENEFITS PROCESSED. YOU OWE NINE DOLLARS AND A YEAR.'
    ],
    rooms: [
      {
        id: 'benefits-risk-atrium',
        title: 'BENEFITS RISK ATRIUM',
        contradictionSign: 'WAIT FOR COVERAGE TO NOTICE YOU',
        actionSigns: ['EVERY DOORWAY HAS TERMS', 'THE LOWER PLAN SAVES STAIRS'],
        premiumTarget: 0
      },
      {
        id: 'benefits-claim-window',
        title: 'BENEFITS CLAIM WINDOW',
        actionSigns: ['FORMS BECOME SOLID AFTER REJECTION', 'PLEASE CROSS THE DENIED CLAIM'],
        premiumTarget: 0
      },
      {
        id: 'benefits-network-narrow',
        title: 'BENEFITS NETWORK NARROW',
        actionSigns: ['THE NETWORK PREFERS SMALLER MOTION', 'OUT OF NETWORK MEANS FLOOR'],
        premiumTarget: 0
      },
      {
        id: 'enrollment-intake',
        title: 'ENROLLMENT INTAKE',
        contradictionSign: 'COVERAGE REQUIRES COMPLIANCE.',
        actionSigns: ['COLLECT TWO PREMIUM STAMPS.', 'PIZZA IMPROVES NOTHING.'],
        premiumTarget: 2
      },
      {
        id: 'premium-pathways',
        title: 'PREMIUM PATHWAYS',
        contradictionSign: 'SAFE ROUTE REQUIRES PAYMENT.',
        actionSigns: ['TWO PREMIUMS OPEN STAIRS.', 'SCANTRONS TRACK YOUR LANDING.'],
        premiumTarget: 2
      },
      {
        id: 'network-validation',
        title: 'NETWORK VALIDATION',
        contradictionSign: 'IN-NETWORK IS A FEELING.',
        actionSigns: ['THREE PREMIUMS REDUCE SURPRISE.', 'SCANTRONS PREFER CONFIDENCE.'],
        premiumTarget: 3
      },
      {
        id: 'deductible-adjustment',
        title: 'DEDUCTIBLE ADJUSTMENT',
        contradictionSign: 'THE FLOOR HAS A COPAY.',
        actionSigns: ['WEIGHTS REDUCE YOUR VERTICAL.', 'TWO PREMIUMS LIMIT SHRINKAGE.'],
        premiumTarget: 2
      },
      {
        id: 'wellness-incentive',
        title: 'WELLNESS INCENTIVE',
        contradictionSign: 'RECOVERY IS A PERFORMANCE METRIC.',
        actionSigns: ['PIZZA IS NOT LEAVE.', 'THREE PREMIUMS CALM THE HALL.'],
        premiumTarget: 3
      },
      {
        id: 'final-processing',
        title: 'FINAL PROCESSING',
        contradictionSign: 'PROCESSING CONTINUES DURING DECLINE.',
        actionSigns: ['TWO PREMIUMS COMPLETE REVIEW.', 'NINE DOLLARS REMAIN DUE.'],
        premiumTarget: 2
      }
    ]
  };
})(CEHP);
CEHP._register('72_world_benefits');
