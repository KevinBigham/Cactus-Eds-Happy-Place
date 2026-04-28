/* MODULE: 81_DOCKET - weekly curated global seed, archived.
   No timer, no streak, no reward. Shared text, not retention. */

(function(ns){
  'use strict';

  var STORAGE_VERSION = 1;

  function now(){
    return ns.Docket && ns.Docket._now ? ns.Docket._now() : new Date();
  }

  function isoDate(date){
    return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1, 2) + '-' + pad(date.getUTCDate(), 2);
  }

  function pad(n, width){
    var out = String(n);
    while (out.length < width) out = '0' + out;
    return out;
  }

  function safeRead(){
    var raw;
    try {
      raw = localStorage.getItem(ns.K.DOCKET_WEEK);
      if (!raw) return { version: STORAGE_VERSION, weeks: [] };
      raw = JSON.parse(raw);
      if (!raw || !raw.weeks || !raw.weeks.push) return { version: STORAGE_VERSION, weeks: [] };
      return raw;
    } catch (err) {
      return { version: STORAGE_VERSION, weeks: [] };
    }
  }

  function safeWrite(payload){
    try {
      localStorage.setItem(ns.K.DOCKET_WEEK, JSON.stringify(payload));
      return true;
    } catch (err) {
      return false;
    }
  }

  function mondayForWeek(year, isoWeek){
    var jan4 = new Date(Date.UTC(year, 0, 4));
    var jan4Day = jan4.getUTCDay();
    if (jan4Day === 0) jan4Day = 7;
    var monday = new Date(jan4.getTime());
    monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1 + ((isoWeek - 1) * 7));
    return new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate()));
  }

  function weekInfo(date){
    var source = date ? new Date(date.getTime ? date.getTime() : date) : now();
    var utc = new Date(Date.UTC(source.getUTCFullYear(), source.getUTCMonth(), source.getUTCDate()));
    var day = utc.getUTCDay();
    if (day === 0) day = 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    var year = utc.getUTCFullYear();
    var yearStart = new Date(Date.UTC(year, 0, 1));
    var isoWeek = Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
    var monday = mondayForWeek(year, isoWeek);
    var sunday = new Date(monday.getTime());
    sunday.setUTCDate(monday.getUTCDate() + 6);
    return {
      year: year,
      isoWeek: isoWeek,
      monday: monday,
      sunday: sunday,
      mondayDate: isoDate(monday),
      sundayDate: isoDate(sunday)
    };
  }

  function axesList(){
    return ['COMPLIANCE', 'INTUITION', 'CURIOSITY', 'GRACE', 'CHAOS', 'EFFICIENCY'];
  }

  function seedForWeek(year, isoWeek){
    var monday = mondayForWeek(year, isoWeek);
    var rng = ns.makeRNG ? ns.makeRNG((isoWeek * 1000) + year) : null;
    var axisChoices = axesList();
    var axis = rng ? axisChoices[rng.int(0, axisChoices.length)] : axisChoices[0];
    return {
      year: year,
      isoWeek: isoWeek,
      mondayDate: isoDate(monday),
      sundayDate: isoDate(new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + 6))),
      seed: ns.CaseSeed ? ns.CaseSeed.make({ date: monday, counter: isoWeek, axis: axis }) : ('CASE-' + axis),
      axis: axis
    };
  }

  function currentWeekSeed(){
    var info = weekInfo(now());
    return seedForWeek(info.year, info.isoWeek).seed;
  }

  function compareWeeks(a, b){
    if (a.year !== b.year) return b.year - a.year;
    return b.isoWeek - a.isoWeek;
  }

  function ensureWeek(archive, year, isoWeek, seed){
    var i;
    var seeded = seedForWeek(year, isoWeek);
    for (i = 0; i < archive.weeks.length; i++) {
      if (archive.weeks[i].year === year && archive.weeks[i].isoWeek === isoWeek) {
        if (!archive.weeks[i].seed) archive.weeks[i].seed = seed || seeded.seed;
        if (!archive.weeks[i].receipts) archive.weeks[i].receipts = [];
        archive.weeks[i].mondayDate = archive.weeks[i].mondayDate || seeded.mondayDate;
        archive.weeks[i].sundayDate = archive.weeks[i].sundayDate || seeded.sundayDate;
        return archive.weeks[i];
      }
    }
    archive.weeks.push({
      year: year,
      isoWeek: isoWeek,
      seed: seed || seeded.seed,
      mondayDate: seeded.mondayDate,
      sundayDate: seeded.sundayDate,
      receipts: []
    });
    archive.weeks.sort(compareWeeks);
    return ensureWeek(archive, year, isoWeek, seed || seeded.seed);
  }

  function receiptKey(entry){
    return [
      entry.seed || '',
      entry.worldId || '',
      (entry.fragmentIds || []).join('|'),
      (entry.lines || []).join('|')
    ].join('::');
  }

  function loadArchive(){
    return safeRead();
  }

  function recordReceipt(entry){
    var archive = safeRead();
    var info;
    var week;
    var existing;
    var i;
    if (!entry || !entry.seed) return archive;
    info = (entry.year && entry.isoWeek) ? {
      year: entry.year,
      isoWeek: entry.isoWeek
    } : weekInfo(entry.ts ? new Date(entry.ts) : now());
    week = ensureWeek(archive, info.year, info.isoWeek, entry.seed);
    for (i = 0; i < week.receipts.length; i++) {
      existing = week.receipts[i];
      if (receiptKey(existing) === receiptKey(entry)) {
        existing.ts = entry.ts || existing.ts || Date.now();
        safeWrite(archive);
        return archive;
      }
    }
    week.receipts.push({
      seed: entry.seed,
      worldId: entry.worldId || 'orientation',
      lines: (entry.lines || []).slice(),
      fragmentIds: (entry.fragmentIds || []).slice(),
      flags: entry.flags || {},
      ts: entry.ts || Date.now()
    });
    week.receipts.sort(function(a, b){
      return (b.ts || 0) - (a.ts || 0);
    });
    safeWrite(archive);
    return archive;
  }

  function createEl(tag, className, text){
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function previewReceipt(seed){
    return {
      seed: seed,
      lines: [
        'THIS WEEK WAS FILED.',
        'THE CASE IS PUBLIC.',
        'LOCAL RECEIPTS REST BELOW.'
      ],
      fragmentIds: ['DOCKET_WEEK', 'PUBLIC_CASE', 'LOCAL_ARCHIVE'],
      tensions: { obedience: 0, style: 0, auditRisk: 0 }
    };
  }

  function renderCard(entry, thermal){
    var receipt = {
      seed: entry.seed,
      lines: entry.lines,
      fragmentIds: entry.fragmentIds,
      tensions: entry.tensions || { obedience: 0, style: 0, auditRisk: 0 },
      flags: entry.flags || {}
    };
    var canvas = ns.ReceiptRender.render(receipt, {
      worldId: entry.worldId || 'orientation',
      thermal: !!thermal,
      width: 360,
      height: 450
    });
    canvas.className = 'receipt-card';
    return canvas;
  }

  function renderWeekSection(root, week, thermal, currentSeed){
    var section = createEl('section', 'docket-week');
    var header = createEl('div', 'docket-week-head');
    var h3 = createEl('h3', '', week.year + ' WEEK ' + pad(week.isoWeek, 2));
    var meta = createEl('p', 'note', week.mondayDate + ' to ' + week.sundayDate + ' · ' + week.seed);
    var link = createEl('a', 'docket-link', 'Open case');
    var grid = createEl('div', 'receipt-grid');
    var summary = createEl('p', 'note', '');
    var preview = renderCard({
      seed: week.seed,
      worldId: 'docket',
      lines: previewReceipt(week.seed).lines,
      fragmentIds: previewReceipt(week.seed).fragmentIds,
      tensions: { obedience: 0, style: 0, auditRisk: 0 }
    }, thermal);
    var i;

    link.href = '?case=' + encodeURIComponent(week.seed);
    if (thermal) link.href += '&thermal=1';

    header.appendChild(h3);
    header.appendChild(meta);
    header.appendChild(link);
    section.appendChild(header);
    section.appendChild(preview);

    if (!week.receipts || !week.receipts.length) {
      summary.textContent = week.seed === currentSeed ? 'NO LOCAL RECEIPTS FILED FOR THIS WEEK.' : 'NO LOCAL RECEIPTS WERE FOUND FOR THIS WEEK.';
      section.appendChild(summary);
      return section;
    }

    summary.textContent = week.receipts.length + ' LOCAL RECEIPT' + (week.receipts.length === 1 ? '' : 'S') + ' ON FILE.';
    section.appendChild(summary);
    for (i = 0; i < week.receipts.length; i++) {
      grid.appendChild(renderCard(week.receipts[i], thermal));
    }
    section.appendChild(grid);
    return section;
  }

  function renderInto(root, search){
    var thermal = ns.Receipts && ns.Receipts.isThermalSearch ? ns.Receipts.isThermalSearch(search) : false;
    var info = weekInfo(now());
    var current = seedForWeek(info.year, info.isoWeek);
    var archive = loadArchive();
    var weeks = archive.weeks ? archive.weeks.slice() : [];
    var i;
    var found = false;

    if (!root || typeof document === 'undefined') return;
    root.innerHTML = '';

    for (i = 0; i < weeks.length; i++) {
      if (weeks[i].year === info.year && weeks[i].isoWeek === info.isoWeek) {
        found = true;
        if (!weeks[i].seed) weeks[i].seed = current.seed;
      }
    }
    if (!found) {
      weeks.unshift({
        year: info.year,
        isoWeek: info.isoWeek,
        seed: current.seed,
        mondayDate: current.mondayDate,
        sundayDate: current.sundayDate,
        receipts: []
      });
    }
    weeks.sort(compareWeeks);

    root.appendChild(createEl('h2', '', 'THE DOCKET'));
    root.appendChild(createEl('p', '', 'PUBLIC RECORD. ONE SHARED WEEKLY CASE. NO TIMER. NO REWARD.'));
    root.appendChild(createEl('p', 'note', 'Current case: ' + current.seed + ' · thermal ' + (thermal ? 'on' : 'off') + '.'));

    for (i = 0; i < weeks.length; i++) {
      root.appendChild(renderWeekSection(root, weeks[i], thermal, current.seed));
    }
  }

  ns.Docket = {
    _now: function(){ return new Date(); },
    weekInfo: weekInfo,
    seedForWeek: seedForWeek,
    currentWeekSeed: currentWeekSeed,
    recordReceipt: recordReceipt,
    loadArchive: loadArchive,
    renderInto: renderInto
  };
})(CEHP);
CEHP._register('81_docket');
