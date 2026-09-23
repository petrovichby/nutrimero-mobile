# Implementation Plan: Home Baker first run (shell)

**Branch**: `lane/home-baker` | **Date**: 2026-09-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-home-first-run/spec.md` (gate 1 passed, with the
owner's dietary-mapping ruling).

**Status**: Draft — **gate 2** (coordinator reads; nothing is implemented before the word).

## Summary

Build the Home Baker first-run shell: a cream static splash handing off to the DESIGN.md
0.5.0 cover; three skippable onboarding steps writing units, a dietary profile and a pantry seed
to a backup-excluded device store; one wipe path used by the local reset (and contracted for
sign-out/erase); a five-tab shell whose Recipes tab shows the connect-once state; the owner's
dietary mapping and fit evaluation, tested but not yet displayed; and a script-produced FID
snapshot so onboarding works with no network and no session. 001 makes **no api calls at run
time**. New shared code lands in `packages/core`, `packages/ui` and two new
`packages/features/*` packages (III seam, announced through the coordinator).

## Technical Context

**Language/Version**: TypeScript 6.0 (strict), React 19.2, React Native 0.86, Expo SDK 57; scripts
on Node 22 built-in type stripping.

**Primary Dependencies**: existing `expo`, `expo-splash-screen`, `expo-status-bar`,
`openapi-fetch`. **Proposed (ADR 0001 — XI stop):** `expo-router`, `expo-secure-store`,
`expo-localization`, `use-intl`, `expo-font` (explicit), dev `yaml`.

**Storage**: device-only key/value store (`expo-secure-store`; iOS Keychain ThisDeviceOnly;
Android Keystore, app backup disabled). No server storage.

**Testing**: Vitest (node) for logic and repo instruments; manual quickstart + VoiceOver/TalkBack
audit for screens (no RN component harness — research R11).

**Target Platform**: iOS and Android phones (tablet relaxes to a ~600pt column); portrait.

**Project Type**: mobile app in a pnpm monorepo (thin app + shared packages).

**Performance Goals**: cover held only for startup work (fonts + store read); cold start to
onboarding step 1 under 2 s on a mid-range device; SC-001 timings.

**Constraints**: works fully offline from install; zero network requests; no personal data in
logs; 44pt targets; 1.3× text; en/de/lt.

**Scale/Scope**: 8 screens (cover, 3 steps, Recipes connect-once, coming-soon tab, More, confirm
sheet); 14 staples; 6 dietary options.

## Constitution Check

*Gate: must pass before Phase 0; re-checked after Phase 1 (below).*

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack settled | ✅ | Expo/RN/TS/pnpm/Biome/Vitest/EAS only |
| II | Contract consumer | ✅ | No api calls at run time; snapshot script uses generated `paths` types; A1–A7 (+A10) named as api work; contract sync is its own PR (#5) |
| III | Core + packs | ✅ | App holds route re-exports + config only; logic in `packages/core`, `packages/ui`, new `packages/features/{first-run,diet-profile}` (within III per ruling); seam announced via coordinator |
| IV | Allergen/nutrition from FID only | ✅ | Snapshot is script-produced from contract-typed api responses, api commit in header, resolution test; mapping codes resolve against it; no free-text allergen path |
| V | Honest provenance | ✅ | Cover plate carries its stamp; no other imagery besides empty-state art |
| VI | Privacy by architecture | ✅ | Device-only store, backup-excluded, one wipe path, no transmission (static test + proxy check) |
| VII | Entitlements server-side | ✅ n/a | No tier logic in 001 |
| VIII | Offline first-class | ✅ | Whole flow offline; connect-once state stated; delta sync is 003's (A7) |
| IX | Multilingual | ✅ | `use-intl` over en/de/lt catalogs, parity test, shared unit formatter |
| X | Design from tokens | ✅ after rider | Tokens generated from DESIGN.md (0.5.0) — replaces hand-seeded lime; impeccable used for screen build/review |
| XI | Stop conditions | ⛔ **STOP (raised)** | New categories: navigation, local persistence, i18n runtime (+ locale, fonts, dev yaml) → **ADR 0001 proposed**; approval required at gate 2 |
| XII | The gates | ✅ | Both gates; PRs only; CI green; no-suppressions instrument ported (phase 1); tokens/snapshot generated files are suppression-class if hand-edited |

**Post-design re-check**: unchanged. XI remains a stop until ADR 0001 is approved; no other
violation; Complexity Tracking empty.

## Gate-2 items for the coordinator

1. **ADR 0001** (`docs/adr/0001-first-run-shell-dependencies.md`) — approve or amend the six
   packages.
2. **FR-020 → 003** (research R12): 001 has no saved data and no network actions; propose moving
   the offline banner requirement to 003 (component still ships). Default if not ruled: keep
   FR-020 and add `expo-network` to ADR 0001.
3. **DESIGN.md 0.5.0 must declare the Home light/dark role table in its frontmatter** (today only
   in the corpus `shared.css`) so tokens can be generated from the binding document (R5). Ask to
   the design-mobile lane, via the coordinator.
4. **A10** (non-blocking api ask): expose the build commit on `/health`, so the snapshot header is
   verified rather than operator-declared (R7).
5. **Staple FID ids**: chosen during implementation by querying the api, confirmed by the owner in
   the snapshot PR.

## Phases

### Phase 1 — Setup riders (no dependency on ADR 0001 or DESIGN 0.5.0)

- **1a No-suppressions instrument**: port `nutrimero-web/src/no-suppressions.test.ts` to
  `scripts/no-suppressions.test.ts` (markers from comments, casts from code, hollowed forms incl.
  `.todo(`, denominator floor = file count at port time); widen Vitest `include` to
  `scripts/**/*.test.ts`; add a named CI step `No suppressions (Constitution XII)` in `quality`.
  A CI change that *adds* a check needs no dual sign-off.
- **1b CI statement** (research R9): the `quality` job runs lint, check, typecheck, unit tests
  and bundles on every push and PR — lint/check/typecheck/unit on PRs are covered; no extension
  needed beyond 1a and 2b.
- **1c Contract**: PR #5 (`chore/contract-sync`, api `origin/main` `4a4356b`) merges first. The II
  gate as run: CI's `contract` job proves **types = committed snapshot**; **snapshot = api** is
  the reviewed sync.
- **1d Static splash**: `app.json` splash background `#f7f4ec` (light and dark), no image — the
  gold flash is removed independently of the cover redesign.

