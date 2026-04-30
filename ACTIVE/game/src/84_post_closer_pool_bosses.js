/* MODULE: 84_POST_CLOSER_POOL_BOSSES - W15M-P11 closer pool depth
   for mini-boss defeat outcomes. Loads after 80_receipts.js so
   ns.Receipts.registerFragment is available. Adds 5 closer variants
   per mini-boss so receipt selection has options on replay. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  var SUPERVISOR_FRAGMENTS = [
    {
      id: 'W15_SUPERVISOR_CLOSER_02',
      text: 'THE BADGE LOST ITS APPETITE.',
      opts: { worlds: { orientation: 6 }, flags: { supervisorDefeated: true }, micro: { modulesPassed: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPERVISOR_CLOSER_03',
      text: 'INTAKE FORGAVE YOUR COUNTERSTROKE.',
      opts: { worlds: { orientation: 6 }, flags: { supervisorDefeated: true }, axes: { chaos: 0.3, grace: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPERVISOR_CLOSER_04',
      text: 'THE STAMP NEVER LANDED.',
      opts: { worlds: { orientation: 6 }, flags: { supervisorDefeated: true }, axes: { intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPERVISOR_CLOSER_05',
      text: 'CERTIFICATION YIELDED TO PRESSURE.',
      opts: { worlds: { orientation: 6 }, flags: { supervisorDefeated: true }, axes: { compliance: 0.2, chaos: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPERVISOR_CLOSER_06',
      text: 'YOU UNSIGNED THE PAPERWORK.',
      opts: { worlds: { orientation: 6 }, flags: { supervisorDefeated: true }, micro: { modulesPassed: 0.3, contradictionDefy: 0.4 }, tone: 'benign' }
    }
  ];

  var ENROLLMENT_FRAGMENTS = [
    {
      id: 'W15_ENROLLMENT_CLOSER_02',
      text: 'DENIAL ARRIVED AND LEFT EARLY.',
      opts: { worlds: { benefits: 6 }, flags: { enrollmentDefeated: true }, axes: { intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_ENROLLMENT_CLOSER_03',
      text: 'THE COVERAGE FORM SOFTENED.',
      opts: { worlds: { benefits: 6 }, flags: { enrollmentDefeated: true }, axes: { compliance: 0.2, grace: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_ENROLLMENT_CLOSER_04',
      text: 'PREMIUMS WAITED OUT YOUR PATIENCE.',
      opts: { worlds: { benefits: 6 }, flags: { enrollmentDefeated: true }, micro: { contradictionFollow: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_ENROLLMENT_CLOSER_05',
      text: 'THE PLAN ADMITTED YOUR EXISTENCE.',
      opts: { worlds: { benefits: 6 }, flags: { enrollmentDefeated: true }, axes: { compliance: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_ENROLLMENT_CLOSER_06',
      text: 'ELIGIBILITY GAVE UP QUIETLY.',
      opts: { worlds: { benefits: 6 }, flags: { enrollmentDefeated: true }, axes: { intuition: 0.3, grace: 0.2 }, tone: 'benign' }
    }
  ];

  var LOGISTICS_FRAGMENTS = [
    {
      id: 'W15_LOGISTICS_CLOSER_02',
      text: 'THE LEDGER MISSED YOUR EXIT.',
      opts: { worlds: { rasta: 6 }, flags: { logisticsDefeated: true }, axes: { intuition: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_LOGISTICS_CLOSER_03',
      text: 'THE FOREMAN STOPPED COUNTING.',
      opts: { worlds: { rasta: 6 }, flags: { logisticsDefeated: true }, axes: { grace: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_LOGISTICS_CLOSER_04',
      text: 'THE PALLETS LEARNED YOUR TIMING.',
      opts: { worlds: { rasta: 6 }, flags: { logisticsDefeated: true }, axes: { intuition: 0.3, grace: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_LOGISTICS_CLOSER_05',
      text: 'THE DOCKET CLOSED IN YOUR FAVOR.',
      opts: { worlds: { rasta: 6 }, flags: { logisticsDefeated: true }, axes: { compliance: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_LOGISTICS_CLOSER_06',
      text: 'THE BELT KEPT YOUR CADENCE.',
      opts: { worlds: { rasta: 6 }, flags: { logisticsDefeated: true }, micro: { musicSync: 0.4 }, tone: 'benign' }
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
    registerGroup(SUPERVISOR_FRAGMENTS);
    registerGroup(ENROLLMENT_FRAGMENTS);
    registerGroup(LOGISTICS_FRAGMENTS);
    REGISTERED = true;
    return true;
  }

  ns.Closers = ns.Closers || {};
  ns.Closers.registerBossPool = registerAll;
  ns.Closers.bossPoolFragments = function(){
    return SUPERVISOR_FRAGMENTS.concat(ENROLLMENT_FRAGMENTS).concat(LOGISTICS_FRAGMENTS);
  };

  registerAll();
})(CEHP);
CEHP._register('84_post_closer_pool_bosses');
