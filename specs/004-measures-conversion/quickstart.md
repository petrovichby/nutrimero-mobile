# Quickstart: validating Measures (004)

## Prerequisites

- `pnpm install` at the repo root; an iOS simulator (iOS 26.5 until the iOS 27 scene fix lands)
  and, when available, an Android emulator.
- For regenerating the snapshot only: a LOCAL nutrimero-api checked out at `contract/SOURCE`'s
  commit, seeded with `fid:import` (001 quickstart's recipe). Never production.

## 1. Data and logic (no device)

```sh
pnpm test                 # resolution matrix, evidence coverage, round trips, search, labels
pnpm measures:report      # inconsistencies + AI-derived rows without evidence
```

Expected: tests pass; the report lists every inconsistent ingredient with each row's source and
value (wheat flour and sugar among them until ruled) and zero AI-derived rows without an evidence
line.

## 2. Regenerate the snapshot (only when the set or the api commit changes)

```sh
NUTRIMERO_API_URL=http://localhost:4198 NUTRIMERO_API_TOKEN=… \
  node scripts/fid-snapshot.mts --api-commit <contract/SOURCE commit>
git diff packages/features/measures/src/measures-snapshot.generated.ts
```

Expected: both generated files carry the same api commit; the diff is reviewed in the PR.

## 3. On device (offline)

Airplane mode on, fresh install, complete first run, open Measures.

| Check | Expected |
|---|---|
| List | the curated set, names in the UI language (English for lt/pl/be/uk until FID has them) |
| An inconsistent ingredient (e.g. wheat flour before its ruling) | no volume conversion, the "not settled yet" wording; pieces (if any) still shown |
| A settled ingredient (e.g. butter) | cup/tbsp/tsp in grams, **US and metric side by side, each labelled** |
| Provenance on a number | FID source, method, confidence; for a proven AI row, the confirming sources |
| Egg | extra small … extra large with grams; no volume/piece mixing |
| Converter: 250 g butter → US cups → flip | fraction + exact decimal; flip returns 250 g within rounding |
| No ingredient: 350 °F → °C | 175 °C |
| No ingredient: 1 cup → g | asks for the ingredient |
| Search "Mehl" in English UI, "migdol" in Lithuanian | wheat flour / almond found; nonsense term → "not in the app yet" |
| Setting → Australian | tablespoon rows use 20 ml, labelled AU |
| Clear my data | the standard setting returns to US + metric |
| de / lt / uk UI | decimal comma accepted in input; locale number format in output |
| VoiceOver / TalkBack | amounts read as "US cup: 1.125"-style label and value, never the glyph |
| 1.3× text, dark mode | no clipping; contrast per DESIGN.md |

## 4. Onboarding card (FR-023)

After flour's pick is ruled: the units card's "1 cup flour" shows the same grams as Measures' US
cup of flour.
