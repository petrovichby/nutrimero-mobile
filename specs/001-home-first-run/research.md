# Research: 001-home-first-run

Each decision is recorded as Decision / Rationale / Alternatives. Items marked **XI** introduce a
dependency category and are proposed in `docs/adr/0001-first-run-shell-dependencies.md` — they
are **stops** until that ADR is approved at gate 2.

## R1 — Navigation (XI)

- **Decision**: `expo-router` (Expo's first-party router, built on React Navigation) with a
  `Tabs` layout for Recipes · Builder · Shopping · Pantry · More and a stack for onboarding. Route
  files in `apps/home-baker/app/` are one-line re-exports of screens from `packages/features/*`,
  keeping the app thin (III).
- **Rationale**: the Expo default for SDK 57; typed routes; system back and Android predictive
  back handled; tab bar `accessibilityState.selected` comes from React Navigation.
- **Alternatives**: React Navigation directly (same engine, more wiring, no file routes);
  hand-rolled state switch (no system back integration, re-implements a solved problem).

## R2 — Device store for profile, pantry, units, onboarding state (XI, VI)

- **Decision**: `expo-secure-store`. iOS: Keychain with
  `WHEN_UNLOCKED_THIS_DEVICE_ONLY` (never synced to iCloud Keychain, never restored to another
  device). Android: Keystore-encrypted storage; app backup disabled (`android.allowBackup:
  false`) so nothing reaches Google backup. **Reinstall rule**: iOS Keychain survives uninstall,
  so first launch checks an install marker file in the app's document directory (removed by
  uninstall; written with `expo-file-system`, admitted at gate 2); if absent, the store is wiped
  before anything is read. Full conditions: ADR 0001 §Secure-store conditions.
- **Rationale**: FR-009 requires exclusion from backups; secure-store's ThisDeviceOnly class and
  Android backup exclusion give that without custom native code. Payload is tiny (≤ 14 staple ids,
  ≤ 6 options, one enum, a marker).
- **Alternatives**: AsyncStorage (plaintext, included in iOS backups — fails FR-009);
  `expo-sqlite` (DB under Documents is backed up; exclusion needs a native attribute call —
  over-built for a few keys); MMKV (third-party native module, same backup problem).

## R3 — i18n runtime (XI, IX)

- **Decision**: `use-intl` (the framework-agnostic core of `next-intl`, which `nutrimero-web`
  uses) over `packages/core/messages/{en,de,hu,lt,be,pl,uk}.json` (the seven UI locales,
  IX 1.1.0); locale from `expo-localization` (read by the app) — one of the seven, else `en`, with
  `be`/`uk` mapped to `en` only until their G-2 faces are vendored (3c). Messages use the web's ICU shape
  (`{count, plural, one {…} other {…}}` — lt, be, pl and uk need `one/few/many/other`). The
  runtime asserts at startup (dev builds) that Hermes' `Intl.PluralRules` resolves the expected
  categories for all seven; Node-side coverage is already tested in `catalogs.test.ts`.
- **Rationale**: IX requires the web catalog shape; the web's catalogs are ICU via next-intl, so
  the same formatter family guarantees identical semantics. Hermes provides `Intl.PluralRules`.
- **Alternatives**: hand-written `t()` (would need an ICU parser to keep the web shape — a
  re-implementation); `i18next` (different message syntax from the web).

## R4 — Fonts

- **Decision**: vendor the OFL font files (Plus Jakarta Sans 400/500/600/700, Pacifico 400,
  Stardos Stencil 700, and — per design ruling G-2 — **Onest** 400/500/600/700 and **Yeseva One**
  400) into `packages/ui/assets/fonts/` with their licenses; load via `expo-font` (already a
  transitive dependency of `expo`, declared explicitly) before the cover is released. A font
  registry picks the UI face and the stamp face by locale script: Latin → Plus Jakarta Sans /
  Stardos Stencil; Cyrillic (be, uk) → Onest / Yeseva One. A test proves each locale's stamp text
  and UI text resolve to their ruled faces.
- **Rationale**: DESIGN.md typography; no runtime download (offline first run).
- **Alternatives**: `@expo-google-fonts/*` packages (a dependency per family for files we can
  vendor once).

## R5 — Design tokens follow DESIGN.md (rider)

- **Finding**: `packages/ui/src/tokens.ts` is hand-seeded from DESIGN.md 0.1.0 (`appAccentHome`
  lime). The Home "Crust & Butter" roles exist in DESIGN.md 0.4.0 only as three declared values
  plus prose; the full light/dark role table exists only in the approved corpus's `shared.css`.
- **Decision**: generate `packages/ui/src/tokens.generated.ts` by script
  (`scripts/tokens-generate.ts`) from the **DESIGN.md frontmatter** (binding). This requires
  DESIGN.md 0.5.0 to declare the Home light/dark role table in its frontmatter — asked of the
  design-mobile lane through the coordinator (see plan, Gate-2 items). `tokens.ts` stops being
  hand-edited (X). Dev tooling: `yaml` to parse the frontmatter (XI, dev-only).
- **Alternatives**: hand-edit tokens.ts to the corpus values (violates "never extended by hand");
  read `shared.css` from the design repo (concept authority, not binding).

## R6 — Static splash and cover (rider)

