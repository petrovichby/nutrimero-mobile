# Quickstart: validating Measures (004)

## Prerequisites

- `pnpm install` at the repo root; an iOS simulator (iOS 26.5 until the iOS 27 scene fix lands)
  and, when available, an Android emulator.
- For regenerating the snapshot only: a LOCAL nutrimero-api checked out at `contract/SOURCE`'s
  commit, seeded with `fid:import` (001 quickstart's recipe). Never production.

## 1. Data and logic (no device)

```sh
pnpm test                 # snapshot = api, evidence coverage, round trips, search, labels
```

Expected: tests pass; every AI-derived row in the set has an evidence line.

## 2. Regenerate the snapshot (after api `change/002`, and whenever the set or the api commit changes)

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
| An ingredient the api has not settled (no chosen density) | no volume conversion, the "not settled yet" wording; pieces (if any) still shown |
| A settled ingredient | grams for the standard cup (250 ml) and the US cup (236.59 ml) side by side, tsp 5 ml, tbsp 15 ml, **each labelled** |
| Provenance on a number | the sources the api records for the chosen value |
| Egg | extra small … extra large with grams; no volume/piece mixing |
| Converter: 250 g butter → US cups → flip | fraction + exact decimal; flip returns 250 g within rounding |
| No ingredient: 350 °F → °C | 175 °C |
| No ingredient: 1 cup → g | asks for the ingredient |
| Search "Mehl" in English UI, "migdol" in Lithuanian | wheat flour / almond found; nonsense term → "not in the app yet" |
| de / lt / uk UI | decimal comma accepted in input; locale number format in output |
| VoiceOver / TalkBack | amounts read as "US cup: 1.125"-style label and value, never the glyph |
| 1.3× text, dark mode | no clipping; contrast per DESIGN.md |

## 4. Onboarding card (FR-023)

After the api settles flour: the units card's "1 cup flour" shows the same grams as Measures' US
cup of flour.
