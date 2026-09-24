import type { LocalizedNameSets, SnapshotLocale } from "./fid-snapshot-types";

/**
 * The pantry step's staples (001 FR-007), in the order 07-onboarding-pantry lists them. Curated
 * content: chosen by querying FID at nutrimero-api 4a4356b and confirmed by the owner on
 * 2026-09-23 (13 staples; baking powder is a later FID addition, never a substitute). Names are
 * not here — they come from the generated FID snapshot, displayed exactly as stored (MA-14).
 */
export const STAPLE_FID_IDS = [
  "389D858", // wheat flour
  "4BEC221", // sugar
  "61CAB80", // butter
  "14A64E9", // egg
  "588D661", // dry yeast
  "569480A", // vanilla sugar
  "5CDA2A6", // cocoa powder
  "185FB6F", // honey
  "22F4A0C", // almond
  "007BBC5", // salt
  "4B24CC7", // dark chocolate
  "06CB219", // milk
  "6B83483", // rolled oat
] as const;

export type StapleFidId = (typeof STAPLE_FID_IDS)[number];

/**
 * Curated display names — the owner's pick (2026-09-24) where FID stores several names for a
 * staple in one language. Each is one of FID's own stored names (a test holds it to the snapshot
 * set), never a hand-typed string. Everywhere else the first name in FID's delivery order shows
 * — the rule the api adopts with A11 (one display name per ingredient and language). When A11
 * ships and the snapshot is retaken, each pick either matches the api's display name (drop it)
 * or moves into the api as an owner overlay.
 */
export const CURATED_STAPLE_NAMES: Partial<
  Record<StapleFidId, Partial<Record<SnapshotLocale, string>>>
> = {
  "4BEC221": { de: "Zucker" },
  "14A64E9": { de: "Ei" },
  "007BBC5": { de: "Salz" },
  "4B24CC7": { de: "Zartbitter-Schokolade" },
};

const CURATED_BY_ID = new Map<string, Partial<Record<SnapshotLocale, string>>>(
  Object.entries(CURATED_STAPLE_NAMES),
);

/**
 * The name a staple shows in a UI locale (001 FR-007; MA-14: exactly as stored, never re-cased):
 * the curated pick, else FID's first name. A locale FID has no name for yet (lt, pl, be, uk until
 * api feat/021) falls back to English (FR-017's temporary fallback).
 */
export function stapleName(
  staple: { fidId: string; names: LocalizedNameSets },
  locale: SnapshotLocale,
): string {
  const curated = CURATED_BY_ID.get(staple.fidId)?.[locale];
  return curated ?? staple.names[locale]?.[0] ?? staple.names.en?.[0] ?? staple.fidId;
}
