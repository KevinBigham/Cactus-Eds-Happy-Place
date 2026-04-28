/* MODULE: 85_LENS-W7 LensKit deterministic dither/scanline/vignette.
 PlayScene only;receipts/overlays stay stable. */

(function(ns){
'use strict';

var DITHER_KEY='cehp-lens-dither';
var SCANLINE_KEY='cehp-lens-scanline';
var VIGNETTE_KEY='cehp-lens-vignette';
var DITHER_SIZE=64;
var SCANLINE_SCROLL_PER_FRAME=0.4;
var DITHER_ALPHA=0.18;
var SCANLINE_ALPHA=0.07;
var VIGNETTE_EDGE_ALPHA=0.55;
var DITHER_DEPTH=44;
var SCANLINE_DEPTH=45;
var VIGNETTE_DEPTH=46;
var CAMERA_LEAD_MAX_PX=150;
var CAMERA_LEAD_VEL_MULT=0.45;
var CAMERA_LEAD_VERTICAL_FALL_PX=140;
var CAMERA_LEAD_VERTICAL_APEX_PX=90;
var CAMERA_LEAD_LERP_MS=120;
var APEX_VEL_EPSILON=30;
var CAMERA_LAND_DIP_SOFT_PX=0;
var CAMERA_LAND_DIP_MED_PX=2;
var CAMERA_LAND_DIP_HARD_PX=4;
var CAMERA_LAND_DIP_DURATION_MS=90;
var CAMERA_SHAKE_AMPLITUDE_PX=6;
var CAMERA_SHAKE_DURATION_MS=70;
var CAMERA_SHAKE_FREQ_HZ=14;
var RIM_LIGHT_AMPLITUDE_PX=1;
var RIM_LIGHT_FREQ_HZ=0.85;
var RIM_LIGHT_ALPHA=0.22;
var TWO_PI=Math.PI*2;
var RNG_MOD=4294967296;/* 2^32 from MODULE: 02_RNG */
var BAYER_4X4=[
  [0,8,2,10],
  [12,4,14,6],
  [3,11,1,9],
  [15,7,13,5]
];

function blendMultiply(){
  if (typeof Phaser!=='undefined'&&Phaser.BlendModes) return Phaser.BlendModes.MULTIPLY;
  return 'MULTIPLY';
}

function padHex(hex){
  var out=hex.toString(16);
  while (out.length<6) out='0'+out;
  return out;
}

function rgba(hex,alpha){
  return 'rgba('
   +parseInt(padHex(hex).slice(0,2),16)+','
   +parseInt(padHex(hex).slice(2,4),16)+','
   +parseInt(padHex(hex).slice(4,6),16)+','
   +alpha+')';
}

function makeCanvas(width,height){
  if (typeof document==='undefined'||!document.createElement) return null;
  var canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  return canvas;
}

function resetTexture(scene,key,canvas){
  if (!scene||!scene.textures||!scene.textures.addCanvas||!canvas) return null;
  if (scene.textures.exists&&scene.textures.exists(key)) scene.textures.remove(key);
  return scene.textures.addCanvas(key,canvas);
}

function clamp(v,min,max){
  return v<min?min:(v>max?max:v);
}

function isGrounded(ed){
  var body=ed&&ed.body;
  return !!(body&&((body.blocked&&body.blocked.down)||(body.touching&&body.touching.down)));
}

function cameraLeadX(vx){
  if (!vx) return 0;
  return (vx<0?-1:1)*Math.min(CAMERA_LEAD_MAX_PX,Math.abs(vx)*CAMERA_LEAD_VEL_MULT);
}

function cameraLeadY(vy,grounded){
  if (grounded) return 0;
  if (Math.abs(vy||0)<APEX_VEL_EPSILON) return CAMERA_LEAD_VERTICAL_APEX_PX;
  if ((vy||0)>0) return CAMERA_LEAD_VERTICAL_FALL_PX;
  return 0;
}

function makeCameraState(seed){
  return {
    leadX: 0,
    leadY: 0,
    dipMs: 0,
    dipDurationMs: 0,
    dipPx: 0,
    dipOffset: 0,
    shakeRng: ns.makeRNG?ns.makeRNG(String(seed||'CASE-UNKNOWN')+'|lens|shake'):null,
    shakeMs: 0,
    shakeDurationMs: 0,
    shakeElapsedMs: 0,
    shakeAmp: 0,
    shakePhase: 0,
    shakeX: 0,
    shakeY: 0
 };
}

function stopTween(tween){
  if (!tween) return;
  if (tween.stop) tween.stop();
  if (tween.remove) tween.remove();
}

function clearLegacySettle(scene){
  var feel=scene&&scene._cehpFeel?scene._cehpFeel:null;
  if (!feel||!feel.settleTween) return;
  stopTween(feel.settleTween);
  feel.settleTween=null;
}

function landingDipPx(fallClass){
  if (fallClass==='hard') return CAMERA_LAND_DIP_HARD_PX;
  if (fallClass==='medium') return CAMERA_LAND_DIP_MED_PX;
  return CAMERA_LAND_DIP_SOFT_PX;
}

function startLandingDip(state,fallClass){
  var px;
  if (!state||state.dipMs>0) return false;
  px=landingDipPx(fallClass);
  if (px<=0) return false;
  state.dipPx=px;
  state.dipOffset=px;
  state.dipDurationMs=CAMERA_LAND_DIP_DURATION_MS;
  state.dipMs=CAMERA_LAND_DIP_DURATION_MS;
  return true;
}

function updateLandingDip(state,dtMs){
  var elapsed;
  var t;
  var eased;
  if (!state||state.dipMs<=0) return 0;
  state.dipMs=Math.max(0,state.dipMs-(dtMs||16));
  elapsed=state.dipDurationMs-state.dipMs;
  t=state.dipDurationMs>0?clamp(elapsed/state.dipDurationMs,0,1):1;
  eased=1-((1-t)*(1-t));/* easeOutQuad: fast dip recovery,no bounce. */
  state.dipOffset=state.dipMs>0?state.dipPx*(1-eased):0;
  return state.dipOffset;
}

function drawShakePhase(state){
  if (!state||!state.shakeRng||!state.shakeRng.next) return 0;
  return (state.shakeRng.next()/RNG_MOD)*TWO_PI;
}

function makeRimLightState(seed){
  var rng=ns.makeRNG?ns.makeRNG(String(seed||'CASE-UNKNOWN')+'|lens|rim'):null;
  return {phase: rng&&rng.next?(rng.next()/RNG_MOD)*TWO_PI:0};
}

function rimBlinkOff(actor){
  var phase4=actor&&actor._cehpState&&actor._cehpState.phase4?actor._cehpState.phase4:null;
  return !!(phase4&&phase4.iframesMs>0&&actor.alpha<0.5);
}

function setRimNode(node,visible,x,alpha){
  if (!node) return;
  node.visible=visible;
  node.x=x;
  node.alpha=visible?alpha:0;
}

function rimLight(actor,pulseMs,state){
  var elapsed=(Number(pulseMs)||0)/1000;
  var phase=state&&state.phase?state.phase:0;
  var offset;
  if (!actor||rimBlinkOff(actor)) {
    setRimNode(actor&&actor._cehpRimCyan,false,0,0);
    setRimNode(actor&&actor._cehpRimMagenta,false,0,0);
    return {visible: false,offset: 0};
 }
  offset=Math.round(Math.sin((elapsed*RIM_LIGHT_FREQ_HZ*TWO_PI)+phase)*RIM_LIGHT_AMPLITUDE_PX);
  setRimNode(actor._cehpRimCyan,true,-1+offset,RIM_LIGHT_ALPHA);
  setRimNode(actor._cehpRimMagenta,true,1-offset,RIM_LIGHT_ALPHA*0.85);
  return {visible: true,offset: offset};
}

function startCameraShake(state,payload){
  if (!state||!payload||payload.kind!=='damage') return null;
  state.shakeAmp=CAMERA_SHAKE_AMPLITUDE_PX;
  state.shakeDurationMs=CAMERA_SHAKE_DURATION_MS;
  state.shakeMs=CAMERA_SHAKE_DURATION_MS;
  state.shakeElapsedMs=0;
  state.shakePhase=drawShakePhase(state);
  return {
    amplitudePx: state.shakeAmp,
    durationMs: state.shakeDurationMs,
    phase: state.shakePhase
 };
}

function updateCameraShake(state,dtMs){
  var seconds;
  var angle;
  if (!state) return;
  state.shakeX=0;
  state.shakeY=0;
  if (state.shakeMs<=0) return;
  state.shakeElapsedMs += dtMs||16;
  state.shakeMs=Math.max(0,state.shakeDurationMs-state.shakeElapsedMs);
  if (state.shakeMs<=0) return;
  seconds=state.shakeElapsedMs/1000;
  angle=(seconds*CAMERA_SHAKE_FREQ_HZ*TWO_PI)+state.shakePhase;
  state.shakeX=Math.cos(angle)*state.shakeAmp;
  state.shakeY=Math.sin(angle)*state.shakeAmp;
}

function bindCameraEvents(scene,state,layer){
  if (!ns.Events||!ns.Events.on||!state||!layer) return;
  layer.offFns=layer.offFns||[];
  layer.offFns.push(ns.Events.on('movement:landed',function(payload){
    if (payload&&payload.scene&&payload.scene!==scene) return;
    if (payload&&payload.natural===false) return;
    clearLegacySettle(scene);
    startLandingDip(state,payload&&payload.fallClass?payload.fallClass:'soft');
 }));
  layer.offFns.push(ns.Events.on('camera:shake',function(payload){
    if (payload&&payload.scene&&payload.scene!==scene) return;
    startCameraShake(state,payload);
 }));
}

function updateCameraResponse(scene,layer,delta){
  var state=layer&&layer.response?layer.response:null;
  var camera=scene&&scene.cameras?scene.cameras.main:null;
  var ed=scene&&scene.player?scene.player:null;
  var vel=ed&&ed.body&&ed.body.velocity?ed.body.velocity:null;
  var dt=delta||16;
  var lerp=Math.min(1,dt/CAMERA_LEAD_LERP_MS);
  var targetX;
  var targetY;
  if (!state||!camera||!camera.setFollowOffset||!ed) return;
  targetX=cameraLeadX(vel?vel.x:0);
  targetY=cameraLeadY(vel?vel.y:0,isGrounded(ed));
  state.leadX += (targetX-state.leadX)*lerp;
  state.leadY += (targetY-state.leadY)*lerp;
  updateLandingDip(state,dt);
  updateCameraShake(state,dt);
  camera.setFollowOffset(state.leadX+state.shakeX,state.leadY+state.dipOffset+state.shakeY);
}

function buildDitherCanvas(seed){
  var palette=ns.PALETTE||{};
  var canvas=makeCanvas(DITHER_SIZE,DITHER_SIZE);
  var ctx=canvas&&canvas.getContext?canvas.getContext('2d'):null;
  var rng=ns.makeRNG?ns.makeRNG(String(seed||'CASE-UNKNOWN')+'|lens|dither'):null;
  var x;
  var y;
  var threshold;
  var inkAlpha;
  var paperAlpha;
  if (!ctx) return canvas;

  for (y=0;y<DITHER_SIZE;y++) {
    for (x=0;x<DITHER_SIZE;x++) {
      threshold=BAYER_4X4[y % 4][x % 4];
      inkAlpha=0.08+(((threshold+(rng?rng.int(0,4):0))/19)*0.26);
      paperAlpha=0.02+((threshold/15)*0.05);
      ctx.fillStyle=rgba((((x+y+threshold) % 3)===0)?palette.COPIER_GRAY:palette.BRUISE_NAVY,inkAlpha);
      ctx.fillRect(x,y,1,1);
      if (((x+y) % 2)===0) {
        ctx.fillStyle=rgba(palette.OFF_WHITE,paperAlpha);
        ctx.fillRect(x,y,1,1);
     }
   }
 }
  return canvas;
}

function buildScanlineCanvas(){
  var palette=ns.PALETTE||{};
  var canvas=makeCanvas(2,2);
  var ctx=canvas&&canvas.getContext?canvas.getContext('2d'):null;
  if (!ctx) return canvas;

  ctx.fillStyle=rgba(palette.BRUISE_NAVY,0.55);
  ctx.fillRect(0,0,2,1);
  ctx.fillStyle=rgba(palette.OFF_WHITE,0.02);
  ctx.fillRect(0,1,2,1);
  return canvas;
}

function buildVignetteCanvas(width,height){
  var palette=ns.PALETTE||{};
  var canvas=makeCanvas(width,height);
  var ctx=canvas&&canvas.getContext?canvas.getContext('2d'):null;
  var gradient;
  if (!ctx) return canvas;

  gradient=ctx.createRadialGradient(
    width*0.5,
    height*0.5,
    Math.min(width,height)*0.08,
    width*0.5,
    height*0.5,
    Math.max(width,height)*0.62
 );
  gradient.addColorStop(0,rgba(palette.BRUISE_NAVY,0));
  gradient.addColorStop(0.62,rgba(palette.BRUISE_NAVY,0.18));
  gradient.addColorStop(1,rgba(palette.BRUISE_NAVY,VIGNETTE_EDGE_ALPHA));
  ctx.fillStyle=gradient;
  ctx.fillRect(0,0,width,height);
  return canvas;
}

function attach(scene,opts){
  var width;
  var height;
  var layer;
  var ditherCanvas;
  var scanlineCanvas;
  var vignetteCanvas;
  if (!scene) return null;
  if (scene._cehpLens) return scene._cehpLens;

  width=scene.cameras&&scene.cameras.main?scene.cameras.main.width:ns.GAME_W;
  height=scene.cameras&&scene.cameras.main?scene.cameras.main.height:ns.GAME_H;
  ditherCanvas=buildDitherCanvas(opts&&opts.seed?opts.seed:'');
  scanlineCanvas=buildScanlineCanvas();
  vignetteCanvas=buildVignetteCanvas(width,height);

  resetTexture(scene,DITHER_KEY,ditherCanvas);
  resetTexture(scene,SCANLINE_KEY,scanlineCanvas);
  resetTexture(scene,VIGNETTE_KEY,vignetteCanvas);

  layer={
    dither: scene.add.tileSprite(width/2,height/2,width,height,DITHER_KEY)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DITHER_DEPTH)
      .setAlpha(DITHER_ALPHA)
      .setBlendMode(blendMultiply()),
    scanlines: scene.add.tileSprite(width/2,height/2,width,height,SCANLINE_KEY)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(SCANLINE_DEPTH)
      .setAlpha(SCANLINE_ALPHA),
    vignette: scene.add.image(width/2,height/2,VIGNETTE_KEY)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(VIGNETTE_DEPTH)
      .setBlendMode(blendMultiply()),
    response: makeCameraState(opts&&opts.seed?opts.seed:''),
    offFns: [],
    cleanup: function(){
      var i;
      if (layer.offFns) {
        for (i=0;i<layer.offFns.length;i++) {
          if (layer.offFns[i]) layer.offFns[i]();
       }
        layer.offFns=[];
     }
      if (scene.textures&&scene.textures.exists&&scene.textures.remove) {
        if (scene.textures.exists(DITHER_KEY)) scene.textures.remove(DITHER_KEY);
        if (scene.textures.exists(SCANLINE_KEY)) scene.textures.remove(SCANLINE_KEY);
        if (scene.textures.exists(VIGNETTE_KEY)) scene.textures.remove(VIGNETTE_KEY);
     }
   }
 };

  scene._cehpLens=layer;
  bindCameraEvents(scene,layer.response,layer);
  if (scene.events&&scene.events.once) {
    scene.events.once('shutdown',function(){
      layer.cleanup();
      scene._cehpLens=null;
   });
 }
  return layer;
}

function update(scene,delta){
  var layer=scene&&scene._cehpLens?scene._cehpLens:null;
  if (!layer||!layer.scanlines) return;
  layer.scanlines.tilePositionY += (delta/(1000/60))*SCANLINE_SCROLL_PER_FRAME;
  updateCameraResponse(scene,layer,delta);
}

ns.Lens={
  attach: attach,
  update: update,
  cameraLeadX: cameraLeadX,
  cameraLeadY: cameraLeadY,
  makeCameraState: makeCameraState,
  landingDipPx: landingDipPx,
  startLandingDip: startLandingDip,
  updateLandingDip: updateLandingDip,
  startCameraShake: startCameraShake,
  makeRimLightState: makeRimLightState,
  rimLight: rimLight
};
})(CEHP);
CEHP._register('85_lens');
