/* MODULE: 66B_POST_BOSS_ANIM - ART3 visual-only boss tell tweens. */
(function(ns){
'use strict';
var INSTALLED=false,SHAKE=.3,SPAWNERS=['spawnSupervisor','spawnEnrollment','spawnLogistics'],SPECS={
  supervisor:{p:'stamp',t:'angle',v:8},
  enrollment:{p:'denial',t:'scale',v:1.1},
  logistics:{p:'ledger',t:'angle',v:10}
};
function stop(t){if(t){if(t.stop)t.stop();if(t.remove)t.remove()}}
function assist(s){return s&&s._assistMode?s._assistMode:(ns.RunState&&ns.RunState.assistMode?ns.RunState.assistMode:{})}
function damp(s,v,n){return assist(s).reduceShake?n+((v-n)*SHAKE):v}
function setScale(o,x,y){if(o.setScale)o.setScale(x,y);else{o.scaleX=x;o.scaleY=y}}
function restore(b){var s=b&&b.sprite;if(!s)return;if(b._cehpArt3TellBaseAngle!=null)s.angle=b._cehpArt3TellBaseAngle;if(b._cehpArt3TellBaseScaleX!=null)setScale(s,b._cehpArt3TellBaseScaleX,b._cehpArt3TellBaseScaleY)}
function addTell(b,sp){
  var s=b.sprite,baseX=s.scaleX==null?1:s.scaleX,baseY=s.scaleY==null?1:s.scaleY,v,c;
  if(sp.t==='scale'){
    v=damp(b.scene,sp.v,1);b._cehpArt3TellBaseScaleX=baseX;b._cehpArt3TellBaseScaleY=baseY;
    c={targets:s,scaleX:baseX*v,scaleY:baseY*v,duration:75,ease:'Sine.easeInOut',yoyo:true,repeat:1,onComplete:function(){restore(b);b._cehpArt3TellTween=null}};
  } else {
    v=damp(b.scene,sp.v,0);b._cehpArt3TellBaseAngle=s.angle||0;
    c={targets:s,angle:b._cehpArt3TellBaseAngle+v,duration:25,ease:'Sine.easeInOut',yoyo:true,repeat:5,onComplete:function(){restore(b);b._cehpArt3TellTween=null}};
  }
  b._cehpArt3TellTween=b.scene.tweens.add(c);
}
function start(b,snap){
  var sp=b&&SPECS[b.id],key;
  if(!b||!b.sprite||!b.scene||!b.scene.tweens||!b.scene.tweens.add||!snap||!sp||b.defeated)return false;
  if(snap.state!=='telegraph'||snap.phaseId!==sp.p)return false;
  key=snap.phaseId+':'+snap.state+':'+(snap.totalStrikes||0);
  if(b._cehpArt3TellKey===key)return false;
  stop(b._cehpArt3TellTween);restore(b);b._cehpArt3TellKey=key;b._cehpArt3TellLeadMs=snap.timerMs||0;addTell(b,sp);return true;
}
function wrap(b){
  var u;
  if(!b||b._cehpArt3BossWrapped)return b;
  b._cehpArt3BossWrapped=true;u=b.update;
  if(u)b.update=function(dt){var s=u.apply(b,arguments);if(s&&s.state!=='telegraph')b._cehpArt3TellKey='';start(b,s);return s};
  return b;
}
function wrapSpawner(name){
  var old;
  if(!ns.bosses||!ns.bosses[name]||ns.bosses[name]._cehpArt3Wrapped)return;
  old=ns.bosses[name];ns.bosses[name]=function(){return wrap(old.apply(this,arguments))};ns.bosses[name]._cehpArt3Wrapped=true;
}
function install(){var i;if(INSTALLED)return;INSTALLED=true;ns.bosses=ns.bosses||{};ns.bosses.wrapAnimBoss=wrap;ns.bosses.startTellTween=start;for(i=0;i<SPAWNERS.length;i++)wrapSpawner(SPAWNERS[i])}
install();
})(CEHP);
CEHP._register('66B_post_boss_anim');
