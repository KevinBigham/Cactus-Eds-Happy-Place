/* MODULE: 42_PARALLAX - W15M-P7 deterministic visual-only backdrop layers. */
(function(ns){
  'use strict';

  var DEFAULTS = {
    far: { depth: 0.5, alpha: 0.6, factor: 0.3 },
    mid: { depth: 0.8, alpha: 0.8, factor: 0.6 }
  };

  var PLATE_DEFAULTS = {
    far: { depth: 0.35, alpha: 0.56, factor: 0.18 },
    mid: { depth: 0.65, alpha: 0.68, factor: 0.42 },
    near: { depth: 1.1, alpha: 0.46, factor: 0.72 }
  };

  var PLATE_STATES = ['far', 'mid', 'near'];

  var PALETTES = {
    orientation: { far: 0x1a2230, mid: 0x2c3a52 },
    benefits: { far: 0x2a1d24, mid: 0x4a3142 },
    rasta: { far: 0x231b18, mid: 0x3d2f28 }
  };

  ns.Parallax = ns.Parallax || {};

  function worldId(world, opts){
    opts = opts || {};
    if (opts.worldId) return opts.worldId;
    if (world && world.worldId) return world.worldId;
    if (world && world.runState && world.runState.worldId) return world.runState.worldId;
    return 'orientation';
  }

  function seedFor(world, opts, id){
    var base = opts && opts.seed;
    if (!base && world && world.runState && world.runState.caseSeed) base = world.runState.caseSeed;
    if (!base) base = 'cehp-parallax';
    return String(base) + '|parallax|' + id;
  }

  function paletteFor(id){
    return PALETTES[id] || PALETTES.orientation;
  }

  function screenWidth(world){
    if (world && world.scene && world.scene.scale && world.scene.scale.width) return world.scene.scale.width;
    return ns.GAME_W || 960;
  }

  function screenHeight(){
    return ns.GAME_H || 540;
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function addRect(scene, x, y, w, h, color, alpha, depth){
    var node;
    if (!scene || !scene.add || !scene.add.rectangle) return null;
    node = scene.add.rectangle(x, y, w, h, color, alpha);
    if (node.setDepth) node.setDepth(depth);
    if (node.setOrigin) node.setOrigin(0.5, 1);
    return node;
  }

  function makeItem(scene, layerId, palette, rng, i, width){
    var spec = DEFAULTS[layerId];
    var spacing = Math.floor(width / 5);
    var baseX = -120 + (i * spacing) + rng.int(-28, 29);
    var baseY = layerId === 'far' ? 300 + rng.int(-20, 21) : 336 + rng.int(-16, 17);
    var w = layerId === 'far' ? 46 + rng.int(0, 34) : 58 + rng.int(0, 44);
    var h = layerId === 'far' ? 68 + rng.int(0, 54) : 52 + rng.int(0, 46);
    var node = addRect(scene, baseX, baseY, w, h, palette[layerId], spec.alpha, spec.depth);
    if (!node) return null;
    return {
      id: layerId + '-' + i,
      layerId: layerId,
      factor: spec.factor,
      baseX: baseX,
      baseY: baseY,
      node: node
    };
  }

  function makeLayer(scene, world, opts, layerId, palette){
    var rng = ns.makeRNG ? ns.makeRNG(seedFor(world, opts, layerId)) : null;
    var width = screenWidth(world);
    var items = [];
    var item;
    var i;
    if (!rng) return items;
    for (i = 0; i < 6; i++) {
      item = makeItem(scene, layerId, palette, rng, i, width);
      if (item) items.push(item);
    }
    return items;
  }

  function loadWorldPlates(id){
    var list = [];
    var layerId;
    var key;
    var spec;
    var i;
    id = PALETTES[id] ? id : 'orientation';
    if (!ns.Art || !ns.Art.getKey) return list;
    for (i = 0; i < PLATE_STATES.length; i++) {
      layerId = PLATE_STATES[i];
      spec = PLATE_DEFAULTS[layerId];
      key = ns.Art.getKey('environments', id + '.' + layerId);
      if (!key) continue;
      list.push({
        worldId: id,
        layerId: layerId,
        key: key,
        factor: spec.factor,
        alpha: spec.alpha,
        depth: spec.depth
      });
    }
    return list;
  }

  function makePlate(scene, world, spec){
    var width = screenWidth(world);
    var height = screenHeight();
    var node;
    if (!spec || !textureExists(scene, spec.key) || !scene.add || !scene.add.image) return null;
    node = scene.add.image(width / 2, height, spec.key);
    if (node.setDepth) node.setDepth(spec.depth);
    if (node.setOrigin) node.setOrigin(0.5, 1);
    if (node.setDisplaySize) node.setDisplaySize(Math.max(width, 1024), Math.round(Math.max(width, 1024) * 0.5625));
    if (node.setAlpha) node.setAlpha(spec.alpha);
    return {
      id: 'plate-' + spec.worldId + '-' + spec.layerId,
      layerId: spec.layerId,
      key: spec.key,
      factor: spec.factor,
      baseX: width / 2,
      baseY: height,
      node: node
    };
  }

  function makePlates(scene, world, id){
    var specs = loadWorldPlates(id);
    var plates = [];
    var item;
    var i;
    for (i = 0; i < specs.length; i++) {
      item = makePlate(scene, world, specs[i]);
      if (item) plates.push(item);
    }
    return plates;
  }

  function syncItems(items, cameraX){
    var i;
    var item;
    cameraX = Number(cameraX) || 0;
    for (i = 0; i < items.length; i++) {
      item = items[i];
      item.node.x = item.baseX + (cameraX * (1 - item.factor));
      item.node.y = item.baseY;
    }
  }

  function destroyItems(items){
    var i;
    for (i = 0; i < items.length; i++) {
      if (items[i].node && items[i].node.destroy) items[i].node.destroy();
    }
    items.length = 0;
  }

  function cameraX(scene){
    return scene && scene.cameras && scene.cameras.main ? scene.cameras.main.scrollX : 0;
  }

  ns.Parallax.attach = function(scene, world, opts){
    var id = worldId(world, opts);
    var palette = paletteFor(id);
    var handle;
    var updateHook;
    opts = opts || {};
    handle = {
      worldId: id,
      factors: { far: DEFAULTS.far.factor, mid: DEFAULTS.mid.factor },
      layers: {
        far: makeLayer(scene, world, opts, 'far', palette),
        mid: makeLayer(scene, world, opts, 'mid', palette)
      },
      plates: makePlates(scene, world, id),
      sync: function(scrollX){
        syncItems(handle.layers.far, scrollX);
        syncItems(handle.layers.mid, scrollX);
        syncItems(handle.plates, scrollX);
      },
      destroy: function(){
        if (updateHook && scene && scene.events && scene.events.off) scene.events.off('update', updateHook);
        updateHook = null;
        destroyItems(handle.layers.far);
        destroyItems(handle.layers.mid);
        destroyItems(handle.plates);
      }
    };
    updateHook = function(){
      handle.sync(cameraX(scene));
    };
    if (scene && scene.events && scene.events.on) scene.events.on('update', updateHook);
    handle.sync(cameraX(scene));
    return handle;
  };
  ns.Parallax.loadWorldPlates = loadWorldPlates;
})(CEHP);
CEHP._register('42_parallax');