### Phase 2 — Design port and tokens (needs DESIGN.md 0.5.0 from the design-mobile lane)

- **2a** Port `nutrimero-design:mobile/AMENDMENTS.md` into `docs/DESIGN.md` 0.5.0 by its own PR,
  with the PRODUCT.md staleness the census found.
- **2b** `scripts/tokens-generate.ts` → `packages/ui/src/tokens.generated.ts` from the DESIGN.md
  frontmatter; `tokens.ts` re-exports it; `pnpm tokens:generate`; CI regenerates and fails on
  drift (added step). Home accent becomes `#dfa621` (FR-025).

### Phase 3 — Shared foundations (needs ADR 0001)

- **3a** `packages/core`: `resolveLocale`, `createTranslator` (use-intl), catalog additions for
  every 001 string (en/de/lt, parity test), `formatQuantity`.
- **3b** `packages/core`: `DeviceStore` over a typed adapter, `wipeAll`, reinstall rule; tests
  with an in-memory adapter.
- **3c** `packages/ui`: fonts (vendored OFL files + licenses), `Screen`, `Masthead`, `Button`,
  `SelectionCard`, `ToggleChip`, `EmptyState`, `OfflineBanner`, `ConfirmSheet`, `TabBar`,
  `ProvenanceStamp` — through the `impeccable` skill, a11y props built in.

### Phase 4 — Diet profile (owner's ruling)

- **4a** `packages/features/diet-profile`: options, mapping, `evaluateFit` + full matrix tests.
- **4b** `scripts/fid-snapshot.ts` + generated snapshot + resolution test (R7). Header states the
  api commit, contract source and the "hand edit = suppression-class violation (XII)" rule.

### Phase 5 — Screens (needs 2, 3, 4)

- **5a** `packages/features/first-run`: cover (0.5.0 drawing), Units, Diet, Pantry, first-run
  gate, Recipes connect-once, coming-soon tabs, More + reset confirm.
- **5b** `apps/home-baker`: expo-router layout (Tabs + onboarding stack), thin route files,
  `app.json` plugins and `android.allowBackup: false`; `app-root.tsx` bootstrap retired.
- **5c** Static no-network test (first-run and diet-profile import no api client, no `fetch`).

### Phase 6 — Verify

- Quickstart walkthrough (both platforms, en/de/lt, light/dark, 1.3×, Reduce Motion), proxy
  check, backup/reinstall checks, VoiceOver + TalkBack audit; impeccable critique pass on every
  screen against the corpus.

**PR shape**: 1a–1d one PR (setup riders); 2a its own docs PR; 2b + 3 + 4 + 5 + 6 the feature PR
(or split by package if review size demands). Every `packages/*` PR is announced to the pro lane
through the coordinator before merge.

## Project Structure

### Documentation (this feature)

```text
specs/001-home-first-run/
├── spec.md
├── plan.md              # this file
├── research.md          # R1–R12
├── data-model.md        # device store, wipe, snapshot, mapping
├── quickstart.md        # validation guide
├── contracts/modules.md # shared-package surfaces
└── checklists/requirements.md
docs/adr/0001-first-run-shell-dependencies.md   # XI stop, proposed
```

### Source Code (repository root)

```text
apps/home-baker/
├── app/                       # expo-router: _layout.tsx, (tabs)/…, onboarding/… — re-exports only
└── app.json                   # splash #f7f4ec, allowBackup false, plugins
packages/core/
├── messages/{en,de,lt}.json   # + 001 strings (ICU shape)
└── src/{i18n,device-store,units}/
packages/ui/
├── assets/fonts/              # OFL files + licenses
└── src/{tokens.generated.ts,tokens.ts,components/}
packages/features/diet-profile/src/{options,mapping,evaluate-fit,fid-snapshot.generated}.ts
packages/features/first-run/src/{screens,gate}/
scripts/{fid-snapshot.ts,tokens-generate.ts,no-suppressions.test.ts}
```

**Structure Decision**: the constitution's III shape. Two feature packages because 003 and later
features consume the diet profile independently of the first-run screens.

## Complexity Tracking

No violations requiring justification. (XI is handled by its own mechanism — ADR 0001 — not as a
tracked violation.)
