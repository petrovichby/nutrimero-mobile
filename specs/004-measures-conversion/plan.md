# Implementation Plan: Measures table & ingredient-aware conversion

**Branch**: `spec/004-measures-conversion` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: `specs/004-measures-conversion/spec.md`. Gate 1 passed 2026-09-24, was corrected the same day, and
passed again market-aware at `7d3f486` (2026-09-25). Also recorded in the spec: the units systems by region, the
owner's F23 walk (all eight stops approved), and the owner's rulings on the ten density picks and the per-market
set.

**Status**: **Gate 2 PASSED at `77c0e60` (2026-09-25); item 2 (piece weights) ruled the same day.**
- Item 1 has been relayed to the api lane.
- Item 3 takes path (b): the api's first, small PR lands the market table and the unit definitions. Phase 2
  unblocks once that lands and the owner has walked the three variants.
- Item 4 is accepted: label–value spoken amounts.
- Item 5 is accepted: the seam changes are additive, and the coordinator announces them.
- Item 6: **GO on phase 1.**
- Item 2 was **ruled by the owner on 2026-09-25** ("pieces as recommended", FR-007a). Eggs show the market's
  statutory size ranges in shell, with no single weight; banana medium shows peeled at about 120 g; pear large at
  230 g; nothing else. Research into a sourced typical *cracked* egg weight per EU and UK grade continues and is
  reported through the coordinator.

The build of phases 3–5 waits for the api's units-and-density change.

## Summary

Ship a free Measures destination in Home Baker. It is market-aware: the device **region** selects the market
(DE, AT, CH, HU, LT, PL and the UK at launch; US later; any other region gets the core set with metric units
and no egg grades). Measures shows each ingredient's kitchen measures and exact weight, a two-way converter, on-device
search by any FID name, and the provenance of every number.

- **Set** (confirmed by the owner, `curated-set.md`): a 183-entry core, 5 of them US-only flour names, plus the 13
  German Type flours for DE/AT/CH, which show by weight only. EU and other markets show 178; the UK 180 (without
  the US corn flour, FR-031); the US all 183.
- **Density** (ruled by the owner): the api's chosen value per ingredient, form and state. That covers the
  owner's ten picks, with rice flour at 0.630 and potato starch by weight only, and the rows
  `density-evidence.md` verified.
- **Units**: three systems — Metric, US, UK Imperial (no cups) — offered two at a time by region on 001's Units
  step (FR-028). A recipe from another system switches measures "just this time" and never touches the setting
  (FR-029).
- **Constraints**: the app holds no unit constants, no density rule and no market table; all of them come from
  the api through a script-produced snapshot. No runtime api calls, and no new dependency.

## Technical Context

**Language/Version**: TypeScript 6.0 (strict), React 19.2, React Native 0.86, Expo SDK 57; scripts on Node 22
type stripping.

**Primary Dependencies**: existing only: `expo-localization` (`regionCode` for the market, R17), `use-intl`, the
FormatJS Intl polyfills, `expo-router`, `@nutrimero/core`/`ui`/`feature-home-data`. **No new dependency.**

**Storage**: no new key. The existing Home key `nutrimero.home.units` widens from `metric | imperial` to
`metric | us | ukImperial`; the legacy `imperial` reads as `us` (FR-028, R18). The market is read, never stored.
The ingredient data, unit definitions and market tables ship in the bundle (snapshot).

**Testing**: Vitest (node) for all logic, data and instruments; quickstart per market (the simulator's region
switched through `simctl`), VoiceOver/TalkBack.

**Target Platform**: iOS and Android phones, portrait; tablet per DESIGN.md.

**Project Type**: mobile app in the pnpm monorepo (thin app, shared packages).

**Performance Goals**: search results as you type (< 16 ms per keystroke over ~200 × ~20 keys); the converter
updates on every keystroke.

**Constraints**: fully offline; zero network requests; seven UI locales; no plural on a fraction; 44pt targets;
1.3× text; generated files never hand-edited.

**Scale/Scope**: 183 + 13 ingredients; the screens are the F23 corpus's eight approved stops (design-mobile is
landing them).

## Constitution Check

