/* MODULE: 40_FX - CRT roll, scanlines, chromatic aberration,
   per-axis grading. Respect reduceShake/reduceFlash/reduceParticles.
   Canvas-only fallback path mandatory. */

(function(ns){
  'use strict';

  var mood = 'orientation';
  var axesSnapshot = { primary: { compliance:0, intuition:0, curiosity:0, grace:0, chaos:0, efficiency:0 }, micro:{} };
  var deathTimes = [];

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function assistTuning(scene, runState){
    if (runState && runState.assistTuning) return runState.assistTuning;
    if (scene && scene._assistTuning) return scene._assistTuning;
    if (ns.SAVE && ns.SAVE.assistTuning) return ns.SAVE.assistTuning(null);
    return {
      flashAlpha: 1,
      overlayAlpha: 1,
      occlusionAlpha: 1,
      particleAlpha: 1
    };
  }

  function attach(scene){
    if (!scene || scene._cehpFx) return scene && scene._cehpFx;
    var layer = {};
    layer.stamp = scene.add.text(ns.GAME_W / 2, ns.GAME_H / 2 - 16, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#f3d16a',
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

    layer.sub = scene.add.text(ns.GAME_W / 2, ns.GAME_H / 2 + 10, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#d9d9d9',
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

    layer.overlay = scene.add.graphics().setScrollFactor(0).setDepth(49);
    layer.occlusion = scene.add.graphics().setScrollFactor(0).setDepth(48);
    layer.cig = scene.add.graphics().setDepth(25);
    layer.stampUntil = 0;
    scene._cehpFx = layer;
    return layer;
  }

  function noteDeath(scene, now){
    now = now || 0;
    while (deathTimes.length && deathTimes[0] < now - ns.TUNING.DEATH_ESCALATE_MS) deathTimes.shift();
    deathTimes.push(now);

    var layer = attach(scene);
    var escalated = deathTimes.length >= ns.TUNING.DEATH_ESCALATE_N;
    layer.stamp.setText(escalated ? 'ADDITIONAL INCIDENTS\nHAVE BEEN PRE-APPROVED' : 'APPLICATION DENIED');
    layer.sub.setText(escalated ? 'CONTINUE' : 'RESPAWN');
    layer.stampUntil = now + ns.TUNING.DEATH_STAMP_MS;
    layer.stamp.setAlpha(1);
    layer.sub.setAlpha(1);
    return {
      message: escalated ? 'ADDITIONAL INCIDENTS HAVE BEEN PRE-APPROVED.' : 'APPLICATION DENIED.',
      iframesMs: escalated ? 1600 : 900
    };
  }

  function update(scene, runState, dtMs){
    if (!scene || !scene._cehpFx) return;
    var layer = scene._cehpFx;
    var now = scene.time.now;
    var p = axesSnapshot.primary || {};
    var micro = axesSnapshot.micro || {};
    var assist = assistTuning(scene, runState);
    var chaos = p.chaos || 0;
    var grace = p.grace || 0;
    var cigaretteLit = !(runState && runState.worldFlags && runState.worldFlags.cigaretteWillNotLight);
    var burnRate = clamp(0.25 + (chaos * 1.2) - (grace * 0.5), 0.1, 1.6);
    var ashLength = clamp(3 + (grace * 12) - (chaos * 5), 1, 15);

    layer.overlay.clear();
    layer.overlay.fillStyle(mood === 'rasta' ? 0x3f5e37 : 0x10151d, (0.12 + (chaos * 0.08)) * assist.overlayAlpha);
    layer.overlay.fillRect(0, 0, ns.GAME_W, ns.GAME_H);
    layer.occlusion.clear();

    if (runState && runState.worldStats && runState.worldStats.occlusionUntil > now && scene.player && scene.cameras && scene.cameras.main) {
      var camera = scene.cameras.main;
      var cx = scene.player.x - camera.scrollX;
      var cy = scene.player.y - camera.scrollY;
      var radius = 72;
      var alpha = clamp((runState.worldStats.occlusionUntil - now) / 2800, 0.18, 0.6) * assist.occlusionAlpha;
      var left = clamp(cx - radius, 0, ns.GAME_W);
      var right = clamp(cx + radius, 0, ns.GAME_W);
      var top = clamp(cy - radius, 0, ns.GAME_H);
      var bottom = clamp(cy + radius, 0, ns.GAME_H);
      layer.occlusion.fillStyle(0x09090c, alpha);
      layer.occlusion.fillRect(0, 0, ns.GAME_W, top);
      layer.occlusion.fillRect(0, bottom, ns.GAME_W, ns.GAME_H - bottom);
      layer.occlusion.fillRect(0, top, left, bottom - top);
      layer.occlusion.fillRect(right, top, ns.GAME_W - right, bottom - top);
    }

    if (layer.stampUntil > now) {
      var alpha = clamp((layer.stampUntil - now) / ns.TUNING.DEATH_STAMP_MS, 0, 1) * assist.flashAlpha;
      layer.stamp.setAlpha(alpha);
      layer.sub.setAlpha(alpha);
    } else {
      layer.stamp.setAlpha(0);
      layer.sub.setAlpha(0);
    }

    layer.cig.clear();
    if (scene.player) {
      var px = scene.player.x + (scene.player.facing > 0 ? 8 : -8);
      var py = scene.player.y - 8;
      layer.cig.lineStyle(1, cigaretteLit ? 0xd6d0c0 : 0x777777, 1);
      layer.cig.beginPath();
      layer.cig.moveTo(px, py);
      layer.cig.lineTo(px + (scene.player.facing > 0 ? ashLength : -ashLength), py);
      layer.cig.strokePath();
      if (assist.particleAlpha > 0) {
        layer.cig.fillStyle(cigaretteLit ? 0xff9b53 : 0x555555, (cigaretteLit ? 0.8 : 0.5) * assist.particleAlpha);
        layer.cig.fillCircle(px + (scene.player.facing > 0 ? ashLength : -ashLength), py, (cigaretteLit ? 2 + chaos : 1.5) * assist.particleAlpha);
      }
      if (ns.Events && ns.Events.emit) {
        ns.Events.emit('cig:burn', { rate: burnRate, lit: cigaretteLit });
        ns.Events.emit('cig:ash', { length: ashLength, lit: cigaretteLit });
      }
      if (runState && dtMs) {
        runState.cigarette = {
          lit: cigaretteLit,
          burnRate: burnRate,
          ashLength: ashLength,
          microBurn: micro.cigBurnRate || 0,
          particleAlpha: assist.particleAlpha,
          flashAlpha: assist.flashAlpha
        };
      }
    }
  }

  ns.FX = {
    attach: attach,
    noteDeath: noteDeath,
    update: update,
    setMood: function(nextMood){ mood = nextMood || 'orientation'; },
    setAxes: function(snapshot){ axesSnapshot = snapshot || axesSnapshot; }
  };
})(CEHP);
CEHP._register('40_fx');
