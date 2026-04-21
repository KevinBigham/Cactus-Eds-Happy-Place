/* ================================================================
   MODULE: 50_FORMS
   Forms-as-physical-objects. Core verb family.
     bridge     — liability waiver spans a gap
     blade      — rejected application deals damage
     trampoline — stamp pad adds launch velocity
   Canvas rect + institutional copy = aesthetic + design in one move.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function makeRect(scene, x, y, w, h, color){
    var rect = scene.add.rectangle(x, y, w, h, color, 1).setDepth(6);
    scene.physics.add.existing(rect, true);
    rect.body.allowGravity = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function label(scene, x, y, text){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#111111',
      align: 'center'
    }).setOrigin(0.5).setDepth(7);
  }

  function bridge(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, opts.width || 120, opts.height || 16, 0xdcc9a3);
    var tag = label(scene, rect.x, rect.y - 18, 'LIABILITY WAIVER');
    return {
      kind: 'bridge',
      rect: rect,
      label: tag,
      activate: function(actor){
        if (ns.Events && ns.Events.emit) ns.Events.emit('form:used', { kind: 'bridge', x: rect.x, y: rect.y, actorX: actor ? actor.x : rect.x });
      }
    };
  }

  function blade(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, opts.width || 36, opts.height || 18, 0xb8442f);
    var tag = label(scene, rect.x, rect.y - 18, 'REJECTED APPLICATION');
    return {
      kind: 'blade',
      rect: rect,
      label: tag,
      activate: function(actor){
        if (ns.Events && ns.Events.emit) {
          ns.Events.emit('form:used', { kind: 'blade', x: rect.x, y: rect.y });
          ns.Events.emit('combat:damageTaken', { kind: 'blade', amount: 1 });
        }
        if (actor && actor.takeHit) actor.takeHit('blade');
      }
    };
  }

  function trampoline(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, opts.width || 64, opts.height || 12, 0x67a7d9);
    var tag = label(scene, rect.x, rect.y - 18, 'STAMP PAD');
    return {
      kind: 'trampoline',
      rect: rect,
      label: tag,
      power: opts.power || 520,
      activate: function(actor){
        if (actor && actor.body) {
          actor.body.setVelocityY(-(opts.power || 520));
        }
        if (ns.Events && ns.Events.emit) ns.Events.emit('form:used', { kind: 'trampoline', x: rect.x, y: rect.y });
      }
    };
  }

  ns.Forms = {
    bridge: bridge,
    blade: blade,
    trampoline: trampoline
  };
})(CEHP);
CEHP._register('50_forms');
