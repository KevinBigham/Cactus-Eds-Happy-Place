/* MODULE: 83_RECEIPT_RENDER - shared receipt card renderer. */
(function(ns){
  'use strict';

  var BASE_W = 1080;
  var BASE_H = 1350;

  function createCanvas(width, height, factory){
    var canvas;

    if (factory) return factory(width, height);

    if (typeof document !== 'undefined' && document.createElement) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }

    throw new Error('No canvas factory available for receipt rendering.');
  }

  function resolveHeight(width, height){
    if (width && height) return height;
    return Math.round((width || BASE_W) * (BASE_H / BASE_W));
  }

  function scaleFor(canvas){
    return {
      x: canvas.width / BASE_W,
      y: canvas.height / BASE_H
    };
  }

  function scaledFont(scale, size){
    return Math.max(10, Math.round(size * Math.min(scale.x, scale.y)));
  }

  function scaledX(scale, value){
    return Math.round(value * scale.x);
  }

  function scaledY(scale, value){
    return Math.round(value * scale.y);
  }

  function receiptRng(model){
    if (!ns.makeRNG) return null;
    return ns.makeRNG(
      String(model.seed || 'CASE-UNKNOWN') +
      '|' +
      String(model.theme.mode || 'normal') +
      '|receipt-render'
    );
  }

  function wrapLine(context, text, maxWidth){
    var words = String(text || '').split(/\s+/);
    var lines = [];
    var line = '';
    var next;
    var i;

    for (i = 0; i < words.length; i++) {
      next = line ? (line + ' ' + words[i]) : words[i];
      if (line && context.measureText(next).width > maxWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = next;
      }
    }

    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }

  function drawThermalNoise(context, canvas, model, rng){
    var i;
    var y;

    if (!model.thermal) return;

    context.save();
    context.fillStyle = model.theme.band;
    context.globalAlpha = 0.24;

    for (i = 0; i < 18; i++) {
      y = Math.round((canvas.height / 18) * i);
      context.fillRect(0, y, canvas.width, Math.max(2, Math.round(canvas.height / 160)));
    }

    context.globalAlpha = model.theme.noiseAlpha;
    context.strokeStyle = model.theme.ink;

    for (i = 0; i < 110; i++) {
      y = rng ? rng.int(0, canvas.height) : ((i * 13) % canvas.height);
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y + (rng ? rng.int(-2, 3) : 0));
      context.stroke();
    }

    context.restore();
  }

  function crestKeyForWorld(worldId){
    if (worldId === 'orientation') return 'receipt_crest_orientation';
    if (worldId === 'benefits') return 'receipt_crest_benefits';
    if (worldId === 'rasta') return 'receipt_crest_rasta';
    return '';
  }

  function sourceImageForTexture(key){
    var textures = ns._game && ns._game.textures;
    var texture;
    var sourceImage;

    if (!key || !textures || !textures.exists || !textures.get) return null;
    if (!textures.exists(key)) return null;

    texture = textures.get(key);
    if (!texture || !texture.getSourceImage) return null;

    sourceImage = texture.getSourceImage();
    if (!sourceImage || !sourceImage.width || !sourceImage.height) return null;

    return sourceImage;
  }

  function drawWatermarkImage(context, source, x, y, maxWidth, maxHeight, alpha){
    var scale;
    var drawWidth;
    var drawHeight;

    if (!source || !source.width || !source.height || !maxWidth || !maxHeight || !alpha) return;

    scale = Math.min(maxWidth / source.width, maxHeight / source.height);
    drawWidth = Math.round(source.width * scale);
    drawHeight = Math.round(source.height * scale);

    context.save();
    context.globalAlpha = alpha;
    context.drawImage(
      source,
      Math.round(x - (drawWidth / 2)),
      Math.round(y - (drawHeight / 2)),
      drawWidth,
      drawHeight
    );
    context.restore();
  }

  function uiArtKey(name){
    if (!ns.Art || !ns.Art.getKey) return '';
    return ns.Art.getKey('ui', name);
  }

  function drawReceiptFrameAssets(context, canvas, model, scale){
    var frameImage = sourceImageForTexture(uiArtKey(model.thermal ? 'receipt_frame.thermal' : 'receipt_frame.normal'));
    var bandImage = sourceImageForTexture(uiArtKey('fragment_band_decoration.normal'));
    var chipImage = sourceImageForTexture(uiArtKey('case_seed_chip.normal'));

    drawWatermarkImage(
      context,
      frameImage,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width,
      canvas.height,
      model.thermal ? 0.92 : 0.86
    );

    drawWatermarkImage(
      context,
      chipImage,
      scaledX(scale, 734),
      scaledY(scale, 194),
      scaledX(scale, 236),
      scaledY(scale, 118),
      model.thermal ? 0.34 : 0.5
    );

    drawWatermarkImage(
      context,
      bandImage,
      scaledX(scale, 540),
      scaledY(scale, 846),
      scaledX(scale, 858),
      scaledY(scale, 108),
      model.thermal ? 0.28 : 0.42
    );
  }

  function drawWatermarks(context, model, scale){
    var crestKey;
    var crestImage;
    var sealImage;
    var mascotImage;

    if (model.thermal) return;

    crestKey = crestKeyForWorld(model.worldId);
    crestImage = sourceImageForTexture(crestKey);
    sealImage = sourceImageForTexture('receipt_seal');
    mascotImage = sourceImageForTexture('receipt_brand_mascot');

    if (crestKey === 'receipt_crest_rasta') {
      drawWatermarkImage(
        context,
        crestImage,
        scaledX(scale, 540),
        scaledY(scale, 500),
        scaledX(scale, 640),
        scaledY(scale, 280),
        0.12
      );
    } else {
      drawWatermarkImage(
        context,
        crestImage,
        scaledX(scale, 540),
        scaledY(scale, 504),
        scaledX(scale, 560),
        scaledY(scale, 560),
        crestKey === 'receipt_crest_orientation' ? 0.11 : 0.10
      );
    }

    drawWatermarkImage(
      context,
      sealImage,
      scaledX(scale, 540),
      scaledY(scale, 1088),
      scaledX(scale, 300),
      scaledY(scale, 300),
      0.10
    );

    drawWatermarkImage(
      context,
      mascotImage,
      scaledX(scale, 83),
      scaledY(scale, 132),
      scaledX(scale, 54),
      scaledY(scale, 80),
      0.92
    );
  }

  function drawReceipt(context, canvas, model){
    var scale = scaleFor(canvas);
    var rng = receiptRng(model);
    var maxWidth = canvas.width - scaledX(scale, 236);
    var textLines = model.lines && model.lines.length
      ? model.lines
      : ['FILE NOT FOUND.', 'THE RECEIPT REMAINED BLANK.', 'RETURN WITH A CASE.'];
    var wrappedLines;
    var footerLines;
    var lineY;
    var lineJitter;
    var footerY;
    var i;
    var j;

    context.fillStyle = model.theme.paper;
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawThermalNoise(context, canvas, model, rng);

    context.fillStyle = model.theme.frame;
    context.fillRect(
      scaledX(scale, 44),
      scaledY(scale, 44),
      canvas.width - scaledX(scale, 88),
      canvas.height - scaledY(scale, 88)
    );

    context.fillStyle = model.theme.panel;
    context.fillRect(
      scaledX(scale, 72),
      scaledY(scale, 72),
      canvas.width - scaledX(scale, 144),
      canvas.height - scaledY(scale, 144)
    );

    drawWatermarks(context, model, scale);
    drawReceiptFrameAssets(context, canvas, model, scale);

    context.fillStyle = model.theme.shadow;
    context.fillRect(
      scaledX(scale, 94),
      scaledY(scale, 232),
      canvas.width - scaledX(scale, 188),
      scaledY(scale, 6)
    );

    context.fillStyle = model.theme.ink;
    context.font = 'bold ' + scaledFont(scale, 34) + 'px monospace';
    context.fillText('COUNTERFEIT EDUCATIONAL', scaledX(scale, 118), scaledY(scale, 156));

    context.fillStyle = model.theme.subInk;
    context.font = scaledFont(scale, 22) + 'px monospace';
    context.fillText(model.seed, scaledX(scale, 118), scaledY(scale, 204));

    context.fillStyle = model.theme.ink;
    context.font = 'bold ' + scaledFont(scale, 58) + 'px monospace';
    lineY = scaledY(scale, 344);

    for (i = 0; i < textLines.length; i++) {
      wrappedLines = wrapLine(context, textLines[i], maxWidth);

      for (j = 0; j < wrappedLines.length; j++) {
        lineJitter = model.thermal && rng
          ? rng.int(-model.theme.jitter, model.theme.jitter + 1)
          : 0;
        context.fillText(
          wrappedLines[j],
          scaledX(scale, 118),
          lineY + scaledY(scale, 84 * j) + lineJitter
        );
      }

      lineY += scaledY(scale, 120) + scaledY(scale, 82 * (wrappedLines.length - 1));
    }

    context.fillStyle = model.theme.subInk;
    context.font = scaledFont(scale, 26) + 'px monospace';
    context.fillText(model.worldLabel, scaledX(scale, 118), scaledY(scale, 708));

    wrappedLines = wrapLine(context, 'PLAY ' + model.playUrl, maxWidth);
    lineY = scaledY(scale, 756);

    for (i = 0; i < wrappedLines.length; i++) {
      context.fillText(wrappedLines[i], scaledX(scale, 118), lineY);
      lineY += scaledY(scale, 34);
    }

    context.fillStyle = model.theme.divider;
    context.fillRect(
      scaledX(scale, 118),
      scaledY(scale, 836),
      scaledX(scale, 844),
      Math.max(2, scaledY(scale, 2))
    );

    context.fillStyle = model.theme.subInk;
    context.font = scaledFont(scale, 24) + 'px monospace';
    context.fillText('FRAGMENTS ' + (model.fragmentIds || []).join(' / '), scaledX(scale, 118), scaledY(scale, 904));
    context.fillText('OBEDIENCE ' + Number(model.tensions.obedience || 0).toFixed(2), scaledX(scale, 118), scaledY(scale, 956));
    context.fillText('STYLE ' + Number(model.tensions.style || 0).toFixed(2), scaledX(scale, 118), scaledY(scale, 1006));
    context.fillText('AUDIT ' + Number(model.tensions.auditRisk || 0).toFixed(2), scaledX(scale, 118), scaledY(scale, 1056));

    context.fillStyle = model.theme.ink;
    context.font = 'bold ' + scaledFont(scale, 28) + 'px monospace';
    footerLines = wrapLine(context, model.footer, maxWidth);
    footerY = scaledY(scale, 1178);

    for (i = 0; i < footerLines.length; i++) {
      context.fillText(footerLines[i], scaledX(scale, 118), footerY);
      footerY += scaledY(scale, 34);
    }
  }

  function cardModel(receipt, options){
    if (receipt && receipt.theme && receipt.lines && receipt.seed) return receipt;

    if (!ns.Receipts || !ns.Receipts.cardModel) {
      throw new Error('Receipt card helpers unavailable.');
    }

    return ns.Receipts.cardModel(receipt, options || {});
  }

  function render(receipt, options){
    var opts = options || {};
    var width = opts.width || BASE_W;
    var height = resolveHeight(width, opts.height);
    var canvas = createCanvas(width, height, opts.createCanvas || null);
    var context = canvas.getContext('2d');
    var model = cardModel(receipt, opts);

    drawReceipt(context, canvas, model);
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
