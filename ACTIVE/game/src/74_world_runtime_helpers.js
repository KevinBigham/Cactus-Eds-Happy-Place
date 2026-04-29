/* MODULE: 74_WORLD_RUNTIME_HELPERS - shared room construction helpers. */

(function(ns){
  'use strict';

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function staticRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0x6a6671, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    scene.physics.add.existing(rect, true);
    rect.body.allowGravity = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function movingRect(scene, x, y, w, h, color, alpha, depth){
    var rect = scene.add.rectangle(x, y, w, h, color || 0xe8d9b1, alpha == null ? 1 : alpha).setDepth(depth == null ? 4 : depth);
    scene.physics.add.existing(rect);
    rect.body.allowGravity = false;
    rect.body.setImmovable(true);
    rect.body.moves = false;
    rect.body.updateFromGameObject();
    return rect;
  }

  function sensorZone(scene, x, y, w, h){
    var zone = scene.add.zone(x, y, w, h).setDepth(3);
    scene.physics.add.existing(zone, true);
    zone.body.allowGravity = false;
    zone.body.moves = false;
    return zone;
  }

  function textLabel(scene, x, y, text, size, color, depth, fallbackColor){
    return scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: (size || 8) + 'px',
      color: color || fallbackColor || '#fff9e0',
      align: 'left'
    }).setDepth(depth == null ? 8 : depth);
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function addBackdropImage(scene, key, x, y, w, h, depth, alpha){
    var image;
    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;
    image = scene.add.image(x, y, key).setDepth(depth == null ? 1.6 : depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(w, h);
    if (image.setAlpha) image.setAlpha(alpha == null ? 1 : alpha);
    return image;
  }

  function destroyThing(obj){
    if (obj && obj.destroy) obj.destroy();
  }

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function intersects(a, b){
    return ns.Collision && ns.Collision.intersects ? ns.Collision.intersects(a, b) : false;
  }

  ns.WorldRuntime = {
    clamp: clamp,
    staticRect: staticRect,
    movingRect: movingRect,
    sensorZone: sensorZone,
    textLabel: textLabel,
    textureExists: textureExists,
    addBackdropImage: addBackdropImage,
    destroyThing: destroyThing,
    clone: clone,
    intersects: intersects
  };
})(CEHP);
CEHP._register('74_world_runtime_helpers');
