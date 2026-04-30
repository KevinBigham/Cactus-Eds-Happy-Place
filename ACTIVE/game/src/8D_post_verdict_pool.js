/* MODULE: 8D_POST_VERDICT_POOL - W15M-P16 verdict pool depth.
   Adds 5 axis-keyed verdict variants per world (orientation, benefits,
   rasta) so receipt selection has more rotation options on replay.
   Loads after 80_receipts.js so ns.Receipts.registerFragment is
   available. World weights match the canonical VERDICT_<WORLD> family
   (no domination), so these augment rather than replace base pools. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  var ORIENTATION_FRAGMENTS = [
    {
      id: 'W15_VERDICT_ORIENTATION_DEPTH_01',
      text: 'THE FILE BLINKED AT YOUR PHRASING.',
      opts: { worlds: { orientation: 2.8 }, axes: { chaos: 0.5, curiosity: 0.4 }, micro: { contradictionDefy: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_ORIENTATION_DEPTH_02',
      text: 'INTAKE NOTICED YOUR EXTRA STEP.',
      opts: { worlds: { orientation: 2.8 }, axes: { curiosity: 0.5, intuition: 0.3 }, micro: { signsRead: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_ORIENTATION_DEPTH_03',
      text: 'THE BADGE LOST ITS TRAINING WHEELS.',
      opts: { worlds: { orientation: 2.8 }, axes: { chaos: 0.6 }, micro: { modulesPassed: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_ORIENTATION_DEPTH_04',
      text: 'ORIENTATION STAYED OPEN PAST CURFEW.',
      opts: { worlds: { orientation: 2.8 }, axes: { chaos: 0.4, intuition: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_ORIENTATION_DEPTH_05',
      text: 'THE LECTURE FORGOT WHAT IT MEANT.',
      opts: { worlds: { orientation: 2.8 }, axes: { chaos: 0.5, curiosity: 0.3 }, micro: { contradictionDefy: 0.3 }, tone: 'benign' }
    }
  ];

  var BENEFITS_FRAGMENTS = [
    {
      id: 'W15_VERDICT_BENEFITS_DEPTH_01',
      text: 'THE DEDUCTIBLE FORGAVE A SINGLE ROUTE.',
      opts: { worlds: { benefits: 3.0 }, axes: { efficiency: 0.5, grace: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_BENEFITS_DEPTH_02',
      text: 'COVERAGE LEFT A POLITE NOTE.',
      opts: { worlds: { benefits: 3.0 }, axes: { grace: 0.5, intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_BENEFITS_DEPTH_03',
      text: 'THE FORMS QUIETED THEIR STAMPING.',
      opts: { worlds: { benefits: 3.0 }, axes: { efficiency: 0.4, compliance: 0.4 }, micro: { formsUsed: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_BENEFITS_DEPTH_04',
      text: 'ENROLLMENT FOUND YOUR REAL NAME.',
      opts: { worlds: { benefits: 3.0 }, axes: { grace: 0.4, intuition: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_BENEFITS_DEPTH_05',
      text: 'THE PLAN PAUSED ITS ARGUMENT.',
      opts: { worlds: { benefits: 3.0 }, axes: { efficiency: 0.4, grace: 0.3 }, micro: { contradictionFollow: 0.3 }, tone: 'benign' }
    }
  ];

  var RASTA_FRAGMENTS = [
    {
      id: 'W15_VERDICT_RASTA_DEPTH_01',
      text: 'THE BELT REMEMBERED YOUR BREATH.',
      opts: { worlds: { rasta: 3.3 }, axes: { intuition: 0.5, grace: 0.3 }, micro: { musicSync: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_RASTA_DEPTH_02',
      text: 'REST FOUND THE LONGER MEASURE.',
      opts: { worlds: { rasta: 3.3 }, axes: { intuition: 0.4, grace: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_RASTA_DEPTH_03',
      text: 'THE HALLWAY HUMMED WITH YOU.',
      opts: { worlds: { rasta: 3.3 }, axes: { grace: 0.5, intuition: 0.3 }, micro: { musicSync: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_RASTA_DEPTH_04',
      text: 'THE FLOOR LOWERED ITS VOICE.',
      opts: { worlds: { rasta: 3.3 }, axes: { grace: 0.4, intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_VERDICT_RASTA_DEPTH_05',
      text: 'QUIET COUNTED ALL OF YOU.',
      opts: { worlds: { rasta: 3.3 }, axes: { grace: 0.5, intuition: 0.4 }, micro: { contradictionFollow: 0.3 }, tone: 'benign' }
    }
  ];

  function registerGroup(group){
    var i, f;
    for (i = 0; i < group.length; i++) {
      f = group[i];
      ns.Receipts.registerFragment('VERDICTS', f.id, f.text, f.opts);
    }
  }

  function registerAll(){
    if (REGISTERED) return false;
    if (!ns.Receipts || !ns.Receipts.registerFragment) return false;
    registerGroup(ORIENTATION_FRAGMENTS);
    registerGroup(BENEFITS_FRAGMENTS);
    registerGroup(RASTA_FRAGMENTS);
    REGISTERED = true;
    return true;
  }

  ns.Verdicts = ns.Verdicts || {};
  ns.Verdicts.registerDepthPool = registerAll;
  ns.Verdicts.depthPoolFragments = function(){
    return ORIENTATION_FRAGMENTS.concat(BENEFITS_FRAGMENTS).concat(RASTA_FRAGMENTS);
  };

  registerAll();
})(CEHP);
CEHP._register('8D_post_verdict_pool');
