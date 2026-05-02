# ART_ATTRIBUTION — CEHP Art Generator, License, and Credit Policy

> **Authority**: This document is the source of truth for CEHP art generator choice, license stance, and credit/attribution policy.
> **Created**: 2026-05-02
> **Approval payload**: `APPROVE_AND_EXECUTE_MAD_DASH_CEHP_ART_ATTRIBUTION_POLICY_001 v1.0.0` (Kevin-authored, 2026-05-02)
> **Packet**: `_studio/tasks/mad-dash/MAD_DASH_CEHP_ART_ATTRIBUTION_POLICY_001.json` v1.0.0

---

## 1. Purpose

This document is the single source of truth for three policy questions that govern CEHP art generation:

1. Which generator(s) are approved for producing real-art swap-in PNGs.
2. How those assets are attributed (and whether attribution is per-asset or global).
3. What license terms the resulting art is released under in the public CEHP repo (`KevinBigham/Cactus-Eds-Happy-Place`, served at `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`).

It exists to close the §6 / risk #2 open question raised by `MAD_DASH_CEHP_W15_ART_BOARD_001` (the W15 art board executor flagged that real-art swap-ins could not proceed safely without a settled attribution and license stance; the reviewer acknowledged this as issue #3, severity: note). This doc closes that question so future per-asset swap-in packets can be authored against settled policy rather than improvising per asset.

This doc applies to the 37 placeholder PNGs currently shipped under `ACTIVE/game/assets/art/` and to any subsequent real-art swap-ins authored under the `W15M-ART-SWAP` commit pattern.

---

## 2. Generator choice

**Verbatim from approval payload (`art_attribution_decisions.generator_choice`):**

> Primary: OpenAI image generation (gpt-image-1, accessed via ChatGPT or Codex CLI surfaces) when ChatGPT/Codex credits are available. Fallback: Google NanoBanana (Gemini image generation). The implementation-time agent decides which is in-budget at the moment of asset creation. NO OTHER GENERATOR IS APPROVED BY THIS PAYLOAD — Stable Diffusion, Midjourney, Firefly, hand commission, etc., all require a separate Kevin approval before use.

**Operational reading.** The currently-approved generator list is exactly two entries: `gpt-image-1` (OpenAI image generation) and `gemini-nano-banana` (Google NanoBanana). Implementation-time agents may choose between these two based on budget at the moment of asset creation; no per-asset Kevin approval is required to choose between them. Any other tool (Stable Diffusion / SDXL, Midjourney, Firefly, hand commission, AI base + human paintover, etc.) is NOT approved by this policy and requires a separate Kevin approval payload before use.

---

## 3. Attribution model

**Verbatim from approval payload (`art_attribution_decisions.attribution_model`):**

> Model name only. Each generated asset records the model it came from (e.g., 'gpt-image-1' or 'gemini-nano-banana'). NO prompt is recorded, NO seed is recorded, NO additional generator metadata is required.

**Where the credit appears.** Per §5 (Public visibility) and §6 (Per-asset attribution), the credit surface is the in-game splash screen, sourced from `ACTIVE/game/assets/art/art_manifest.json`. The credit value recorded per asset is the model name string only.

---

## 4. License stance

**Verbatim from approval payload (`art_attribution_decisions.license_stance`):**

> Commercial. Self-hosted SDXL preferred where it can replace either of the named generators at zero per-asset variable cost. Paid subscription (e.g., ChatGPT Plus) acceptable as a practical fallback if self-hosting is infeasible at the time of asset creation. Pre-scale, free routes are preferred. Art carries the existing CEHP repo license unless a generator's terms force a stricter per-asset clause, in which case the policy doc records the exception per asset.

**How this interacts with the existing repo license.** Art carries the existing CEHP repo license by default. The policy reserves a per-asset escape hatch: if a generator's terms force a stricter clause for a specific PNG, the per-asset packet that introduces that PNG must record the exception in this doc (a new "License exceptions" subsection appended at revision time).

**Public-GitHub-Pages distribution context.** CEHP is deployed publicly at `https://kevinbigham.github.io/Cactus-Eds-Happy-Place/`. All approved generators must permit redistribution of the resulting art as part of a publicly-served browser game. If a generator's terms ever conflict with public Pages distribution, the asset must NOT be committed and a separate Kevin approval is required before swap-in.

**Generator-list reconciliation.** This stanza expresses a forward-looking cost preference (self-hosted SDXL would be preferred for cost if it were approved); it does NOT add SDXL to the approved generator list. §2 is the authoritative current generator list. SDXL adoption requires a separate Kevin approval payload that explicitly extends §2.

---

## 5. Public visibility of credit

**Verbatim from approval payload (`art_attribution_decisions.whether_credit_is_publicly_visible`):**

> true. Credit appears on the in-game splash screen rendered at game launch. The splash credits are sourced from CEHP/ACTIVE/game/assets/art/art_manifest.json (see whether_per_asset_attribution_is_required) so credits and assets cannot drift out of sync.

**Yes / No: YES.** Credit is publicly visible.

**Surface(s) where credit appears:**

- In-game splash screen rendered at game launch (the only authoritative public credit surface).

**Surfaces explicitly NOT used as credit channels:**

- Repo `README.md` does not need to carry per-asset credit.
- Repo `NOTICE` file is not required.
- Per-PR commit-message credit lines are not required.
- PNG embedded metadata is not required.
- `.prompt.md` sidecar files do not need a credit line (they remain the per-asset prompt log; credit lives in the manifest).

The single splash-screen-from-manifest design is intentional: it prevents credits and assets from drifting out of sync.

---

