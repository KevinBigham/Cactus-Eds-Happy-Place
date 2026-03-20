# Cactus Ed's Happy Place

- Play Online: [https://kevinbigham.github.io/Cactus-Eds-Happy-Place/](https://kevinbigham.github.io/Cactus-Eds-Happy-Place/)
- Repo: [https://github.com/KevinBigham/Cactus-Eds-Happy-Place](https://github.com/KevinBigham/Cactus-Eds-Happy-Place)
- Public status: Preview
- Runtime truth: `index.html`

## Live Public Check

- Verified on `2026-03-14`
- GitHub Pages returned `HTTP 200`
- Browser load showed page title `Cactus Ed's Happy Place` and a Phaser boot log
- Live Pages HTML SHA-256 matches both local `index.html` and public `main/index.html`: `17aebc1a7d7a66ef4535ab2772e915acd463327e98d2bae91f15fa8b2f31a52f`
- Latest public repo commit checked during this pass: `ecc98ebb65d96ccad965cc97d5aea129fd4b273a`

## What Is Live Right Now

- Active scenes: `Title`, `Demo`, `World2`, `World3`
- Tech shape: Phaser via CDN, ES5 JavaScript only, no build step, single-file runtime
- Human certification for unresolved W2/W3 continuity remains open, so the public build is still `Preview`, not `Certified`

## Local Run

```bash
python3 -m http.server 4175 --bind 127.0.0.1
```

Then open [http://127.0.0.1:4175/index.html](http://127.0.0.1:4175/index.html).

## Repo Truth

- Read `AGENTS.md`
- Then `docs/ACTIVE_WORKING_SET.md`
- Then `CURRENT_PASS.md`
- Then `HANDOFF.md`

Canonical verification:

```bash
node scripts/check_save_schema.js
./scripts/verify-cehp.sh
```

Dev-only certification entry points:

- [https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w2](https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w2)
- [https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w3](https://kevinbigham.github.io/Cactus-Eds-Happy-Place/?certAid=w3)

## License

Personal project by Kevin Bigham. All rights reserved.
