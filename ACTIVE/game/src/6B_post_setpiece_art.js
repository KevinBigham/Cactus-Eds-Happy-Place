/* MODULE: 6B_POST_SETPIECE_ART - ART2 manifest backdrops for W15 setpieces. */
(function(ns){
  'use strict';

  var BACKDROPS = {
    'trust-fall': {
      name: 'trust_fall.hero',
      w: 430,
      h: 270,
      depth: 2.55,
      alpha: 0.76
    },
    'open-concept': {
      name: 'open_concept.hero',
      w: 590,
      h: 332,
      depth: 2.55,
      alpha: 0.72
    },
    'supply-chain': {
      name: 'supply_chain.hero',
      w: 650,
      h: 366,
      depth: 2.55,
      alpha: 0.74
    }
  };

  function artKeyFor(id){
    var config = BACKDROPS[id];
    if (!config || !ns.Art || !ns.Art.getKey) return '';
    return ns.Art.getKey('setpieces', config.name);
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function setAlpha(node, value){
    if (!node) return;
    if (node.setAlpha) node.setAlpha(value);
    else node.alpha = value;
  }

  function destroy(node){
    if (node && node.destroy) node.destroy();
  }

  function nodeCenter(node, fallbackX, fallbackY){
    return {
      x: node && node.x != null ? node.x : fallbackX,
      y: node && node.y != null ? node.y : fallbackY
    };
  }

  function averageNodes(list, fallbackX, fallbackY){
    var x = 0;
    var y = 0;
    var count = 0;
    var point;
    var i;
    for (i = 0; list && i < list.length; i++) {
      point = nodeCenter(list[i], null, null);
      if (point.x == null || point.y == null) continue;
      x += point.x;
      y += point.y;
      count++;
    }
    if (!count) return { x: fallbackX, y: fallbackY };
    return { x: x / count, y: y / count };
  }

  function fallbackAnchor(setpiece){
    var world = setpiece && setpiece.world;
    var room = setpiece && setpiece.room;
    return {
      x: room && room.startX != null ? room.startX + 420 : 420,
      y: (world && world.horizon ? world.horizon : 516) - 118
    };
  }

  function anchorFor(setpiece, id){
    var fallback = fallbackAnchor(setpiece);
    var anchor;
    if (id === 'trust-fall') {
      anchor = nodeCenter(setpiece && setpiece.sensor, fallback.x, fallback.y);
      anchor.y -= 38;
      return anchor;
    }
    if (id === 'open-concept') {
      anchor = averageNodes(setpiece && setpiece.walls, fallback.x, fallback.y);
      anchor.y -= 34;
      return anchor;
    }
    if (id === 'supply-chain') {
      anchor = averageNodes(setpiece && setpiece.conveyors, fallback.x, fallback.y);
      anchor.y -= 58;
      return anchor;
    }
    return fallback;
  }

  function makeBackdrop(scene, key, anchor, config){
    var image;
    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;
    image = scene.add.image(anchor.x, anchor.y, key).setDepth(config.depth);
    if (image.setOrigin) image.setOrigin(0.5);
    if (image.setDisplaySize) image.setDisplaySize(config.w, config.h);
    setAlpha(image, config.alpha);
    return image;
  }

  function wrapDestroy(setpiece){
    var original;
    if (!setpiece || setpiece._cehpArt2SetpieceDestroyWrapped) return;
    setpiece._cehpArt2SetpieceDestroyWrapped = true;
    original = setpiece.destroy;
    setpiece.destroy = function(){
      destroy(setpiece.backdrop);
      return original ? original.apply(setpiece, arguments) : undefined;
    };
  }

  function applyBackdrop(scene, setpiece, id){
    var kind;
    var config;
    var key;
    var anchor;
    scene = scene || (setpiece && setpiece.scene);
    kind = id || (setpiece && setpiece.id);
    config = BACKDROPS[kind];
    if (!scene || !setpiece || !config) return false;
    key = artKeyFor(kind);
    if (!key || !textureExists(scene, key)) return false;
    if (!setpiece.backdrop) {
      anchor = anchorFor(setpiece, kind);
      setpiece.backdrop = makeBackdrop(scene, key, anchor, config);
    }
    if (!setpiece.backdrop) return false;
    setpiece._cehpArt2BackdropKey = key;
    wrapDestroy(setpiece);
    return true;
  }

  function wrapArtAttach(name, id){
    var original;
    if (!ns.Setpieces || !ns.Setpieces[name] || ns.Setpieces[name]._cehpArt2Wrapped) return false;
    original = ns.Setpieces[name];
    ns.Setpieces[name] = function(scene){
      var setpiece = original.apply(this, arguments);
      applyBackdrop(scene, setpiece, id);
      return setpiece;
    };
    ns.Setpieces[name]._cehpArt2Wrapped = true;
    return true;
  }

  ns.Setpieces = ns.Setpieces || {};
  ns.Setpieces.artKeyFor = artKeyFor;
  ns.Setpieces.applyBackdrop = applyBackdrop;
  ns.Setpieces.wrapArtAttach = wrapArtAttach;
  wrapArtAttach('attachTrustFall', 'trust-fall');
  wrapArtAttach('attachOpenConcept', 'open-concept');
  wrapArtAttach('attachSupplyChain', 'supply-chain');
})(CEHP);
CEHP._register('6B_post_setpiece_art');