## 6. Per-asset attribution requirement

**Verbatim from approval payload (`art_attribution_decisions.whether_per_asset_attribution_is_required`):**

> true. CEHP/ACTIVE/game/assets/art/art_manifest.json carries one entry per art asset with at minimum the fields { file, generator, date_added }. The in-game splash credits screen is rendered from this manifest at build time. PNG metadata, sidecar JSON, and per-PR credit lines are NOT required — the manifest is the single source of truth for per-asset attribution.

**Yes / No: YES.** Per-asset attribution is required.

**Operational implication for the W15M-ART-SWAP commit pattern.**

- Each per-asset swap-in packet MUST extend `art_manifest.json` so the swapped asset has an entry with at minimum `{ file, generator, date_added }`. `generator` carries the model name string (`gpt-image-1` or `gemini-nano-banana`) per §3.
- The W15M-ART-SWAP commit message itself does NOT need a credit line — the manifest entry is the credit-of-record.
- `.prompt.md` sidecar files do NOT need a credit line — those remain the per-asset prompt log; the manifest is authoritative for credit.
- PNG embedded metadata is NOT required.
- The splash-screen renderer (which reads the manifest at build time) is NOT wired up by this policy — that is a separate runtime change owned by a future per-runtime packet. Until the renderer ships, the manifest entries accumulate; they become publicly visible the moment the renderer ships.

---

## 7. Operational hooks for future per-asset swap-in packets

Future per-asset swap-in packets (W15M-ART-SWAP series) MUST conform to these hooks. Any deviation requires a new approval payload that explicitly supersedes this doc.

- **Generator restriction** — Each per-asset packet must name the generator used for the swap, and that generator MUST be one of `gpt-image-1` or `gemini-nano-banana` (see §2). If the agent wants to use any other tool, the packet must SAFE_NOOP_HALT and request a separate Kevin approval.
- **Manifest mutation is required** — The per-asset packet's allowed_paths must include `ACTIVE/game/assets/art/art_manifest.json` so the agent can extend it with the new asset's `{ file, generator, date_added }` entry. A swap that does NOT extend the manifest is incomplete and must be rejected at review time.
- **Manifest schema is fixed at minimum** — The required keys are exactly `file`, `generator`, `date_added`. Adding additional keys (prompt, seed, license override, etc.) is a separate decision; the per-asset packet that wants to extend the schema must reference a separate Kevin-authored schema-extension approval and cite it here.
- **No prompt/seed recording** — Per §3, per-asset packets must NOT add a `prompt` or `seed` field to the manifest entry. The `.prompt.md` sidecar continues to be the per-asset prompt log surface (no change).
- **Credit lives in the manifest only** — Per §5 and §6, per-asset packets do NOT need to add a credit line to README, NOTICE, the commit message, the PR body, or the PNG's metadata. The manifest entry is the authoritative credit-of-record.
- **License default applies unless the generator forces a stricter clause** — Per §4, the asset takes the existing CEHP repo license by default. If the generator's terms-of-service force a stricter per-asset clause for a specific PNG, the per-asset packet must (a) record the exception in this doc under a new "License exceptions" subsection appended at revision time, AND (b) flag the exception in its execution report so the reviewer can confirm the public-Pages distribution remains compatible.
- **Splash renderer is out of scope for swap-in packets** — Per-asset swap-ins do NOT wire the splash credits screen. That renderer is a future runtime packet. Per-asset packets only mutate the manifest; the renderer reads it later.

---

## 8. Open questions / future revisions

The approval payload settled the five required policy questions. Items deferred to future revision packets:

- **Splash credits renderer** — How and when the splash screen reads the manifest and displays credits at game launch is a runtime decision out of scope for this policy doc. The manifest contract here is forward-compatible with a renderer that reads `{ file, generator, date_added }` per asset. A future runtime packet (architect-defined NEXT_TASK rotation) is the appropriate vehicle.
- **Manifest schema extensions** — If a future generator requires additional metadata (e.g., a license-exception URL, a model-version pin, an image-rights tag), a separate schema-extension approval must explicitly extend §6's `{ file, generator, date_added }` minimum. This doc must be revised in the same packet.
- **Mid-wave generator changes** — If during a swap-in wave Kevin authorizes a new generator (e.g., SDXL self-hosted, Firefly, hand commission), the new generator must be added to §2 by a revision packet BEFORE any asset using it is committed. Mixing approved-list generators within a wave is fine; introducing an unapproved generator is not.
- **Exception logging surface** — When the first per-asset license exception fires per §4, the per-asset packet should append a "License exceptions" subsection to this doc under §11 in the same session, listing `{ asset_file, generator, exception_summary, source_url }`. Until the first exception, the subsection does not need to exist.
- **Manifest format** — `art_manifest.json` is currently a 14,321-byte JSON file (per the W15 art board executor's snapshot). The exact JSON shape (top-level array vs. object-keyed-by-filename) is whatever the existing manifest already uses; per-asset swap-in packets must read the existing shape and extend it consistently rather than re-formatting.

---

## 9. Authority

This document is the source of truth. If a sidecar, README, or W15 report disagrees, this document wins until the next revision packet supersedes it.

---

## 10. Revision history

- **2026-05-02** — Initial creation under `MAD_DASH_CEHP_ART_ATTRIBUTION_POLICY_001 v1.0.0`, approval payload `APPROVE_AND_EXECUTE_MAD_DASH_CEHP_ART_ATTRIBUTION_POLICY_001 v1.0.0` (2026-05-02). Closes §6 / risk #2 of `MAD_DASH_CEHP_W15_ART_BOARD_001`.