*Gate: must pass before Phase 0; re-checked after Phase 1 (below).*

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack settled | ✅ | No stack change |
| II | Contract consumer | ✅ | Units, markets and density choice are api work first (the units-and-density change), then a contract sync; the snapshot script reads generated-typed endpoints; no runtime calls |
| III | Core + packs | ✅ | New `packages/features/measures`; formatting extends `packages/core/src/units`; the units type widens in `feature-home-data`; routes only in the app; every `packages/*` change is announced through the coordinator |
| IV | FID-only data (applied to units, F23) | ✅ | Every number is the api's (chosen densities, unit definitions, market tables); the lane's evidence feeds the api's overlays; no app-side choice |
| V | Honest provenance | ✅ | Each ingredient-specific number exposes the sources the api records |
| VI | Privacy by architecture | ✅ | No personal data; the region is read, never stored or sent; search is in memory; the units choice is an existing Home key under Home's wiper |
| VII | Entitlements server-side | ✅ n/a | Free tier |
| VIII | Offline first-class | ✅ | Everything ships in the bundle; no network path (static test) |
| IX | Multilingual | ✅ | "Kitchen measures / Exact by weight", "US", "Imperial" and the unit labels in seven catalogs with owner string review; shared unit formatters in core; whole-number plural rule kept |
| X | Design from tokens | ✅ | Screens from the F23 corpus through the DESIGN.md port, built with impeccable; accessibility built in |
| XI | Stop conditions | ✅ | No new dependency category; no new top-level package |
| XII | The gates | ✅ | Both gates; PRs only; CI green; the generated snapshot is suppression-class if hand-edited |

**Post-design re-check**: all ✅; Complexity Tracking empty.

## Gate-2 items

1. **What the api's units-and-density change must carry** (a report for the coordinator to relay; phase 3 reads
   exactly these, with names following the api's contract):
   - **market resolution**: region → market for DE, AT, CH, HU, LT, PL, **UK (`GB`)** and US, and the default for every other
     region (core set, metric, no egg grades);
   - **units systems per market**: which two systems the Units step offers and which is preselected (FR-028);
   - **unit definitions**: the 250 ml cup, the US cup 236.59 ml, tsp 5 ml and tbsp 15 ml everywhere, the ounce,
     the pound, the **imperial fluid ounce and pint**, and the butter stick if it becomes a platform unit;
   - **set membership per market**: the core, US-only and DE/AT/CH entries of `curated-set.md`;
   - **egg grading per market**: EU grades, and **UK grades** (small, medium, large, very large, from the UK's
     retained standard). None yet, so no size weights (FR-007a);
   - **en-GB ingredient names**, sourced (FID has none), and an en-GB name for `631E984` before it returns to the
     UK set (FR-031);
   - **chosen density** per ingredient, form and state, with its recorded sources. This includes values that are
     not an FID row: **rice flour 0.630 (HERR 41)** comes as an overlay. "No volume value" is stated
     explicitly: potato starch, and the 44 unverified ingredients, which carry no chosen value;
   - **piece weights**: which ones are admitted (today only large pear, 230 g).
2. **Piece weights in v1.** One piece weight is confirmed (large pear); banana medium is confirmed only as a
   peeled weight. Proposal: **004 shows no piece weights at all** until the api admits a meaningful set; a single
   size of a single fruit would read as broken. The ruling decides whether the piece row is drawn empty or
   hidden.
3. **Early delivery of FR-028** (the Units step). This needs the region → systems mapping, which is market data
   the app must not hold (FR-025). Two ways: (a) wait for the api change; (b) the api lane publishes the market
   table first, a small slice of its change. The early path also needs the owner to have walked design-mobile's
   three variants.
4. **Spoken amounts** (R8, carried over): FR-021 is read as a label–value form ("US cup: 1.125"); fractions are
   not spelled out in words in seven languages.
5. **Seam** (III): `feature-home-data`'s `Units` type widens (stored values `metric | us | ukImperial`, legacy
   `imperial` → `us`). Pro does not read it. `packages/core/src/units` gains formatters that take their factor as
   an argument. Both are announced through the coordinator before merge.
6. **Order**: phase 1 needs neither the api change nor design. Phase 2 (the Units step) waits on item 3.
   Phase 3 waits on the api change. Phase 4 waits on phase 3 and on design-mobile's F23 corpus through the
   DESIGN.md port.

## Phases

### Phase 0 — Evidence and set (done)

`density-evidence.md` (every row checked; the picks ruled), `curated-set.md` (confirmed), and the api-lane
gaps (FID gaps and duplicates, HU/PL/LT flour classes, Type-flour defects), all on #39.

### Phase 1 — Core formatting (no api change, no design)

