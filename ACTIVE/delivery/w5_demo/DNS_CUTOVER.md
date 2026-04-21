# DNS Cutover Checklist

> Week 5 prep only. Do **not** flip DNS until Kevin gives the explicit go-ahead.

## Current repo state
- GitHub Pages deploy root is `ACTIVE/game`
- `ACTIVE/game/CNAME` contains `counterfeit-educational.org`
- The live Pages build should serve the single-file rebuild from that root after the next push

## Registrar handoff steps
1. Confirm the GitHub repository Pages source is the `github-pages` environment for the `main` branch deploy.
2. Confirm the latest deploy includes the `CNAME` file at the Pages-served root.
3. In the registrar DNS panel for `counterfeit-educational.org`, set the apex domain to GitHub Pages using the standard A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. Add a `www` CNAME pointing to `kevinbigham.github.io`.
5. Leave any unrelated mail records untouched.
6. Save the changes and wait for propagation.

## Verification after flip
1. Open `https://counterfeit-educational.org/` and confirm the rebuild boots from the root URL.
2. Open `https://counterfeit-educational.org/?docket=1` and confirm THE DOCKET renders.
3. Open `https://counterfeit-educational.org/?case=CASE-20260504-001-GRACE-R2&world=rasta` and confirm the receipt/play surface is live.
4. Run `cd ACTIVE/game && bash scripts/verify-cehp.sh` locally against the pushed build before public announcement.
5. Render one Discord receipt against the live domain after the flip and confirm the play link resolves.

## Do not do in Week 5
- Do not change the registrar before Kevin says to flip.
- Do not point the domain anywhere except GitHub Pages.
- Do not add redirects, tracking, or analytics as part of cutover.
