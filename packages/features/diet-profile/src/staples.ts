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
