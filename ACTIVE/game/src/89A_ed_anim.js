/* MODULE: 89A_ED_ANIM - ART3 visual-only Ed tween polish. */
(function(ns){
  'use strict';

  var REGISTERED = false;
  var HURT_TINT = 0xff4040;
  var CLEAR_TINT = 0xffffff;

  function stopTween(tween){
    if (!tween) return;
    if (tween.stop) tween.stop();
    if (tween.remove) tween.remove();
  }

  function assistMode(scene){
    if (scene && scene._assistMode) return scene._assistMode;
    if (ns.RunState && ns.RunState.assistMode) return ns.RunState.assistMode;
    return {};
  }

  function visualNode(actor){
    if (!actor) return null;
    return actor._cehpBodyImage || actor._cehpSheetImage || actor;
  }

  function setTint(node, color){
    if (!node) return;
    if (node.setTint) node.setTint(color);
    else node.tint = color;
  }

  function clearTint(node){
    if (!node) return;
    if (node.clearTint) node.clearTint();
    else setTint(node, CLEAR_TINT);
  }

  function hurtFlash(actor){
    var node = visualNode(actor);
    var scene = actor && actor.scene;
    var mode = assistMode(scene);
    var pulseAlpha = mode && mode.reduceFlash ? 0.78 : 0.48;
    var baseAlpha;

    if (!actor || !node || !scene || !scene.tweens || !scene.tweens.add) return false;

    stopTween(actor._cehpArt3HurtTween);
    baseAlpha = node.alpha == null ? 1 : node.alpha;
    actor._cehpArt3HurtBaseAlpha = baseAlpha;

    actor._cehpArt3HurtTween = scene.tweens.add({
      targets: node,
      alpha: pulseAlpha,
      duration: 80,
      ease: 'Sine.easeOut',
      yoyo: true,
      onStart: function(){
        setTint(node, HURT_TINT);
      },
      onComplete: function(){
        clearTint(node);
        if (node.setAlpha) node.setAlpha(baseAlpha);
        else node.alpha = baseAlpha;
        actor._cehpArt3HurtTween = null;
      }
    });

    return true;
  }

  function actorFor(layer, payload){
    if (payload && payload.actor) return payload.actor;
    if (layer && layer.actors && layer.actors.length) return layer.actors[0];
    return null;
  }

  function bindLayer(scene, layer){
    if (!scene || !layer || layer._cehpArt3HeroAnimBound || !ns.Events || !ns.Events.on) return layer;
    layer._cehpArt3HeroAnimBound = true;
    layer.offFns = layer.offFns || [];
    layer.offFns.push(ns.Events.on('player:death', function(payload){
      hurtFlash(actorFor(layer, payload));
    }));
    return layer;
  }

  function install(){
    var originalPrime;
    if (REGISTERED || !ns.Ed || !ns.Ed.prime) return;
    REGISTERED = true;
    originalPrime = ns.Ed.prime;
    ns.Ed.prime = function(scene, opts){
      var layer = originalPrime.apply(this, arguments);
      bindLayer(scene, layer);
      return layer;
    };
    ns.Ed.hurtFlash = hurtFlash;
  }

  ns.EdAnim = {
    hurtFlash: hurtFlash,
    assistMode: assistMode,
    install: install
  };
  install();
})(CEHP);
CEHP._register('89A_ed_anim');
