/* ================================================================
   MODULE: 41_SIGNS
   Canvas-drawn diegetic signage. Ed-voice rule: max 8 words,
   no exclamation marks, deadpan.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function sanitize(text){
    var out = String(text || '').replace(/!/g, '.').trim();
    var words = out.split(/\s+/);
    if (words.length > 8) out = words.slice(0, 8).join(' ');
    return out;
  }

  function place(scene, x, y, text, opts){
    opts = opts || {};
    var clean = sanitize(text);
    var width = opts.width || 104;
    var height = opts.height || 34;
    var paper = scene.add.rectangle(x, y, width, height, opts.paperColor || 0xe8e3d1, 0.96).setDepth(9);
    var label = scene.add.text(x, y, clean, {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#111111',
      align: 'center',
      wordWrap: { width: width - 8 }
    }).setOrigin(0.5).setDepth(10);
    var sensor = scene.add.zone(x, y, width + 20, height + 20);
    scene.physics.add.existing(sensor);
    sensor.body.allowGravity = false;
    sensor.body.moves = false;

    var sign = {
      id: opts.id || ('sign-' + x + '-' + y),
      x: x,
      y: y,
      text: clean,
      paper: paper,
      label: label,
      sensor: sensor,
      hasPeeked: false,
      hasRead: false,
      peek: function(payload){
        if (sign.hasPeeked) return;
        sign.hasPeeked = true;
        if (ns.Events && ns.Events.emit) ns.Events.emit('sign:peek', payload || { signId: sign.id, words: clean.split(/\s+/).length });
      },
      read: function(payload){
        if (sign.hasRead) return;
        sign.hasRead = true;
        if (ns.Events && ns.Events.emit) ns.Events.emit('sign:read', payload || { signId: sign.id, words: clean.split(/\s+/).length });
      },
      updateFromAxes: function(snapshot){
        var chaos = snapshot && snapshot.primary ? snapshot.primary.chaos || 0 : 0;
        sign.label.setRotation((chaos - 0.5) * 0.02);
        sign.paper.setAlpha(0.92 + (chaos * 0.05));
      }
    };

    return sign;
  }

  ns.Signs = {
    sanitize: sanitize,
    place: place
  };
})(CEHP);
CEHP._register('41_signs');
