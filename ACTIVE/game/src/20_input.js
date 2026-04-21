/* ================================================================
   MODULE: 20_INPUT
   Keyboard + gamepad abstraction. Exposes justPressed/justReleased.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var current = {};
  var previous = {};
  var bindings = null;
  var boundScene = null;
  var axis = { x: 0, y: 0 };
  var ACTIONS = [
    'left','right','up','down',
    'jump','punch','kick','spinDash','cigCopter','groundSlam','glide',
    'pause','confirm','back',
    'menuUp','menuDown','menuLeft','menuRight'
  ];

  function key(keys, name){
    return !!(keys && keys[name] && keys[name].isDown);
  }

  function button(pad, idx){
    return !!(pad && pad.buttons && pad.buttons[idx] && pad.buttons[idx].pressed);
  }

  function axisValue(pad, idx){
    if (!pad || !pad.axes || !pad.axes[idx]) return 0;
    return pad.axes[idx].getValue();
  }

  function firstPad(scene){
    var pads = scene && scene.input && scene.input.gamepad ? scene.input.gamepad.gamepads : null;
    if (!pads || !pads.length) return null;
    return pads[0];
  }

  function bind(scene){
    if (!scene || !scene.input || !scene.input.keyboard || typeof Phaser === 'undefined') return;
    if (boundScene === scene && bindings) return;

    boundScene = scene;
    bindings = scene.input.keyboard.addKeys({
      LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      UP: Phaser.Input.Keyboard.KeyCodes.UP,
      DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      Z: Phaser.Input.Keyboard.KeyCodes.Z,
      J: Phaser.Input.Keyboard.KeyCodes.J,
      K: Phaser.Input.Keyboard.KeyCodes.K,
      L: Phaser.Input.Keyboard.KeyCodes.L,
      C: Phaser.Input.Keyboard.KeyCodes.C,
      V: Phaser.Input.Keyboard.KeyCodes.V,
      B: Phaser.Input.Keyboard.KeyCodes.B,
      P: Phaser.Input.Keyboard.KeyCodes.P,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
      ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
  }

  function readAction(action){
    var keys = bindings;
    var pad = firstPad(boundScene);
    var lx = axisValue(pad, 0);
    var ly = axisValue(pad, 1);

    switch (action) {
      case 'left': return key(keys, 'LEFT') || key(keys, 'A') || lx < -0.35 || button(pad, 14);
      case 'right': return key(keys, 'RIGHT') || key(keys, 'D') || lx > 0.35 || button(pad, 15);
      case 'up': return key(keys, 'UP') || key(keys, 'W') || ly < -0.35 || button(pad, 12);
      case 'down': return key(keys, 'DOWN') || key(keys, 'S') || ly > 0.35 || button(pad, 13);
      case 'jump': return key(keys, 'SPACE') || key(keys, 'Z') || button(pad, 0);
      case 'punch': return key(keys, 'J') || button(pad, 2);
      case 'kick': return key(keys, 'K') || button(pad, 1);
      case 'spinDash': return key(keys, 'L') || key(keys, 'SHIFT') || button(pad, 3);
      case 'cigCopter': return key(keys, 'C') || button(pad, 4);
      case 'groundSlam': return key(keys, 'V') || button(pad, 5);
      case 'glide': return key(keys, 'B') || button(pad, 7);
      case 'pause': return key(keys, 'ESC') || key(keys, 'P') || button(pad, 9);
      case 'confirm': return key(keys, 'ENTER') || key(keys, 'SPACE') || button(pad, 0);
      case 'back': return key(keys, 'ESC') || button(pad, 1);
      case 'menuUp': return readAction('up');
      case 'menuDown': return readAction('down');
      case 'menuLeft': return readAction('left');
      case 'menuRight': return readAction('right');
      default: return false;
    }
  }

  function update(){
    if (!bindings) return;
    for (var i = 0; i < ACTIONS.length; i++) {
      previous[ACTIONS[i]] = !!current[ACTIONS[i]];
      current[ACTIONS[i]] = !!readAction(ACTIONS[i]);
    }
    axis.x = current.left ? -1 : (current.right ? 1 : 0);
    axis.y = current.up ? -1 : (current.down ? 1 : 0);
  }

  function down(action){ return !!current[action]; }
  function justPressed(action){ return !!current[action] && !previous[action]; }
  function justReleased(action){ return !current[action] && !!previous[action]; }

  ns.Input = {
    state: current,
    bind: bind,
    update: update,
    down: down,
    justPressed: justPressed,
    justReleased: justReleased,
    axisX: function(){ return axis.x; },
    axisY: function(){ return axis.y; }
  };
})(CEHP);
CEHP._register('20_input');
