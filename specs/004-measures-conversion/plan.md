# Implementation Plan: Measures table & ingredient-aware conversion

**Branch**: `spec/004-measures-conversion` | **Date**: 2026-09-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-measures-conversion/spec.md` (gate 1 passed
2026-09-24 with rulings Q1–Q3).

**Status**: At gate 2 — items below for the coordinator and the owner.

## Summary

Ship a free Measures destination in Home Baker. It covers a curated set of ~150–200 bakery
ingredients: each ingredient's cup, spoon and piece measures in grams, a two-way converter,
on-device search by any FID name, and the provenance of every ingredient-specific number.

Mobile follows the platform's agreements (the gate-1 correction). **Units and the chosen density
are defined in the api**, in its upcoming `change/002`, and the app reads both from a
script-produced snapshot, taken from a local api at `contract/SOURCE`'s commit once that change
lands. The lane's job on data is the **evidence**: `density-evidence.md`, with multi-source proof
for AI-derived rows and every inconsistency listed with its sources, which feeds the api's
overlays. The app holds no unit constants and no choice rule. It makes no runtime api calls and
adds no dependency.

## Technical Context

**Language/Version**: TypeScript 6.0 (strict), React 19.2, React Native 0.86, Expo SDK 57; scripts
on Node 22 type stripping.

**Primary Dependencies**: existing only: `use-intl`, the FormatJS Intl polyfills, `expo-router`,
`@nutrimero/core`/`ui`/`feature-home-data`. **No new dependency** (research R16).

**Storage**: none on the device (FR-022); the ingredient data and unit definitions ship in the
bundle.

**Testing**: Vitest (node) for all logic, data and instruments (research R15); quickstart
walkthrough plus VoiceOver/TalkBack on device.

**Target Platform**: iOS and Android phones, portrait; tablet per DESIGN.md.

**Project Type**: mobile app in the pnpm monorepo (thin app, shared packages).

**Performance Goals**: search results as you type (< 16 ms per keystroke over ~200 × ~20 keys);
the converter updates on every keystroke.

**Constraints**: fully offline; zero network requests; seven UI locales; no plural on a fraction;
44pt targets; 1.3× text; generated files never hand-edited.

**Scale/Scope**: ~150–200 ingredients; ~3 screens (list/search, ingredient + converter,
provenance sheet); the exact screen count follows design-mobile's concept.

## Constitution Check

*Gate: must pass before Phase 0; re-checked after Phase 1 (below).*

| # | Principle | Verdict | How |
|---|---|---|---|
| I | Stack settled | ✅ | No stack change |
| II | Contract consumer | ✅ | Units and density choice are api work first (`change/002`), then a contract sync; the snapshot script reads generated-typed endpoints; no runtime calls |
| III | Core + packs | ✅ | New `packages/features/measures`; formatting extends `packages/core/src/units`; routes only in the app; seam announced via the coordinator |
| IV | FID-only data (the pattern applied to units, per F23) | ✅ | Every number is the api's: chosen densities and unit definitions from the snapshot; AI-derived rows reach a screen only through the api's multi-source admission, fed by the lane's evidence (FR-004a); no app-side choice |
| V | Honest provenance | ✅ | Every ingredient-specific number exposes its source, method, confidence and confirmations |
| VI | Privacy by architecture | ✅ | No personal data; nothing stored; search is in memory |
| VII | Entitlements server-side | ✅ n/a | Free tier; no tier logic |
| VIII | Offline first-class | ✅ | Everything ships in the bundle; no network path exists (static test) |
| IX | Multilingual | ✅ | All strings in seven catalogs; shared unit formatters in core; whole-number plural rule kept (R7, R8) |
| X | Design from tokens | ✅ | No screen before the F23 concept is ported to DESIGN.md; built through impeccable; a11y built in |
| XI | Stop conditions | ✅ | No new dependency category; no new top-level package (a feature package is the III shape) |
| XII | The gates | ✅ | Both gates; PRs only; CI green; generated snapshot is suppression-class if hand-edited; the evidence file is test-enforced |

**Post-design re-check**: all ✅; Complexity Tracking empty.

## Gate-2 items

1. **Owner: confirm the curated set** (FR-018). It arrives as a table with the evidence (phase 2),
   flagged per candidate: AI-only, inconsistent, pieces only.
2. ~~api: `reserved` stable~~ — **confirmed stable** by the api lane (2026-09-24): full-precision
   strings, density = mass over volume to 6 places, empty is not zero; `losses` and
   `dryMatterPercent` are not derived from.
3. **api `change/002`**: units and the chosen density (rule plus resolved picks). The snapshot
   (phase 3) waits for it and for the contract sync that follows.
4. **Open to the api lane** (R13): (a) whether the butter *stick* is a platform unit (FR-023);
   (b) whether Markus's 2026-09-03 piece-weight table is part of the delivery M34 disclosed as
   AI-generated. If it is, all 2,010 piece weights are AI-derived and fall under Q1, although
   their source string doesn't say so.
5. **Spoken amounts** (R8): FR-021 read as a label–value form ("US cup: 1.125"), not fractions
   spelled out in words in seven languages.
6. **Order**: phases 1 and 2 need neither the api change nor design. Phase 3 needs `change/002`,
   and phase 4 needs design-mobile's F23 concept.

## Phases

### Phase 1 — Core formatting (no data, no design, no api change)

- `packages/core/src/units`: `toPracticalFraction`, `formatMeasure`, `parseAmount`,
  `foldForSearch`, and conversion functions that take their factor as an argument (no unit
  constants — R6), with tests. Extend the font-coverage test for ⅛–⅞, ⅓, ⅔, ⁄ and °.

### Phase 2 — Draft set and evidence (now, in parallel with the api change)

- Draft the curated set from the local api or the seed files at `4a4356b` (R5).
- The survey: every AI-derived row and every group of rows more than 5 % apart in the draft set
  (R3).
- The web research, committed as `density-evidence.md` (R4): per ingredient, its FID rows, at
  least two independent published sources per AI-derived row, and a verdict. Inconsistencies are
  listed with every row's source and value, wheat flour first, then sugar.
- **PR**: the draft set table for the owner plus the evidence. It feeds the api's overlays.

### Phase 3 — Snapshot (after api `change/002` and the contract sync)

- `scripts/fid-snapshot.mts` gains its second output (R2): FID rows, the api's chosen densities
  with their recorded sources, the api's unit definitions, localized vocabulary names and search
  keys, all at the same api commit as the staples file.
- `packages/features/measures`: the generated snapshot, `MEASURES_FID_IDS` (the owner-confirmed
  set), `convert`, `searchIngredients`, `ingredientName`, with tests.
- `GRAMS_PER_OUNCE` in core moves onto the api's ounce (R6).

### Phase 4 — Screens (needs design-mobile's F23 concept → DESIGN.md port)

- Through `impeccable`: the measures list with search, the ingredient view (measures table,
  converter, variants, pieces) and the provenance sheet. Routes
  `app/measures/…`, and the entry point per the concept.
- Hermes `String.prototype.normalize` check on device (R9).
- **PR**: screens plus routes plus the catalog strings (seven locales, owner string review).

### Phase 5 — Onboarding card and cleanup

- FR-023: `units-step` shows the api's chosen flour density once flour is settled; the butter
  stick per the api's answer (gate-2 item 4a). Tell design-mobile.
- Static no-network test for the measures package; round-trip and search tests over the final
  set (SC-004, SC-005).

### Phase 6 — Verify

- Quickstart on iOS (26.5, and iOS 27 after the scene fix) and on Android when possible; all seven
  locales, light and dark, 1.3×, VoiceOver and TalkBack; an impeccable critique pass against the
  concept.

**PR shape**: phase 1 as its own PR (announced for III), phase 2 as the evidence PR (one or more),
phase 3 as the snapshot PR, phase 4 as the screens PR, and phases 5 and 6 with or after it. Every `packages/*` PR is announced to
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
packages/core/src/units/{fraction,format,parse,fold,convert}.ts   # + tests; no unit constants
packages/features/measures/
├── src/measures-snapshot.generated.ts   # script output — never hand-edited
├── src/measures-set.ts                  # the owner-confirmed ids (MEASURES_FID_IDS)
├── src/{convert,search,names}.ts        # + tests
└── src/screens/                          # phase 4
packages/features/first-run/src/units-step.tsx                     # FR-023 (phase 5)
apps/home-baker/app/measures/{index,[fidId]}.tsx                   # routes only
scripts/{fid-snapshot.mts,measures-survey.mts}   # survey feeds the evidence, not the app
```

**Structure Decision**: III's shape. A new feature package, because F30, F04, F24 and Pro's F17
consume ingredient-aware conversion independently of these screens.

## Complexity Tracking

No violations requiring justification.
