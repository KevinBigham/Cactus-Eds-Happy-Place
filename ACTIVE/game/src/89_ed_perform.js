(function(ns){
'use strict';

var BODY_A_KEY='cehp:ed:body-a';
var BODY_B_KEY='cehp:ed:body-b';
var EYE_KEY='cehp:ed:eye-dot';
var FALLBACK_SEED='CASE-UNKNOWN';
var SHEET_KEY='ed_sheet_60px';
var SHEET_FRAME_PREFIX='f';
var ED_W=(ns.TUNING&&ns.TUNING.ED_FRAME_W)||48;
var ED_H=(ns.TUNING&&ns.TUNING.ED_FRAME_H)||64;
var FALLBACK_W=24;
var FALLBACK_H=32;
var BODY_Y=-2;
var ACTOR_DEPTH=7;
var EYE_X=2;
var EYE_Y_A=-10;
var EYE_Y_B=-9;
var BREATHE_MS=820;
var BLINK_MS=80;
var AIM_RAD=Math.PI/180;
var SCALE_EPSILON=0.0001;
var FALL_SOFT_MAX_PX=80;
var FALL_MEDIUM_MAX_PX=200;
var RUN_START_VEL_EPSILON=24;
var SKID_VEL_EPSILON=40;
/* x-scale,y-scale,duration-ms triplets from W10 Phase 5. */
var SQUASH_SPECS={
  runStart: [1.05,0.95,60],
  skid: [0.90,1.10,80],
  jumpSquat: [1.10,0.90,40],
  jumpLaunch: [0.85,1.20,60],
  doubleJump: [0.75,1.30,70],
  landMedium: [1.15,0.85,90],
  landHard: [1.20,0.80,110],
  wallJump: [1.20,0.90,70]
};
var TRANSFER_FIELDS=[
  'facing',
  'spawnX',
  'spawnY',
  'health',
  'coyoteWindowMs',
  'coyoteMs',
  'jumpBufferMs',
  'jumpsUsed',
  'wallSliding',
  'spinChargeMs',
  'spinCooldownMs',
  'attackMs',
  'invulnMs',
  'glideTickMs',
  'copterTickMs',
  'wasGrounded',
  'lastVelocityY',
  'gravityMultiplier',
  'respawnAtMs',
  '_cehpAimY',
  '_cehpAimDeg'
];

function isGrounded(actor){
  var body=actor&&actor.body;
  return !!(body&&((body.blocked&&body.blocked.down)||(body.touching&&body.touching.down)));
}

function getVelX(actor){
  return actor&&actor.body&&actor.body.velocity?actor.body.velocity.x:0;
}

function currentStateName(actor){
  return actor&&actor._cehpState&&actor._cehpState.current?actor._cehpState.current:'';
}

function tuning(name,fallback){
  return ns.TUNING&&ns.TUNING[name] != null?ns.TUNING[name]:fallback;
}

function bodyShapeKey(stateName){
  if (stateName==='slide') return 'slide';
  if (stateName==='crouch') return 'crouch';
  return 'stand';
}

function bodyDimsForState(stateName){
  if (stateName==='slide') return {w: tuning('ED_SLIDE_W',24),h: tuning('ED_SLIDE_H',24)};
  if (stateName==='crouch') return {w: tuning('ED_BODY_W',22),h: tuning('ED_CROUCH_H',30)};
  return {w: tuning('ED_BODY_W',22),h: tuning('ED_BODY_H',46)};
}

function applyBodyShape(actor,stateName){
  var body=actor&&actor.body;
  var key=bodyShapeKey(stateName||currentStateName(actor));
  var dims=bodyDimsForState(key);
  var bottom;
  if (!body) return false;
  if (actor._cehpLastShapeState== null) actor._cehpLastShapeState=null;
  if (actor._cehpLastShapeState===key) return false;
  bottom=body.y != null&&body.height != null?body.y+body.height:null;
  if (body.setSize) body.setSize(dims.w,dims.h,true);
  else {
    body.width=dims.w;
    body.height=dims.h;
 }
  if (bottom != null&&body.y != null) body.y=bottom-dims.h;
  actor._cehpBodyShape=key;
  actor._cehpLastShapeState=key;
  return true;
}

function stopTween(tween){
  if (!tween) return;
  if (tween.stop) tween.stop();
  if (tween.remove) tween.remove();
}

function stopLegacySquash(actor){
  var feel=actor&&actor.scene&&actor.scene._cehpFeel?actor.scene._cehpFeel:null;
  if (!feel||!feel.squashTween) return;
  stopTween(feel.squashTween);
  feel.squashTween=null;
  if (actor.setScale) actor.setScale(1,1);
}

function configureRim(node,color){
  if (!node) return node;
  if (node.setTint) node.setTint(color);
  if (node.setAlpha) node.setAlpha(0);
  else node.alpha=0;
  return node;
}

function setActorScale(actor,x,y){
  var p5;
  if (!actor) return;
  if (actor._cehpBodyImage) {
    p5=ensurePhase5(actor);
    p5.visualX=x;
    p5.visualY=y;
    syncVisualState(actor);
    return;
 }
  if (actor.setScale) actor.setScale(x,y);
  else {
    actor.scaleX=x;
    actor.scaleY=y;
 }
}

function fallClassForDistance(fallPx){
  if (fallPx<FALL_SOFT_MAX_PX) return 'soft';
  if (fallPx<FALL_MEDIUM_MAX_PX) return 'medium';
  return 'hard';
}

function makePhase5State(actor){
  return {
    wasGrounded: isGrounded(actor),
    wasMoving: false,
    lastVx: getVelX(actor),
    lastState: currentStateName(actor),
    airborne: false,
    peakY: actor&&actor.y != null?actor.y:0,
    naturalFall: true,
    squashMs: 0,
    squashDurationMs: 0,
    squashX: 1,
    squashY: 1,
    visualX: 1,
    visualY: 1
 };
}

function ensurePhase5(actor){
  if (!actor._cehpPhase5) actor._cehpPhase5=makePhase5State(actor);
  return actor._cehpPhase5;
}

function scaleSpec(kind,fallClass){
  if (kind==='landing') return fallClass==='medium'?SQUASH_SPECS.landMedium:(fallClass==='hard'?SQUASH_SPECS.landHard:null);
  return SQUASH_SPECS[kind]||(kind==='jump'?SQUASH_SPECS.jumpLaunch:null);
}

function applySquash(actor,kind,fallClass){
  var p5;
  var spec;
  if (!actor) return false;
  spec=scaleSpec(kind,fallClass);
  if (!spec) return false;
  if (kind==='landing') stopLegacySquash(actor);
  p5=ensurePhase5(actor);
  p5.squashX=spec[0];
  p5.squashY=spec[1];
  p5.squashMs=spec[2];
  p5.squashDurationMs=spec[2];
  setActorScale(actor,spec[0],spec[1]);
  return true;
}

function updateSquash(actor,dtMs){
  var p5;
  var t;
  var sx;
  var sy;
  if (!actor||!actor._cehpPhase5||actor._cehpPhase5.squashMs<=0) return false;
  p5=actor._cehpPhase5;
  p5.squashMs=Math.max(0,p5.squashMs-(dtMs||16));
  t=p5.squashDurationMs>0?1-(p5.squashMs/p5.squashDurationMs):1;
  if (p5.squashMs<=0) {
    setActorScale(actor,1,1);
    p5.squashX=1;
    p5.squashY=1;
    return false;
 }
  sx=p5.squashX+((1-p5.squashX)*t);
  sy=p5.squashY+((1-p5.squashY)*t);
  setActorScale(actor,sx,sy);
  return true;
}

function actorForEvent(layer,payload){
  if (payload&&payload.actor) return payload.actor;
  if (!layer||!layer.actors||!layer.actors.length) return null;
  return layer.actors[0];
}

function bindSquash(layer,topic,kind){
  layer.offFns.push(ns.Events.on(topic,function(payload){
    applySquash(actorForEvent(layer,payload),kind);
 }));
}

function bindPhase5Events(layer){
  if (!layer||layer.phase5EventsBound||!ns.Events||!ns.Events.on) return;
  layer.phase5EventsBound=true;
  layer.offFns=layer.offFns||[];
  bindSquash(layer,'movement:jump','jumpLaunch');
  bindSquash(layer,'movement:doubleJump','doubleJump');
  layer.offFns.push(ns.Events.on('movement:wallJump',function(payload){
    var actor=actorForEvent(layer,payload);
    var p5=actor?ensurePhase5(actor):null;
    if (p5) p5.naturalFall=false;
    applySquash(actor,'wallJump');
 }));
  bindSquash(layer,'movement:runStart','runStart');
  bindSquash(layer,'movement:skidStart','skid');
  bindSquash(layer,'movement:jumpSquat','jumpSquat');
}

function emitLanding(actor,p5){
  var fallPx=Math.max(0,(actor&&actor.y != null?actor.y:0)-p5.peakY);
  var fallClass=fallClassForDistance(fallPx);
  if (!p5.naturalFall) return;
  if (ns.Events&&ns.Events.emit) {
    ns.Events.emit('movement:landed',{
      scene: actor.scene,
      actor: actor,
      x: actor.x,
      y: actor.y,
      fallPx: fallPx,
      fallClass: fallClass,
      natural: true
   });
 }
  applySquash(actor,'landing',fallClass);
}

function updatePhase5Motion(actor){
  var p5=ensurePhase5(actor);
  var grounded=isGrounded(actor);
  var vx=getVelX(actor);
  var moving=grounded&&Math.abs(vx)>RUN_START_VEL_EPSILON;
  var stateName=currentStateName(actor);

  if (moving&&!p5.wasMoving) applySquash(actor,'runStart');
  if (grounded&&p5.lastVx*vx<0&&Math.abs(p5.lastVx)>SKID_VEL_EPSILON&&Math.abs(vx)>SKID_VEL_EPSILON) {
    applySquash(actor,'skid');
 } else if (stateName==='skid'&&p5.lastState!=='skid') {
    applySquash(actor,'skid');
 }

  if (!grounded) {
    if (!p5.airborne) {
      p5.airborne=true;
      p5.peakY=actor.y;
      p5.naturalFall=true;
   } else if (actor.y<p5.peakY) {
      p5.peakY=actor.y;
   }
    if (stateName==='wallJump'||stateName==='dash'||stateName==='slide') p5.naturalFall=false;
 } else if (p5.airborne&&!p5.wasGrounded) {
    emitLanding(actor,p5);
    p5.airborne=false;
    p5.naturalFall=true;
    p5.peakY=actor.y;
 }

  p5.wasGrounded=grounded;
  p5.wasMoving=moving;
  p5.lastVx=vx;
  p5.lastState=stateName;
}

function makeSeededRng(seed,suffix){
  if (!ns.makeRNG) return 0;
  return ns.makeRNG(String(seed||FALLBACK_SEED)+suffix);
}

function idleStartPhase(seed){
  var rng=makeSeededRng(seed,'|ed|idle');
  return rng&&rng.float?rng.float():0;
}

function makeBlinkSchedule(seed){
  var rng=makeSeededRng(seed,'|ed|blink');

  return {
    drawInterval: function(){
      return rng&&rng.int?rng.int(5000,9001):5000;
   }
 };
}

function generateTexture(scene,key,width,height,drawFn){
  var graphics=scene.add.graphics();

  if (scene.textures.exists(key)) scene.textures.remove(key);

  drawFn(graphics);
  graphics.generateTexture(key,width,height);
  graphics.destroy();
}

function sheetFrameName(index){
  return SHEET_FRAME_PREFIX+index;
}

function sceneHasSheet(scene){
  return !!(scene&&scene.textures&&scene.textures.exists&&scene.textures.exists(SHEET_KEY));
}

function heroArtKeyForName(name){
  return ns.Art&&ns.Art.getKey?ns.Art.getKey('characters',name):'';
}

function heroArtNameForState(actor){
  var stateName=currentStateName(actor);
  if (stateName==='run'||stateName==='skid') return 'cactus_ed.walk_keypose';
  if (stateName==='jumpRise'||stateName==='jumpApex'||stateName==='jumpFall'||stateName==='doubleJump'||stateName==='wallJump'||stateName==='wallSlide'||stateName==='wallClimb'||stateName==='landed') return 'cactus_ed.jump_apex';
  if (stateName==='ranged'||stateName==='melee'||stateName==='dash'||stateName==='slide') return 'cactus_ed.kick';
  if (stateName==='iFrameHurt'||stateName==='hitStop'||stateName==='death') return 'cactus_ed.hit';
  return 'cactus_ed.idle';
}

function heroArtKeyForState(actor){
  return heroArtKeyForName(heroArtNameForState(actor));
}

function heroArtHeight(name,fallback){
  var asset=ns.Art&&ns.Art.getAsset?ns.Art.getAsset('characters',name):null;
  return asset&&asset.resolution&&asset.resolution[1]?asset.resolution[1]:fallback;
}

function sceneHasHeroArt(scene){
  var key=heroArtKeyForName('cactus_ed.idle');
  return !!(key&&scene&&scene.textures&&scene.textures.exists&&scene.textures.exists(key));
}

function ensureSheetFrames(scene){
  var tex=scene&&scene.textures&&scene.textures.get?scene.textures.get(SHEET_KEY):null;
  var i;
  if (!tex||!tex.add) return sceneHasSheet(scene);
  if (tex.has&&tex.has(sheetFrameName(0))) return true;
  for (i=0;i<30;i++) tex.add(sheetFrameName(i),0,i*ED_W,0,ED_W,ED_H);
  return true;
}

function sheetFrameForState(actor){
  var stateName=currentStateName(actor);
  var v=actor&&actor._cehpBreatheState?actor._cehpBreatheState.v:0;
  var step=Math.max(0,Math.min(5,Math.floor(v*6)));
  if (stateName==='idle') return actor&&actor._cehpBlinkMs>0?1:step%3;
  if (stateName==='run') return 3+step;
  if (stateName==='skid') return 9+(step%2);
  if (stateName==='jumpRise'||stateName==='doubleJump') return 11;
  if (stateName==='jumpApex') return 12;
  if (stateName==='jumpFall') return 13+(step%2);
  if (stateName==='dash') return 15+(step%2);
  if (stateName==='wallSlide') return 17+(step%3);
  if (stateName==='wallJump') return 20;
  if (stateName==='wallClimb') return 21+(step%2);
  if (stateName==='crouch') return 23+(step%2);
  if (stateName==='slide') return 25;
  if (stateName==='ranged'||stateName==='melee') return 26;
  if (stateName==='iFrameHurt'||stateName==='hitStop') return 27;
  if (stateName==='death') return 28;
  if (stateName==='landed') return 29;
  return step%3;
}

function drawBodyFrame(graphics,useLowerPose){
  var headY=useLowerPose?4:3;
  var shoulderY=useLowerPose?10:9;
  var torsoY=useLowerPose?13:12;
  var legHeight=useLowerPose?5:6;

  graphics.fillStyle(ns.PALETTE.INK_BLACK,1);
  graphics.fillRect(10,headY,8,5);
  graphics.fillRect(9,headY+5,8,3);
  graphics.fillRect(8,shoulderY,10,3);
  graphics.fillRect(9,torsoY,8,8);
  graphics.fillRect(9,20,8,legHeight);
  graphics.fillRect(9,26,3,6);
  graphics.fillRect(14,26,3,6);
  graphics.fillRect(8,torsoY+1,1,10);
  graphics.fillRect(17,torsoY+1,1,9);

  graphics.fillStyle(ns.PALETTE.SPINE_HIGHLIGHT,1);
  graphics.fillRect(12,shoulderY+1,2,12);
  graphics.fillRect(12,20,2,legHeight>2?legHeight-1:2);
  graphics.fillRect(13,headY+2,1,2);

  graphics.fillStyle(ns.PALETTE.WARM_RIM,0.4);
  graphics.fillRect(9,headY,7,1);
  graphics.fillRect(9,headY+1,1,4);
  graphics.fillRect(8,shoulderY,1,9);
  graphics.fillRect(9,shoulderY,2,1);
}

function ensureTextures(scene){
  if (sceneHasHeroArt(scene)) return;

  if (sceneHasSheet(scene)) {
    ensureSheetFrames(scene);
    return;
 }

  generateTexture(scene,BODY_A_KEY,FALLBACK_W,FALLBACK_H,function(graphics){
    drawBodyFrame(graphics,false);
 });

  generateTexture(scene,BODY_B_KEY,FALLBACK_W,FALLBACK_H,function(graphics){
    drawBodyFrame(graphics,true);
 });

  generateTexture(scene,EYE_KEY,1,1,function(graphics){
    graphics.fillStyle(ns.PALETTE.WARM_RIM,1);
    graphics.fillRect(0,0,1,1);
 });
}

function syncVisualState(actor){
  var nextBodyKey=actor._cehpBreatheState.v>=0.5?BODY_B_KEY:BODY_A_KEY;
  var nextHeroKey;
  var facingScale=actor.facing<0?-1:1;
  var p5=actor._cehpPhase5;
  var visualX=p5&&p5.visualX?p5.visualX:1;
  var visualY=p5&&p5.visualY?p5.visualY:1;
  var baseScale=actor._cehpBaseVisualScale||1;
  var aimX=actor._cehpSheetImage?9:EYE_X;
  var aimUpY=actor._cehpSheetImage?-18:-10;
  var aimDownY=actor._cehpSheetImage?-10:-5;

  if (actor._cehpHeroArt) {
    nextHeroKey=heroArtKeyForState(actor);
    if (nextHeroKey&&actor._cehpBodyKey!==nextHeroKey) {
      actor._cehpBodyImage.setTexture(nextHeroKey);
      if (actor._cehpRimCyan&&actor._cehpRimCyan.setTexture) actor._cehpRimCyan.setTexture(nextHeroKey);
      if (actor._cehpRimMagenta&&actor._cehpRimMagenta.setTexture) actor._cehpRimMagenta.setTexture(nextHeroKey);
      actor._cehpBodyKey=nextHeroKey;
   }
    actor._cehpBodyImage.scaleX=facingScale*visualX*baseScale;
    actor._cehpBodyImage.scaleY=visualY*baseScale;
    if (actor._cehpRimCyan) {
      actor._cehpRimCyan.scaleX=facingScale*visualX*baseScale;
      actor._cehpRimCyan.scaleY=visualY*baseScale;
   }
    if (actor._cehpRimMagenta) {
      actor._cehpRimMagenta.scaleX=facingScale*visualX*baseScale;
      actor._cehpRimMagenta.scaleY=visualY*baseScale;
   }
    if (actor._cehpAimImage) {
      actor._cehpAimImage.visible=!!actor._cehpAimY;
      actor._cehpAimImage.x=aimX*facingScale*visualX*baseScale;
      actor._cehpAimImage.y=(actor._cehpAimY<0?aimUpY:aimDownY)*visualY*baseScale;
      actor._cehpAimImage.scaleX=facingScale*visualX*baseScale;
      actor._cehpAimImage.scaleY=visualY*baseScale;
      actor._cehpAimImage.rotation=(actor._cehpAimDeg||0)*AIM_RAD*facingScale;
   }
    return;
 }

  if (actor._cehpSheetImage) {
    if (actor._cehpSheetImage.setFrame) actor._cehpSheetImage.setFrame(sheetFrameName(sheetFrameForState(actor)));
    actor._cehpSheetImage.scaleX=facingScale*visualX*baseScale;
    actor._cehpSheetImage.scaleY=visualY*baseScale;
    if (actor._cehpRimCyan&&actor._cehpRimCyan.setFrame) actor._cehpRimCyan.setFrame(sheetFrameName(sheetFrameForState(actor)));
    if (actor._cehpRimMagenta&&actor._cehpRimMagenta.setFrame) actor._cehpRimMagenta.setFrame(sheetFrameName(sheetFrameForState(actor)));
    if (actor._cehpRimCyan) {
      actor._cehpRimCyan.scaleX=facingScale*visualX*baseScale;
      actor._cehpRimCyan.scaleY=visualY*baseScale;
   }
    if (actor._cehpRimMagenta) {
      actor._cehpRimMagenta.scaleX=facingScale*visualX*baseScale;
      actor._cehpRimMagenta.scaleY=visualY*baseScale;
   }
    if (actor._cehpAimImage) {
      actor._cehpAimImage.visible=!!actor._cehpAimY;
      actor._cehpAimImage.x=aimX*facingScale*visualX*baseScale;
      actor._cehpAimImage.y=(actor._cehpAimY<0?aimUpY:aimDownY)*visualY*baseScale;
      actor._cehpAimImage.scaleX=facingScale*visualX*baseScale;
      actor._cehpAimImage.scaleY=visualY*baseScale;
      actor._cehpAimImage.rotation=(actor._cehpAimDeg||0)*AIM_RAD*facingScale;
   }
    return;
 }

  if (actor._cehpBodyKey!==nextBodyKey) {
    actor._cehpBodyImage.setTexture(nextBodyKey);
    if (actor._cehpRimCyan&&actor._cehpRimCyan.setTexture) actor._cehpRimCyan.setTexture(nextBodyKey);
    if (actor._cehpRimMagenta&&actor._cehpRimMagenta.setTexture) actor._cehpRimMagenta.setTexture(nextBodyKey);
    actor._cehpBodyKey=nextBodyKey;
 }

  actor._cehpBodyImage.scaleX=facingScale*visualX*baseScale;
  actor._cehpBodyImage.scaleY=visualY*baseScale;
  if (actor._cehpRimCyan) {
    actor._cehpRimCyan.scaleX=facingScale*visualX*baseScale;
    actor._cehpRimCyan.scaleY=visualY*baseScale;
 }
  if (actor._cehpRimMagenta) {
    actor._cehpRimMagenta.scaleX=facingScale*visualX*baseScale;
    actor._cehpRimMagenta.scaleY=visualY*baseScale;
 }
  actor._cehpEyeImage.scaleX=visualX*baseScale;
  actor._cehpEyeImage.scaleY=visualY*baseScale;
  actor._cehpEyeImage.x=EYE_X*facingScale*visualX*baseScale;
  actor._cehpEyeImage.y=(nextBodyKey===BODY_B_KEY?EYE_Y_B:EYE_Y_A)*visualY*baseScale;
  actor._cehpEyeImage.visible=actor._cehpBlinkMs<=0;

  if (actor._cehpAimImage) {
    actor._cehpAimImage.visible=!!actor._cehpAimY;
    actor._cehpAimImage.x=aimX*facingScale*visualX*baseScale;
    actor._cehpAimImage.y=(actor._cehpAimY<0?aimUpY:aimDownY)*visualY*baseScale;
    actor._cehpAimImage.scaleX=facingScale*visualX*baseScale;
    actor._cehpAimImage.scaleY=visualY*baseScale;
    actor._cehpAimImage.rotation=(actor._cehpAimDeg||0)*AIM_RAD*facingScale;
 }
}

function startLoopTween(scene,actor){
  actor._cehpEdBreatheTween=scene.tweens.add({
    targets: actor._cehpBreatheState,
    v: 0,
    duration: BREATHE_MS,
    ease: 'Linear',
    yoyo: true,
    repeat: -1,
    onUpdate: function(){
      syncVisualState(actor);
   }
 });

  if (actor._cehpTweenPaused) actor._cehpEdBreatheTween.pause();
}

function seedBreatheTween(scene,actor,startPhase){
  actor._cehpBreatheState={v: startPhase};
  syncVisualState(actor);

  actor._cehpEdBreatheTween=scene.tweens.add({
    targets: actor._cehpBreatheState,
    v: 1,
    duration: Math.max(1,Math.round((1-startPhase)*BREATHE_MS)),
    ease: 'Linear',
    onUpdate: function(){
      syncVisualState(actor);
   },
    onComplete: function(){
      startLoopTween(scene,actor);
   }
 });

  if (actor._cehpTweenPaused) actor._cehpEdBreatheTween.pause();
}

function killBreatheTween(scene,actor){
  if (actor._cehpBreatheState) {
    scene.tweens.killTweensOf(actor._cehpBreatheState);
 }

  if (!actor._cehpEdBreatheTween) return;

  actor._cehpEdBreatheTween.stop();
  if (actor._cehpEdBreatheTween.remove) actor._cehpEdBreatheTween.remove();
  actor._cehpEdBreatheTween=0;
}

function migrateActor(scene,layer,originalActor){
  var i;
  var useHeroArt=sceneHasHeroArt(scene);
  var useSheet=!useHeroArt&&sceneHasSheet(scene);
  var bodyKey=useHeroArt?heroArtKeyForName('cactus_ed.idle'):(useSheet?SHEET_KEY:BODY_A_KEY);
  var bodyFrame=useSheet?sheetFrameName(0):null;
  var bodyImage=useSheet?scene.add.image(0,BODY_Y,bodyKey,bodyFrame).setOrigin(0.5):scene.add.image(0,BODY_Y,bodyKey).setOrigin(0.5);
  var rimCyan=configureRim(useSheet?scene.add.image(0,BODY_Y,bodyKey,bodyFrame).setOrigin(0.5):scene.add.image(0,BODY_Y,bodyKey).setOrigin(0.5),0x5ab0b9);
  var rimMagenta=configureRim(useSheet?scene.add.image(0,BODY_Y,bodyKey,bodyFrame).setOrigin(0.5):scene.add.image(0,BODY_Y,bodyKey).setOrigin(0.5),0xb55284);
  var eyeImage=useSheet||useHeroArt?null:scene.add.image(EYE_X,EYE_Y_A,EYE_KEY).setOrigin(0.5);
  var aimImage=scene.add.rectangle(0,-8,9,2,ns.PALETTE.WARM_RIM,0.75).setOrigin(0,0.5);
  var children=useSheet||useHeroArt?[rimCyan,rimMagenta,bodyImage,aimImage]:[rimCyan,rimMagenta,bodyImage,eyeImage,aimImage];
  var actor=scene.add.container(originalActor.x,originalActor.y,children);

  actor.setDepth(originalActor.depth&&originalActor.depth>0?originalActor.depth:ACTOR_DEPTH);
  actor.setSize(ED_W,ED_H);
  scene.physics.add.existing(actor);
  actor.body.setCollideWorldBounds(true);
  actor.body.setDragX(originalActor.body.drag.x);
  actor.body.setMaxVelocity(originalActor.body.maxVelocity.x,originalActor.body.maxVelocity.y);
  actor.body.setVelocity(originalActor.body.velocity.x,originalActor.body.velocity.y);

  for (i=0;i<TRANSFER_FIELDS.length;i++) {
    if (originalActor[TRANSFER_FIELDS[i]] != null) {
      actor[TRANSFER_FIELDS[i]]=originalActor[TRANSFER_FIELDS[i]];
   }
 }

  actor.alpha=originalActor.alpha != null?originalActor.alpha:1;
  actor._cehpBodyImage=bodyImage;
  actor._cehpEyeImage=eyeImage;
  actor._cehpAimImage=aimImage;
  actor._cehpRimCyan=rimCyan;
  actor._cehpRimMagenta=rimMagenta;
  actor._cehpRimState=ns.Lens&&ns.Lens.makeRimLightState?ns.Lens.makeRimLightState(layer.seed):null;
  actor._cehpRimMs=0;
  actor._cehpSheetImage=useSheet?bodyImage:null;
  actor._cehpHeroArt=useHeroArt;
  actor._cehpBaseVisualScale=tuning('ED_RENDER_H',60)/(useHeroArt?heroArtHeight('cactus_ed.idle',1024):(useSheet?ED_H:FALLBACK_H));
  actor._cehpBodyKey=useHeroArt?bodyKey:'';
  actor._cehpBlinkSchedule=makeBlinkSchedule(layer.seed);
  actor._cehpBlinkMs=0;
  actor._cehpNextBlinkMs=actor._cehpBlinkSchedule.drawInterval();
  actor._cehpTweenPaused=0;
  applyBodyShape(actor,'idle');

  seedBreatheTween(scene,actor,idleStartPhase(layer.seed));
  layer.actors.push(actor);
  originalActor.destroy();
  return actor;
}

function prime(scene,opts){
  var layer=scene._cehpEd;

  if (!layer) {
    layer=scene._cehpEd={
      actors: [],
      seed: FALLBACK_SEED,
      offFns: [],
      phase5EventsBound: false
   };

    scene.events.once('shutdown',function(){
      cleanup(scene);
   });
 }

  if (opts&&opts.seed != null) {
    layer.seed=String(opts.seed||FALLBACK_SEED);
 }

  if (layer.originalCreateEd||!ns.Movement||!ns.Movement.createEd) return layer;

  ensureTextures(scene);
  bindPhase5Events(layer);

  layer.originalCreateEd=ns.Movement.createEd;
  layer.wrappedCreateEd=function(targetScene){
    var originalActor=layer.originalCreateEd.apply(this,arguments);
    return targetScene===scene?migrateActor(scene,layer,originalActor):originalActor;
 };

  ns.Movement.createEd=layer.wrappedCreateEd;
  return layer;
}

function update(scene,dtMs){
  var layer=scene&&scene._cehpEd;
  var actor;
  var scaled;
  var scaleX;
  var scaleY;
  var p5;
  var i;

  if (!layer) return;

  dtMs=dtMs||16;

  for (i=layer.actors.length-1;i>=0;i--) {
    actor=layer.actors[i];
    if (!actor||!actor.active||actor.scene!==scene) {
      layer.actors.splice(i,1);
      continue;
   }

    scaleX=actor.scaleX != null?actor.scaleX:1;
    scaleY=actor.scaleY != null?actor.scaleY:1;
    updatePhase5Motion(actor);
    applyBodyShape(actor);
    updateSquash(actor,dtMs);
    p5=ensurePhase5(actor);
    scaleX=actor._cehpBodyImage?p5.visualX:(actor.scaleX != null?actor.scaleX:1);
    scaleY=actor._cehpBodyImage?p5.visualY:(actor.scaleY != null?actor.scaleY:1);
    scaled=Math.abs(scaleX-1)>SCALE_EPSILON||Math.abs(scaleY-1)>SCALE_EPSILON;

    if (scaled&&!actor._cehpTweenPaused&&actor._cehpEdBreatheTween&&actor._cehpEdBreatheTween.pause) {
      actor._cehpEdBreatheTween.pause();
   }

    if (!scaled&&actor._cehpTweenPaused&&actor._cehpEdBreatheTween&&actor._cehpEdBreatheTween.resume) {
      actor._cehpEdBreatheTween.resume();
   }

    actor._cehpTweenPaused=scaled;

    if (actor._cehpBlinkMs>0) {
      actor._cehpBlinkMs=Math.max(0,actor._cehpBlinkMs-dtMs);
      if (!actor._cehpBlinkMs) {
        actor._cehpNextBlinkMs=actor._cehpBlinkSchedule.drawInterval();
     }
   } else {
      actor._cehpNextBlinkMs=Math.max(0,actor._cehpNextBlinkMs-dtMs);
      if (!actor._cehpNextBlinkMs) actor._cehpBlinkMs=BLINK_MS;
   }

    syncVisualState(actor);
    actor._cehpRimMs=(actor._cehpRimMs||0)+dtMs;
    if (ns.Lens&&ns.Lens.rimLight) ns.Lens.rimLight(actor,actor._cehpRimMs,actor._cehpRimState);
 }
}

function cleanup(scene){
  var layer=scene&&scene._cehpEd;
  var i;

  if (!layer) return;

  if (layer.offFns) {
    for (i=0;i<layer.offFns.length;i++) {
      if (layer.offFns[i]) layer.offFns[i]();
   }
    layer.offFns=[];
 }

  if (ns.Movement&&layer.originalCreateEd&&ns.Movement.createEd===layer.wrappedCreateEd) {
    ns.Movement.createEd=layer.originalCreateEd;
 }

  for (i=0;i<layer.actors.length;i++) {
    killBreatheTween(scene,layer.actors[i]);
    if (layer.actors[i].destroy) layer.actors[i].destroy();
 }

  if (scene.textures.exists(BODY_A_KEY)) scene.textures.remove(BODY_A_KEY);
  if (scene.textures.exists(BODY_B_KEY)) scene.textures.remove(BODY_B_KEY);
  if (scene.textures.exists(EYE_KEY)) scene.textures.remove(EYE_KEY);

  scene._cehpEd=0;
}

ns.Ed={
  prime: prime,
  update: update,
  cleanup: cleanup,
  idleStartPhase: idleStartPhase,
    makeBlinkSchedule: makeBlinkSchedule
  ,
    fallClassForDistance: fallClassForDistance,
    applySquash: applySquash,
    updateSquash: updateSquash,
    bodyDimsForState: bodyDimsForState,
    applyBodyShape: applyBodyShape,
    heroArtNameForState: heroArtNameForState
};
})(CEHP);
CEHP._register('89_ed_perform');
