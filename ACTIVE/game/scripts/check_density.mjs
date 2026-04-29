#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const GAME_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(GAME_DIR, 'src');
const CAMERA_W = 960;
const LIMIT = 5;

function readSource(file) {
  return fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loadManifests() {
  const sandbox = {
    CEHP: {
      has: function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      },
      _register: function() {}
    }
  };
  const context = vm.createContext(sandbox);
  [
    '70_worlds.js',
    '71_world_orientation.js',
    '72_world_benefits.js',
    '73_world_rasta.js'
  ].forEach(function(file) {
    vm.runInContext(readSource(file), context, { filename: file });
  });
  return context.CEHP.Worlds.MANIFEST;
}

function parseList(raw) {
  return raw.split(',').map(function(part) {
    const value = Number(part.trim());
    if (!Number.isFinite(value)) throw new Error('Non-numeric density value: ' + part);
    return value;
  });
}

function functionBody(source, name) {
  const start = source.indexOf('function ' + name + '(');
  if (start < 0) throw new Error('Missing runtime builder: ' + name);
  const brace = source.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(brace + 1, i);
    }
  }
  throw new Error('Unclosed runtime builder: ' + name);
}

function startMultiplier(expr) {
  const value = expr.trim();
  let match;
  if (value === '0') return 0;
  if (value === 'roomWidth') return 1;
  match = value.match(/^roomWidth\s*\*\s*(\d+)$/);
  if (match) return Number(match[1]);
  throw new Error('Unsupported room start expression: ' + value);
}

function addThreat(out, worldId, roomId, kind, positions) {
  out.push({
    worldId: worldId,
    roomId: roomId,
    kind: kind,
    positions: positions
  });
}

function extractBenefitsThreats(manifest, source) {
  const roomWidthMatch = source.match(/var roomWidth = (\d+);/);
  if (!roomWidthMatch) throw new Error('Benefits roomWidth not found');
  const roomWidth = Number(roomWidthMatch[1]);
  const callPattern = /(build[A-Za-z0-9_]+)\(world,\s*manifest\.rooms\[(\d+)\],\s*([^,]+),\s*roomWidth\);/g;
  const threats = [];
  let call;

  while ((call = callPattern.exec(source))) {
    const builder = call[1];
    const roomIndex = Number(call[2]);
    const room = manifest.benefits.rooms[roomIndex];
    const startX = startMultiplier(call[3]) * roomWidth;
    const body = functionBody(source, builder);
    let match;

    const directHazard = /makeHazard\(world,\s*room,\s*startX\s*\+\s*(\d+)/g;
    while ((match = directHazard.exec(body))) {
      addThreat(threats, 'benefits', room.id, 'hazard', [startX + Number(match[1])]);
    }

    const laneHazards = /addLaneHazards\(world,\s*room,\s*startX,\s*\[([^\]]+)\]\)/g;
    while ((match = laneHazards.exec(body))) {
      const values = parseList(match[1]);
      for (let i = 0; i < values.length; i += 4) {
        addThreat(threats, 'benefits', room.id, 'lane-hazard', [startX + values[i]]);
      }
    }

    const directEnemy = /addEnemy\(world,\s*room,\s*'([^']+)',\s*\{([^}]*)\}\)/g;
    while ((match = directEnemy.exec(body))) {
      const xMatch = match[2].match(/x:\s*startX\s*\+\s*(\d+)/);
      if (!xMatch) throw new Error('Unsupported enemy x expression in ' + builder);
      addThreat(threats, 'benefits', room.id, match[1], [startX + Number(xMatch[1])]);
    }

    const scantronRoute = /addScantronRoute\(world,\s*room,\s*startX,\s*\[([^\]]+)\]\)/g;
    while ((match = scantronRoute.exec(body))) {
      const values = parseList(match[1]);
      const positions = [];
      for (let i = 0; i < values.length; i += 2) positions.push(startX + values[i]);
      addThreat(threats, 'benefits', room.id, 'scantron-route', positions);
    }
  }

  return { roomWidth: roomWidth, threats: threats };
}

