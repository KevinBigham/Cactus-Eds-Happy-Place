/* MODULE: 66A_POST_BOSS_ART - ART2 manifest sprites for W15 mini-bosses. */
(function(ns){
  'use strict';

  var SUBJECTS = {
    supervisor: 'supervisor',
    enrollment: 'enrollment_officer',
    logistics: 'logistics_foreman'
  };

  var SPAWNERS = [
    'spawnSupervisor',
    'spawnEnrollment',
    'spawnLogistics'
  ];

  function subjectFor(id){
    return SUBJECTS[id] || '';
  }

  function artKeyFor(id, state){
    var subject = subjectFor(id);
    if (!subject || !ns.Art || !ns.Art.getKey) return '';
    return ns.Art.getKey('bosses', subject + '.' + state);
  }

  function artStateFor(boss, snapshot){
    if (boss && boss.defeated) return 'defeated';
    if (snapshot && snapshot.defeated) return 'defeated';
    if (snapshot && (snapshot.state === 'telegraph' || snapshot.state === 'strike')) return 'telegraph';
    return 'idle';
  }

  function textureExists(boss, key){
    return !!(boss && boss.scene && boss.scene.textures && boss.scene.textures.exists && boss.scene.textures.exists(key));
  }

  function applyArtSprite(boss, snapshot){
    var state;
    var key;
    var w;
    var h;
    if (!boss || !boss.sprite) return false;
    state = artStateFor(boss, snapshot);
    key = artKeyFor(boss.id, state);
    if (!key || !textureExists(boss, key)) return false;
    if (boss._cehpArt2BossKey !== key && boss.sprite.setTexture) {
      w = boss.sprite.displayWidth || boss.sprite.width || boss._cehpArt2BossW || 92;
      h = boss.sprite.displayHeight || boss.sprite.height || boss._cehpArt2BossH || 118;
      boss.sprite.setTexture(key);
      if (boss.sprite.setDisplaySize) boss.sprite.setDisplaySize(w, h);
      boss._cehpArt2BossKey = key;
      boss._cehpArt2BossW = w;
      boss._cehpArt2BossH = h;
   }
    return true;
  }

  function wrapBoss(boss){
    var originalUpdate;
    var originalDefeat;
    if (!boss || boss._cehpArt2BossWrapped) return boss;
    boss._cehpArt2BossWrapped = true;
    applyArtSprite(boss, boss.snapshot && boss.snapshot());

    originalUpdate = boss.update;
    if (originalUpdate) {
      boss.update = function(dt){
        var snapshot = originalUpdate.apply(boss, arguments);
        applyArtSprite(boss, snapshot);
        return snapshot;
      };
   }

    originalDefeat = boss.defeat;
    if (originalDefeat) {
      boss.defeat = function(reason){
        var snapshot = originalDefeat.apply(boss, arguments);
        applyArtSprite(boss, snapshot);
        return snapshot;
      };
   }
    return boss;
  }

  function wrapSpawner(name){
    var original;
    if (!ns.bosses || !ns.bosses[name] || ns.bosses[name]._cehpArt2Wrapped) return;
    original = ns.bosses[name];
    ns.bosses[name] = function(){
      return wrapBoss(original.apply(this, arguments));
    };
    ns.bosses[name]._cehpArt2Wrapped = true;
  }

  function install(){
    var i;
    ns.bosses = ns.bosses || {};
    ns.bosses.artKeyFor = artKeyFor;
    ns.bosses.applyArtSprite = applyArtSprite;
    ns.bosses.wrapArtBoss = wrapBoss;
    for (i = 0; i < SPAWNERS.length; i++) wrapSpawner(SPAWNERS[i]);
  }

  install();
})(CEHP);
CEHP._register('66A_post_boss_art');
