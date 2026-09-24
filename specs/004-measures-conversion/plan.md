# Implementation Plan: Measures table & ingredient-aware conversion

**Branch**: `spec/004-measures-conversion` | **Date**: 2026-09-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-measures-conversion/spec.md` (gate 1 passed
2026-09-24 with rulings Q1–Q3).

**Status**: At gate 2 — items below for the coordinator and the owner.

## Summary

Ship a free Measures destination in Home Baker. It covers a curated set of ~150–200 bakery
ingredients: each ingredient's cup, spoon and piece measures in grams, a two-way converter,
on-device search by any FID name, and the provenance of every ingredient-specific number. All
data is a script-produced copy of FID taken from a local api at `contract/SOURCE`'s commit. The
app never picks a density silently:

- **AI-derived rows**: shown only when multi-source proven, with the evidence committed.
- **Rows that disagree by more than 5 %**: no volume conversion until the owner rules a sourced
  pick, recorded in a tested manifest.

Standards are explicit and labelled: US customary and metric by default, with UK and Australian
behind a setting. The feature makes **no api calls at run time** and adds **no dependency**.

## Technical Context

**Language/Version**: TypeScript 6.0 (strict), React 19.2, React Native 0.86, Expo SDK 57; scripts
on Node 22 type stripping.

**Primary Dependencies**: existing only: `use-intl`, the FormatJS Intl polyfills, `expo-router`,
`@nutrimero/core`/`ui`/`feature-home-data`. **No new dependency** (research R16).

**Storage**: one Home key in the existing device store (`nutrimero.home.measureStandard`); the
ingredient data ships in the bundle.

**Testing**: Vitest (node) for all logic, data and instruments (research R15); quickstart
walkthrough plus VoiceOver/TalkBack on device.

**Target Platform**: iOS and Android phones, portrait; tablet per DESIGN.md.

**Project Type**: mobile app in the pnpm monorepo (thin app, shared packages).

**Performance Goals**: search results as you type (< 16 ms per keystroke over ~200 × ~20 keys);
the converter updates on every keystroke.

**Constraints**: fully offline; zero network requests; seven UI locales; no plural on a fraction;
44pt targets; 1.3× text; generated files never hand-edited.

**Scale/Scope**: ~150–200 ingredients; ~3 screens (list/search, ingredient + converter,
provenance sheet) plus a setting; the exact screen count follows design-mobile's concept.

## Constitution Check

*Gate: must pass before Phase 0; re-checked after Phase 1 (below).*

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack settled | ✅ | No stack change |
| II | Contract consumer | ✅ | The snapshot script reads generated-typed endpoints at `contract/SOURCE`; no runtime calls; `reserved` stability and FID's 240 ml cup raised as api asks (R13) |
| III | Core + packs | ✅ | New `packages/features/measures`; unit arithmetic extends `packages/core/src/units`; one Home key in `feature-home-data`; routes only in the app; seam announced via the coordinator |
| IV | FID-only data (the pattern applied to units, per F23) | ✅ | Every number traces to an FID row; AI-derived rows only when multi-source proven (FR-004a); no silent choice between disagreeing rows (FR-005a); a closed source list fails the build on an unknown source |
| V | Honest provenance | ✅ | Every ingredient-specific number exposes its source, method, confidence and confirmations |
| VI | Privacy by architecture | ✅ | No personal data; search is in memory; the setting is a display preference under Home's wiper |
| VII | Entitlements server-side | ✅ n/a | Free tier; no tier logic |
| VIII | Offline first-class | ✅ | Everything ships in the bundle; no network path exists (static test) |
| IX | Multilingual | ✅ | All strings in seven catalogs; shared unit formatters in core; whole-number plural rule kept (R7, R8) |
| X | Design from tokens | ✅ | No screen before the F23 concept is ported to DESIGN.md; built through impeccable; a11y built in |
| XI | Stop conditions | ✅ | No new dependency category; no new top-level package (a feature package is the III shape) |
| XII | The gates | ✅ | Both gates; PRs only; CI green; generated snapshot is suppression-class if hand-edited; the evidence file is test-enforced |

**Post-design re-check**: all ✅; Complexity Tracking empty.

## Gate-2 items

1. **Owner: confirm the curated set** (FR-018). It arrives as a table in the snapshot PR (phase 2),
   flagged per candidate: AI-only, inconsistent, pieces only. Wheat flour's and sugar's
   inconsistencies are brought with it (FR-005a).
2. ~~api lane: confirm `reserved` is stable~~ — **CONFIRMED STABLE** by the api lane (2026-09-24):
   `GET /api/v1/fid/ingredients/{fidId}` → `reserved.volumeToMass`, `pieceWeight`,
   `waterContent`, `losses`, `dryMatterPercent`, schema unchanged since 2026-09-04, no open branch
   touching it. Relied on: the fields as they are; numbers as full-precision strings; density =
   mass over volume to 6 places; **empty is not zero**. `losses` holds 0 rows and
   `dryMatterPercent` is always null by design — 004 derives neither. A new `method` or
   `confidence` value would be an announced contract change (the closed source list and the
   enums in the generated types fail loudly if one appears). Still with the api lane: FID's
   240 ml cup (gate-1 Q3).
3. **Source order for the fixed rule's third key** (R3). It only matters inside the 5 % band.
   Proposed: national food-composition tables (Fineli, Health Canada CNF, BLS, McCance &
   Widdowson), then USDA FDC, then FAO/INFOODS, then Markus's table, then confirmed AI-derived
   rows.
4. **Spoken amounts** (R8): FR-021 read as a label–value form ("US cup: 1.125"), not fractions
   spelled out in words in seven languages.
5. **The standard setting is Home data**, so Clear my data resets it (R10). The alternative is a
   device preference, like the interface language.
6. **Order**: phases 1–3 and 5 need no design. Phase 4 (screens) waits for design-mobile's F23
   concept and its DESIGN.md port.

## Phases

### Phase 1 — Core arithmetic (no data, no design)

- `packages/core/src/units`: `MEASURING_STANDARDS` (R6), `toPracticalFraction`, `formatMeasure`,
  `parseAmount`, `foldForSearch`, with tests. Also extend the font-coverage test for ⅛–⅞, ⅓, ⅔,
  ⁄ and ° (all present today).

### Phase 2 — The snapshot and the manifest

- Draft the curated set from the local api (R5). This is the owner-confirmation table.
- `scripts/fid-snapshot.mts` gains its second output (R2), plus the closed source list in the
  manifest (R3). Regenerate both files at `4a4356b`.
- `packages/features/measures`: the generated snapshot, `measures-manifest.ts` and
  `resolveVolume`, with its matrix test. `pnpm measures:report`.
- **PR**: carries the snapshot, the set table for the owner, and the inconsistency report. The
  set is confirmed there, as the staples were.

### Phase 3 — Evidence (gate-1 Q1)

- For each AI-derived volume row in the confirmed set, collect published sources (R4). Commit
  `density-evidence.md` and the test that parses it and holds the admitted rows to it.
- Bring each inconsistency's rows and sources to the owner, flour first; the owner rules the
  picks and they land in `RULED_PICKS` with their test.
- **PR**: the evidence file plus the picks. It may repeat as rulings arrive, and rows without a
  ruling simply stay unshown.

### Phase 4 — Screens (needs design-mobile's F23 concept → DESIGN.md port)

- Through `impeccable`: the measures list with search, the ingredient view (measures table,
  converter, variants, pieces), the provenance sheet, and the standard setting. Routes
  `app/measures/…`, and the entry point per the concept.
- Hermes `String.prototype.normalize` check on device (R9).
- **PR**: screens plus routes plus the catalog strings (seven locales, owner string review).

### Phase 5 — Onboarding card and cleanup

- FR-023: `units-step` shows the resolved flour value once it is ruled. Tell design-mobile.
- Static no-network test for the measures package; round-trip and search tests over the final
  set (SC-004, SC-005).

### Phase 6 — Verify

- Quickstart on iOS (26.5, and iOS 27 after the scene fix) and on Android when possible; all seven
  locales, light and dark, 1.3×, VoiceOver and TalkBack; an impeccable critique pass against the
  concept.

**PR shape**: phases 1 and 2 as one PR (announced for III), phase 3 as one or more evidence PRs,
phase 4 as the screens PR, phases 5 and 6 with or after it. Every `packages/*` PR is announced to
the pro lane through the coordinator.

## Project Structure

### Documentation (this feature)

```text
specs/004-measures-conversion/
├── spec.md
├── plan.md                 # this file
├── research.md             # R1–R16
├── data-model.md
├── quickstart.md
├── contracts/modules.md
├── density-evidence.md     # phase 3 (gate-1 Q1)
└── checklists/requirements.md
```

### Source Code (repository root)

```text
packages/core/src/units/{standards,fraction,format,parse,fold}.ts   # + tests
packages/features/measures/
├── src/measures-snapshot.generated.ts   # script output — never hand-edited
├── src/measures-manifest.ts             # set, ruled picks, source classes and order
├── src/{resolve,convert,search,names}.ts   # + tests
└── src/screens/                          # phase 4
packages/features/home-data/src/{keys,home-store}.ts               # measureStandard
packages/features/first-run/src/units-step.tsx                     # FR-023 (phase 5)
apps/home-baker/app/measures/{index,[fidId]}.tsx                   # routes only
scripts/{fid-snapshot.mts,measures-report.mts}
```

**Structure Decision**: III's shape. A new feature package, because F30, F04, F24 and Pro's F17
consume ingredient-aware conversion independently of these screens.

## Complexity Tracking

No violations requiring justification.
