/* MODULE: 05_CASESEED - CASE-YYYYMMDD-NNN-AXIS-R2.
   Deterministic, URL-parseable; one per run. */

(function(ns){
  'use strict';

  var REGEX = /^CASE-(\d{8})-(\d{3})-([A-Z]+)-(R\d+)$/;

  function pad(n, w){
    var s = String(n);
    while (s.length < w) s = '0' + s;
    return s;
  }

  function dateStamp(d){
    d = d || new Date();
    return '' + d.getUTCFullYear() + pad(d.getUTCMonth() + 1, 2) + pad(d.getUTCDate(), 2);
  }

  function make(opts){
    opts = opts || {};
    var d    = opts.date    || new Date();
    var n    = opts.counter != null ? opts.counter : 0;
    var axis = (opts.axis   || 'CURIOSITY').toUpperCase();
    var rs   = opts.ruleset || ns.RULESET || 'R2';
    return 'CASE-' + dateStamp(d) + '-' + pad(n, 3) + '-' + axis + '-' + rs;
  }

  function parse(seedStr){
    if (typeof seedStr !== 'string') return null;
    var m = REGEX.exec(seedStr);
    if (!m) return null;
    return {
      raw:     seedStr,
      date:    m[1],
      counter: parseInt(m[2], 10),
      axis:    m[3],
      ruleset: m[4]
    };
  }

  function isValid(seedStr){ return REGEX.test(seedStr); }

  function fromURL(url){
    url = url || (typeof location !== 'undefined' ? location.search : '');
    var q = url.indexOf('?');
    var query = q >= 0 ? url.slice(q + 1) : url;
    var parts = query.split('&');
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split('=');
      if (kv[0] === 'case') return parse(decodeURIComponent(kv[1] || ''));
    }
    return null;
  }

  ns.CaseSeed = {
    make:    make,
    parse:   parse,
    isValid: isValid,
    fromURL: fromURL,
    REGEX:   REGEX
  };
})(CEHP);
CEHP._register('05_caseseed');
