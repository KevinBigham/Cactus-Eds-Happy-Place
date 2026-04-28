/* ================================================================
   MODULE: 21_MOVEMENT
   All 11 movement actions + Celeste mercies.
   PERMANENT from Minute 1 — gating breaks replay parity.
   Celeste mercies: coyote window, jump buffering, corner nudge.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function createEd(scene, x, y){
    var assistTuning = scene && scene._assistTuning ? scene._assistTuning : null;
    var ed = scene.add.rectangle(x, y, 18, 28, ns.PALETTE.EXIT_AMBER, 1);
    scene.physics.add.existing(ed);
    ed.body.setCollideWorldBounds(true);
    ed.body.setSize(18, 28, true);
    ed.body.setDragX(1400);
    ed.body.setMaxVelocity(ns.TUNING.RUN_SPEED * 2.8, 560);
    ed.facing = 1;
    ed.spawnX = x;
    ed.spawnY = y;
    ed.health = 1;
    ed.coyoteWindowMs = assistTuning && assistTuning.coyoteMs ? assistTuning.coyoteMs : ns.TUNING.COYOTE_MS;
    ed.coyoteMs = ed.coyoteWindowMs;
    ed.jumpBufferMs = 0;
    ed.jumpsUsed = 0;
    ed.wallSliding = false;
    ed.spinChargeMs = 0;
    ed.spinCooldownMs = 0;
    ed.attackMs = 0;
    ed.invulnMs = 0;
    ed.glideTickMs = 0;
    ed.copterTickMs = 0;
    ed.wasGrounded = false;
    ed.lastVelocityY = 0;
    ed.gravityMultiplier = 1;
    ed.respawnAtMs = 0;
    resetGravityModifier(ed);
    return ed;
  }

  function emit(topic, payload){
    if (ns.Events && ns.Events.emit) ns.Events.emit(topic, payload || {});
  }

  function grounded(ed){
    return !!(ed.body.blocked.down || ed.body.touching.down);
  }

  function wallSide(ed){
    if (ed.body.blocked.left) return -1;
    if (ed.body.blocked.right) return 1;
    return 0;
  }

  function resetGravityModifier(ed){
    if (!ed || !ed.body) return;
    if (ns.Feel && ns.Feel.resetGravityModifier) {
      ns.Feel.resetGravityModifier(ed);
      return;
    }
    ed.gravityMultiplier = 1;
    if (ed.body.setGravityY) ed.body.setGravityY(0);
  }

  function applyGravityModifier(ed){
    if (!ed || !ed.body) return;
    if (ns.Feel && ns.Feel.applyGravityModifier) {
      ns.Feel.applyGravityModifier(ed);
      return;
    }
    if (ed.gravityMultiplier == null) ed.gravityMultiplier = 1;
    if (ed.body.setGravityY) ed.body.setGravityY((ed.gravityMultiplier - 1) * ns.TUNING.GRAVITY);
  }

  function respawn(ed){
    ed.x = ed.spawnX;
    ed.y = ed.spawnY;
    ed.body.reset(ed.spawnX, ed.spawnY);
    ed.body.setVelocity(0, 0);
    ed.jumpBufferMs = 0;
    ed.coyoteMs = ed.coyoteWindowMs || ns.TUNING.COYOTE_MS;
    ed.jumpsUsed = 0;
    ed.spinChargeMs = 0;
    ed.attackMs = 0;
    ed.lastVelocityY = 0;
    ed.gravityMultiplier = 1;
    resetGravityModifier(ed);
  }

  ns.Movement = {
    ACTIONS: [
      'move',
      'jump',
      'doubleJump',
      'tripleJump',
      'wallSlideJump',
      'punch',
      'kick',
      'spinDash',
      'cigCopter',
      'groundSlam',
      'glide'
    ],
    createEd: createEd,
    respawn: respawn,
    apply: function(ed, input, dtMs){
      if (!ed || !ed.body) return;
      dtMs = dtMs || 16;

      ed.invulnMs = Math.max(0, ed.invulnMs - dtMs);
      ed.attackMs = Math.max(0, ed.attackMs - dtMs);
      ed.spinCooldownMs = Math.max(0, ed.spinCooldownMs - dtMs);
      ed.glideTickMs = Math.max(0, ed.glideTickMs - dtMs);
      ed.copterTickMs = Math.max(0, ed.copterTickMs - dtMs);

      var isGrounded = grounded(ed);
      var wall = wallSide(ed);
      var axisX = input.axisX();
      var landingSpeed = Math.max(ed.body.velocity.y, ed.lastVelocityY || 0);

      if (axisX !== 0) {
        ed.facing = axisX;
      }

      if (isGrounded) {
        ed.coyoteMs = ed.coyoteWindowMs || ns.TUNING.COYOTE_MS;
        ed.jumpsUsed = 0;
        resetGravityModifier(ed);
      } else {
        ed.coyoteMs = Math.max(0, ed.coyoteMs - dtMs);
      }

      if (wall !== 0 && !isGrounded && ed.body.velocity.y > 0 && axisX === wall) {
        ed.wallSliding = true;
        ed.body.setVelocityY(Math.min(ed.body.velocity.y, 90));
      } else {
        ed.wallSliding = false;
      }

      if (!isGrounded && ed.body.velocity.y < 0 && ed.gravityMultiplier > 1) {
        applyGravityModifier(ed);
      } else if (isGrounded || ed.body.velocity.y >= 0) {
        resetGravityModifier(ed);
      }

      if (input.justPressed('punch')) {
        ed.attackMs = 120;
        emit('movement:punch', { x: ed.x, y: ed.y });
      }

      if (input.justPressed('kick')) {
        ed.attackMs = 160;
        ed.body.setVelocityX(ed.facing * (ns.TUNING.RUN_SPEED + 40));
        emit('movement:kick', { x: ed.x, y: ed.y });
      }

      if (input.down('spinDash') && isGrounded && ed.spinCooldownMs <= 0) {
        ed.spinChargeMs = Math.min(1500, ed.spinChargeMs + dtMs);
      } else if (ed.spinChargeMs > 0 && input.justReleased('spinDash') && ed.spinCooldownMs <= 0) {
        var tier = ed.spinChargeMs >= 900 ? 3 : (ed.spinChargeMs >= 450 ? 2 : 1);
        ed.body.setVelocityX(ed.facing * (ns.TUNING.RUN_SPEED + (tier * 90)));
        ed.spinChargeMs = 0;
        ed.spinCooldownMs = 220;
        emit('movement:spinDash', { x: ed.x, y: ed.y, tier: tier });
      } else if (!input.down('spinDash')) {
        ed.spinChargeMs = 0;
      }

      if (input.justPressed('groundSlam') && !isGrounded) {
        ed.body.setVelocityY(460);
        ed.body.setVelocityX(ed.body.velocity.x * 0.2);
        emit('movement:groundSlam', { x: ed.x, y: ed.y });
      }

      if (input.down('glide') && !isGrounded && ed.body.velocity.y > 0) {
        ed.body.setVelocityY(Math.min(ed.body.velocity.y, 90));
        if (ed.glideTickMs <= 0) {
          ed.glideTickMs = 180;
          emit('movement:glide', { x: ed.x, y: ed.y });
        }
      }

      if (input.down('cigCopter') && !isGrounded) {
        ed.body.setVelocityY(Math.max(ed.body.velocity.y - 14, -80));
        if (ed.copterTickMs <= 0) {
          ed.copterTickMs = 180;
          emit('movement:cigCopter', { x: ed.x, y: ed.y });
        }
      }

      if (!input.down('spinDash') || ed.spinCooldownMs > 0) {
        ed.body.setVelocityX(axisX * ns.TUNING.RUN_SPEED);
      }

      if (ed.body.blocked.up && axisX !== 0) {
        ed.x += axisX * ns.TUNING.CORNER_NUDGE_PX;
        emit('movement:correction', { x: ed.x, y: ed.y, distance: ns.TUNING.CORNER_NUDGE_PX });
      }

      /* Arcade bodies zero vertical speed on contact, so keep the last fall speed. */
      if (!ed.wasGrounded && isGrounded && landingSpeed > 200 && ns.Feel && ns.Feel.onLanding) {
        ns.Feel.onLanding(ed.scene, ed, landingSpeed);
      }

      ed.wasGrounded = isGrounded;
      ed.lastVelocityY = ed.body.velocity.y;
      ed.fillColor = ed.attackMs > 0 ? 0xff7b5a : 0xf7c948;
      ed.alpha = ed.invulnMs > 0 ? 0.7 : 1;
      ed.body.setVelocityX(clamp(ed.body.velocity.x, -ns.TUNING.RUN_SPEED * 2.8, ns.TUNING.RUN_SPEED * 2.8));
    }
  };
})(CEHP);
CEHP._register('21_movement');
