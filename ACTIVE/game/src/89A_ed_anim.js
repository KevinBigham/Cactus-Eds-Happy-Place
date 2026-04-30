/* MODULE: 89A_ED_ANIM - ART3 visual-only Ed tween polish. */
(function(ns){
  'use strict';

  var REGISTERED = false;
  var HURT_TINT = 0xff4040;
  var CLEAR_TINT = 0xffffff;
  var IDLE_BREATHE_Y = 1.02;
  var IDLE_BREATHE_MS = 800;
  var MOVE_EPSILON = 4;
  var REDUCE_SHAKE_SCALE = 0.3;
  var JUMP_SQUASH_X = 0.9;
  var JUMP_SQUASH_Y = 1.15;
  var JUMP_SQUASH_MS = 80;
  var LAND_SQUASH_X = 1.1;
  var LAND_SQUASH_Y = 0.85;
  var LAND_SQUASH_MS = 100;

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

  function ensureScaleState(actor){
    if (!actor._cehpArt3ScaleState) {
      actor._cehpArt3ScaleState = {
        idleX: 1,
        idleY: 1,
        squashX: 1,
        squashY: 1,
        appliedX: 1,
        appliedY: 1
      };
    }
    return actor._cehpArt3ScaleState;
  }

  function setNodeScale(node, x, y){
    if (!node) return;
    if (node.setScale) node.setScale(x, y);
    else {
      node.scaleX = x;
      node.scaleY = y;
    }
  }

  function applyCombinedScale(actor, freshBase){
    var nodes = visualNodes(actor);
    var state;
    var combinedX;
    var combinedY;
    var previousX;
    var previousY;
    var node;
    var baseX;
    var baseY;
    var i;

    if (!actor) return;

    state = ensureScaleState(actor);
    combinedX = state.idleX * state.squashX;
    combinedY = state.idleY * state.squashY;
    previousX = freshBase ? 1 : state.appliedX || 1;
    previousY = freshBase ? 1 : state.appliedY || 1;

    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      baseX = node.scaleX == null ? 1 : node.scaleX;
      baseY = node.scaleY == null ? 1 : node.scaleY;
      if (previousX) baseX = baseX / previousX;
      if (previousY) baseY = baseY / previousY;
      setNodeScale(node, baseX * combinedX, baseY * combinedY);
    }

    state.appliedX = combinedX;
    state.appliedY = combinedY;
  }

  function setScaleFactors(actor, bucket, x, y, freshBase){
    var state;
    if (!actor) return;
    state = ensureScaleState(actor);
    if (bucket === 'idle') {
      state.idleX = x;
      state.idleY = y;
    } else if (bucket === 'squash') {
      state.squashX = x;
      state.squashY = y;
    }
    applyCombinedScale(actor, freshBase);
  }

  function applyIdleScale(actor, factor){
    setScaleFactors(actor, 'idle', 1, factor, false);
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

  function dampScale(scene, value){
    var mode = assistMode(scene);
    if (mode && mode.reduceShake) return 1 + ((value - 1) * REDUCE_SHAKE_SCALE);
    return value;
  }

  function startSquashTween(actor, x, y, durationMs){
    var scene = actor && actor.scene;
    var state;

    if (!actor || !scene || !scene.tweens || !scene.tweens.add) return false;

    stopTween(actor._cehpArt3SquashTween);
    state = {
      x: dampScale(scene, x),
      y: dampScale(scene, y)
    };
    actor._cehpArt3SquashState = state;
    setScaleFactors(actor, 'squash', state.x, state.y, false);

    actor._cehpArt3SquashTween = scene.tweens.add({
      targets: state,
      x: 1,
      y: 1,
      duration: durationMs,
      ease: 'Sine.easeOut',
      onUpdate: function(){
        setScaleFactors(actor, 'squash', state.x, state.y, false);
      },
      onComplete: function(){
        state.x = 1;
        state.y = 1;
        setScaleFactors(actor, 'squash', 1, 1, false);
        actor._cehpArt3SquashTween = null;
      }
    });

    return true;
  }

  function jumpSquash(actor){
    return startSquashTween(actor, JUMP_SQUASH_X, JUMP_SQUASH_Y, JUMP_SQUASH_MS);
  }

  function landSquash(actor){
    return startSquashTween(actor, LAND_SQUASH_X, LAND_SQUASH_Y, LAND_SQUASH_MS);
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
      applyCombinedScale(layer.actors[i], true);
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
    layer.offFns.push(ns.Events.on('movement:jump', function(payload){
      jumpSquash(actorFor(layer, payload));
    }));
    layer.offFns.push(ns.Events.on('movement:landed', function(payload){
      landSquash(actorFor(layer, payload));
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
    jumpSquash: jumpSquash,
    landSquash: landSquash,
    assistMode: assistMode,
    install: install
  };
  install();
})(CEHP);
CEHP._register('89A_ed_anim');
