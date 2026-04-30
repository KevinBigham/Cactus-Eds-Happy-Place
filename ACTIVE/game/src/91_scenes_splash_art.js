/* MODULE: 91_SCENES_SPLASH_ART - ART2 title and death splash overlays. */
(function(ns){
  'use strict';

  var TITLE_BG = 'cehp_title_background.title_background';
  var TITLE_LOGO = 'cehp_title_logo.wordmark';

  function searchString(){
    return typeof location !== 'undefined' ? (location.search || '') : '';
  }

  function shouldShowTitle(search){
    if (/[?&]case=/.test(search || '')) return false;
    if (ns.Scenes && ns.Scenes.shouldPreloadPresentationArt) return ns.Scenes.shouldPreloadPresentationArt(search);
    return !/[?&]splash=0/.test(search || '') && !/[?&]thermal=1/.test(search || '');
  }

  function splashKey(name){
    if (!ns.Art || !ns.Art.getKey) return '';
    return ns.Art.getKey('splash', name);
  }

  function textureExists(scene, key){
    return !!(scene && scene.textures && scene.textures.exists && scene.textures.exists(key));
  }

  function setScroll(node){
    if (node && node.setScrollFactor) node.setScrollFactor(0);
    return node;
  }

  function fitImage(scene, key, depth, mode){
    var width = ns.GAME_W || 960;
    var height = ns.GAME_H || 540;
    var texture;
    var source;
    var scale;
    var image;
    if (!textureExists(scene, key) || !scene.add || !scene.add.image) return null;
    image = scene.add.image(width / 2, height / 2, key).setDepth(depth || 1);
    if (image.setOrigin) image.setOrigin(0.5);
    texture = scene.textures && scene.textures.get ? scene.textures.get(key) : null;
    source = texture && texture.getSourceImage ? texture.getSourceImage() : null;
    if (source && source.width && source.height && image.setScale) {
      scale = mode === 'contain'
        ? Math.min(width / source.width, height / source.height)
        : Math.max(width / source.width, height / source.height);
      image.setScale(scale);
    } else if (image.setDisplaySize) {
      image.setDisplaySize(width, height);
    }
    return setScroll(image);
  }

  function addText(scene, x, y, text, size, depth){
    var node;
    if (!scene || !scene.add || !scene.add.text) return null;
    node = scene.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: String(size || 12) + 'px',
      color: '#f7c948',
      align: 'center'
    }).setDepth(depth || 4);
    if (node.setOrigin) node.setOrigin(0.5);
    return setScroll(node);
  }

  function showTitle(scene){
    var width = ns.GAME_W || 960;
    var height = ns.GAME_H || 540;
    var bg = fitImage(scene, splashKey(TITLE_BG), 1, 'cover');
    var logo = fitImage(scene, splashKey(TITLE_LOGO), 3, 'contain');
    if (logo) {
      logo.y = height * 0.36;
      if (logo.setDisplaySize) logo.setDisplaySize(Math.round(width * 0.64), Math.round(width * 0.32));
    }
    if (!bg && scene.add && scene.add.rectangle) {
      setScroll(scene.add.rectangle(width / 2, height / 2, width, height, 0x0b0d12, 1).setDepth(0));
    }
    addText(scene, width / 2, height * 0.72, 'PRESS ANY KEY.', 12, 4);
  }

  function startPlayOnce(scene){
    var started = false;
    function start(){
      if (started) return;
      started = true;
      if (scene.scene && scene.scene.start) scene.scene.start('Play');
    }
    if (scene.input && scene.input.keyboard && scene.input.keyboard.once) scene.input.keyboard.once('keydown', start);
    if (scene.input && scene.input.once) scene.input.once('pointerdown', start);
    return start;
  }

  function destroyNodes(nodes){
    var i;
    for (i = 0; nodes && i < nodes.length; i++) {
      if (nodes[i] && nodes[i].destroy) nodes[i].destroy();
    }
  }

  function showGameOver(scene){
    var width = ns.GAME_W || 960;
    var height = ns.GAME_H || 540;
    var nodes = [];
    var bg;
    var logo;
    if (!scene || scene._cehpGameOverSplash) return;
    if (scene.add && scene.add.rectangle) nodes.push(setScroll(scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.64).setDepth(116)));
    bg = fitImage(scene, splashKey(TITLE_BG), 117, 'cover');
    if (bg) {
      if (bg.setAlpha) bg.setAlpha(0.34);
      nodes.push(bg);
    }
    logo = fitImage(scene, splashKey(TITLE_LOGO), 118, 'contain');
    if (logo) {
      logo.y = height * 0.42;
      if (logo.setDisplaySize) logo.setDisplaySize(Math.round(width * 0.48), Math.round(width * 0.24));
      nodes.push(logo);
    }
    nodes.push(addText(scene, width / 2, height * 0.62, 'RUN ENDED.', 12, 119));
    scene._cehpGameOverSplash = nodes;
  }

  function hideGameOver(scene){
    if (!scene || !scene._cehpGameOverSplash) return;
    destroyNodes(scene._cehpGameOverSplash);
    scene._cehpGameOverSplash = null;
  }

  function sceneClassAt(index, key){
    var list = ns.Scenes && ns.Scenes.list ? ns.Scenes.list() : [];
    var sceneClass = list[index];
    if (sceneClass && sceneClass.prototype && !sceneClass.prototype.sceneKey) sceneClass.prototype.sceneKey = key;
    return sceneClass;
  }

  function patchBoot(){
    var BootScene = sceneClassAt(0, 'Boot');
    var proto = BootScene && BootScene.prototype;
    if (!proto || proto._cehpArt2TitleSplash) return;
    proto.create = function(){
      var search = searchString();
      if (!shouldShowTitle(search)) {
        if (this.scene && this.scene.start) this.scene.start('Play');
        return;
      }
      if (this.cameras && this.cameras.main && this.cameras.main.setBackgroundColor) this.cameras.main.setBackgroundColor('#0b0d12');
      showTitle(this);
      startPlayOnce(this);
    };
    proto._cehpArt2TitleSplash = true;
  }

  function patchPlay(){
    var PlayScene = sceneClassAt(1, 'Play');
    var proto = PlayScene && PlayScene.prototype;
    var originalQueueDeath;
    var originalUpdate;
    if (!proto || proto._cehpArt2GameOverSplash) return;
    originalQueueDeath = proto.queueDeath;
    originalUpdate = proto.update;
    proto.queueDeath = function(){
      var result = originalQueueDeath ? originalQueueDeath.apply(this, arguments) : undefined;
      if (this.pendingDeath) showGameOver(this);
      return result;
    };
    proto.update = function(){
      var result = originalUpdate ? originalUpdate.apply(this, arguments) : undefined;
      if (!this.pendingDeath) hideGameOver(this);
      return result;
    };
    proto._cehpArt2GameOverSplash = true;
  }

  function install(){
    patchBoot();
    patchPlay();
  }

  ns.Splash = {
    splashKey: splashKey,
    showTitle: showTitle,
    showGameOver: showGameOver,
    hideGameOver: hideGameOver,
    install: install
  };
  install();
})(CEHP);
CEHP._register('91_scenes_splash_art');
