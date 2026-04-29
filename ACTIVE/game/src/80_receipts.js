/* ================================================================
   MODULE: 80_RECEIPTS
   3-line format: [Primary Verdict] [Pairwise Tension] [World Closer]
   W8-R03 tone: nudge ties toward benign reframe (Perchtold 2019).
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var BENIGN_BIAS = 0.35;
  var MALICIOUS_BIAS = -0.35;
  var W11_CONTENT_BIAS = 1.1;

  function makeFragment(id, text, opts){
    return {
      id: id,
      text: text,
      axes: opts && opts.axes ? opts.axes : null,
      lowAxes: opts && opts.lowAxes ? opts.lowAxes : null,
      tensions: opts && opts.tensions ? opts.tensions : null,
      lowTensions: opts && opts.lowTensions ? opts.lowTensions : null,
      micro: opts && opts.micro ? opts.micro : null,
      worlds: opts && opts.worlds ? opts.worlds : null,
      flags: opts && opts.flags ? opts.flags : null,
      tone: opts && opts.tone ? opts.tone : null
    };
  }

  function addGroup(target, prefix, texts, opts){
    for (var i = 0; i < texts.length; i++) {
      target.push(makeFragment(prefix + '_' + pad(i + 1, 2), texts[i], opts));
    }
  }

  function registerFragment(pool, id, text, opts){
    var pools = {
      VERDICTS: VERDICTS,
      TENSIONS: TENSIONS,
      CLOSERS: CLOSERS
    };
    var key = String(pool || '').toUpperCase();
    var target = pools[key];
    var fragment;
    if (!target) return null;
    fragment = makeFragment(id, text, opts || {});
    target.push(fragment);
    return fragment;
  }

  function pad(n, width){
    var out = String(n);
    while (out.length < width) out = '0' + out;
    return out;
  }

  function queryValue(search, key){
    search = search || '';
    var q = search.indexOf('?');
    var query = q >= 0 ? search.slice(q + 1) : search;
    var parts = query.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] === key) return decodeURIComponent(kv[1] || '');
    }
    return '';
  }

  function isThermalSearch(search){
    return queryValue(search, 'thermal') === '1';
  }

  function playUrlForSeed(seed){
    return 'https://counterfeit-educational.org/?case=' + encodeURIComponent(seed || '');
  }

  function themeForReceipt(opts){
    opts = opts || {};
    if (opts.thermal) {
      return {
        mode: 'thermal',
        paper: '#efe3c6',
        panel: '#f4ead3',
        ink: '#2b241a',
        subInk: '#5f4d39',
        divider: '#6f5d43',
        frame: '#d8c7a2',
        band: '#e4d4b3',
        shadow: '#cab896',
        noiseAlpha: 0.06,
        jitter: 3
      };
    }
    return {
      mode: 'normal',
      paper: '#f5f0df',
      panel: '#f8f2e2',
      ink: '#221a13',
      subInk: '#5a4a36',
      divider: '#2e2a25',
      frame: '#1d1914',
      band: '#ece3cb',
      shadow: '#ddd2b8',
      noiseAlpha: 0.02,
      jitter: 0
    };
  }

  function worldLabel(worldId){
    var labels = {
      orientation: 'WORLD ORIENTATION',
      benefits: 'WORLD BENEFITS',
      rasta: 'WORLD RASTA',
      docket: 'WORLD DOCKET'
    };
    return labels[worldId] || ('WORLD ' + String(worldId || 'orientation').toUpperCase());
  }

  function cardModel(receipt, opts){
    receipt = receipt || {};
    opts = opts || {};
    return {
      seed: receipt.seed || opts.seed || 'CASE-UNKNOWN',
      lines: receipt.lines ? receipt.lines.slice() : [],
      fragmentIds: receipt.fragmentIds ? receipt.fragmentIds.slice() : [],
      tensions: receipt.tensions || { obedience: 0, style: 0, auditRisk: 0 },
      worldId: opts.worldId || 'orientation',
      worldLabel: worldLabel(opts.worldId || 'orientation'),
      playUrl: opts.playUrl || playUrlForSeed(receipt.seed || opts.seed || 'CASE-UNKNOWN'),
      footer: opts.footer || 'THE INSTITUTION REQUIRES MORE DATA.',
      thermal: !!opts.thermal,
      theme: themeForReceipt({ thermal: !!opts.thermal }),
      flags: opts.flags || receipt.flags || {}
    };
  }

  var VERDICTS = [];
  var TENSIONS = [];
  var CLOSERS = [];

  addGroup(VERDICTS, 'VERDICT_COMPLIANCE', [
    'ROUTINE COMPLIANCE OBSERVED.',
    'PROCEDURE HELD UNDER FOOT.',
    'FORMAL SUCCESS RECORDED.',
    'INSTRUCTIONS WERE TAKEN SERIOUSLY.',
    'NO DETOUR REQUIRED TODAY.',
    'ORDER SURVIVED YOUR INPUT.',
    'FILED MOVEMENT REMAINED ORDERLY.',
    'HALLWAY DISCIPLINE HELD.',
    'POLICY AND MOTION ALIGNED.',
    'MANDATE FULFILLED WITHOUT DRIFT.'
  ], {
    tone: 'benign',
    axes: { compliance: 2.0, efficiency: 0.8 },
    tensions: { obedience: 1.1 },
    micro: { contradictionFollow: 0.6, modulesPassed: 0.4 }
  });

  addGroup(VERDICTS, 'VERDICT_CURIOSITY', [
    'UNSCHEDULED COMPETENCE DETECTED.',
    'QUESTIONABLE CURIOSITY PAID OFF.',
    'A SIDE DOOR REMEMBERED YOU.',
    'YOU READ PAST THE HEADER.',
    'DETOUR INSTINCT OUTPACED SIGNAGE.',
    'THE WALL REVEALED SOMETHING.',
    'YOU LOOKED WHERE FORMS HID.',
    'UNLISTED ROUTES RECEIVED ATTENTION.',
    'CURIOSITY OUTRAN ADMINISTRATIVE INTENT.',
    'YOU ASKED THE ROOM BACK.'
  ], {
    tone: 'benign',
    axes: { curiosity: 2.0, intuition: 0.8 },
    tensions: { auditRisk: 0.9 },
    micro: { signPeeks: 0.4, secretsFound: 0.6, signsRead: 0.2 }
  });

  addGroup(VERDICTS, 'VERDICT_CHAOS', [
    'INCIDENT PRE-APPROVED.',
    'AUDIT WINDOW BREACHED.',
    'LATERAL MOVEMENT LOGGED.',
    'DISORDER ARRIVED EARLY.',
    'CONTROL LEFT THE BUILDING.',
    'YOUR METHODS REQUIRED REDACTION.',
    'SUPERVISION LOST VISUAL CONTACT.',
    'HAZARD FORM BECAME A PLAN.',
    'RESTRAINT WAS DECLINED QUIETLY.',
    'FILE MOTION TURNED COMBATIVE.'
  ], {
    tone: 'malicious',
    axes: { chaos: 2.0, curiosity: 0.5 },
    tensions: { obedience: -1.2 },
    micro: { contradictionDefy: 0.6, kickCount: 0.4, punchCount: 0.2 }
  });

  addGroup(VERDICTS, 'VERDICT_GRACE', [
    'GRACE OUTPACED EXPECTATION.',
    'CLEAN RECOVERY REGISTERED.',
    'AIRBORNE CORRECTION LOOKED DELIBERATE.',
    'EDGE CONTACT BECAME STYLE.',
    'FALL CONTROL REMAINED CALM.',
    'LANDING FILED AS ELEGANT.',
    'YOUR BALANCE SURPRISED THE HALLWAY.',
    'IMPACT AVOIDANCE READ AS CRAFT.',
    'EVEN THE MISS LOOKED MEANT.',
    'MOTION STAYED SOFT UNDER PRESSURE.'
  ], {
    tone: 'benign',
    axes: { grace: 2.0, intuition: 0.4 },
    tensions: { style: 0.8 },
    micro: { wallJumps: 0.5, nearMisses: 0.5, corrections: 0.4 }
  });

  addGroup(VERDICTS, 'VERDICT_EFFICIENCY', [
    'EXIT REACHED WITH INTENT.',
    'DEAD TIME STAYED LOW.',
    'DELAY WAS NOT INDULGED.',
    'YOU MOVED LIKE A DEADLINE.',
    'PATHING RESISTED SENTIMENTAL LOOPS.',
    'TIME LOSS STAYED MINOR.',
    'SHORTCUT THINKING BECAME POLICY.',
    'ADMINISTRATIVE FRICTION LOST.',
    'THE ROUTE NEVER GOT LONELY.',
    'OUTPUT ARRIVED BEFORE OBJECTION.'
  ], {
    tone: 'benign',
    axes: { efficiency: 2.0, compliance: 0.6 },
    tensions: { style: 0.6, obedience: 0.2 },
    micro: { modulesPassed: 0.5, formsUsed: 0.2 }
  });

  addGroup(VERDICTS, 'VERDICT_INTUITION', [
    'INSTINCT FILLED THE MISSING FORM.',
    'DANGER WAS READ EARLY.',
    'YOU TRUSTED THE QUIET OPTION.',
    'THE ROOM WARNED YOU FIRST.',
    'TIMING LANDED BEFORE EXPLANATION.',
    'SOMETHING FELT WRONG. YOU LISTENED.',
    'HESITATION BECAME USEFUL DATA.',
    'THE FLOOR TOLD YOU ENOUGH.',
    'CAUTION ARRIVED WITHOUT PERMISSION.',
    'YOUR GUESS OUTRAN THE SCRIPT.'
  ], {
    tone: 'benign',
    axes: { intuition: 2.0, grace: 0.4 },
    tensions: { auditRisk: -0.8 },
    micro: { damageTaken: 0.2, signsRead: 0.2, deaths: 0.1 }
  });

  addGroup(VERDICTS, 'VERDICT_ORIENTATION', [
    'INTAKE ACCEPTED YOUR SHOES.',
    'THE BADGE LIKED YOUR POSTURE.',
    'THE HALLWAY FILED YOUR ENTRANCE.',
    'ORIENTATION REMAINED MOSTLY LEGIBLE.',
    'THE BUREAU COUNTED EVERY ATTEMPT.',
    'WINDOW THREE KEPT YOUR SHAPE.',
    'THE CLIPBOARD ADMIRED YOUR TIMING.',
    'THE TRAINING FLOOR REMEMBERED YOUR WEIGHT.',
    'COMPLIANCE LOOKED BETTER FROM INSIDE.',
    'THE STAMP SAW ENOUGH TODAY.'
  ], {
    tone: 'benign',
    worlds: { orientation: 2.8 },
    axes: { compliance: 0.8, curiosity: 0.4, efficiency: 0.4 },
    micro: { modulesPassed: 0.7, signsRead: 0.2 }
  });

  addGroup(VERDICTS, 'VERDICT_BENEFITS', [
    'THE ATRIUM INVOICED YOUR INSTINCT.',
    'COVERAGE REMAINED CONDITIONAL.',
    'BILLING REACHED THE SAME CONCLUSION.',
    'THE PLAN OBSERVED YOUR POSTURE.',
    'PREMIUMS IMPROVED THE LIGHTING ONLY.',
    'ENROLLMENT CONTINUED WITHOUT CONSENT.',
    'THE CHECKBOXES ACCEPTED YOUR WEIGHT.',
    'THE NETWORK PREFERRED YOUR SILENCE.',
    'YOUR COPAY ARRIVED BEFORE COMFORT.',
    'CARE STAYED MOSTLY ADMINISTRATIVE.'
  ], {
    worlds: { benefits: 3.0 },
    axes: { compliance: 0.5, intuition: 0.3, chaos: 0.2 },
    micro: { formsUsed: 0.3, damageTaken: 0.3, modulesPassed: 0.5 }
  });

  addGroup(VERDICTS, 'VERDICT_BENEFITS_SECURED', [
    'THE UPPER PLAN NOTICED YOUR PAYMENTS.',
    'COVERAGE ARRIVED WITH BETTER CARPET.',
    'THE SAFER PATH REMEMBERED YOUR PREMIUMS.',
    'PREAUTHORIZATION LIKED YOUR PATIENCE.',
    'THE ATRIUM OFFERED A SOFTER STAIR.'
  ], {
    tone: 'benign',
    worlds: { benefits: 3.4 },
    flags: { premiumSecured: true },
    axes: { compliance: 0.8, efficiency: 0.4 },
    micro: { modulesPassed: 0.8, contradictionFollow: 0.4 }
  });

  addGroup(VERDICTS, 'VERDICT_BENEFITS_UNINSURED', [
    'THE LOWER PATH KNEW YOUR DEDUCTIBLE.',
    'COVERAGE DECLINED TO MEET YOU THERE.',
    'THE ATRIUM SAVED MONEY ON YOUR FALL.',
    'YOUR FILE CONTINUED WITHOUT PROTECTION.',
    'BILLING PREFERRED THE RISKIER VERSION.'
  ], {
    tone: 'malicious',
    worlds: { benefits: 3.4 },
    flags: { uninsuredVeteran: true },
    axes: { chaos: 0.8, intuition: 0.3 },
    micro: { damageTaken: 0.8, modulesSkipped: 0.8, contradictionDefy: 0.4 }
  });

  addGroup(VERDICTS, 'VERDICT_RASTA_REST', [
    'THE FILE UNDERSTOOD.',
    'REST CHANGED THE ROUTE.',
    'THE DOOR WAITED WITH YOU.',
    'QUIET MOVED THE BELT.',
    'YOU ARRIVED WITHOUT DEFENSE.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.4 },
    flags: { restOpened: true, cigaretteLit: false },
    axes: { intuition: 0.6, grace: 0.4 },
    micro: { contradictionFollow: 0.7, musicSync: 0.7 }
  });

  addGroup(VERDICTS, 'VERDICT_RASTA_RUSH', [
    'THE ROOM PUSHED SOFTLY BACK.',
    'HURRY RETURNED TO YOUR CHEST.',
    'THE MACHINES CAUGHT YOUR NOISE.',
    'YOU FOUGHT A KIND DOOR.',
    'THE BELT KEPT LOVING YOU.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.3 },
    flags: { rushedRest: true },
    axes: { intuition: 0.4, grace: 0.2, chaos: 0.2 },
    micro: { contradictionDefy: 0.7, modulesSkipped: 0.5 }
  });

  addGroup(TENSIONS, 'TENSION_OBEDIENCE_HIGH', [
    'OBEDIENCE OUTRANKED APPETITE.',
    'ORDER WON THE ARGUMENT.',
    'PROCEDURE SAT HEAVIER THAN IMPULSE.',
    'YOU LEFT LITTLE FOR SECURITY.',
    'PATIENCE OUTVOTED MISCHIEF.',
    'DISCIPLINE STAYED AHEAD OF STATIC.',
    'THE RULEBOOK KEPT ITS SHOES.',
    'COMPLIANCE OUTLIVED TEMPTATION.',
    'STILLNESS KEPT ITS BADGE.',
    'FORM BEAT INSTINCT THIS TIME.'
  ], {
    tone: 'benign',
    tensions: { obedience: 2.0 },
    axes: { compliance: 0.8 }
  });

  addGroup(TENSIONS, 'TENSION_OBEDIENCE_LOW', [
    'INSUBORDINATION OUTPACED CLARITY.',
    'APPETITE OUTRANKED ORDER.',
    'STATIC BROKE THE CHECKLIST.',
    'AUTHORITY LOST THE ROOM.',
    'MISCHIEF OUTVOTED PATIENCE.',
    'PROCEDURE ARRIVED AFTER THE DAMAGE.',
    'THE RULEBOOK MISSED A STEP.',
    'YOUR NOISE FOUND LEVERAGE.',
    'COMPLIANCE READ AS TEMPORARY.',
    'OBEDIENCE NEVER FOUND PARKING.'
  ], {
    tone: 'benign',
    tensions: { obedience: -2.0 },
    axes: { chaos: 0.8 }
  });

  addGroup(TENSIONS, 'TENSION_STYLE_HIGH', [
    'STYLE EXCEEDED NECESSITY.',
    'GRACE LEFT A PAPER TRAIL.',
    'EFFICIENCY WORE GOOD SHOES.',
    'THE SHORTCUT STILL LOOKED CLEAN.',
    'HASTE ARRIVED WELL DRESSED.',
    'MOTION STAYED NEAT UNDER PRESSURE.',
    'THE FILE MOVED WITH POISE.',
    'CLEAN LINES SURVIVED PANIC.',
    'ACCURACY MET PRESENTATION HALFWAY.',
    'THE HALLWAY RESPECTED YOUR FORM.'
  ], {
    tone: 'benign',
    tensions: { style: 1.1 },
    axes: { grace: 0.8, efficiency: 0.8 }
  });

  addGroup(TENSIONS, 'TENSION_STYLE_LOW', [
    'STYLE REMAINED UNCLAIMED.',
    'THE LANDING WAS PURE ADMINISTRATION.',
    'SPEED TOOK THE UGLY ROUTE.',
    'POISE CLOCKED OUT EARLY.',
    'THE FILE ARRIVED WRINKLED.',
    'FORM WAS NOT CONSULTED.',
    'EFFICIENCY LEFT SCUFF MARKS.',
    'YOUR METHOD KEPT NO MANNERS.',
    'PANIC HANDLED THE COSMETICS.',
    'GRACE MISSED THE ELEVATOR.'
  ], {
    lowTensions: { style: 1.0 },
    lowAxes: { grace: 0.6, efficiency: 0.6 },
    axes: { chaos: 0.3 }
  });

  addGroup(TENSIONS, 'TENSION_AUDIT_HIGH', [
    'AUDIT RISK EXCEEDS PERMITTED RANGE.',
    'CURIOSITY LOGGED WITHOUT SPONSORSHIP.',
    'OVERSIGHT WOULD PREFER LESS QUESTIONS.',
    'YOU LOOKED PAST THE SAFE COPY.',
    'COMPLIANCE COULD NOT HIDE THE DETOUR.',
    'THE FILE ATTRACTED EXTRA EYES.',
    'RESEARCH BEHAVIOR REMAINED UNBILLED.',
    'THE ROOM NOW REQUIRES NOTES.',
    'YOU ASKED FOR UNLISTED CONTEXT.',
    'ADMINISTRATION NOTICED YOUR INTEREST.'
  ], {
    tensions: { auditRisk: 2.0 },
    axes: { curiosity: 0.8 }
  });

  addGroup(TENSIONS, 'TENSION_AUDIT_LOW', [
    'INTUITION OUTRANKED CURIOSITY.',
    'YOU LEFT FEWER TRACE QUESTIONS.',
    'OVERSIGHT FOUND LITTLE TO CHASE.',
    'THE FILE CLOSED WITHOUT MYSTERY.',
    'INSTINCT KEPT THE LIGHTS LOW.',
    'QUESTIONS STOPPED BEFORE THE DOOR.',
    'RESEARCH NEVER NEEDED A WITNESS.',
    'THE ROOM KEPT ITS RECEIPTS PRIVATE.',
    'YOU CHOSE SIGNAL OVER NOVELTY.',
    'NOT MUCH REQUIRED AN INVESTIGATION.'
  ], {
    tone: 'benign',
    tensions: { auditRisk: -2.0 },
    axes: { intuition: 0.8 }
  });

  addGroup(TENSIONS, 'TENSION_ORIENTATION', [
    'THE BADGE WANTED MORE THAN MOTION.',
    'EVERY WINDOW EXPECTED ANOTHER PERSON.',
    'THE TURNSTILE MEASURED YOUR MANNERS.',
    'THE BUREAU PREFERRED A SMALLER ANSWER.',
    'THE HALLWAY TOOK SIDES QUIETLY.',
    'PROTOCOL SPOKE FIRST. YOU SPOKE BETTER.',
    'THE MONITOR KEPT ITS PRIVATE OPINION.',
    'THE FLOOR AUDITED YOUR APPETITE.',
    'THE STAIRS FILED A SEPARATE STORY.',
    'CERTIFICATION ASKED FOR LESS SELF.'
  ], {
    worlds: { orientation: 2.7 },
    tensions: { obedience: 0.6, auditRisk: 0.4, style: 0.3 },
    micro: { contradictionFollow: 0.5, contradictionDefy: 0.5, modulesPassed: 0.4 }
  });

  addGroup(TENSIONS, 'TENSION_ORIENTATION_FOLLOW', [
    'THE BADGE PREFERRED YOUR RESTRAINT.',
    'THE STAIRS TRUSTED YOUR PATIENCE.',
    'THE BUREAU NOTED YOUR QUIETER ROUTE.',
    'THE UPPER FILE KEPT YOUR MANNERS.',
    'THE WINDOW RESPECTED YOUR DELAY.'
  ], {
    tone: 'benign',
    worlds: { orientation: 3.0 },
    tensions: { obedience: 0.9, style: 0.2 },
    micro: { contradictionFollow: 1.2, modulesPassed: 0.4 },
    axes: { compliance: 0.4 }
  });

  addGroup(TENSIONS, 'TENSION_ORIENTATION_DEFY', [
    'THE TURNSTILE RESENTED YOUR MOMENTUM.',
    'THE LOWER HALL LIKED YOUR REFUSAL.',
    'THE BUREAU CLOCKED YOUR IMPATIENCE.',
    'PROTOCOL LOST THE ARGUMENT EARLY.',
    'THE BADGE MISSED YOUR BETTER IDEA.'
  ], {
    tone: 'benign',
    worlds: { orientation: 3.0 },
    tensions: { obedience: -1.0, auditRisk: 0.5 },
    micro: { contradictionDefy: 1.2, modulesPassed: 0.4 },
    axes: { chaos: 0.5, curiosity: 0.3 }
  });

  addGroup(TENSIONS, 'TENSION_BENEFITS', [
    'THE COPAY ARRIVED BEFORE EMPATHY.',
    'THE NETWORK LEFT YOU SMALLER.',
    'PREMIUMS BOUGHT A BETTER EXPLANATION.',
    'THE CHECKBOXES MEASURED YOUR TOLERANCE.',
    'BILLING SPOKE FIRST. YOU KEPT MOVING.',
    'THE ATRIUM OFFERED RISK BY BRANCH.',
    'COMFORT REQUIRED A DIFFERENT TIER.',
    'THE PLAN CHARGED FOR ALTITUDE.',
    'YOUR STAIRCASE CAME WITH CONDITIONS.',
    'RELIEF REMAINED OUTSIDE COVERAGE.'
  ], {
    worlds: { benefits: 2.9 },
    tensions: { obedience: 0.3, auditRisk: 0.4, style: 0.2 },
    micro: { modulesPassed: 0.4, modulesSkipped: 0.4, damageTaken: 0.4 }
  });

  addGroup(TENSIONS, 'TENSION_BENEFITS_SECURED', [
    'THE UPPER BRANCH COST LESS BLOOD.',
    'YOUR PREMIUMS RENTED A CLEANER EXIT.',
    'COVERAGE RESPECTED YOUR QUIETER ROUTE.',
    'THE SAFER HALLWAY CHARGED IN ADVANCE.',
    'THE NETWORK REWARDED EARLY SUBMISSION.'
  ], {
    tone: 'benign',
    worlds: { benefits: 3.3 },
    flags: { premiumSecured: true },
    tensions: { obedience: 0.8, style: 0.4 },
    micro: { modulesPassed: 0.8, contradictionFollow: 0.5 }
  });

  addGroup(TENSIONS, 'TENSION_BENEFITS_UNINSURED', [
    'THE LOWER BRANCH PREFERRED YOUR EXPOSURE.',
    'COVERAGE MISSED YOUR MOST EXPENSIVE MOMENT.',
    'THE ATRIUM CHARGED EXTRA FOR MOMENTUM.',
    'YOUR RISK PROFILE NEEDED LESS PROTECTION.',
    'THE DEDUCTIBLE TOOK THE STAIRS FIRST.'
  ], {
    worlds: { benefits: 3.3 },
    flags: { uninsuredVeteran: true },
    tensions: { obedience: -0.8, auditRisk: 0.5 },
    micro: { damageTaken: 0.9, modulesSkipped: 0.8, contradictionDefy: 0.5 }
  });

  addGroup(TENSIONS, 'TENSION_RASTA_REST', [
    'PATIENCE MADE SPACE FOR YOU.',
    'THE QUIETER ROUTE STAYED TRUE.',
    'STILLNESS OUTRANKED URGENCY.',
    'THE FLOOR KEPT GENTLER TIME.',
    'YOU LET THE SIGNAL ARRIVE.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.3 },
    flags: { restOpened: true, cigaretteLit: false },
    tensions: { obedience: 0.5, style: 0.4, auditRisk: -0.4 },
    micro: { contradictionFollow: 0.8, musicSync: 0.6 },
    axes: { intuition: 0.4, grace: 0.3 }
  });

  addGroup(TENSIONS, 'TENSION_RASTA_RUSH', [
    'URGENCY CAME HOME UNHELD.',
    'THE KIND ROUTE ASKED AGAIN.',
    'MOTION OUTRAN YOUR BREATH.',
    'THE BELT RETURNED YOUR WEIGHT.',
    'THE MACHINES SOFTENED IMPACT.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.2 },
    flags: { rushedRest: true },
    tensions: { obedience: -0.2, style: 0.1, auditRisk: -0.2 },
    micro: { contradictionDefy: 0.7, modulesSkipped: 0.5 },
    axes: { intuition: 0.3, grace: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_GENERAL', [
    'RETURN TO ASSIGNED HALLWAY.',
    'PROCEED TO NEXT MANDATORY MODULE.',
    'CASE HELD OPEN FOR REVIEW.',
    'FILE SEVERED.',
    'NO FURTHER QUESTIONS TODAY.',
    'COOPERATION ACKNOWLEDGED. NOTED.',
    'YOUR FILE REMAINED LEGIBLE.',
    'THE EXIT ACCEPTED YOUR STORY.',
    'THIS HALLWAY WILL REMEMBER ENOUGH.',
    'PAPERWORK CONTINUES WITHOUT YOU.'
  ], {
    axes: { compliance: 0.2, efficiency: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_PATIENCE', [
    'PATIENCE REWARDED THE UPPER PATH.',
    'WAITING CHANGED THE FLOORPLAN.',
    'STILLNESS OPENED SOMETHING QUIET.',
    'YOU LET THE SIGN FINISH.',
    'THE DOOR RESPECTED YOUR PAUSE.',
    'COMPLIANCE BOUGHT ALTITUDE.',
    'THE HALLWAY YIELDED TO RESTRAINT.',
    'YOU STOOD STILL. IT MATTERED.',
    'THE ROOM OPENED AFTER BREATHING.',
    'THE UPPER ROUTE CHOSE YOU.'
  ], {
    tone: 'benign',
    micro: { contradictionFollow: 2.6 },
    axes: { compliance: 0.6 },
    worlds: { orientation: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_DEFY', [
    'INSUBORDINATION NOTED. LOWER PATH OPEN.',
    'THE SIGN LOST JURISDICTION.',
    'JUMPING MADE THE BASEMENT AVAILABLE.',
    'THE FLOOR REVISED ITS OPINION.',
    'THE LOWER ROUTE ACCEPTED FORCE.',
    'YOUR DEFIANCE MOVED A WALL.',
    'COMPLIANCE STAYED UPSTAIRS WITHOUT YOU.',
    'YOU BROKE THE FORM INTO ACCESS.',
    'THE HALLWAY MADE ROOM FOR NO.',
    'DISOBEDIENCE OPENED SOMETHING USEFUL.'
  ], {
    tone: 'benign',
    micro: { contradictionDefy: 2.6 },
    axes: { chaos: 0.7, curiosity: 0.3 },
    worlds: { orientation: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_WARMTH', [
    'FILE CLOSED. WITH WARMTH.',
    'THE CIGARETTE DID NOT BURN.',
    'YOU WERE NOT HURRIED HERE.',
    'THIS ROOM OWED YOU NOTHING.',
    'THE DOOR OPENED WHEN ASKED.',
    'NO THREAT WAS REQUIRED TODAY.',
    'THE FLOOR ACCEPTED YOUR WEIGHT.',
    'QUIET TURNED OUT TO BE TRUE.',
    'THE HALLWAY STOPPED LYING BRIEFLY.',
    'YOU LEFT WITH BOTH SHOULDERS DOWN.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.0 },
    flags: { cigaretteLit: false },
    axes: { intuition: 0.3, grace: 0.4 }
  });

  addGroup(CLOSERS, 'CLOSER_RASTA_REST', [
    'THE EXIT WAITED WITH YOU.',
    'THE BELT RELEASED YOUR NAME.',
    'THE QUIET HELD LONG ENOUGH.',
    'YOU WERE MET WITHOUT FIRE.',
    'THE FLOOR REMEMBERED GENTLY.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.4 },
    flags: { restOpened: true, cigaretteLit: false },
    axes: { intuition: 0.4, grace: 0.4 },
    micro: { contradictionFollow: 0.8, musicSync: 0.6 }
  });

  addGroup(CLOSERS, 'CLOSER_RASTA_RUSH', [
    'THE KINDNESS TOOK TWO PASSES.',
    'THE DOOR STAYED OPEN INSIDE.',
    'SOFT MACHINES KEPT YOUR SHAPE.',
    'YOU WERE TURNED, NOT JUDGED.',
    'THE HALLWAY STOOD NEARBY.'
  ], {
    tone: 'benign',
    worlds: { rasta: 3.1 },
    flags: { rushedRest: true },
    axes: { intuition: 0.3, grace: 0.2 },
    micro: { contradictionDefy: 0.7, modulesSkipped: 0.4 }
  });

  addGroup(CLOSERS, 'CLOSER_REPEAT', [
    'ADDITIONAL INCIDENTS WERE ALREADY FILED.',
    'DENIAL ARRIVED BUT MISSED.',
    'YOUR RETURN CHANGED THE LANGUAGE.',
    'THE STAMP HIT. YOU DID NOT.',
    'THREE MISTAKES BOUGHT MERCY.',
    'THE FILE GREW TEETH FIRST.',
    'REENTRY HAS BEEN PRE-CLEARED.',
    'INCIDENT FATIGUE CHANGED THE RULES.',
    'YOUR LOSSES ALTERED THE PAPERWORK.',
    'REPETITION SOFTENED THE STAMP.'
  ], {
    tone: 'benign',
    micro: { deaths: 0.7, respawns: 0.5 },
    axes: { intuition: 0.3 }
  });

  addGroup(CLOSERS, 'CLOSER_FORMS', [
    'LIABILITY WALKED LIKE A BRIDGE.',
    'REJECTION HAD AN EDGE TODAY.',
    'THE STAMP PREFERRED HEIGHT.',
    'FORMS CONTINUED TO BE PHYSICAL.',
    'YOU TOUCHED THE INSTITUTION DIRECTLY.',
    'PAPERWORK TOOK SOLID SHAPE.',
    'THE OBJECTS KEPT THEIR TONE.',
    'ADMINISTRATION BECAME A SURFACE.',
    'EVERY FORM WANTED A BODY.',
    'YOU MADE OFFICE SUPPLIES DECISIVE.'
  ], {
    micro: { formsUsed: 0.8 },
    axes: { efficiency: 0.3, curiosity: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_ORIENTATION', [
    'BADGE RETURNED. INSTINCT RETAINED.',
    'WINDOW THREE CLOSED WITHOUT MERCY.',
    'THE CLIPBOARD KEPT YOUR SHADOW.',
    'THE BUREAU CLOCKED YOUR SILHOUETTE.',
    'THE STAIRS FILED FOR CUSTODY.',
    'THE TURNSTILE SIGNED NOTHING BACK.',
    'TRAINING CONCLUDED. POSTURE REMAINS.',
    'THE STAMP RESPECTED SOME OF THIS.',
    'THE MONITOR LOST ITS TONE.',
    'CERTIFICATION ENDED. SURVEILLANCE CONTINUES.',
    'THE BADGE GOT HEAVIER LEAVING.',
    'INTAKE CLOSED. YOU STAYED RECORDED.'
  ], {
    worlds: { orientation: 3.1 },
    axes: { compliance: 0.3, curiosity: 0.2, intuition: 0.2 },
    micro: { modulesPassed: 0.8, contradictionFollow: 0.4, contradictionDefy: 0.4 }
  });

  addGroup(CLOSERS, 'CLOSER_ORIENTATION_FOLLOW', [
    'THE UPPER FILE KEPT YOUR NAME.',
    'PATIENCE LEFT A CLEANER SHADOW.',
    'THE BADGE CLOSED ON SOFTER TERMS.',
    'THE STAIRS RETURNED YOU QUIETLY.',
    'THE CLIPBOARD PREFERRED YOUR PAUSE.'
  ], {
    tone: 'benign',
    worlds: { orientation: 3.4 },
    axes: { compliance: 0.4, intuition: 0.1 },
    micro: { contradictionFollow: 1.4, modulesPassed: 0.6 }
  });

  addGroup(CLOSERS, 'CLOSER_ORIENTATION_DEFY', [
    'THE LOWER HALL TOOK YOUR SIDE.',
    'THE TURNSTILE LOST ITS LEVERAGE.',
    'THE BADGE RETURNED WITH BITE MARKS.',
    'THE MONITOR FILED A COMPLAINT.',
    'CERTIFICATION LEFT BY SERVICE STAIRS.'
  ], {
    tone: 'benign',
    worlds: { orientation: 3.4 },
    axes: { chaos: 0.5, curiosity: 0.2 },
    micro: { contradictionDefy: 1.4, modulesPassed: 0.6 }
  });

  addGroup(CLOSERS, 'CLOSER_BENEFITS', [
    'BENEFITS PROCESSED. COSTS REMAIN ACTIVE.',
    'COVERAGE ENDED BEFORE THE FALL.',
    'THE DEDUCTIBLE OUTLIVED YOUR BALANCE.',
    'PREAUTHORIZATION LOST TRACK OF YOU.',
    'THE ATRIUM KEPT YOUR COPAY.',
    'SOMEONE IN BILLING SAW THIS.',
    'THE PREMIUM PATH CLOSED QUIETLY.',
    'CARE ARRIVED WITH CONDITIONS.',
    'THE PLAN REMAINED LESS THAN GENEROUS.',
    'ENROLLMENT FINISHED WITHOUT RELIEF.'
  ], {
    worlds: { benefits: 2.5 },
    axes: { compliance: 0.2, chaos: 0.2 }
  });

  addGroup(CLOSERS, 'CLOSER_BENEFITS_SECURED', [
    'THE PREMIUM PATH FILED YOU GENTLY.',
    'COVERAGE HELD UNTIL THE EXIT.',
    'THE UPPER CLAIM CLOSED WITH SHOES ON.',
    'PAYMENT PURCHASED A SOFTER FLOOR.',
    'THE ATRIUM RESPECTED YOUR RECEIPTS.'
  ], {
    tone: 'benign',
    worlds: { benefits: 3.4 },
    flags: { premiumSecured: true },
    axes: { compliance: 0.3, efficiency: 0.2 },
    micro: { modulesPassed: 0.7 }
  });

  addGroup(CLOSERS, 'CLOSER_BENEFITS_UNINSURED', [
    'UNINSURED VETERAN. CLAIM STILL PENDING.',
    'THE LOWER HALL BILLED YOUR BRAVERY.',
    'CARE ARRIVED AFTER THE INCIDENT.',
    'YOUR FILE REQUIRED CHEAPER ASSUMPTIONS.',
    'THE ATRIUM KEPT THE WORST VERSION.'
  ], {
    worlds: { benefits: 3.4 },
    flags: { uninsuredVeteran: true },
    axes: { chaos: 0.4, intuition: 0.3 },
    micro: { damageTaken: 0.8, modulesSkipped: 0.8, deaths: 0.3 }
  });

  function normalAxes(axes){
    axes = axes || {};
    if (!axes.primary) {
      return { primary: axes, micro: axes.micro || {} };
    }
    return axes;
  }

  function normalTensions(tens){
    return tens || { obedience: 0, style: 0, auditRisk: 0 };
  }

  function microValue(val){
    if (!val) return 0;
    if (val <= 1) return val;
    return Math.min(1, val / 3);
  }

  function allFlagsMatch(fragment, context){
    var key;
    if (!fragment.flags) return true;
    for (key in fragment.flags) {
      if (!ns.has(fragment.flags, key)) continue;
      if (key === 'cigaretteLit') {
        if (context.cigaretteLit !== fragment.flags[key]) return false;
      } else if (!context.flags || context.flags[key] !== fragment.flags[key]) {
        return false;
      }
    }
    return true;
  }

  function scoreFragment(fragment, axes, tensions, context){
    var score = 0;
    var key;
    var value;
    var primary = axes.primary || {};
    var micro = axes.micro || {};

    if (fragment.axes) {
      for (key in fragment.axes) {
        if (!ns.has(fragment.axes, key)) continue;
        value = primary[key] || 0;
        if (tensions[key] != null) value = tensions[key];
        score += value * fragment.axes[key];
      }
    }

    if (fragment.lowAxes) {
      for (key in fragment.lowAxes) {
        if (!ns.has(fragment.lowAxes, key)) continue;
        score += (1 - Math.min(1, primary[key] || 0)) * fragment.lowAxes[key];
      }
    }

    if (fragment.tensions) {
      for (key in fragment.tensions) {
        if (!ns.has(fragment.tensions, key)) continue;
        score += (tensions[key] || 0) * fragment.tensions[key];
      }
    }

    if (fragment.lowTensions) {
      for (key in fragment.lowTensions) {
        if (!ns.has(fragment.lowTensions, key)) continue;
        value = tensions[key];
        if (key === 'style') {
          value = Math.max(0, Math.min(2, tensions[key] || 0));
          score += (1 - Math.min(1, value / 2)) * fragment.lowTensions[key];
        } else {
          score += (1 - Math.min(1, Math.max(-1, value || 0) + 1)) * fragment.lowTensions[key];
        }
      }
    }

    if (fragment.micro) {
      for (key in fragment.micro) {
        if (!ns.has(fragment.micro, key)) continue;
        score += microValue(micro[key] || 0) * fragment.micro[key];
      }
    }

    if (fragment.worlds && context.worldId && fragment.worlds[context.worldId]) {
      score += fragment.worlds[context.worldId];
    }

    if (fragment.flags) {
      for (key in fragment.flags) {
        if (!ns.has(fragment.flags, key)) continue;
        if (key === 'cigaretteLit') {
          if (context.cigaretteLit === fragment.flags[key]) score += 1.5;
          continue;
        }
        if (context.flags && context.flags[key] === fragment.flags[key]) score += 1.8;
      }
    }

    if (fragment.tone === 'benign') score += BENIGN_BIAS;
    else if (fragment.tone === 'malicious') score += MALICIOUS_BIAS;
    if (fragment.id && fragment.id.indexOf('W11_') === 0 && allFlagsMatch(fragment, context)) score += W11_CONTENT_BIAS;

    return score;
  }

  function tieBreaker(seed, fragmentId){
    if (ns.seedFromString) return ns.seedFromString(seed + '|' + fragmentId);
    return 0;
  }

  function pickPriority(rng, list, axes, tensions, context){
    var scored = [];
    for (var i = 0; i < list.length; i++) {
      scored.push({
        fragment: list[i],
        score: scoreFragment(list[i], axes, tensions, context),
        tie: tieBreaker(context.seed, list[i].id)
      });
    }

    scored.sort(function(a, b){
      if (b.score !== a.score) return b.score - a.score;
      if (a.tie === b.tie) return 0;
      return a.tie < b.tie ? -1 : 1;
    });

    return scored.length ? scored[0].fragment : list[rng.int(0, list.length)];
  }

  function worldClosers(worldId){
    var manifest = ns.Worlds && ns.Worlds.get ? ns.Worlds.get(worldId) : null;
    var out = [];
    if (!manifest || !manifest.closerFragments) return out;
    for (var i = 0; i < manifest.closerFragments.length; i++) {
      out.push(makeFragment('WORLD_' + worldId.toUpperCase() + '_' + pad(i + 1, 2), manifest.closerFragments[i], {
        worlds: (function(){
          var v = {};
          v[worldId] = 1.2;
          return v;
        })()
      }));
    }
    return out;
  }

  function generate(opts){
    opts = opts || {};
    var seed = opts.seed || (ns.CaseSeed ? ns.CaseSeed.make() : 'CASE-UNKNOWN');
    var rng  = ns.makeRNG ? ns.makeRNG(seed) : null;
    var axes = normalAxes(opts.axes || (ns.Axes ? ns.Axes.snapshot() : null));
    var tens = normalTensions(opts.tensions || (ns.Axes ? ns.Axes.tensions() : null));
    var context = {
      seed: seed,
      worldId: opts.worldId || 'orientation',
      cigaretteLit: opts.cigaretteLit !== false,
      flags: opts.flags || {}
    };
    var closers = CLOSERS.concat(worldClosers(context.worldId));

    if (!rng) {
      return {
      seed: seed,
      lines: [VERDICTS[0].text, TENSIONS[0].text, closers[0].text],
      fragmentIds: [VERDICTS[0].id, TENSIONS[0].id, closers[0].id],
      cigaretteLit: context.cigaretteLit,
      axes: axes,
      tensions: tens
    };
  }

    var verdict = pickPriority(rng, VERDICTS, axes, tens, context);
    var tension = pickPriority(rng, TENSIONS, axes, tens, context);
    var closer  = pickPriority(rng, closers, axes, tens, context);

    return {
      seed: seed,
      lines: [verdict.text, tension.text, closer.text],
      fragmentIds: [verdict.id, tension.id, closer.id],
      cigaretteLit: context.cigaretteLit,
      axes: axes,
      tensions: tens,
      flags: context.flags
    };
  }

  registerFragment('VERDICTS', 'W11_BENEFITS_VERDICT_ATRIUM_01', 'THE ATRIUM PRICED YOUR HESITATION.', {worlds:{benefits:3.2}, axes:{compliance:0.5, intuition:0.4}, micro:{idleMs:0.5}, tone:'benign'});
  registerFragment('VERDICTS', 'W11_BENEFITS_VERDICT_NETWORK_01', 'THE NETWORK COUNTED YOUR SHOULDERS.', {worlds:{benefits:3.1}, axes:{grace:0.5, efficiency:0.3}, micro:{nearMisses:0.5}, tone:'benign'});
  registerFragment('VERDICTS', 'W11_BENEFITS_VERDICT_AUTH_01', 'PREAUTHORIZATION MISTOOK DELAY FOR VALUE.', {worlds:{benefits:3.1}, flags:{premiumSecured:true}, axes:{compliance:0.6}, micro:{contradictionFollow:0.6}, tone:'benign'});
  registerFragment('TENSIONS', 'W11_BENEFITS_TENSION_BRANCH_01', 'EVERY BRANCH COST A DIFFERENT BODY.', {worlds:{benefits:3.0}, tensions:{auditRisk:0.4, style:0.2}, micro:{modulesPassed:0.4}});
  registerFragment('TENSIONS', 'W11_BENEFITS_TENSION_SLOW_01', 'THE CLAIM REWARDED LOWER VELOCITY.', {worlds:{benefits:3.1}, tensions:{obedience:0.5}, axes:{compliance:0.4, intuition:0.2}, tone:'benign'});
  registerFragment('TENSIONS', 'W11_BENEFITS_TENSION_EXPOSED_01', 'YOUR EXPOSURE IMPROVED THE MARGIN.', {worlds:{benefits:3.2}, flags:{uninsuredVeteran:true}, tensions:{obedience:-0.6, auditRisk:0.4}, micro:{damageTaken:0.6}});
  registerFragment('CLOSERS', 'W11_BENEFITS_CLOSER_PLAN_01', 'THE PLAN CLOSED WITHOUT LOOKING DOWN.', {worlds:{benefits:3.2}, flags:{premiumSecured:true}, axes:{compliance:0.3}, tone:'benign'});
  registerFragment('CLOSERS', 'W11_BENEFITS_CLOSER_BILLING_01', 'THE EXIT KEPT A BILLING ADDRESS.', {worlds:{benefits:3.0}, axes:{efficiency:0.2, chaos:0.2}});
  registerFragment('VERDICTS', 'W11_RASTA_VERDICT_BELT_01', 'THE BELT ACCEPTED YOUR STILLNESS.', {worlds:{rasta:3.3}, flags:{restOpened:true, cigaretteLit:false}, axes:{intuition:0.5, grace:0.3}, micro:{musicSync:0.5}, tone:'benign'});
  registerFragment('TENSIONS', 'W11_RASTA_TENSION_DOOR_01', 'THE KIND DOOR REASSESSED URGENCY.', {worlds:{rasta:3.2}, flags:{rushedRest:true}, micro:{contradictionDefy:0.6}, axes:{intuition:0.3}, tone:'benign'});
  registerFragment('CLOSERS', 'W11_RASTA_CLOSER_FLOOR_01', 'THE FLOOR RELEASED YOUR BREATH.', {worlds:{rasta:3.3}, flags:{restOpened:true, cigaretteLit:false}, axes:{grace:0.4}, tone:'benign'});
  registerFragment('CLOSERS', 'W11_RASTA_CLOSER_NAME_01', 'SOFT MACHINES RETURNED YOUR NAME.', {worlds:{rasta:3.1}, flags:{rushedRest:true}, axes:{intuition:0.3, grace:0.2}, tone:'benign'});

  ns.Receipts = {
    POOLS: {
      VERDICTS: VERDICTS,
      TENSIONS: TENSIONS,
      CLOSERS: CLOSERS
    },
    generate: generate,
    cardModel: cardModel,
    registerFragment: registerFragment,
    playUrlForSeed: playUrlForSeed,
    themeForReceipt: themeForReceipt,
    isThermalSearch: isThermalSearch,
    queryValue: queryValue
  };
})(CEHP);
CEHP._register('80_receipts');
