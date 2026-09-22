# Build prompt — Home Baker splash screen

Task brief for a coding agent working in `~/Projects/nutrimero-mobile`. Paste everything below
the rule as the agent's instructions.

---

Implement the launch splash screen for **Nutrimero Home Baker** (`apps/home-baker`), an Expo
SDK 57 / React Native 0.86 app inside a pnpm monorepo. Follow the repo's `CLAUDE.md` and
`.specify/memory/constitution.md`; design authority is `docs/DESIGN.md` (v0.4.0, the warm
"Crust & Butter" Home Baker world). Do NOT touch `apps/pro-baker`.

## Colors (from DESIGN.md v0.4.0 + the approved icon)

- Butter gold (light splash background): **#dfa621** (`home-action` / `app-accent-home`)
- Rust loaf mark (light-mode mark color, as in the icon): **#863414**
- Dark splash background: **#201510** (Home Baker dark scheme warm-brown ramp — never gray/navy)
- Dark-mode mark color: **#dfa621** (butter gold — rust on #201510 is too quiet; gold reads warm
  and passes contrast)

## Asset preparation

Source artwork: `__artifacts__/raw/icon/icon-home-warm.png` (1254×1254; solid golden field
#dfa21c with a rust #863414 bread-loaf glyph and a thin divider ornament under it).

Do not use the full square image on a colored background — the artwork has grain texture and its
field (#dfa21c) differs slightly from the token (#dfa621), which would show as a visible seam.
Instead extract the mark:

1. With Python + Pillow (use `~/Projects/venv/bin/python` — this machine's convention), key out
   the golden background: classify pixels by hue/distance to #dfa21c, keep the rust mark
   (including the divider ornament) with an alpha channel; clean stray speckles (the grain) with
   a small connected-component or median filter pass.
2. Export two splash images, each 1024×1024, transparent background, mark centered with ~15%
   padding on all sides:
   - `apps/home-baker/assets/splash-icon.png` — mark in original rust #863414 (light mode)
   - `apps/home-baker/assets/splash-icon-dark.png` — same alpha mask, mark recolored to
     butter gold #dfa621 (dark mode)
3. Keep the generation script at `scripts/make-splash-home.py` so the asset is reproducible from
   the source artwork (idempotent, same spirit as nutrimero-design's generators). The source in
   `__artifacts__/raw/` is never modified.

## Expo configuration

Use the SDK-standard `expo-splash-screen` config plugin (install with
`pnpm --filter @nutrimero/home-baker exec npx expo install expo-splash-screen` so the version
matches SDK 57). In `apps/home-baker/app.json`:

```json
"plugins": [
  ["expo-splash-screen", {
    "image": "./assets/splash-icon.png",
    "imageWidth": 200,
    "resizeMode": "contain",
    "backgroundColor": "#dfa621",
    "dark": {
      "image": "./assets/splash-icon-dark.png",
      "backgroundColor": "#201510"
    }
  }]
]
```

## Runtime behavior

In `apps/home-baker` (entry: `index.ts` → `src/app-root.tsx`):

- Call `SplashScreen.preventAutoHideAsync()` at module scope, and `SplashScreen.hideAsync()`
  once the root view has laid out (`onLayout` on the root `View` is enough today — there is no
  async boot work yet; leave a comment that font/entitlement loading will move the hide call).
- Enable the built-in fade-out: `SplashScreen.setOptions({ fade: true, duration: 200 })`.
  DESIGN.md motion rules: 150–250 ms, and a fade is acceptable under reduced motion (it is not a
  movement), so no extra handling is needed — note this in a comment.

## Constraints & quality gates (must pass before you finish)

- Kebab-case filenames only (Biome gate). New code in TypeScript strict.
- No dependencies beyond `expo-splash-screen` (SDK-native; anything else violates constitution XI).
- Run from the repo root and make green: `pnpm lint && pnpm check && pnpm typecheck && pnpm test`,
  then `pnpm --filter @nutrimero/home-baker run bundle` to prove Metro still exports.
- Verify visually if a simulator is available (`pnpm start:home`, press `i`): gold field, centered
  loaf, fade-out into the app; switch the simulator to dark appearance and confirm the brown/gold
  variant. If no simulator, state that visual verification is pending.
- Do NOT run `git commit` or `git push` — the user commits personally. Leave the working tree
  clean of any files other than: the two splash assets, the generation script, `app.json`,
  `package.json`/lockfile, and `src/app-root.tsx`.
- Update `ASSETS.md`: tick "Home Baker splash (Expo config), light + dark" (`[x]`).

## Acceptance checklist

- [ ] Splash shows instantly on cold start: butter-gold #dfa621 field, centered rust loaf mark
- [ ] Dark appearance: warm brown #201510 field, butter-gold mark (never gray or navy)
- [ ] 200 ms fade-out, no flash of unstyled screen between splash and app
- [ ] Assets reproducible via `scripts/make-splash-home.py`; source artwork untouched
- [ ] All quality gates green; no changes under `apps/pro-baker`
