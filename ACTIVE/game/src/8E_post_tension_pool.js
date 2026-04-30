/* MODULE: 8E_POST_TENSION_POOL - W15M-P17 tension pool depth.
   Adds 5 axis-keyed tension variants per world (orientation, benefits,
   rasta) so the receipt's middle line has more rotation options on
   replay. Loads after 80_receipts.js so ns.Receipts.registerFragment
   is available. World weights match canonical TENSION_<WORLD> family
   (2.7 / 2.9 / 3.2) so depth fragments augment without dominating. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  var ORIENTATION_FRAGMENTS = [
    {
      id: 'W15_TENSION_ORIENTATION_DEPTH_01',
      text: 'THE STAMP LEARNED YOUR NAME ANYWAY.',
      opts: { worlds: { orientation: 2.7 }, tensions: { obedience: 0.4, style: 0.4 }, axes: { curiosity: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_ORIENTATION_DEPTH_02',
      text: 'PROTOCOL FORGOT WHAT IT INTENDED.',
      opts: { worlds: { orientation: 2.7 }, tensions: { obedience: -0.5, auditRisk: 0.3 }, axes: { chaos: 0.4, intuition: 0.3 } }
    },
    {
      id: 'W15_TENSION_ORIENTATION_DEPTH_03',
      text: 'YOUR HESITATION WROTE BETTER NOTES.',
      opts: { worlds: { orientation: 2.7 }, tensions: { obedience: 0.3, style: 0.5 }, axes: { curiosity: 0.5, intuition: 0.3 }, micro: { signsRead: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_ORIENTATION_DEPTH_04',
      text: 'THE CLIPBOARD DRIFTED FROM ITS PHRASING.',
      opts: { worlds: { orientation: 2.7 }, tensions: { obedience: -0.3, auditRisk: 0.2 }, axes: { chaos: 0.5, curiosity: 0.3 }, micro: { contradictionDefy: 0.4 } }
    },
    {
      id: 'W15_TENSION_ORIENTATION_DEPTH_05',
      text: 'THE TURNSTILE LIKED YOUR DETOUR.',
      opts: { worlds: { orientation: 2.7 }, tensions: { obedience: -0.4, style: 0.3 }, axes: { chaos: 0.4, intuition: 0.3 }, tone: 'benign' }
    }
  ];

  var BENEFITS_FRAGMENTS = [
    {
      id: 'W15_TENSION_BENEFITS_DEPTH_01',
      text: 'THE NETWORK COUNTED YOUR EVERY ATTEMPT.',
      opts: { worlds: { benefits: 2.9 }, tensions: { obedience: 0.3, auditRisk: 0.4 }, axes: { efficiency: 0.4, compliance: 0.3 }, micro: { modulesPassed: 0.4 } }
    },
    {
      id: 'W15_TENSION_BENEFITS_DEPTH_02',
      text: 'PREMIUMS WAITED FOR YOUR CHOICE.',
      opts: { worlds: { benefits: 2.9 }, tensions: { obedience: 0.4, style: 0.2 }, axes: { efficiency: 0.4, grace: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_BENEFITS_DEPTH_03',
      text: 'COVERAGE MEASURED YOUR PATIENCE TWICE.',
      opts: { worlds: { benefits: 2.9 }, tensions: { auditRisk: 0.3, style: 0.4 }, axes: { grace: 0.5, intuition: 0.3 }, micro: { contradictionFollow: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_BENEFITS_DEPTH_04',
      text: 'THE PLAN PRICED YOUR REFUSAL CHEAPLY.',
      opts: { worlds: { benefits: 2.9 }, tensions: { obedience: -0.4, auditRisk: 0.4 }, axes: { efficiency: 0.4, chaos: 0.3 }, micro: { contradictionDefy: 0.4 } }
    },
    {
      id: 'W15_TENSION_BENEFITS_DEPTH_05',
      text: 'YOUR FILE STAYED HONEST IN MARGINS.',
      opts: { worlds: { benefits: 2.9 }, tensions: { style: 0.5, auditRisk: -0.3 }, axes: { grace: 0.4, intuition: 0.4 }, tone: 'benign' }
    }
  ];

  var RASTA_FRAGMENTS = [
    {
      id: 'W15_TENSION_RASTA_DEPTH_01',
      text: 'THE BELT KEPT TIME WITHOUT ASKING.',
      opts: { worlds: { rasta: 3.2 }, tensions: { obedience: 0.4, auditRisk: -0.3 }, axes: { intuition: 0.5, grace: 0.3 }, micro: { musicSync: 0.5 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_RASTA_DEPTH_02',
      text: 'THE FLOOR HEARD WHAT YOU MEANT.',
      opts: { worlds: { rasta: 3.2 }, tensions: { style: 0.4, auditRisk: -0.4 }, axes: { grace: 0.5, intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_RASTA_DEPTH_03',
      text: 'QUIET HELD YOUR DOUBT WITH YOU.',
      opts: { worlds: { rasta: 3.2 }, tensions: { obedience: 0.3, style: 0.4 }, axes: { grace: 0.5, intuition: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_RASTA_DEPTH_04',
      text: 'REST RECEIVED YOUR SHARP EDGES.',
      opts: { worlds: { rasta: 3.2 }, tensions: { auditRisk: -0.5, style: 0.3 }, axes: { grace: 0.4, intuition: 0.4 }, micro: { contradictionFollow: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TENSION_RASTA_DEPTH_05',
      text: 'THE HALLWAY WORE YOUR RHYTHM.',
      opts: { worlds: { rasta: 3.2 }, tensions: { obedience: 0.3, style: 0.4 }, axes: { intuition: 0.5, grace: 0.3 }, micro: { musicSync: 0.4 }, tone: 'benign' }
    }
  ];

  function registerGroup(group){
    var i, f;
    for (i = 0; i < group.length; i++) {
      f = group[i];
      ns.Receipts.registerFragment('TENSIONS', f.id, f.text, f.opts);
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

  ns.Tensions = ns.Tensions || {};
  ns.Tensions.registerDepthPool = registerAll;
  ns.Tensions.depthPoolFragments = function(){
    return ORIENTATION_FRAGMENTS.concat(BENEFITS_FRAGMENTS).concat(RASTA_FRAGMENTS);
  };

  registerAll();
})(CEHP);
CEHP._register('8E_post_tension_pool');