function extractOrientationThreats(manifest, source) {
  const roomWidth = 1320;
  const roomIndex = manifest.orientation.rooms.findIndex(function(room) {
    return room.id === 'corrective-handling';
  });
  const bladeCount = (source.match(/Forms\.blade/g) || []).length;
  const threats = [];

  if (bladeCount !== 1) {
    throw new Error('Expected one Orientation blade threat, found ' + bladeCount);
  }
  if (roomIndex < 0) throw new Error('Orientation corrective-handling room missing');
  addThreat(threats, 'orientation', 'corrective-handling', 'blade', [roomIndex * roomWidth + 876]);
  return { roomWidth: roomWidth, threats: threats };
}

function extractRastaThreats(manifest, source) {
  const roomWidthMatch = source.match(/var roomWidth = (\d+);/);
  const roomWidth = roomWidthMatch ? Number(roomWidthMatch[1]) : 1280;
  if (/Enemies\.spawn|addEnemy|makeHazard|Forms\.blade/.test(source)) {
    throw new Error('Rasta runtime contains an unmodeled decision-grade threat');
  }
  return { roomWidth: roomWidth, threats: [] };
}

function visibleThreats(threats, startX) {
  const endX = startX + CAMERA_W;
  return threats.filter(function(threat) {
    return threat.positions.some(function(x) {
      return x >= startX && x <= endX;
    });
  });
}

function maxDensity(worldId, rooms, roomWidth, threats) {
  const worldWidth = roomWidth * rooms.length;
  const maxStart = Math.max(0, worldWidth - CAMERA_W);
  const starts = new Set([0, maxStart]);

  threats.forEach(function(threat) {
    threat.positions.forEach(function(x) {
      starts.add(clamp(x, 0, maxStart));
      starts.add(clamp(x - CAMERA_W, 0, maxStart));
      starts.add(clamp(x - 1, 0, maxStart));
      starts.add(clamp(x - CAMERA_W + 1, 0, maxStart));
    });
  });

  let best = { count: 0, startX: 0, threats: [] };
  Array.from(starts).sort(function(a, b) { return a - b; }).forEach(function(startX) {
    const visible = visibleThreats(threats, startX);
    if (visible.length > best.count) {
      best = { count: visible.length, startX: startX, threats: visible };
    }
  });

  return { worldId: worldId, worldWidth: worldWidth, best: best };
}

function formatThreat(threat) {
  return threat.roomId + ':' + threat.kind + '@' + threat.positions.join('/');
}

const manifests = loadManifests();
const orientation = extractOrientationThreats(manifests, readSource('74_world_orientation_runtime.js'));
const benefits = extractBenefitsThreats(manifests, readSource('75_world_benefits_runtime.js'));
const rasta = extractRastaThreats(manifests, readSource('76_world_rasta_runtime.js'));
const worlds = [
  { id: 'orientation', data: orientation },
  { id: 'benefits', data: benefits },
  { id: 'rasta', data: rasta }
];

let failed = false;
let totalThreats = 0;

console.log('[check_density] viewport ' + CAMERA_W + 'x540, limit ' + LIMIT + ' decision-grade threats');

worlds.forEach(function(entry) {
  const manifest = manifests[entry.id];
  const threats = entry.data.threats;
  const result = maxDensity(entry.id, manifest.rooms, entry.data.roomWidth, threats);
  const visible = result.best.threats.map(formatThreat).join(', ') || 'none';
  totalThreats += threats.length;

  if (result.best.count > LIMIT) {
    failed = true;
    console.error('FAIL ' + entry.id + ' max density ' + result.best.count + '/' + LIMIT +
      ' at x=' + result.best.startX + ': ' + visible);
  } else {
    console.log('PASS ' + entry.id + ' max density ' + result.best.count + '/' + LIMIT +
      ' at x=' + result.best.startX + ': ' + visible);
  }
});

if (failed) {
  console.error('[check_density] FAIL');
  process.exit(1);
}

console.log('[check_density] OK - ' + worlds.length + ' worlds checked, ' + totalThreats + ' threats modeled');
