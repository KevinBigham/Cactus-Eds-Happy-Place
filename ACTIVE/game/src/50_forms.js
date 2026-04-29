/* MODULE: 50_FORMS - forms-as-physical-objects verb family.
   bridge=liability waiver, blade=rejected app, trampoline=stamp pad. */

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

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function artImage(scene, key, x, y, w, h, depth, alpha){
    var image;

    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;

    image = scene.add.image(x, y, key).setDepth(depth == null ? 6.5 : depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(w, h);
    if (image.setAlpha) image.setAlpha(alpha == null ? 1 : alpha);
    return image;
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
        ns.emit('form:used', { kind: 'bridge', x: rect.x, y: rect.y, actorX: actor ? actor.x : rect.x });
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
        ns.emit('form:used', { kind: 'blade', x: rect.x, y: rect.y });
        ns.emit('combat:damageTaken', { kind: 'blade', amount: 1 });
        if (actor && actor.takeHit) actor.takeHit('blade');
      }
    };
  }

  function trampoline(scene, opts){
    opts = opts || {};
    var rect = makeRect(scene, opts.x || 0, opts.y || 0, opts.width || 64, opts.height || 12, 0x67a7d9);
    var tag = label(scene, rect.x, rect.y - 18, 'STAMP PAD');
    var art = artImage(scene, 'prop_stamp_pad', rect.x, rect.y - 2, rect.width + 18, 42, 6.5, 0.98);
    return {
      kind: 'trampoline',
      rect: rect,
      label: tag,
      art: art,
      power: opts.power || 520,
      activate: function(actor){
        if (actor && actor.body) {
          actor.body.setVelocityY(-(opts.power || 520));
        }
        ns.emit('form:used', { kind: 'trampoline', x: rect.x, y: rect.y });
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
