/* MODULE: 1A_ASSET_LOADER - W15 ART2 manifest-driven Phaser image wiring. */
(function(ns){
  'use strict';

  var MANIFEST_KEY = 'cehp_art_manifest';
  var BASE_PATH = 'assets/art/';
  var MANIFEST_PATH = BASE_PATH + 'art_manifest.json';
  var manifest = null;
  var assets = [];
  var byName = {};
  var registered = false;

  function own(obj, key){
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function assetName(asset){
    return String(asset.subject || '') + '.' + String(asset.state || '');
  }

  function lookupKey(category, name){
    return String(category || '') + '|' + String(name || '');
  }

  function textureKey(asset){
    return [
      'cehp_art',
      asset.category,
      asset.subject,
      asset.state,
      asset.variant
    ].join(':');
  }

  function cloneAsset(asset){
    var copy = {};
    var key;
    for (key in asset) {
      if (own(asset, key)) copy[key] = asset[key];
    }
    return copy;
  }

  function addLookup(asset){
    var name = assetName(asset);
    byName[lookupKey(asset.category, name)] = asset;
    byName[lookupKey(asset.category, String(asset.subject || '') + '_' + String(asset.state || ''))] = asset;
  }

  function registerManifest(data){
    var list;
    var i;
    var item;
    if (registered) return false;
    if (!data || !data.assets || !data.assets.length) return false;

    manifest = data;
    list = data.assets;
    assets = [];
    byName = {};
    for (i = 0; i < list.length; i++) {
      item = cloneAsset(list[i]);
      item.key = textureKey(item);
      item.path = BASE_PATH + item.file;
      assets.push(item);
      addLookup(item);
    }
    registered = true;
    return true;
  }

  function cachedManifest(scene){
    if (!scene || !scene.cache || !scene.cache.json || !scene.cache.json.get) return null;
    return scene.cache.json.get(MANIFEST_KEY);
  }

  function payloadManifest(a, b, c){
    if (c && c.assets) return c;
    if (b && b.assets) return b;
    if (a && a.assets) return a;
    return null;
  }

  function queueImages(scene){
    var i;
    var item;
    if (!scene || !scene.load || !scene.load.image) return false;
    for (i = 0; i < assets.length; i++) {
      item = assets[i];
      if (scene.textures && scene.textures.exists && scene.textures.exists(item.key)) continue;
      scene.load.image(item.key, item.path);
    }
    return true;
  }

  function onManifestLoaded(scene){
    return function(a, b, c){
      var data = payloadManifest(a, b, c) || cachedManifest(scene);
      if (data) registerManifest(data);
      if (registered) queueImages(scene);
    };
  }

  function preloadAll(scene){
    var cached;
    if (!registered) {
      cached = cachedManifest(scene);
      if (cached) registerManifest(cached);
    }
    if (registered) return queueImages(scene);
    if (!scene || !scene.load) return false;
    if (scene.load.once) scene.load.once('filecomplete-json-' + MANIFEST_KEY, onManifestLoaded(scene));
    if (scene.load.json) scene.load.json(MANIFEST_KEY, MANIFEST_PATH);
    return false;
  }

  function findAsset(category, name){
    var item = byName[lookupKey(category, name)];
    if (item) return item;
    return null;
  }

  function getAsset(category, name){
    var item = findAsset(category, name);
    return item ? cloneAsset(item) : null;
  }

  function getKey(category, name){
    var item = findAsset(category, name);
    return item ? item.key : '';
  }

  function getPath(category, name){
    var item = findAsset(category, name);
    return item ? item.path : '';
  }

  function allAssets(){
    var list = [];
    var i;
    for (i = 0; i < assets.length; i++) list.push(cloneAsset(assets[i]));
    return list;
  }

  function withPreloadHook(sceneList){
    var list = sceneList || [];
    var i;
    var sceneClass;
    var proto;
    var original;
    for (i = 0; i < list.length; i++) {
      sceneClass = list[i];
      proto = sceneClass && sceneClass.prototype;
      if (!proto || !proto.preload || proto._cehpArtPreloadHooked) continue;
      original = proto.preload;
      proto.preload = (function(fn){
        return function(){
          preloadAll(this);
          return fn.apply(this, arguments);
        };
      })(original);
      proto._cehpArtPreloadHooked = true;
    }
    return list;
  }

  ns.Art = {
    MANIFEST_KEY: MANIFEST_KEY,
    MANIFEST_PATH: MANIFEST_PATH,
    registerManifest: registerManifest,
    preloadAll: preloadAll,
    withPreloadHook: withPreloadHook,
    getAsset: getAsset,
    getKey: getKey,
    getPath: getPath,
    allAssets: allAssets,
    _manifest: function(){ return manifest; }
  };
})(CEHP);
CEHP._register('1A_asset_loader');
