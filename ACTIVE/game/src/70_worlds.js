/* MODULE: 70_WORLDS - world manifest container.
   Each world module registers under CEHP.Worlds.MANIFEST.<id>
   with palette, signs, closers, overrides. */

(function(ns){
  'use strict';

  ns.Worlds = ns.Worlds || {};
  ns.Worlds.MANIFEST = ns.Worlds.MANIFEST || {};
  ns.Worlds.get  = function(id){ return ns.Worlds.MANIFEST[id] || null; };
  ns.Worlds.list = function(){
    var out = [];
    for (var k in ns.Worlds.MANIFEST) {
      if (Object.prototype.hasOwnProperty.call(ns.Worlds.MANIFEST, k)) out.push(k);
    }
    return out;
  };
})(CEHP);
CEHP._register('70_worlds');