- `packages/core/src/units`: `convertByFactor`, `toPracticalFraction`, `formatMeasure`, `parseAmount`,
  `foldForSearch`, with tests. No unit constants: 001's `GRAMS_PER_OUNCE` becomes a factor argument, fed from
  the snapshot in phase 3. The font-coverage test gains ⅛–⅞, ⅓, ⅔, ⁄ and °.

### Phase 2 — Units systems (FR-028) — on gate-2 item 3

- `feature-home-data`: `UNITS = ["metric", "us", "ukImperial"]`; the read maps the legacy `imperial` → `us`
  (tested: a stored legacy value, each new value, and corrupt values reading as the default).
- `first-run` Units step: the two options and the preselection by market; a stored choice outside the pair is
  shown selected beside it; each option lists its units; the three card variants as drawn, with a units-only
  sample until phase 3.
- Catalogs: "US" and "Imperial" (UK) and their unit lists, seven locales, owner string review.

### Phase 3 — Snapshot (after the api's change and the contract sync)

- `scripts/fid-snapshot.mts` gains its second output: FID rows (for provenance), the api's chosen densities with
  their sources, unit definitions, market tables (resolution, systems, set membership, egg grading), localized
  vocabulary names and search keys, all at the same api commit as the staples file.
- `packages/features/measures`: the generated snapshot, `market(regionCode)`, `convert`, `searchIngredients`,
  `ingredientName`, with tests (SC-004, SC-005, SC-008: no US-only item outside the US market or US units, and
  no Type flour outside DE/AT/CH).

### Phase 4 — Screens (after phase 3 and the F23 corpus → DESIGN.md port)

- Through `impeccable`, faithful to the eight approved stops:
  - the list and search, filtered by market;
  - the ingredient view with "Kitchen measures / Exact by weight" (FR-030), variants, and the ruled pieces
    (FR-007a: egg size ranges in shell, banana medium peeled, pear large);
  - the converter with the "just this time" switch (FR-029): screen-local state that names the default, returns
    in one tap, and never writes the setting;
  - the provenance sheet.
- Routes `app/measures/…` and the entry point as drawn. Hermes `String.prototype.normalize` check on device.

### Phase 5 — Onboarding card (FR-023) and cleanup

- The card's market and units variants with the api's densities: flour by weight in EU markets; the US cup of
  flour and "1 stick butter" only for US units. design-mobile is told of number changes through the
  coordinator.
- Static no-network test for the measures package.

### Phase 6 — Verify

- Quickstart per market: DE, AT, CH, HU, LT, PL, **UK**, US, and one other region (e.g. BY), set on the simulator (iOS 27 and
  26.5). Android on an emulator when available (still owed). All seven locales, light and dark, 1.3×,
  VoiceOver and TalkBack; an impeccable critique against the corpus.

**PR shape**: phase 1 as its own PR; phase 2 as its own PR (early or with the build); phase 3 as the snapshot
PR; phases 4 and 5 as the screens PR; phase 6 in each PR's notes. Every `packages/*` PR is announced through
the coordinator.

## Project Structure

### Documentation (this feature)

```text
specs/004-measures-conversion/
├── spec.md
├── plan.md                 # this file
├── research.md             # R1–R19
├── data-model.md
├── quickstart.md
├── contracts/modules.md
├── density-evidence.md     # phase 0 (done) — every row checked; picks ruled
├── curated-set.md          # phase 0 (done) — confirmed per market
└── checklists/requirements.md
```

### Source Code (repository root)

```text
packages/core/src/units/{fraction,format,parse,fold,convert}.ts    # + tests; no unit constants
packages/features/home-data/src/{types,home-store}.ts              # Units widened, legacy read (phase 2)
packages/features/first-run/src/units-step.tsx                     # by market, three variants (phases 2, 5)
packages/features/measures/
├── src/measures-snapshot.generated.ts   # script output — never hand-edited
├── src/{market,convert,search,names}.ts # + tests
└── src/screens/                          # phase 4
apps/home-baker/app/measures/{index,[fidId]}.tsx                   # routes only
scripts/fid-snapshot.mts                                           # second output (phase 3)
```

**Structure Decision**: III's shape. A new feature package, because F30, F04, F24 and Pro's F17 consume
ingredient-aware conversion independently of these screens. FR-029's rule is inherited by those features'
measure sheets.

## Complexity Tracking

No violations requiring justification.
