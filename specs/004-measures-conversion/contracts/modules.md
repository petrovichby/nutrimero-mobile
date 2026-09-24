# Module surfaces: Measures (004)

Shared-package surfaces this feature adds. Every change under `packages/*` is announced to the pro
lane through the coordinator (III seam). No api surface is added or consumed at run time.

## `@nutrimero/core` — `src/units` (extended)

```ts
export type StandardId = "us" | "metric" | "uk" | "au";
export const MEASURING_STANDARDS: Readonly<Record<StandardId, {
  cupMl: number; tbspMl: number; tspMl: number; flOzMl: number | null;
}>>;

/** Snap a cup or spoon amount to a practical fraction (research R7); exact value kept. */
export function toPracticalFraction(value: number, kind: "cup" | "spoon"):
  { whole: number; fraction: string | null; exact: number };

/** Locale-formatted measure with its unit symbol; never a plural on a fraction. */
export function formatMeasure(value: number, unit: MeasureUnit, locale: Locale): string;

/** Parse user input with the locale's decimal separator or "."; null when not a number ≥ 0. */
export function parseAmount(input: string, locale: Locale): number | null;

/** The search fold shared by the snapshot script and the app (research R9). */
export function foldForSearch(text: string): string;
```

Existing `roundToStep`, `gramsFromOunces`, `celsiusFromFahrenheit` … unchanged.

## `@nutrimero/feature-measures` (new)

```ts
export type VolumeResolution =
  | { kind: "value"; gramsPerMl: number; row: VolumeRow; confirmations: readonly EvidenceSource[] }
  | { kind: "inconsistent"; rows: readonly VolumeRow[] }
  | { kind: "none" };

export function resolveVolume(ingredient: MeasuresIngredient, formId: string, stateId: string):
  VolumeResolution;

/** mass↔mass, volume↔volume, volume↔mass, piece↔mass; null when the ingredient cannot. */
export function convert(input: {
  amount: number; from: MeasureUnit; to: MeasureUnit;
  ingredient?: MeasuresIngredient; formId?: string; stateId?: string; sizeClassId?: string;
}): number | null;

export function searchIngredients(query: string, locale: Locale): readonly MeasuresIngredient[];

export function ingredientName(ingredient: MeasuresIngredient, locale: Locale): string; // 001 fallback

export const MEASURES: MeasuresSnapshot; // re-export of the generated snapshot
export { MEASURES_FID_IDS, RULED_PICKS } from "./measures-manifest";

// Screens (after the DESIGN.md port): MeasuresScreen, IngredientMeasures, Converter, ProvenanceSheet
```

## `@nutrimero/feature-home-data` (extended)

```ts
HOME_KEYS.measureStandard = "nutrimero.home.measureStandard";
interface HomeStore {
  measureStandard(): Promise<"usMetric" | "uk" | "au">;
  setMeasureStandard(value: "usMetric" | "uk" | "au"): Promise<void>;
}
```

## `apps/home-baker`

Routes only: `app/measures/index.tsx`, `app/measures/[fidId].tsx`; the entry row or tab per the
approved concept.

## Scripts

- `scripts/fid-snapshot.mts` — second output (research R2); guards unchanged.
- `scripts/measures-report.mts` (`pnpm measures:report`) — prints inconsistencies and
  AI-derived rows lacking evidence, from the committed snapshot; no network.
