# RELEASE CHECKLIST

## Runtime Truth
- [ ] `index.html` is still the intended public runtime.
- [ ] No dev-only certification aid behavior leaks into normal boot when `?certAid=` is absent.

## Validation
- [ ] `node scripts/check_save_schema.js` passes.
- [ ] `./scripts/verify-cehp.sh` has been run.
- [ ] If browser smoke was available, direct boots for `Demo`, `World2`, and `World3` stayed clean.
- [ ] Public play link was spot-checked after the latest publish.

## Save / Assist
- [ ] `SAVE._key` is unchanged unless a migration was explicitly approved.
- [ ] Save/continue behavior remains unchanged.
- [ ] Assist persistence remains unchanged.

## Human Certification
- [ ] W2 manual checkpoint notes are current enough to justify any W2 patch.
- [ ] W3 manual checkpoint notes are current enough to justify any W3 patch.
- [ ] No unproven issue was patched.

## Docs
- [ ] `CURRENT_PASS.md` matches the real next pass.
- [ ] `HANDOFF.md` lists exact commands and exact results from the latest pass.
- [ ] `CERTIFICATION_EVIDENCE.md` reflects the latest human evidence.
- [ ] `KNOWN_ISSUES.md` separates confirmed defects from unproven or presentation notes.
