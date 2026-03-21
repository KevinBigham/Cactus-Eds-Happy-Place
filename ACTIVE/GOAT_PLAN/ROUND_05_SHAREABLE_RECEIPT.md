# ROUND 05 — SHAREABLE RECEIPT CARD

> **Goal**: Turn every player into a marketer for the game
> **Prerequisite**: Round 03 (Receipt 2.0), Round 04 (Behavioral Score, Archetype Title)
> **Est. Effort**: 2-3 days

---

## Context for Builder

The receipt system is now the game's killer feature — infinite procedural text, archetype titles, behavioral scores, near-miss callouts. But this content dies in private. This round packages the receipt as a shareable artifact, turning it into the Wordle grid / Spotify Wrapped of indie games. Every shared receipt is an advertisement that doesn't feel like an advertisement.

---

## Deliverables

### 1. Canvas Receipt Card Renderer

After the receipt stamp animation, a **"PRINT RECEIPT"** button appears. Pressing it generates a clean, shareable image:

**Card layout (1080x1080 for social feed posts):**
```
┌─────────────────────────────────────────┐
│                                         │
│  CACTUS ED'S HAPPIEST PLACE             │
│  ─── BEHAVIORAL ASSESSMENT ───          │
│                                         │
│  WORLD 2: SUNLUSH LEARNING PRESERVE    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │   CLASSIFICATION:               │    │
│  │   THE DEVIANT                   │    │
│  │   [S]                           │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│     [6-AXIS RADAR CHART]               │
│     compliance / intuition / curiosity  │
│     grace / chaos / efficiency          │
│                                         │
│  ─────────────────────────────────────  │
│  "YOUR VIOLENCE HAS BEEN RECLASSIFIED  │
│   AS INITIATIVE. THE INSTITUTION        │
│   THANKS YOU FOR YOUR ENTHUSIASM."      │
│  ─────────────────────────────────────  │
│                                         │
│  INCIDENTS: 47 | STAMPS: 3/4           │
│  CLEARANCE: 2  | ENROLLMENT: #14       │
│                                         │
│  ─────────────────────────────────────  │
│  PRE-ENROLL NOW: [game URL]            │
│                                         │
└─────────────────────────────────────────┘
```

**Visual style:**
- Background: Off-white / cream (like institutional paper)
- Font: Monospace / institutional serif
- Accent color: Dark institutional blue/grey
- Red "PROCESSED" stamp overlaid at slight angle
- 6-axis radar chart rendered on an off-canvas, composited in
- SNES pixel-art aesthetic maintained in chart rendering

**Implementation:**
```javascript
// Create off-screen canvas
var shareCanvas = document.createElement('canvas');
shareCanvas.width = 1080;
shareCanvas.height = 1080;
var shareCtx = shareCanvas.getContext('2d');

// Draw receipt card layout...
// (header, classification, radar chart, quote, stats, URL)

// Generate downloadable image
var dataURL = shareCanvas.toDataURL('image/png');
```

### 2. Six-Axis Radar Chart

Draw a hexagonal radar chart showing the player's behavioral profile:

**Axes** (clockwise from top):
1. Compliance (top)
2. Intuition (top-right)
3. Curiosity (bottom-right)
4. Chaos (bottom)
5. Grace (bottom-left)
6. Efficiency (top-left)

**Rendering:**
- Draw hexagonal grid lines at 25%, 50%, 75%, 100%
- Fill the player's profile polygon with semi-transparent institutional blue
- Label each axis with abbreviated names
- Each axis value normalized to 0-100

**Size**: ~300x300 pixels on the 1080x1080 card

### 3. Share / Download Actions

Three sharing methods (all client-side, no server needed):

**"DOWNLOAD RECEIPT" button:**
- Creates a download link with `canvas.toDataURL('image/png')`
- Filename: `cactus_ed_receipt_[archetype]_[date].png`

**"COPY RECEIPT" button:**
- Copies a text-only version to clipboard using `navigator.clipboard.writeText()`
- Text format:
```
CACTUS ED'S HAPPIEST PLACE
═══════════════════════════
BEHAVIORAL ASSESSMENT
World 2: Sunlush Learning Preserve

CLASSIFICATION: THE DEVIANT [S]

⬛🟥🟥🟥🟥⬛  (behavioral bar chart using emoji blocks)

"YOUR VIOLENCE HAS BEEN RECLASSIFIED
 AS INITIATIVE."

INCIDENTS: 47 | STAMPS: 3/4
────────────────────────────
PRE-ENROLL NOW: [game URL]
```

**"SHARE" button (mobile):**
- Uses `navigator.share()` API if available
- Falls back to download if not supported
- Shares the PNG image with text

### 4. Behavioral Emoji Bar

For platforms that prefer text over images, generate a compact 6-character behavioral code using emoji blocks:

| Axis Intensity | Emoji |
|---|---|
| 0-20% | ⬜ (white) |
| 21-40% | 🟨 (yellow) |
| 41-60% | 🟧 (orange) |
| 61-80% | 🟥 (red) |
| 81-100% | 🟪 (purple) |

**Example**: `⬜🟧🟨🟪🟥⬜` = Low compliance, moderate intuition, mild curiosity, very high chaos, high grace, low efficiency

Include this in the clipboard text version. Players can paste it like a Wordle grid.

### 5. Story-Format Card (Optional Vertical)

Also generate a 1080x1920 vertical card for Instagram/TikTok stories:

- Same content as square card but laid out vertically
- Larger archetype title
- Radar chart centered
- Quote text larger and more prominent
- Game URL + "PRE-ENROLL NOW" at bottom

Toggle between square and vertical via a small format selector on the share screen.

---

## Testing Checklist

- [ ] "PRINT RECEIPT" button appears after receipt stamp animation
- [ ] Square card (1080x1080) renders correctly with all elements
- [ ] Radar chart accurately reflects 6-axis behavioral data
- [ ] Archetype title and score appear on card
- [ ] Best receipt quote is selected and displayed
- [ ] "DOWNLOAD" saves a PNG file with correct filename
- [ ] "COPY" copies formatted text to clipboard
- [ ] Text version includes emoji bar chart
- [ ] "SHARE" uses navigator.share() on mobile
- [ ] Share falls back to download when share API unavailable
- [ ] Vertical card (1080x1920) renders correctly
- [ ] Game URL appears on all card formats
- [ ] Cards look good when actually posted to Discord/Twitter
- [ ] Save contract preserved

---

## What This Unlocks

After this round, the game markets itself. Every receipt card shared on Discord, Twitter, or Instagram is a personality quiz result that says "find out what YOUR classification is." The URL on every card is a zero-friction invitation — it's a browser game, one click and you're playing. This is the viral engine.
