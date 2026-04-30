/* MODULE: 8F_POST_CLOSER_AXIS_POOL - W15M-P18 axis-only closer overflow.
   Adds 12 axis-keyed closer variants (4 chaos-dominant, 4 curiosity-
   dominant, 4 efficiency-dominant) without world weighting. These
   closers only win in axis-dominant unflagged contexts; world-weighted
   and flag-gated closers continue to dominate in their own contexts.
   Loads after 80_receipts.js so registerFragment is available. Fills
   gaps where the existing closer pool was thin on chaos/curiosity/
   efficiency-tilted runs that didn't trip a boss or setpiece flag. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  var CHAOS_FRAGMENTS = [
    {
      id: 'W15_CLOSER_AXIS_CHAOS_01',
      text: 'THE FILE BENT TO YOUR HAND.',
      opts: { axes: { chaos: 0.7 }, micro: { contradictionDefy: 0.4 } }
    },
    {
      id: 'W15_CLOSER_AXIS_CHAOS_02',
      text: 'THE HALLWAY MISFILED ITS RULES.',
      opts: { axes: { chaos: 0.6, curiosity: 0.3 }, micro: { contradictionDefy: 0.3 } }
    },
    {
      id: 'W15_CLOSER_AXIS_CHAOS_03',
      text: 'POLICY LOST ANOTHER ARGUMENT.',
      opts: { axes: { chaos: 0.7, intuition: 0.2 } }
    },
    {
      id: 'W15_CLOSER_AXIS_CHAOS_04',
      text: 'THE STAMP HESITATED FOREVER.',
      opts: { axes: { chaos: 0.5, intuition: 0.4 }, micro: { contradictionDefy: 0.3 } }
    }
  ];

  var CURIOSITY_FRAGMENTS = [
    {
      id: 'W15_CLOSER_AXIS_CURIOSITY_01',
      text: 'EVERY DOOR REWARDED THE QUESTION.',
      opts: { axes: { curiosity: 0.7, intuition: 0.3 }, micro: { signsRead: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_CURIOSITY_02',
      text: 'THE SIGNS WAITED TO BE READ.',
      opts: { axes: { curiosity: 0.6, grace: 0.3 }, micro: { signsRead: 0.5 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_CURIOSITY_03',
      text: 'THE MARGIN HELD BETTER ANSWERS.',
      opts: { axes: { curiosity: 0.7 }, micro: { signsRead: 0.3, modulesPassed: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_CURIOSITY_04',
      text: 'YOUR EYES OUTPACED THE BUREAU.',
      opts: { axes: { curiosity: 0.6, chaos: 0.3 }, micro: { contradictionDefy: 0.3 }, tone: 'benign' }
    }
  ];

  var EFFICIENCY_FRAGMENTS = [
    {
      id: 'W15_CLOSER_AXIS_EFFICIENCY_01',
      text: 'THE QUEUE COMPRESSED TO SUIT YOU.',
      opts: { axes: { efficiency: 0.7, compliance: 0.3 }, micro: { modulesPassed: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_EFFICIENCY_02',
      text: 'ROUTINE BENT TO YOUR PRECISION.',
      opts: { axes: { efficiency: 0.7, compliance: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_EFFICIENCY_03',
      text: 'THE FORMS LEARNED YOUR SHORTCUTS.',
      opts: { axes: { efficiency: 0.6, grace: 0.2 }, micro: { formsUsed: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_CLOSER_AXIS_EFFICIENCY_04',
      text: 'TIME RECOGNIZED YOUR PATTERN.',
      opts: { axes: { efficiency: 0.6, intuition: 0.3 }, micro: { modulesPassed: 0.3 }, tone: 'benign' }
    }
  ];

  function registerGroup(group){
    var i, f;
    for (i = 0; i < group.length; i++) {
      f = group[i];
      ns.Receipts.registerFragment('CLOSERS', f.id, f.text, f.opts);
    }
  }

  function registerAll(){
    if (REGISTERED) return false;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return false;
    registerGroup(CHAOS_FRAGMENTS);
    registerGroup(CURIOSITY_FRAGMENTS);
    registerGroup(EFFICIENCY_FRAGMENTS);
    REGISTERED = true;
    return true;
  }

  ns.Closers = ns.Closers || {};
  ns.Closers.registerAxisPool = registerAll;
  ns.Closers.axisPoolFragments = function(){
    return CHAOS_FRAGMENTS.concat(CURIOSITY_FRAGMENTS).concat(EFFICIENCY_FRAGMENTS);
  };

  registerAll();
})(CEHP);
CEHP._register('8F_post_closer_axis_pool');
