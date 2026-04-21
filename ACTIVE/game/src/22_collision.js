/* ================================================================
   MODULE: 22_COLLISION
   Physics contact helpers, one-way platforms, form-as-object
   trigger routing.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  function rectOf(obj){
    if (!obj) return { left:0, right:0, top:0, bottom:0 };
    if (obj.body) {
      return {
        left: obj.body.x,
        right: obj.body.x + obj.body.width,
        top: obj.body.y,
        bottom: obj.body.y + obj.body.height
      };
    }
    return {
      left: obj.x - (obj.width || 0) / 2,
      right: obj.x + (obj.width || 0) / 2,
      top: obj.y - (obj.height || 0) / 2,
      bottom: obj.y + (obj.height || 0) / 2
    };
  }

  function intersects(a, b){
    var ra = rectOf(a);
    var rb = rectOf(b);
    return !(ra.right <= rb.left || ra.left >= rb.right || ra.bottom <= rb.top || ra.top >= rb.bottom);
  }

  ns.Collision = {
    intersects: intersects,
    wallSide: function(body){
      if (!body) return 0;
      if (body.blocked && body.blocked.left) return -1;
      if (body.blocked && body.blocked.right) return 1;
      return 0;
    },
    shouldLandOn: function(actor, platform){
      if (!actor || !actor.body || !platform) return false;
      return actor.body.velocity.y >= 0 && actor.y < platform.y;
    }
  };
})(CEHP);
CEHP._register('22_collision');
