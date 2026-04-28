/* MODULE: 07_ED_STATE-authored-readable Ed state machine and W10 Phase 3 verbs. ES5 only. */

(function(ns){
'use strict';

var STATE_PRIORITY=[
  'death',
  'hitStop',
  'iFrameHurt',
  'dash',
  'slide',
  'melee',
  'ranged',
  'wallJump',
  'wallSlide',
  'wallClimb',
  'doubleJump',
  'jumpRise',
  'jumpApex',
  'jumpFall',
  'landed',
  'crouch',
  'skid',
  'run',
  'idle'
];

var PUBLIC_STATES=[
  'idle',
  'run',
  'skid',
  'crouch',
  'jumpRise',
  'jumpApex',
  'jumpFall',
  'doubleJump',
  'wallSlide',
  'wallClimb',
  'wallJump',
  'dash',
  'slide',
  'melee',
  'ranged',
  'hitStop',
  'iFrameHurt',
  'landed',
  'death'
];

var INPUT_ACTIONS=['dash','melee','ranged','jump'];

var RUN_CAP=180;
var DASH_SPEED=260;
var DASH_ACTIVE_MS=167;
var DASH_RECOVERY_MS=100;
var DASH_WINDUP_MS=50;
var DASH_LATCH_FRAMES=20;
var DASH_EVENT_LATCH_FRAMES=6;

var DOUBLE_JUMP_IMPULSE_RATIO=0.82;
var DOUBLEJUMP_X_KEEP=0.90;
var DOUBLE_JUMP_LATCH_FRAMES=6;

var WALL_GRACE_MS=83;
var WALL_STICK_MS=67;
var WALLSLIDE_FALL_RATIO=0.40;
var WALLJUMP_AWAY_VEL=Math.round(RUN_CAP*1.15);// 115% run cap per WALLJUMP_AWAY_RATIO.
var WALLJUMP_VERTICAL_RATIO=0.92;
var WALLJUMP_HORIZONTAL_COMMIT_MS=100;
var WALLJUMP_LATCH_FRAMES=7;

var CLIMB_UP_SPEED=90;
var CLIMB_DOWN_SPEED=110;

var SLIDE_WINDUP_MS=33;
var SLIDE_ACTIVE_MS=217;
var SLIDE_RECOVERY_MS=100;
var SLIDE_JUMP_CANCEL_WINDOW_MS=100;
var SLIDE_JUMP_SPEED_MULT=1.08;
var SLIDE_LATCH_FRAMES=22;

var DIAGONAL_AIM_DEG=35;
var BUFFER_CAPACITY=8;
var BUFFER_PRUNE_FRAMES=12;
var ACTION_LATCH_FRAMES=6;
var MELEE_LATCH_FRAMES=8;
var LANDED_LATCH_FRAMES=2;
var DEFAULT_MAX_FALL=560;
var COYOTE_MS=100;// W10 Phase 4: 100 ms coyote window cushions desk-job mistakes.
var JUMP_BUFFER_MS=100;// W10 Phase 4: 100 ms landing buffer,replacing legacy 120 ms at read time.
var DASH_BUFFER_MS=83;// W10 Phase 4: 83 ms dash buffer equals five 60hz frames.
var ATTACK_BUFFER_MS=83;// W10 Phase 4: 83 ms attack buffer equals five 60hz frames.
var JUMP_QUEUE_MS=100;// W10 Phase 4: 100 ms queue lets a late landing inherit intent.
var MOVING_PLATFORM_GRACE_MS=83;// W10 Phase 4: 83 ms grace after leaving moving platforms.
var JUMP_RELEASE_WINDOW_MS=180;// W10 Phase 4: release cut only inside the first 180 ms of takeoff.
var JUMP_CUT_RATIO=0.60;// W10 Phase 4: cut rising velocity to 60%,not superhero snap.
var APEX_GRAVITY_MULT=0.90;// W10 Phase 4: apex gravity is read as 90% of global gravity.
var APEX_DURATION_MS=80;// W10 Phase 4: 80 ms soft peak window.
var APEX_VEL_EPSILON=30;// W10 Phase 4: |vy|<30 px/s is the authored apex band.
var FALL_GRAVITY_MULT=1.12;// W10 Phase 4: falling reads 112% gravity without mutating globals.
var IFRAMES_MS=900;// W10 Phase 4: 900 ms post-damage invulnerability.
var IFRAMES_BLINK_ON_MS=50;// W10 Phase 4: 50 ms visible blink phase.
var IFRAMES_BLINK_OFF_MS=50;// W10 Phase 4: 50 ms dim blink phase.
var DAMAGE_HITSTOP_MS=67;// W10 Phase 4: damage hit-stop is four fixed-step frames.
var MELEE_HITSTOP_MS=50;// W10 Phase 4: melee hit-stop is three fixed-step frames.
var PROJECTILE_HITSTOP_MS=17;// W10 Phase 4: projectile hit-stop is one fixed-step frame.
var CONTROL_LOCK_AFTER_DAMAGE_MS=133;// W10 Phase 4: full post-damage lock lasts eight frames.
var AIR_CONTROL_RESTORED_MS=80;// W10 Phase 4: airborne nudge returns before full lock lifts.
var LEDGE_SNAP_X=8;// W10 Phase 4: snap within 8 px horizontally near ledges.
var LEDGE_SNAP_Y=10;// W10 Phase 4: snap within 10 px vertically near ledges.
var STEP_UP_PX=6;// W10 Phase 4: 6 px step-up over tiny floor lips.
var CORNER_FORGIVE_PX=6;// W10 Phase 4: 6 px head-corner forgiveness;legacy nudge is topped up.

var originalRegister=null;
var activeEventPlayer=null;
var lastEventPlayer=null;
var eventsBound=false;
var registerWrapped=false;

function clonePlain(value){
  return value == null?value:JSON.parse(JSON.stringify(value));
}

function isGrounded(player){
  var body=player&&player.body;
  return !!(body&&((body.blocked&&body.blocked.down)||(body.touching&&body.touching.down)));
}

function getVelX(player){
  return player&&player.body&&player.body.velocity?player.body.velocity.x:0;
}

function getVelY(player){
  return player&&player.body&&player.body.velocity?player.body.velocity.y:0;
}

function emitMovementEvent(topic,payload){
  if (ns.Events&&ns.Events.emit) ns.Events.emit(topic,payload||{});
}

function emitPlayerEvent(topic,player){
  emitMovementEvent(topic,{x: player.x,y: player.y});
}

function getWallContact(player){
  var body=player&&player.body;
  if (!body) return 0;
  if ((body.blocked&&body.blocked.left)||(body.touching&&body.touching.left)) return -1;
  if ((body.blocked&&body.blocked.right)||(body.touching&&body.touching.right)) return 1;
  return 0;
}

function axisX(input){
  return input&&input.axisX?input.axisX():0;
}

function pressed(input,action){
  return !!(input&&input.down&&input.down(action));
}

function justPressed(input,action){
  return !!(input&&input.justPressed&&input.justPressed(action));
}

function justReleased(input,action){
  return !!(input&&input.justReleased&&input.justReleased(action));
}

function setVelX(player,value){
  if (!player||!player.body) return;
  if (player.body.setVelocityX) player.body.setVelocityX(value);
  else if (player.body.velocity) player.body.velocity.x=value;
}

function setVelY(player,value){
  if (!player||!player.body) return;
  if (player.body.setVelocityY) player.body.setVelocityY(value);
  else if (player.body.velocity) player.body.velocity.y=value;
}

function setBodyGravityY(player,value){
  if (!player||!player.body) return;
  if (player.body.setGravityY) player.body.setGravityY(value);
  else player.body.gravityY=value;
}

function msToFrames(ms){
  return Math.max(1,Math.ceil(((Number(ms)||0)/(ns.FixedStep&&ns.FixedStep.STEP_MS?ns.FixedStep.STEP_MS:(1000/60)))));
}

function decrementMs(value,dtMs){
  return Math.max(0,(value||0)-(dtMs||0));
}

function setActorHitStop(actor,durationMs){
  if (!actor||!durationMs) return;
  actor._cehpHitStopMs=Math.max(actor._cehpHitStopMs||0,durationMs);
}

function hitStopDuration(className){
  if (className==='melee') return MELEE_HITSTOP_MS;
  if (className==='projectile') return PROJECTILE_HITSTOP_MS;
  if (className==='damage') return DAMAGE_HITSTOP_MS;
  return 0;
}

function makeVerbs(){
  return {
    dashPhase: '',
    dashMs: 0,
    dashRecoveryMs: 0,
    dashDir: 0,
    slidePhase: '',
    slideMs: 0,
    slideRecoveryMs: 0,
    slideDir: 0,
    wallGraceMs: 0,
    wallStickMs: 0,
    wallSide: 0,
    wallJumpCommitMs: 0,
    wallJumpDir: 0,
    airJumpsLeft: 1,
    wallClimb: 0,
    aimY: 0
 };
}

function makePhase4(){
  return {
    coyoteMs: 0,
    jumpBufferMs: 0,
    dashBufferMs: 0,
    attackBufferMs: 0,
    jumpQueueMs: 0,
    movingPlatformGraceMs: 0,
    jumpCutMs: 0,
    jumpCutUsed: false,
    apexMs: 0,
    effectiveGravity: ns.TUNING.GRAVITY,
    hitStopMs: 0,
    hitStopFrames: 0,
    iframesMs: 0,
    blinkMs: 0,
    controlLockMs: 0,
    airControlDelayMs: 0,
    damageAirborne: false
 };
}

function ensureVerbs(state){
  if (!state.verbs) state.verbs=makeVerbs();
  if (state.verbs.airJumpsLeft == null) state.verbs.airJumpsLeft=1;
  return state.verbs;
}

function ensurePhase4(state){
  if (!state.phase4) state.phase4=makePhase4();
  if (state.phase4.effectiveGravity == null) state.phase4.effectiveGravity=ns.TUNING.GRAVITY;
  return state.phase4;
}

function phase4Of(player){
  return ensurePhase4(ensureState(player));
}

function priorityIndex(stateName){
  var i;
  for (i=0;i<STATE_PRIORITY.length;i++) {
    if (STATE_PRIORITY[i]===stateName) return i;
 }
  return STATE_PRIORITY.length;
}

function getFrame(state){
  if (state&&state.fixed&&state.fixed.semanticFrame>0) return state.fixed.semanticFrame;
  return state&&state.fixed&&state.fixed.frame||0;
}

function createInputBuffer(){
  if (ns.InputBuffer&&ns.InputBuffer.create) return ns.InputBuffer.create({capacity: BUFFER_CAPACITY});
  return {capacity: BUFFER_CAPACITY,entries: []};
}

function createFixedStep(){
  if (ns.FixedStep&&ns.FixedStep.create) return ns.FixedStep.create();
  return {frame: 0,alpha: 0,lastStepCount: 0};
}

function createState(){
  return {
    fixed: createFixedStep(),
    buffer: createInputBuffer(),
    current: 'idle',
    previous: '',
    stateFrame: 0,
    enteredFrame: 0,
    lastGrounded: false,
    latchedState: {
      name: '',
      framesLeft: 0
   },
    cooldowns: {},
    verbs: makeVerbs(),
    phase4: makePhase4()
 };
}

function ensureState(player){
  var state;

  if (!player) return createState();

  state=player._cehpState;
  if (!state) {
    state=createState();
    state.lastGrounded=isGrounded(player);
    player._cehpState=state;
 }

  if (!state.fixed) state.fixed=createFixedStep();
  if (!state.buffer) state.buffer=createInputBuffer();
  if (!state.cooldowns) state.cooldowns={};
  if (!state.latchedState||typeof state.latchedState!=='object') {
    state.latchedState={
      name: '',
      framesLeft: 0
   };
 }

  ensureVerbs(state);
  ensurePhase4(state);
  if (!state.current) state.current='idle';
  if (state.previous == null) state.previous='';

  lastEventPlayer=player;
  return state;
}

function exitState(player,nextState){
  return {fromState: ensureState(player).current,toState: nextState||''};
}

function shouldTraceTransition(fromState,toState,trigger){
  if (trigger==='physics'&&(toState==='run'||toState==='idle'||toState==='landed')) return false;
  return !!(fromState||toState);
}

function shouldSuppressRuntimeTrace(toState,trigger){
  if (trigger==='physics') return toState==='jumpRise'||toState==='jumpApex'||toState==='jumpFall'||toState==='wallSlide';
  if (trigger==='input') return toState==='jumpRise'||toState==='doubleJump'||toState==='wallJump';
  return false;
}

function enterState(player,nextState,trigger){
  var previousState;
  var previousFrames;
  var state=ensureState(player);
  var frame=getFrame(state);

  nextState=nextState||'idle';

  if (state.current===nextState) {
    state.stateFrame=frame-state.enteredFrame;
    if (state.stateFrame<0) state.stateFrame=0;
    return state;
 }

  exitState(player,nextState);

  previousState=state.current||'';
  previousFrames=frame-state.enteredFrame;
  if (previousFrames<0) previousFrames=0;

  state.previous=state.current;
  state.current=nextState;
  state.enteredFrame=frame;
  state.stateFrame=0;

  trigger=trigger||'physics';
  if (ns.Events&&ns.Events.emit &&
      !(state.suppressRuntimeTrace&&shouldSuppressRuntimeTrace(state.current,trigger)) &&
      shouldTraceTransition(previousState,state.current,trigger)) {
    ns.Events.emit('state:transition',{frame: frame,from: previousState,to: state.current,trigger: trigger,stateFrame: previousFrames,grounded: isGrounded(player),vx: getVelX(player),vy: getVelY(player)});
 }

  return state;
}

function latchState(player,stateName,frames){
  var latched=ensureState(player).latchedState;

  frames=Math.max(0,Math.floor(Number(frames)||0));
  if (!stateName||!frames) {
    latched.name='';
    latched.framesLeft=0;
    return latched;
 }

  if (!latched.name||priorityIndex(stateName)<priorityIndex(latched.name)||latched.name===stateName) {
    latched.name=stateName;
    if (frames>latched.framesLeft) latched.framesLeft=frames;
 }

  return latched;
}

function resetState(player){
  var state=ensureState(player);

  if (ns.FixedStep&&ns.FixedStep.reset) ns.FixedStep.reset(state.fixed);
  state.fixed.semanticFrame=0;
  state.buffer=createInputBuffer();
  state.current='idle';
  state.previous='';
  state.stateFrame=0;
  state.enteredFrame=0;
  state.lastGrounded=isGrounded(player);
  state.latchedState={
    name: '',
    framesLeft: 0
 };
  state.cooldowns={};
  state.verbs=makeVerbs();
  state.phase4=makePhase4();

  if (player) {
    player.wallSliding=false;
    player._cehpWallClimbing=false;
    player._cehpAimY=0;
    player._cehpAimDeg=0;
 }

  return state;
}

function queueInput(state,action,source){
  var frame=getFrame(state);
  if (ns.InputBuffer&&ns.InputBuffer.push) {
    ns.InputBuffer.push(state.buffer,action,frame,{source: source||action});
 }
}

function emitNearMiss(state,frame,action,reason){
  if (!ns.Events||!ns.Events.emit) return;
  ns.Events.emit('state:nearMiss',{
    frame: frame,
    state: state.current,
    action: action,
    gated_by: reason,
    stateFrame: state.stateFrame
 });
}

function bufferHasAction(buffer,action){
  var entries=buffer&&buffer.entries?buffer.entries:null;
  var i;

  if (!entries) return false;
  for (i=entries.length-1;i>=0;i--) {
    if (entries[i]&&entries[i].action===action) return true;
 }
  return false;
}

function canTransition(player,action){
  var entry;
  var hasBufferedAction;
  var state=ensureState(player);
  var rules=ns.CancelMatrix&&ns.CancelMatrix.rules?ns.CancelMatrix.rules():null;
  var stateRules=rules&&rules[state.current]?rules[state.current]:null;
  var rule=stateRules&&stateRules[action]?stateRules[action]:null;
  var frame=getFrame(state);

  if (!rule) return null;

  hasBufferedAction=bufferHasAction(state.buffer,action);

  if (state.cooldowns[action] != null&&frame<state.cooldowns[action]) {
    if (hasBufferedAction) emitNearMiss(state,frame,action,'cooldown');
    return null;
 }

  if (state.stateFrame<rule.window.startFrame) {
    if (hasBufferedAction) emitNearMiss(state,frame,action,'window_too_early');
    return null;
 }

  if (rule.window.endFrame>=0&&state.stateFrame>rule.window.endFrame) {
    if (hasBufferedAction) emitNearMiss(state,frame,action,'window_too_late');
    return null;
 }

  entry=ns.InputBuffer&&ns.InputBuffer.peek?ns.InputBuffer.peek(state.buffer,action,frame,rule.bufferFrames):null;
  if (entry) {
    return {
      action: action,
      toState: rule.toState,
      rule: clonePlain(rule),
      entry: entry
   };
 }

  if (hasBufferedAction) emitNearMiss(state,frame,action,'buffer_miss');
  return null;
}

function consumesActionState(stateName){
  return stateName==='dash'||stateName==='melee'||stateName==='ranged'||stateName==='doubleJump'||stateName==='wallJump';
}

function consumeTransition(player,transition){
  var state;
  var frame;

  if (!transition) return null;

  state=ensureState(player);
  frame=getFrame(state);

  if (ns.InputBuffer&&ns.InputBuffer.consume) {
    ns.InputBuffer.consume(state.buffer,transition.action,frame,transition.rule.bufferFrames);
 }

  if (transition.rule.cooldownFrames>0) {
    state.cooldowns[transition.action]=frame+transition.rule.cooldownFrames;
 }

  enterState(player,transition.toState,'input');
  if (consumesActionState(transition.toState)) latchState(player,transition.toState,ACTION_LATCH_FRAMES);

  return transition;
}

function isDashBusy(verbs){
  return verbs.dashPhase==='windup'||verbs.dashPhase==='active'||verbs.dashRecoveryMs>0;
}

function isSlideBusy(verbs){
  return verbs.slidePhase==='windup'||verbs.slidePhase==='active'||verbs.slideRecoveryMs>0;
}

function applyDiagonalAim(player,input){
  var aimY=pressed(input,'up')?-1:(pressed(input,'down')?1:0);

  if (justPressed(input,'punch')||justPressed(input,'kick')||player.attackMs>0) {
    player._cehpAimY=aimY;
    player._cehpAimDeg=DIAGONAL_AIM_DEG*aimY;// up=-35,down=+35,overlay rotates per 89_ed_perform.
 } else if (!player.attackMs) {
    player._cehpAimY=0;
    player._cehpAimDeg=0;
 }
}

function beginSlide(player,verbs,dirSign){
  verbs.slidePhase='windup';
  verbs.slideMs=SLIDE_WINDUP_MS;
  verbs.slideRecoveryMs=0;
  verbs.slideDir=dirSign||player.facing||1;
  latchState(player,'slide',SLIDE_LATCH_FRAMES);
  enterState(player,'slide','input');
}

function beginDash(player,verbs,dirSign){
  verbs.dashPhase='windup';
  verbs.dashMs=DASH_WINDUP_MS;
  verbs.dashRecoveryMs=0;
  verbs.dashDir=dirSign||player.facing||1;
  latchState(player,'dash',DASH_LATCH_FRAMES);
  enterState(player,'dash','input');
}

function readVerbIntent(player,input,dtMs){
  var state=ensureState(player);
  var verbs=ensureVerbs(state);
  var phase4=ensurePhase4(state);
  var grounded=isGrounded(player);
  var wallSide=getWallContact(player);
  var axis=axisX(input);
  var holdingIntoWall=wallSide!==0&&axis===wallSide;
  var jumpPressed=justPressed(input,'jump');
  var dashPressed=justPressed(input,'spinDash')||phase4.dashBufferMs>0;
  var facingDir=axis||player.facing||1;
  var intent={
    suppressJump: false,
    suppressSpinDash: true,
    suppressWallAxis: false,
    doubleJump: false,
    tripleJump: false,
    wallJump: false,
    slideCancel: false,
    wall: wallSide,
    preVx: getVelX(player)
 };

  applyDiagonalAim(player,input);

  if (grounded||wallSide!==0) verbs.airJumpsLeft=1;

  if (grounded) {
    verbs.wallGraceMs=0;
    verbs.wallStickMs=0;
    verbs.wallSide=0;
 } else if (wallSide!==0) {
    verbs.wallGraceMs=WALL_GRACE_MS;
    verbs.wallSide=wallSide;
    if (holdingIntoWall&&getVelY(player)>0) verbs.wallStickMs=WALL_STICK_MS;
 } else {
    verbs.wallGraceMs=Math.max(0,verbs.wallGraceMs-dtMs);
    verbs.wallStickMs=Math.max(0,verbs.wallStickMs-dtMs);
 }

  if (dashPressed&&phase4.controlLockMs<=0&&grounded&&!isDashBusy(verbs)&&!isSlideBusy(verbs)) {
    phase4.dashBufferMs=0;
    if (pressed(input,'down')) beginSlide(player,verbs,facingDir);
    else beginDash(player,verbs,facingDir);
 }

  if (jumpPressed&&verbs.slidePhase==='active') {
    if (verbs.slideMs<=SLIDE_JUMP_CANCEL_WINDOW_MS) intent.slideCancel=true;// cancel only when slideMs<=100.
    intent.suppressJump=true;
 } else if (jumpPressed&&isSlideBusy(verbs)) {
    intent.suppressJump=true;
 } else if (jumpPressed&&!grounded&&(wallSide!==0||verbs.wallGraceMs>0)&&(holdingIntoWall||player.wallSliding)) {
    intent.wallJump=true;
    intent.wall=wallSide||verbs.wallSide||player.facing||1;
    intent.suppressJump=true;
 } else if (jumpPressed&&!grounded&&player.jumpsUsed===2) {
    intent.tripleJump=true;
    intent.suppressJump=true;
 } else if (jumpPressed&&!grounded&&verbs.airJumpsLeft>0&&player.jumpsUsed>=1) {
    intent.doubleJump=true;
    intent.suppressJump=true;
 } else if (jumpPressed&&!grounded&&player.jumpsUsed>=2) {
    intent.suppressJump=true;
 }

  if (!grounded&&wallSide!==0&&holdingIntoWall&&getVelY(player)>0) intent.suppressWallAxis=true;

  return intent;
}

function getJumpVelocity(player){
  return player&&player.jumpVelocity != null?player.jumpVelocity:ns.TUNING.JUMP_VELOCITY;
}

function hasBufferedMs(value){
  return (Number(value)||0)>0;
}

function markJumpTakeoff(player){
  var phase4=phase4Of(player);

  if (player&&player.body) {
    if (ns.Feel&&ns.Feel.resetGravityModifier) ns.Feel.resetGravityModifier(player);
    else {
      player.gravityMultiplier=1;
      setBodyGravityY(player,0);
   }
 }
  phase4.jumpCutMs=JUMP_RELEASE_WINDOW_MS;
  phase4.jumpCutUsed=false;
  phase4.apexMs=0;
}

function canUseForgivenGround(player,phase4){
  return isGrounded(player)||phase4.coyoteMs>0||phase4.movingPlatformGraceMs>0;
}

function platformRect(platform){
  if (!platform) return null;
  if (platform.rect) return platformRect(platform.rect);
  if (platform.body) {
    return {left: platform.body.x,right: platform.body.x+platform.body.width,top: platform.body.y,bottom: platform.body.y+platform.body.height};
 }
  return {left: platform.x-((platform.width||0)/2),right: platform.x+((platform.width||0)/2),top: platform.y-((platform.height||0)/2),bottom: platform.y+((platform.height||0)/2)};
}

function playerRect(player){
  var body=player&&player.body;
  if (body&&body.width&&body.height&&body.x != null&&body.y != null) {
    return {left: body.x,right: body.x+body.width,top: body.y,bottom: body.y+body.height,width: body.width,height: body.height};
 }
  return {left: player.x-((player.width||18)/2),right: player.x+((player.width||18)/2),top: player.y-((player.height||28)/2),bottom: player.y+((player.height||28)/2),width: player.width||18,height: player.height||28};
}

function collectPlatforms(player){
  var scene=player&&player.scene;
  var room=scene&&scene.room?scene.room:null;
  var out=[];
  var i;

  if (room&&room.platforms) {
    for (i=0;i<room.platforms.length;i++) out.push(room.platforms[i]);
 }
  if (room&&room.syncPlatforms) {
    for (i=0;i<room.syncPlatforms.length;i++) {
      if (room.syncPlatforms[i]&&room.syncPlatforms[i].rect) out.push(room.syncPlatforms[i].rect);
   }
 }

  return out;
}

function isOverMovingPlatform(player){
  var scene=player&&player.scene;
  var room=scene&&scene.room?scene.room:null;
  var rect=playerRect(player);
  var platforms=room&&room.syncPlatforms?room.syncPlatforms:null;
  var p;
  var pr;
  var i;

  if (!platforms||!platforms.length) return false;

  for (i=0;i<platforms.length;i++) {
    p=platforms[i];
    pr=platformRect(p&&p.rect?p.rect:p);
    if (!pr) continue;
    if (rect.right<pr.left||rect.left>pr.right) continue;
    if (Math.abs(rect.bottom-pr.top)<=MOVING_PLATFORM_GRACE_MS/8) return true;
 }

  return false;
}

function tickForgiveness(player,input,dtMs){
  var state=ensureState(player);
  var phase4=ensurePhase4(state);
  var grounded=isGrounded(player);
  var jumpEdge=justPressed(input,'jump');

  if (grounded) {
    phase4.coyoteMs=COYOTE_MS;
    phase4.movingPlatformGraceMs=isOverMovingPlatform(player)?MOVING_PLATFORM_GRACE_MS:phase4.movingPlatformGraceMs;
 } else {
    phase4.coyoteMs=decrementMs(phase4.coyoteMs,dtMs);
    phase4.movingPlatformGraceMs=decrementMs(phase4.movingPlatformGraceMs,dtMs);
 }

  phase4.jumpBufferMs=jumpEdge?JUMP_BUFFER_MS:decrementMs(phase4.jumpBufferMs,dtMs);
  phase4.jumpQueueMs=jumpEdge?JUMP_QUEUE_MS:decrementMs(phase4.jumpQueueMs,dtMs);
  phase4.dashBufferMs=justPressed(input,'spinDash')?DASH_BUFFER_MS:decrementMs(phase4.dashBufferMs,dtMs);
  phase4.attackBufferMs=(justPressed(input,'punch')||justPressed(input,'kick'))?ATTACK_BUFFER_MS:decrementMs(phase4.attackBufferMs,dtMs);

  if (phase4.jumpCutMs>0&&!grounded) phase4.jumpCutMs=decrementMs(phase4.jumpCutMs,dtMs);
  if (grounded) {
    phase4.jumpCutMs=0;
    phase4.jumpCutUsed=false;
    phase4.apexMs=0;
 }

  return phase4;
}

function applyPrimaryJump(player){
  var state=ensureState(player);
  var phase4=ensurePhase4(state);

  if (!hasBufferedMs(phase4.jumpBufferMs)&&!hasBufferedMs(phase4.jumpQueueMs)) return false;
  if (!canUseForgivenGround(player,phase4)) return false;

  phase4.jumpBufferMs=0;
  phase4.jumpQueueMs=0;
  phase4.coyoteMs=0;
  phase4.movingPlatformGraceMs=0;
  player.jumpsUsed=1;
  setVelY(player,getJumpVelocity(player));
  markJumpTakeoff(player);
  emitPlayerEvent('movement:jump',player);
  return true;
}

function applyJumpCut(player,input){
  var phase4=phase4Of(player);

  if (!justReleased(input,'jump')) return false;
  if (phase4.jumpCutUsed||phase4.jumpCutMs<=0||getVelY(player)>=0) return false;

  setVelY(player,getVelY(player)*JUMP_CUT_RATIO);
  phase4.jumpCutUsed=true;
  phase4.jumpCutMs=0;
  return true;
}

function applyGravityDeltas(player){
  var phase4=phase4Of(player);
  var vy=getVelY(player);
  var gravity=ns.TUNING.GRAVITY;
  var effective=gravity;

  if (isGrounded(player)) {
    phase4.apexMs=0;
 } else if (Math.abs(vy)<APEX_VEL_EPSILON) {
    phase4.apexMs=APEX_DURATION_MS;
 } else if (phase4.apexMs>0) {
    phase4.apexMs=decrementMs(phase4.apexMs,ns.FixedStep&&ns.FixedStep.STEP_MS?ns.FixedStep.STEP_MS:16);
 }

  if (!isGrounded(player)&&phase4.apexMs>0&&Math.abs(vy)<APEX_VEL_EPSILON) {
    effective=gravity*APEX_GRAVITY_MULT;
 } else if (!isGrounded(player)&&vy>0) {
    effective=gravity*FALL_GRAVITY_MULT;
 }

  phase4.effectiveGravity=effective;
  setBodyGravityY(player,Math.round((effective-gravity)*1000)/1000);
  return effective;
}

function resolvePostDamageLockout(player,dtMs){
  var phase4=phase4Of(player);

  phase4.controlLockMs=decrementMs(phase4.controlLockMs,dtMs);
  phase4.airControlDelayMs=decrementMs(phase4.airControlDelayMs,dtMs);
  if (phase4.controlLockMs<=0) phase4.damageAirborne=false;
  return phase4;
}

function airNudgeAllowed(player,phase4){
  return phase4.controlLockMs>0&&phase4.damageAirborne&&phase4.airControlDelayMs<=0&&!isGrounded(player);
}

function controlsLocked(player,phase4){
  return phase4.controlLockMs>0&&!airNudgeAllowed(player,phase4);
}

function tickIFrames(player,dtMs){
  var phase4=phase4Of(player);
  var totalBlink=IFRAMES_BLINK_ON_MS+IFRAMES_BLINK_OFF_MS;
  var blinkAt;

  if (phase4.iframesMs<=0&&player&&player.invulnMs>0) phase4.iframesMs=player.invulnMs;

  if (phase4.iframesMs>0) {
    phase4.iframesMs=decrementMs(phase4.iframesMs,dtMs);
    if (player) player.invulnMs=phase4.iframesMs;
    phase4.blinkMs=(phase4.blinkMs+(Number(dtMs)||0)) % totalBlink;
    blinkAt=phase4.blinkMs<IFRAMES_BLINK_ON_MS;
    if (player) player.alpha=blinkAt?1:0.35;
 } else if (player&&(!player.invulnMs||player.invulnMs<=0)) {
    phase4.blinkMs=0;
    player.alpha=1;
 }

  return phase4.iframesMs;
}

function tickHitStop(player,dtMs){
  var state=ensureState(player);
  var phase4=ensurePhase4(state);
  var active=phase4.hitStopMs>0;

  if (!active) return false;

  enterState(player,'hitStop','event');
  phase4.hitStopMs=decrementMs(phase4.hitStopMs,dtMs);
  phase4.hitStopFrames=phase4.hitStopMs>0?msToFrames(phase4.hitStopMs):0;
  if (phase4.hitStopMs<=0&&state.latchedState&&state.latchedState.name==='hitStop') {
    state.latchedState.name='';
    state.latchedState.framesLeft=0;
 }
  return true;
}

function startHitStop(player,className,actor){
  var durationMs=hitStopDuration(className);
  var state;
  var phase4;

  if (!durationMs) return 0;

  state=ensureState(player);
  phase4=ensurePhase4(state);
  phase4.hitStopMs=Math.max(phase4.hitStopMs,durationMs);
  phase4.hitStopFrames=msToFrames(phase4.hitStopMs);
  latchState(player,'hitStop',phase4.hitStopFrames);
  enterState(player,'hitStop','event');
  setActorHitStop(actor,durationMs);
  return durationMs;
}

function acceptDamage(player,source,opts){
  var state=ensureState(player);
  var phase4=ensurePhase4(state);
  var hitStopClass;

  opts=opts||{};
  if (phase4.iframesMs>0||(player&&player.invulnMs>0)) return false;

  phase4.iframesMs=IFRAMES_MS;
  phase4.blinkMs=0;
  phase4.controlLockMs=CONTROL_LOCK_AFTER_DAMAGE_MS;
  phase4.airControlDelayMs=AIR_CONTROL_RESTORED_MS;
  phase4.damageAirborne=!isGrounded(player);
  if (player) player.invulnMs=IFRAMES_MS;

  hitStopClass=opts.hitStopClass == null?'damage':opts.hitStopClass;
  if (hitStopClass) startHitStop(player,hitStopClass,opts.actor);
  return true;
}

function resolveSpatialForgiveness(player,input){
  var body=player&&player.body;
  var axis=axisX(input);
  var platforms;
  var rect;
  var pr;
  var i;
  var nudgeTopUp;

  if (!body) return;

  if (body.blocked&&body.blocked.up&&axis!==0) {
    nudgeTopUp=CORNER_FORGIVE_PX-(ns.TUNING.CORNER_NUDGE_PX||0);
    if (nudgeTopUp>0) player.x += axis*nudgeTopUp;
 }

  platforms=collectPlatforms(player);
  if (!platforms.length) return;
  rect=playerRect(player);

  if (isGrounded(player)&&axis!==0&&((axis<0&&body.blocked&&body.blocked.left)||(axis>0&&body.blocked&&body.blocked.right))) {
    for (i=0;i<platforms.length;i++) {
      pr=platformRect(platforms[i]);
      if (!pr) continue;
      if (rect.bottom>=pr.top&&rect.bottom<=pr.top+STEP_UP_PX) {
        player.y -= STEP_UP_PX;
        break;
     }
   }
 }

  if (!isGrounded(player)&&getVelY(player)>=0) {
    for (i=0;i<platforms.length;i++) {
      pr=platformRect(platforms[i]);
      if (!pr) continue;
      if (rect.bottom<pr.top-LEDGE_SNAP_Y||rect.bottom>pr.top+LEDGE_SNAP_Y) continue;
      if (rect.right<pr.left-LEDGE_SNAP_X||rect.left>pr.right+LEDGE_SNAP_X) continue;
      player.y += pr.top-rect.bottom;
      setVelY(player,0);
      if (body.touching) body.touching.down=true;
      break;
   }
 }
}

function tickDash(player,verbs,dtMs){
  if (verbs.dashPhase==='windup') {
    verbs.dashMs -= dtMs;
    if (verbs.dashMs<=0) {
      verbs.dashPhase='active';
      verbs.dashMs=DASH_ACTIVE_MS+verbs.dashMs;
      emitMovementEvent('movement:spinDash',{
        x: player.x,
        y: player.y,
        tier: 1
     });
   }
 }

  if (verbs.dashPhase==='active') {
    setVelX(player,DASH_SPEED*verbs.dashDir);
    verbs.dashMs -= dtMs;
    if (verbs.dashMs<=0) {
      verbs.dashPhase='';
      verbs.dashRecoveryMs=DASH_RECOVERY_MS+verbs.dashMs;
   }
 } else if (verbs.dashRecoveryMs>0) {
    verbs.dashRecoveryMs=Math.max(0,verbs.dashRecoveryMs-dtMs);
 }
}

function tickSlide(player,verbs,dtMs){
  if (verbs.slidePhase==='windup') {
    verbs.slideMs -= dtMs;
    if (verbs.slideMs<=0) {
      verbs.slidePhase='active';
      verbs.slideMs=SLIDE_ACTIVE_MS+verbs.slideMs;
   }
 }

  if (verbs.slidePhase==='active') {
    setVelX(player,RUN_CAP*verbs.slideDir);
    verbs.slideMs -= dtMs;
    if (verbs.slideMs<=0) {
      verbs.slidePhase='';
      verbs.slideRecoveryMs=SLIDE_RECOVERY_MS+verbs.slideMs;
   }
 } else if (verbs.slideRecoveryMs>0) {
    verbs.slideRecoveryMs=Math.max(0,verbs.slideRecoveryMs-dtMs);
 }
}

function getMaxFallVelocity(player){
  var body=player&&player.body;
  if (body&&body.maxVelocity&&body.maxVelocity.y) return body.maxVelocity.y;
  return DEFAULT_MAX_FALL;
}

function isClimbableWall(player){
  var scene=player&&player.scene;
  var world=scene&&scene.physics?scene.physics.world:null;

  if (!player) return false;
  /* Level-design opt-in chain:
     world._cehpClimbBounds||world._cehpClimbable||body._cehpClimbable||actor._cehpClimbable */
  return !!(player._cehpClimbable ||
    (player.body&&player.body._cehpClimbable) ||
    (world&&(world._cehpClimbBounds||world._cehpClimbable||world.climb===true)));
}

function resolveWallClimbAndSlide(player,input,verbs,intent){
  var phase4=phase4Of(player);
  var wallSide=getWallContact(player);
  var axis=axisX(input);
  var canClimb=isClimbableWall(player)&&wallSide!==0&&!isGrounded(player)&&(pressed(input,'up')||pressed(input,'down'));

  player._cehpWallClimbing=false;
  verbs.wallClimb=0;

  if (phase4.controlLockMs>0) {
    player.wallSliding=false;
    return;
 }

  if (canClimb) {
    player._cehpWallClimbing=true;
    verbs.wallClimb=1;
    player.wallSliding=false;
    setVelX(player,0);
    setVelY(player,pressed(input,'up')?-CLIMB_UP_SPEED:CLIMB_DOWN_SPEED);
    return;
 }

  if (!isGrounded(player)&&wallSide!==0&&axis===wallSide&&getVelY(player)>0&&!intent.wallJump) {
    player.wallSliding=true;
    setVelY(player,Math.min(getVelY(player),WALLSLIDE_FALL_RATIO*getMaxFallVelocity(player)));// 40% of max fall velocity per WALLSLIDE_FALL_RATIO.
 } else {
    player.wallSliding=false;
 }
}

function resolvePhase3Verbs(player,input,dtMs,intent){
  var wallSide;
  var verbs=ensureVerbs(ensureState(player));
  var jumpVelocity=getJumpVelocity(player);

  if (intent.slideCancel) {
    verbs.slidePhase='';
    verbs.slideMs=0;
    verbs.slideRecoveryMs=SLIDE_RECOVERY_MS;
    player.jumpsUsed=1;
    setVelX(player,RUN_CAP*verbs.slideDir*SLIDE_JUMP_SPEED_MULT);// 108% run cap preserved per SLIDE_JUMP_SPEED_MULT.
    setVelY(player,jumpVelocity);
    markJumpTakeoff(player);
    emitPlayerEvent('movement:jump',player);
 } else if (intent.wallJump) {
    wallSide=intent.wall||getWallContact(player)||verbs.wallSide||player.facing||1;
    verbs.wallJumpDir=-wallSide;
    verbs.wallJumpCommitMs=WALLJUMP_HORIZONTAL_COMMIT_MS;// player cannot reverse into wall for 100 ms post-launch.
    verbs.airJumpsLeft=1;
    player.jumpsUsed=Math.max(player.jumpsUsed,1);
    player.wallSliding=false;
    setVelX(player,verbs.wallJumpDir*WALLJUMP_AWAY_VEL);
    setVelY(player,WALLJUMP_VERTICAL_RATIO*jumpVelocity);// 92% of full jump per WALLJUMP_VERTICAL_RATIO.
    markJumpTakeoff(player);
    latchState(player,'wallJump',WALLJUMP_LATCH_FRAMES);
    enterState(player,'wallJump','input');
    emitPlayerEvent('movement:wallJump',player);
 } else if (intent.doubleJump) {
    verbs.airJumpsLeft=0;
    player.jumpsUsed=2;
    setVelX(player,DOUBLEJUMP_X_KEEP*intent.preVx);// 90% horizontal momentum preserved per DOUBLEJUMP_X_KEEP.
    setVelY(player,DOUBLE_JUMP_IMPULSE_RATIO*jumpVelocity);// 82% of primary jump per DOUBLE_JUMP_IMPULSE_RATIO (Kevin Gate 2 approved 2026-04-23).
    markJumpTakeoff(player);
    latchState(player,'doubleJump',DOUBLE_JUMP_LATCH_FRAMES);
    enterState(player,'doubleJump','input');
    emitPlayerEvent('movement:doubleJump',player);
 } else if (intent.tripleJump) {
    player.jumpsUsed=3;
    setVelY(player,ns.TUNING.TRIPLE_JUMP);
    markJumpTakeoff(player);
    emitPlayerEvent('movement:tripleJump',player);
	 }

  tickDash(player,verbs,dtMs);
  tickSlide(player,verbs,dtMs);
  resolveWallClimbAndSlide(player,input,verbs,intent);

  if (verbs.wallJumpCommitMs>0) {
    setVelX(player,verbs.wallJumpDir*WALLJUMP_AWAY_VEL);
    verbs.wallJumpCommitMs=Math.max(0,verbs.wallJumpCommitMs-dtMs);
 }
}

function chooseState(player,input,sample){
  var latched=ensureState(player).latchedState;
  var grounded=isGrounded(player);
  var vx=getVelX(player);
  var vy=getVelY(player);
  var inputAxis=input&&input.axisX?input.axisX():0;

  if (player&&player.scene&&player.scene.pendingDeath) return 'death';
  if (latched.name==='hitStop'&&latched.framesLeft>0) return 'hitStop';
  if (player&&player.invulnMs>0) return 'iFrameHurt';
  if (latched.name==='dash'&&latched.framesLeft>0) return 'dash';
  if (latched.name==='slide'&&latched.framesLeft>0) return 'slide';
  if ((latched.name==='melee'&&latched.framesLeft>0)||(player&&player.attackMs>0)) return 'melee';
  if (latched.name==='ranged'&&latched.framesLeft>0) return 'ranged';
  if (latched.name==='wallJump'&&latched.framesLeft>0) return 'wallJump';
  if (player&&player._cehpWallClimbing) return 'wallClimb';
  if (player&&player.wallSliding) return 'wallSlide';
  if (latched.name==='doubleJump'&&latched.framesLeft>0) return 'doubleJump';
  if (vy<-20) return 'jumpRise';
  if (!grounded&&Math.abs(vy)<=20) return 'jumpApex';
  if (!grounded&&vy>20) return 'jumpFall';
  if (latched.name==='landed'&&latched.framesLeft>0) return 'landed';
  if (input&&input.down&&input.down('down')) return 'crouch';
  if (sample&&sample.grounded&&inputAxis!==0&&sample.vx*inputAxis<-8&&Math.abs(sample.vx)>40) return 'skid';
  if (Math.abs(vx)>4) return 'run';
  return 'idle';
}

function advanceSemanticFrame(state){
  state.fixed.semanticFrame=(state.fixed.semanticFrame||0)+1;
  return state.fixed.semanticFrame;
}

function tickLatchedState(state){
  var latched=state.latchedState;
  if (!latched||!latched.framesLeft) return;
  latched.framesLeft=Math.max(0,latched.framesLeft-1);
  if (!latched.framesLeft) latched.name='';
}

function collectInputEdges(player,input){
  var state=ensureState(player);
  if (!input||!input.justPressed) return;
  if (input.justPressed('jump')) {
    queueInput(state,'jump','jump');
    queueInput(state,'jumpQueue','jump');
 }
  if (input.justPressed('spinDash')) queueInput(state,'dash','spinDash');
  if (input.justPressed('punch')) queueInput(state,'melee','punch');
  if (input.justPressed('kick')) queueInput(state,'melee','kick');
}

function consumeFirstTransition(player){
  var transition;
  var i;

  for (i=0;i<INPUT_ACTIONS.length;i++) {
    transition=canTransition(player,INPUT_ACTIONS[i]);
    if (transition) return consumeTransition(player,transition);
 }

  return null;
}

function tickState(player,input,dtMs){
  var fixedResult;
  var consumedTransition;
  var nextState;
  var state=ensureState(player);

  dtMs=dtMs||16;

  if (ns.FixedStep&&ns.FixedStep.advance) {
    fixedResult=ns.FixedStep.advance(state.fixed,dtMs);
 } else {
    state.fixed.frame=(state.fixed.frame||0)+1;
    fixedResult={
      steps: 1,
      frame: state.fixed.frame,
      alpha: 0,
      droppedMs: 0
   };
 }

  advanceSemanticFrame(state);
  tickLatchedState(state);
  if (ns.InputBuffer&&ns.InputBuffer.prune) ns.InputBuffer.prune(state.buffer,getFrame(state),BUFFER_PRUNE_FRAMES);
  collectInputEdges(player,input);

  consumedTransition=consumeFirstTransition(player);
  nextState=chooseState(player,input,{
    vx: getVelX(player),
    vy: getVelY(player),
    grounded: isGrounded(player)
 });

  if (!consumedTransition||priorityIndex(nextState)<priorityIndex(state.current)) {
    enterState(player,nextState,'physics');
 }

  state.stateFrame=getFrame(state)-state.enteredFrame;
  if (state.stateFrame<0) state.stateFrame=0;

  return fixedResult;
}

function makeFilteredInput(player,input,intent){
  var phase4=phase4Of(player);
  return {
    axisX: function(){
      if (controlsLocked(player,phase4)) return 0;
      return intent.suppressWallAxis?0:axisX(input);
   },
    axisY: function(){
      return input&&input.axisY?input.axisY():0;
   },
    down: function(action){
      if (phase4.controlLockMs>0&&action!=='left'&&action!=='right') return false;
      if (controlsLocked(player,phase4)&&(action==='left'||action==='right')) return false;
      return action!=='spinDash'&&action!=='jump'&&(!intent.suppressWallAxis||(action!=='left'&&action!=='right'))&&pressed(input,action);
   },
    justPressed: function(action){
      if (phase4.controlLockMs>0) return false;
      return action!=='spinDash'&&action!=='jump'&&justPressed(input,action);
   },
    justReleased: function(action){
      if (phase4.controlLockMs>0) return false;
      return action!=='spinDash'&&action!=='jump'&&justReleased(input,action);
   }
 };
}

function settlePostMovementState(player,input,sample){
  var nextState;
  var state=ensureState(player);
  var grounded=isGrounded(player);

  if (!state.lastGrounded&&grounded) latchState(player,'landed',LANDED_LATCH_FRAMES);

  nextState=chooseState(player,input,sample);
  enterState(player,nextState,'physics');

  state.stateFrame=getFrame(state)-state.enteredFrame;
  if (state.stateFrame<0) state.stateFrame=0;
  state.lastGrounded=grounded;
  lastEventPlayer=player;
}

function wrapMovementApply(originalApply){
  function wrappedApply(player,input,dtMs){
    var intent;
    var filteredInput;
    var state;
    var preMovementSample={
      vx: getVelX(player),
      vy: getVelY(player),
      grounded: isGrounded(player)
   };

    dtMs=dtMs||16;
    state=ensureState(player);
    tickForgiveness(player,input,dtMs);
    resolvePostDamageLockout(player,dtMs);

    if (tickHitStop(player,dtMs)) {
      tickIFrames(player,dtMs);
      applyGravityDeltas(player);
      return state.current;
   }

    intent=readVerbIntent(player,input,dtMs||16);
    filteredInput=makeFilteredInput(player,input,intent);

    state.suppressRuntimeTrace=true;
    tickState(player,input,dtMs);

    activeEventPlayer=player;
    lastEventPlayer=player;
    originalApply.call(this,player,filteredInput,dtMs);
    resolvePhase3Verbs(player,input,dtMs||16,intent);
    if (!intent.suppressJump) applyPrimaryJump(player);
    applyJumpCut(player,input);
    resolveSpatialForgiveness(player,input);
    applyGravityDeltas(player);
    tickIFrames(player,dtMs);
    activeEventPlayer=null;

    settlePostMovementState(player,input,preMovementSample);
    state.suppressRuntimeTrace=false;

    return player._cehpState.current;
 }

  wrappedApply._cehpEdStateWrappedApply=true;
  return wrappedApply;
}

function install(){
  if (!eventsBound&&ns.Events&&ns.Events.on) {
    eventsBound=true;
    ns.Events.on('movement:doubleJump',function(){
      if (activeEventPlayer||lastEventPlayer) latchState(activeEventPlayer||lastEventPlayer,'doubleJump',DOUBLE_JUMP_LATCH_FRAMES);
   });
    ns.Events.on('movement:wallJump',function(){
      if (activeEventPlayer||lastEventPlayer) latchState(activeEventPlayer||lastEventPlayer,'wallJump',DOUBLE_JUMP_LATCH_FRAMES);
   });
    ns.Events.on('movement:punch',function(){
      if (activeEventPlayer||lastEventPlayer) latchState(activeEventPlayer||lastEventPlayer,'melee',MELEE_LATCH_FRAMES);
   });
    ns.Events.on('movement:kick',function(){
      if (activeEventPlayer||lastEventPlayer) latchState(activeEventPlayer||lastEventPlayer,'melee',MELEE_LATCH_FRAMES);
   });
    ns.Events.on('movement:spinDash',function(){
      if (activeEventPlayer||lastEventPlayer) latchState(activeEventPlayer||lastEventPlayer,'dash',DASH_EVENT_LATCH_FRAMES);
   });
    ns.Events.on('combat:damageTaken',function(payload){
      if (activeEventPlayer||lastEventPlayer) {
        acceptDamage(activeEventPlayer||lastEventPlayer,payload&&payload.kind?payload.kind:'damage',{
          actor: payload&&payload.actor,
          hitStopClass: 'damage'
       });
     }
   });
    ns.Events.on('combat:damageDealt',function(payload){
      if (activeEventPlayer||lastEventPlayer) {
        startHitStop(activeEventPlayer||lastEventPlayer,payload&&payload.kind==='projectile'?'projectile':'melee',payload&&(payload.actor||payload.target));
     }
   });
    ns.Events.on('player:death',function(){
      if (activeEventPlayer||lastEventPlayer) enterState(activeEventPlayer||lastEventPlayer,'death','event');
   });
    ns.Events.on('player:respawn',function(){
      if (activeEventPlayer||lastEventPlayer) resetState(activeEventPlayer||lastEventPlayer);
   });
 }

  if (!ns.Movement) return;

  if (ns.Movement.createEd&&!ns.Movement.createEd._cehpEdStateWrappedCreate) {
    ns.Movement.createEd=(function(originalCreate){
      function wrappedCreateEd(){
        var player=originalCreate.apply(this,arguments);
        ensureState(player);
        return player;
     }

      wrappedCreateEd._cehpEdStateWrappedCreate=true;
      return wrappedCreateEd;
   }(ns.Movement.createEd));
 }

  if (ns.Movement.respawn&&!ns.Movement.respawn._cehpEdStateWrappedRespawn) {
    ns.Movement.respawn=(function(originalRespawn){
      function wrappedRespawn(player){
        var result=originalRespawn.apply(this,arguments);
        if (player) resetState(player);
        return result;
     }

      wrappedRespawn._cehpEdStateWrappedRespawn=true;
      return wrappedRespawn;
   }(ns.Movement.respawn));
 }

  if (ns.Movement.apply&&!ns.Movement.apply._cehpEdStateWrappedApply) {
    ns.Movement.apply=wrapMovementApply(ns.Movement.apply);
 }
}

if (!registerWrapped&&ns._register) {
  originalRegister=ns._register;
  ns._register=function(moduleName){
    originalRegister(moduleName);
    install();
 };
  registerWrapped=true;
}

install();

ns.EdState={
  STATES: PUBLIC_STATES.slice(),
  PRIORITY: STATE_PRIORITY.slice(),
  create: createState,
  ensure: ensureState,
  enter: enterState,
  exit: exitState,
  tick: tickState,
  canTransition: canTransition,
  damage: acceptDamage,
  hitStop: startHitStop,
  snapshot: function(player){
    var state=ensureState(player);
    return clonePlain({
      current: state.current,
      previous: state.previous,
      stateFrame: state.stateFrame,
      enteredFrame: state.enteredFrame,
      fixed: {
        frame: state.fixed.frame||0,
        semanticFrame: state.fixed.semanticFrame||0,
        alpha: state.fixed.alpha||0,
        lastStepCount: state.fixed.lastStepCount||0
     },
      buffer: state.buffer&&state.buffer.entries?state.buffer.entries:[],
      latchedState: state.latchedState,
      cooldowns: state.cooldowns,
      verbs: state.verbs,
      phase4: state.phase4
   });
 }
};
}(CEHP));
CEHP._register('07_ed_state');
