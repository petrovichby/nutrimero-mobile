# Module surfaces: Measures (004)

Shared-package surfaces this feature adds. Every change under `packages/*` is announced to the pro
lane through the coordinator (III seam). No api surface is added or consumed at run time.

## `@nutrimero/core` — `src/units` (extended; no unit constants)

```ts
/** Apply a unit factor read from the snapshot — core defines no unit (gate-1 correction). */
export function convertByFactor(value: number, fromFactor: number, toFactor: number): number;

/** Snap a cup or spoon amount to a practical fraction (research R7); exact value kept. */
export function toPracticalFraction(value: number, kind: "cup" | "spoon"):
  { whole: number; fraction: string | null; exact: number };

/** Locale-formatted amount with the unit's catalog symbol; never a plural on a fraction. */
export function formatMeasure(value: number, unitSymbol: string, locale: Locale): string;

/** Parse user input with the locale's decimal separator or "."; null when not a number ≥ 0. */
export function parseAmount(input: string, locale: Locale): number | null;

/** The search fold shared by the snapshot script and the app (research R9). */
export function foldForSearch(text: string): string;
```

`GRAMS_PER_OUNCE` (001) moves onto the api's ounce definition (research R6). °C ↔ °F stays (a
formula).

## `@nutrimero/feature-measures` (new)

```ts
/** The api's chosen density for this form and state, or null — never computed here. */
export function chosenDensity(ingredient: MeasuresIngredient, formId: string, stateId: string):
  ChosenDensity | null;

/** mass↔mass, volume↔volume, volume↔mass, piece↔mass; null when the ingredient cannot. */
export function convert(input: {
  amount: number; from: MeasureUnit; to: MeasureUnit;
  ingredient?: MeasuresIngredient; formId?: string; stateId?: string; sizeClassId?: string;
}): number | null;

export function searchIngredients(query: string, locale: Locale): readonly MeasuresIngredient[];

export function ingredientName(ingredient: MeasuresIngredient, locale: Locale): string; // 001 fallback

export const MEASURES: MeasuresSnapshot; // re-export of the generated snapshot
export { MEASURES_FID_IDS } from "./measures-set";

// Screens (after the DESIGN.md port): MeasuresScreen, IngredientMeasures, Converter, ProvenanceSheet
```

## `@nutrimero/feature-home-data` (widened)

```ts
export const UNITS = ["metric", "us", "ukImperial"] as const; // legacy stored "imperial" reads as "us"
```

## `apps/home-baker`

Routes only: `app/measures/index.tsx`, `app/measures/[fidId].tsx`; the entry row or tab per the
approved concept.

## Scripts

- `scripts/fid-snapshot.mts` — second output (research R2); guards unchanged.
- `scripts/measures-survey.mts` — for the evidence only: lists the draft set's AI-derived rows
  and its rows more than 5 % apart, from the local api or the seed files. The app never runs it.
