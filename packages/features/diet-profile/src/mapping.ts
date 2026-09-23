import type { DietaryOption } from "@nutrimero/feature-home-data";

/**
 * The dietary option → FID mapping — the owner's ruling of 2026-09-23 (001 FR-018), the
 * conservative default: Gluten-free ⇒ cereals containing gluten; Lactose-free ⇒ milk (incl.
 * lactose); Nut allergy ⇒ tree nuts AND peanuts; Egg-free ⇒ eggs; Vegan / Vegetarian ⇒ the FID
 * dietary facts. Codes are FID allergen codes (EU Annex II numbering in the comments), resolved
 * against the shipped snapshot by test.
 */
export type OptionRule =
  | { kind: "allergens"; codes: readonly string[] }
  | { kind: "dietaryFact"; fact: "vegan" | "vegetarian" };

export const DIETARY_MAPPING: Record<DietaryOption, OptionRule> = {
  glutenFree: { kind: "allergens", codes: ["CCG"] }, // EU 1 — cereals containing gluten
  lactoseFree: { kind: "allergens", codes: ["MIL"] }, // EU 7 — milk and products (incl. lactose)
  nutAllergy: { kind: "allergens", codes: ["NUT", "PEN"] }, // EU 8 tree nuts AND EU 5 peanuts
  eggFree: { kind: "allergens", codes: ["EGG"] }, // EU 3 — eggs
  vegan: { kind: "dietaryFact", fact: "vegan" },
  vegetarian: { kind: "dietaryFact", fact: "vegetarian" },
};

/** Every allergen code the mapping needs — the vocabulary the FID snapshot must carry (FR-014). */
export const MAPPED_ALLERGEN_CODES: readonly string[] = [
  ...new Set(
    Object.values(DIETARY_MAPPING).flatMap((rule) => (rule.kind === "allergens" ? rule.codes : [])),
  ),
];
