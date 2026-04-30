/* MODULE: 89A_ED_ANIM - ART3 visual-only Ed tween polish. */
(function(ns){
  'use strict';

  var REGISTERED = false;
  var HURT_TINT = 0xff4040;
  var CLEAR_TINT = 0xffffff;
  var IDLE_BREATHE_Y = 1.02;
  var IDLE_BREATHE_MS = 800;
  var MOVE_EPSILON = 4;

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

  function pushNode(nodes, node){
    var i;
    if (!node) return;
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) return;
    }
    nodes.push(node);
  }

  function visualNodes(actor){
    var nodes = [];
    if (!actor) return nodes;
    pushNode(nodes, actor._cehpBodyImage);
    pushNode(nodes, actor._cehpSheetImage);
    pushNode(nodes, actor._cehpRimCyan);
    pushNode(nodes, actor._cehpRimMagenta);
    pushNode(nodes, actor._cehpEyeImage);
    pushNode(nodes, actor._cehpAimImage);
    if (!nodes.length) pushNode(nodes, actor);
    return nodes;
  }

  function isGrounded(actor){
    var body = actor && actor.body;
    return !!(body && ((body.blocked && body.blocked.down) || (body.touching && body.touching.down)));
  }

  function velocityX(actor){
    return actor && actor.body && actor.body.velocity ? actor.body.velocity.x || 0 : 0;
  }

  function velocityY(actor){
    return actor && actor.body && actor.body.velocity ? actor.body.velocity.y || 0 : 0;
  }

  function stateName(actor){
    return actor && actor._cehpState && actor._cehpState.current ? actor._cehpState.current : '';
  }

  function isIdle(actor){
    var state = stateName(actor);
    return !!(actor && actor.active !== false && isGrounded(actor) && (state === '' || state === 'idle') && Math.abs(velocityX(actor)) <= MOVE_EPSILON && Math.abs(velocityY(actor)) <= MOVE_EPSILON);
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

  function setNodeScale(node, x, y){
    if (!node) return;
    if (node.setScale) node.setScale(x, y);
    else {
      node.scaleX = x;
      node.scaleY = y;
    }
  }

  function applyIdleScale(actor, factor){
    var nodes = visualNodes(actor);
    var previous = actor && actor._cehpArt3IdleAppliedY ? actor._cehpArt3IdleAppliedY : 1;
    var node;
    var baseX;
    var baseY;
    var i;

    if (!actor) return;

    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      baseX = node.scaleX == null ? 1 : node.scaleX;
      baseY = node.scaleY == null ? 1 : node.scaleY;
      if (previous) baseY = baseY / previous;
      setNodeScale(node, baseX, baseY * factor);
    }

    actor._cehpArt3IdleAppliedY = factor;
  }

  function stopIdleBreathing(actor){
    if (!actor) return false;
    stopTween(actor._cehpArt3IdleTween);
    actor._cehpArt3IdleTween = null;
    if (actor._cehpArt3IdleState) actor._cehpArt3IdleState.y = 1;
    applyIdleScale(actor, 1);
    return true;
  }

  function startIdleBreathing(actor){
    var scene = actor && actor.scene;
    if (!actor || !scene || !scene.tweens || !scene.tweens.add || actor._cehpArt3IdleTween) return false;

    actor._cehpArt3IdleState = { y: 1 };
    actor._cehpArt3IdleTween = scene.tweens.add({
      targets: actor._cehpArt3IdleState,
      y: IDLE_BREATHE_Y,
      duration: IDLE_BREATHE_MS,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
      onUpdate: function(){
        applyIdleScale(actor, actor._cehpArt3IdleState.y);
      }
    });
    return true;
  }

  function updateIdleBreathing(actor){
    if (!actor) return false;
    if (isIdle(actor)) {
      startIdleBreathing(actor);
      return true;
    }
    stopIdleBreathing(actor);
    return false;
  }

  function updateScene(scene, dtMs){
    var layer = scene && scene._cehpEd;
    var i;
    if (!layer || !layer.actors) return;
    for (i = 0; i < layer.actors.length; i++) {
      updateIdleBreathing(layer.actors[i], dtMs);
    }
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
    var originalUpdate;
    if (REGISTERED || !ns.Ed || !ns.Ed.prime) return;
    REGISTERED = true;
    originalPrime = ns.Ed.prime;
    originalUpdate = ns.Ed.update;
    ns.Ed.prime = function(scene, opts){
      var layer = originalPrime.apply(this, arguments);
      bindLayer(scene, layer);
      return layer;
    };
    if (originalUpdate) {
      ns.Ed.update = function(scene, dtMs){
        var result = originalUpdate.apply(this, arguments);
        updateScene(scene, dtMs);
        return result;
      };
    }
    ns.Ed.hurtFlash = hurtFlash;
  }

  ns.EdAnim = {
    hurtFlash: hurtFlash,
    updateIdleBreathing: updateIdleBreathing,
    assistMode: assistMode,
    install: install
  };
  install();
})(CEHP);
CEHP._register('89A_ed_anim');
