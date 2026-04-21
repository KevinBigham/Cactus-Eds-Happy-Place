/* ================================================================
   MODULE: 83_RECEIPT_RENDER
   Shared receipt card renderer for Phaser, plain HTML, and Discord.
   Presentation only — receipt text and fragment selection stay in
   80_receipts.js so thermal mode cannot change verdict content.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  var BASE_W = 1080;
  var BASE_H = 1350;

  function makeCanvas(width, height, createCanvas){
    var canvas;
    if (createCanvas) return createCanvas(width, height);
    if (typeof document !== 'undefined' && document.createElement) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
    throw new Error('No canvas factory available for receipt rendering.');
  }

  function fitHeight(width, height){
    if (width && height) return height;
    return Math.round((width || BASE_W) * (BASE_H / BASE_W));
  }

  function scaleFor(canvas){
    return {
      x: canvas.width / BASE_W,
      y: canvas.height / BASE_H
    };
  }

  function fontPx(scales, size){
    return Math.max(10, Math.round(size * Math.min(scales.x, scales.y)));
  }

  function px(scales, value){
    return Math.round(value * scales.x);
  }

  function py(scales, value){
    return Math.round(value * scales.y);
  }

  function rngFor(model){
    if (!ns.makeRNG) return null;
    return ns.makeRNG(String(model.seed || 'CASE-UNKNOWN') + '|' + String(model.theme.mode || 'normal') + '|receipt-render');
  }

  function wrapLines(ctx, text, maxWidth){
    var words = String(text || '').split(/\s+/);
    var lines = [];
    var line = '';
    var next;
    var i;
    for (i = 0; i < words.length; i++) {
      next = line ? (line + ' ' + words[i]) : words[i];
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function drawBanding(ctx, canvas, model, rng){
    var i;
    var y;
    if (!model.thermal) return;
    ctx.save();
    ctx.fillStyle = model.theme.band;
    ctx.globalAlpha = 0.24;
    for (i = 0; i < 18; i++) {
      y = Math.round((canvas.height / 18) * i);
      ctx.fillRect(0, y, canvas.width, Math.max(2, Math.round(canvas.height / 160)));
    }
    ctx.globalAlpha = model.theme.noiseAlpha;
    ctx.strokeStyle = model.theme.ink;
    for (i = 0; i < 110; i++) {
      y = rng ? (rng.int(0, canvas.height)) : ((i * 13) % canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y + ((rng ? rng.int(-2, 3) : 0)));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawReceipt(ctx, canvas, model){
    var scales = scaleFor(canvas);
    var rng = rngFor(model);
    var maxWidth = canvas.width - px(scales, 236);
    var titleLines;
    var i;
    var j;
    var y;
    var blocks;
    var lineY;
    var lineJitter;
    var subline;

    ctx.fillStyle = model.theme.paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBanding(ctx, canvas, model, rng);

    ctx.fillStyle = model.theme.frame;
    ctx.fillRect(px(scales, 44), py(scales, 44), canvas.width - px(scales, 88), canvas.height - py(scales, 88));

    ctx.fillStyle = model.theme.panel;
    ctx.fillRect(px(scales, 72), py(scales, 72), canvas.width - px(scales, 144), canvas.height - py(scales, 144));

    ctx.fillStyle = model.theme.shadow;
    ctx.fillRect(px(scales, 94), py(scales, 232), canvas.width - px(scales, 188), py(scales, 6));

    ctx.fillStyle = model.theme.ink;
    ctx.font = 'bold ' + fontPx(scales, 34) + 'px monospace';
    ctx.fillText('COUNTERFEIT EDUCATIONAL', px(scales, 118), py(scales, 156));

    ctx.fillStyle = model.theme.subInk;
    ctx.font = fontPx(scales, 22) + 'px monospace';
    ctx.fillText(model.seed, px(scales, 118), py(scales, 204));

    ctx.fillStyle = model.theme.ink;
    ctx.font = 'bold ' + fontPx(scales, 58) + 'px monospace';
    y = py(scales, 344);
    titleLines = model.lines && model.lines.length ? model.lines : ['FILE NOT FOUND.', 'THE RECEIPT REMAINED BLANK.', 'RETURN WITH A CASE.'];
    for (i = 0; i < titleLines.length; i++) {
      blocks = wrapLines(ctx, titleLines[i], maxWidth);
      for (j = 0; j < blocks.length; j++) {
        lineJitter = model.thermal && rng ? rng.int(-model.theme.jitter, model.theme.jitter + 1) : 0;
        ctx.fillText(blocks[j], px(scales, 118), y + py(scales, 84 * j) + lineJitter);
      }
      y += py(scales, 120) + py(scales, 82 * (blocks.length - 1));
    }

    ctx.fillStyle = model.theme.subInk;
    ctx.font = fontPx(scales, 26) + 'px monospace';
    ctx.fillText(model.worldLabel, px(scales, 118), py(scales, 708));
    subline = wrapLines(ctx, 'PLAY ' + model.playUrl, maxWidth);
    lineY = py(scales, 756);
    for (i = 0; i < subline.length; i++) {
      ctx.fillText(subline[i], px(scales, 118), lineY);
      lineY += py(scales, 34);
    }

    ctx.fillStyle = model.theme.divider;
    ctx.fillRect(px(scales, 118), py(scales, 836), px(scales, 844), Math.max(2, py(scales, 2)));

    ctx.fillStyle = model.theme.subInk;
    ctx.font = fontPx(scales, 24) + 'px monospace';
    ctx.fillText('FRAGMENTS ' + (model.fragmentIds || []).join(' / '), px(scales, 118), py(scales, 904));
    ctx.fillText('OBEDIENCE ' + Number(model.tensions.obedience || 0).toFixed(2), px(scales, 118), py(scales, 956));
    ctx.fillText('STYLE ' + Number(model.tensions.style || 0).toFixed(2), px(scales, 118), py(scales, 1006));
    ctx.fillText('AUDIT ' + Number(model.tensions.auditRisk || 0).toFixed(2), px(scales, 118), py(scales, 1056));

    ctx.fillStyle = model.theme.ink;
    ctx.font = 'bold ' + fontPx(scales, 28) + 'px monospace';
    subline = wrapLines(ctx, model.footer, maxWidth);
    lineY = py(scales, 1178);
    for (i = 0; i < subline.length; i++) {
      ctx.fillText(subline[i], px(scales, 118), lineY);
      lineY += py(scales, 34);
    }
  }

  function ensureCardModel(receipt, opts){
    if (receipt && receipt.theme && receipt.lines && receipt.seed) return receipt;
    if (!ns.Receipts || !ns.Receipts.cardModel) {
      throw new Error('Receipt card helpers unavailable.');
    }
    return ns.Receipts.cardModel(receipt, opts || {});
  }

  function render(receipt, opts){
    opts = opts || {};
    var width = opts.width || BASE_W;
    var height = opts.height || fitHeight(width, opts.height);
    var canvas = makeCanvas(width, height, opts.createCanvas || null);
    var ctx = canvas.getContext('2d');
    var model = ensureCardModel(receipt, opts);
    drawReceipt(ctx, canvas, model);
    return canvas;
  }

  ns.ReceiptRender = {
    BASE_W: BASE_W,
    BASE_H: BASE_H,
    render: render,
    drawReceipt: drawReceipt
  };
})(CEHP);
CEHP._register('83_receipt_render');
