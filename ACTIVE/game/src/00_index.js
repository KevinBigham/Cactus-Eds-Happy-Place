/* MODULE: 00_INDEX - global CEHP namespace root.
   First concatenated file. Nothing else may declare `var CEHP`. */

var CEHP = CEHP || {};

(function(ns){
  'use strict';

  ns.VERSION  = '0.2.0-rebuild';
  ns.RULESET  = 'R2';
  ns.BUILD_AT = '2026-04-20';

  ns._modules = {};
  ns._register = function(key){ ns._modules[key] = true; };
  ns._loaded   = function(){
    var out = [];
    for (var k in ns._modules) {
      if (Object.prototype.hasOwnProperty.call(ns._modules, k)) out.push(k);
    }
    return out.sort();
  };
})(CEHP);
CEHP._register('00_index');
if (typeof console !== 'undefined') {
  console.log('[CEHP] ' + CEHP.VERSION + ' ' + CEHP.RULESET + ' — counterfeit-educational.org');
}
