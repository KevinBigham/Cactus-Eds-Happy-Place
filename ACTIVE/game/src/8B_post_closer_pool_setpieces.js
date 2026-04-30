/* MODULE: 8B_POST_CLOSER_POOL_SETPIECES - W15M-P12 closer pool depth
   for setpiece outcomes. Loads after 80_receipts.js so registerFragment
   is available. Adds variant closers per setpiece path so receipt
   selection has options on replay. */
(function(ns){
  'use strict';

  var REGISTERED = false;

  var TRUST_FALL_ACCEPT = [
    {
      id: 'W15_TRUST_FALL_CLOSER_02',
      text: 'THE FLOOR ABSORBED YOUR DECISION.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallAccepted: true }, axes: { intuition: 0.3, grace: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_CLOSER_03',
      text: 'GRAVITY WAS RECORDED AS PARTNER.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallAccepted: true }, axes: { intuition: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_CLOSER_04',
      text: 'YOU LET THE BUILDING CATCH YOU.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallAccepted: true }, axes: { compliance: 0.2, grace: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_CLOSER_05',
      text: 'THE DROP CONFIRMED A WITNESS.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallAccepted: true }, axes: { intuition: 0.3, compliance: 0.2 }, tone: 'benign' }
    }
  ];

  var TRUST_FALL_DECLINE = [
    {
      id: 'W15_TRUST_FALL_DECLINED_01',
      text: 'THE LEDGE HELD ITS QUESTION.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallDeclined: true }, axes: { intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_DECLINED_02',
      text: 'YOU KEPT YOUR OWN SHADOW.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallDeclined: true }, axes: { intuition: 0.3, grace: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_DECLINED_03',
      text: 'THE RISK STAYED WHERE YOU FOUND IT.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallDeclined: true }, axes: { compliance: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_TRUST_FALL_DECLINED_04',
      text: 'NO HAND WAS REQUESTED TODAY.',
      opts: { worlds: { orientation: 7 }, flags: { trustFallDeclined: true }, axes: { intuition: 0.2, compliance: 0.2 }, tone: 'benign' }
    }
  ];

  var OPEN_CONCEPT_NAVIGATED = [
    {
      id: 'W15_OPEN_CONCEPT_CLOSER_02',
      text: 'EVERY WALL ADMITTED YOUR PRESENCE.',
      opts: { worlds: { benefits: 7 }, flags: { openConceptNavigated: true }, axes: { compliance: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_OPEN_CONCEPT_CLOSER_03',
      text: 'THE OFFICE OBSERVED YOU OBSERVING.',
      opts: { worlds: { benefits: 7 }, flags: { openConceptNavigated: true }, axes: { intuition: 0.3, curiosity: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_OPEN_CONCEPT_CLOSER_04',
      text: 'PRIVACY BECAME AN INTERNAL DOCUMENT.',
      opts: { worlds: { benefits: 7 }, flags: { openConceptNavigated: true }, axes: { compliance: 0.2, intuition: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_OPEN_CONCEPT_CLOSER_05',
      text: 'THE ROOM FILED YOUR PERIMETER.',
      opts: { worlds: { benefits: 7 }, flags: { openConceptNavigated: true }, axes: { compliance: 0.3, efficiency: 0.2 }, tone: 'benign' }
    }
  ];

  var SUPPLY_CHAIN_ROUTED = [
    {
      id: 'W15_SUPPLY_CHAIN_CLOSER_02',
      text: 'THE PALLETS REMEMBERED THEIR ORDER.',
      opts: { worlds: { rasta: 8 }, flags: { supplyChainRouted: true }, axes: { compliance: 0.3, grace: 0.2 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPPLY_CHAIN_CLOSER_03',
      text: 'YOU BECAME PART OF THE LOGISTICS.',
      opts: { worlds: { rasta: 8 }, flags: { supplyChainRouted: true }, axes: { compliance: 0.4 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPPLY_CHAIN_CLOSER_04',
      text: 'THE BOX CHOSE YOUR HALLWAY.',
      opts: { worlds: { rasta: 8 }, flags: { supplyChainRouted: true }, axes: { intuition: 0.3 }, tone: 'benign' }
    },
    {
      id: 'W15_SUPPLY_CHAIN_CLOSER_05',
      text: 'DELIVERY KEPT TRACK OF YOU.',
      opts: { worlds: { rasta: 8 }, flags: { supplyChainRouted: true }, axes: { compliance: 0.2, intuition: 0.2 }, tone: 'benign' }
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
    registerGroup(TRUST_FALL_ACCEPT);
    registerGroup(TRUST_FALL_DECLINE);
    registerGroup(OPEN_CONCEPT_NAVIGATED);
    registerGroup(SUPPLY_CHAIN_ROUTED);
    REGISTERED = true;
    return true;
  }

  ns.Closers = ns.Closers || {};
  ns.Closers.registerSetpiecePool = registerAll;
  ns.Closers.setpiecePoolFragments = function(){
    return TRUST_FALL_ACCEPT.concat(TRUST_FALL_DECLINE).concat(OPEN_CONCEPT_NAVIGATED).concat(SUPPLY_CHAIN_ROUTED);
  };

  registerAll();
})(CEHP);
CEHP._register('8B_post_closer_pool_setpieces');