- **Decision**: `expo-splash-screen` static splash background = cream field `#f7f4ec` (light and
  dark — the cover is scheme-fixed), no image, so the native-to-JS hand-off is invisible; the
  composed cover (FR-001) renders in JS **as DESIGN.md 0.5.0 draws it** (real logo, D-5) and is
  released when fonts and the device-store read resolve.
- **Rationale**: today's `#dfa621` static background flashes gold before a cream cover.

## R7 — FID reference snapshot (Q3 ruling, IV)

- **Decision**: `scripts/fid-snapshot.ts`, run with Node 22's built-in type stripping (no `tsx`),
  uses the contract-typed client (`createApiClient` over generated `paths`) against an operator-
  supplied API URL and session token (env only, never committed). Inputs: the curated staples
  manifest (14 FID ids, ordered) and the mapping's allergen codes. It reads
  `/fid/languages`, `/fid/ingredients/{fidId}` (names, dietary facts, allergen states) and
  `/fid/allergens?language=` for the seven UI locales, and writes
  `packages/features/diet-profile/src/fid-snapshot.generated.ts` — `satisfies` a type derived
  from the generated schema, with a header naming the api commit, the contract snapshot commit
  (`contract/SOURCE`), and the generation date.
- **Api commit** (gate-2 ruling): until A10 (build commit on `/health`, queued, non-blocking)
  exists, the snapshot is taken from a **local** api instance checked out at `contract/SOURCE`'s
  commit and seeded with `fid:import` — never production. `--api-commit` is then a fact by
  construction; the script still refuses unless it equals `contract/SOURCE`.
- **Test**: every manifest staple resolves; its names are asserted in all seven UI locales — en, de,
  hu required; lt, pl, be, uk reported as "pending translation run" until api `feat/021` is
  imported (spec FR-017's temporary fallback: the UI shows English), any other gap fails and is
  ruled, never hand-filled; every mapped allergen code
  resolves; the header carries a 40-hex api commit. A hand edit is a suppression-class violation
  (XII) — the file header says so and the PR template for regeneration shows the command used.
- **Open content item**: the 14 FID ids are chosen by querying `/fid/ingredients?q=` during
  implementation and confirmed by the owner in the PR (curation, not code).

## R8 — Dietary mapping and fit evaluation (owner's ruling)

- **Decision**: a pure module in `packages/features/diet-profile`: option → { allergen codes } or
  { dietary fact }; `evaluateFit(profile, recipeFacts) → fits | check | notFitting`, with
  "contains" ⇒ notFitting, "unknown"/"depends on brand" ⇒ check, only explicit "does not
  contain" / satisfied fact ⇒ fits; the worst result across options wins. Exhaustive tests over
  option × state. No UI in 001.

## R9 — What CI runs today (rider)

- `quality` job, on every `push` and `pull_request`: `pnpm install --frozen-lockfile` → `pnpm
  lint` (Biome lint) → `pnpm check` (Biome format + style) → `pnpm typecheck` (`tsc --noEmit` per
  package) → `pnpm test` (Vitest) → `pnpm build` (`expo export` release bundles, both apps, both
  platforms). **It covers lint/check/typecheck/unit on PRs**; no extension needed for that.
- `contract` job: regenerates types from the committed snapshot and fails on any diff in
  `contract/openapi.json` or `packages/core/src/api/generated` — proves **types match the
  committed snapshot**. **Snapshot vs api** is a reviewed sync (`pnpm contract:sync`, PR #5), by
  design — this is the II gate.
- `quickstart-smoke` job: the README quickstart on a clean checkout (Metro serves the manifest).

## R10 — No-suppressions instrument (rider)

- **Decision**: port `nutrimero-web/src/no-suppressions.test.ts` (itself a port of the api's
  `src/no-suppressions.spec.ts`) to `scripts/no-suppressions.test.ts`, run by `pnpm test` (Vitest
  `include` widened to `scripts/**/*.test.ts`) and therefore by CI's `quality` job, plus a named
  CI step so the gate is visible in the checks list. Differences, each forced: walks `apps/*/src`,
  `apps/*/app`, `packages/*/src`, `scripts`; adds `.todo(` to hollowed forms (XII lists it); the
  denominator floor is set to the file count at port time (the web's 50 would fail vacuously the
  other way on a young repo) and raised as the tree grows.

## R11 — Testing boundary

- **Decision**: Vitest (node) for all logic: i18n key parity and locale resolution, device-store
  wipe orchestration against a typed in-memory adapter, fit evaluation matrix, snapshot
  resolution, token generation determinism, a static "no network" test (first-run and
  diet-profile packages import no api client and call no `fetch`). Screens are verified by the
  quickstart walkthrough and the VoiceOver/TalkBack audit (FR-023). A React Native component-test
  harness (`jest-expo` + Testing Library) would be a new test-framework category — **not**
  proposed in 001.

## R12 — Offline banner in 001

- **Finding**: 001 makes no network calls and has no network-only actions; the Recipes tab shows
  the connect-once state regardless of connectivity. Detecting connectivity only to show a banner
  over "no saved data" adds a dependency (`expo-network`) for no user value.
- **Ruled at gate 2**: FR-020 moved to 003. The banner *component* ships in `packages/ui` with
  001's shell components; `expo-network` enters via pro ADR 0002 or 003, whichever is first.
