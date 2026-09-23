import { isPlatformGap } from "./readiness";
import type { GapKind, GridGap, RenderingGap } from "./types";

/**
 * FR-007/FR-008: every gap the api reports becomes one sentence — never dropped, never
 * summarised into "incomplete". A sentence is a catalog key plus parameters; the screen renders
 * it with the i18n runtime. Server-side ids are resolved to names through `NameLookup`; a name
 * the lookup cannot find falls back to the id, so a gap is never hidden for want of a name.
 *
 * `datum.type` and `target.type` are open strings in the contract. The types below are the ones
 * the api emits today (its `calculations/gaps.ts` and the declaration and label layers); any other
 * type renders through the `other` templates with the type shown — still a sentence.
 */
export const KNOWN_DATUM_TYPES = [
  "nutrient",
  "nutrient_values",
  "allergen_states",
  "dietary_states",
  "density",
  "piece_weight",
  "package_content",
  "drained_weight",
  "quantity",
  "unit",
  "unit_is_not_substance",
  "sub_recipe_mass",
  "portion_count",
  "water_content",
  "bound_water_content",
  "nesting",
  "allergen",
  "dietary",
  "additives",
  "composition",
  "region_rule",
  "food_symbol",
  "label_term",
  "no_engine",
  "eu_category",
  "number_format",
  "ingredient_list",
  "identity",
  "designation",
  "additive_category",
] as const;

export const KNOWN_TARGET_TYPES = [
  "fid_ingredient",
  "purchased_item",
  "recipe",
  "product",
  "system",
] as const;

export interface NameLookup {
  fidIngredient(fidId: string): string | null;
  purchasedItem(id: string): string | null;
  recipe(id: string): string | null;
  product(id: string): string | null;
  nutrient(id: number): string | null;
  allergen(id: number): string | null;
}

export type Params = Readonly<Record<string, string | number>>;

export interface Message {
  readonly key: string;
  readonly params: Params;
}

export interface GapSentence {
  readonly kind: GapKind;
  /** FR-008: false when the platform itself cannot hold the datum yet (P-02). */
  readonly fixable: boolean;
  /** `labels.gap.kind.*`, or `labels.gap.systemCannotBeHeld` for a platform gap. */
  readonly kindMessage: Message;
  /** What is missing. */
  readonly what: Message;
  /** Where it is missing; null when the api names no target (rendering gaps). */
  readonly where: Message | null;
  /** How many places the api grouped under this gap (grid gaps; 1 for rendering gaps). */
  readonly occurrences: number;
}

const KNOWN_DATUM = new Set<string>(KNOWN_DATUM_TYPES);
const KNOWN_TARGET = new Set<string>(KNOWN_TARGET_TYPES);

function text(value: unknown): string | null {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : null;
}

function field(record: Readonly<Record<string, unknown>>, name: string): unknown {
  return Object.hasOwn(record, name) ? record[name] : undefined;
}

function whatOf(datum: GridGap["datum"], names: NameLookup): Message {
  const type = datum.type;
  if (!KNOWN_DATUM.has(type)) {
    return { key: "labels.gap.datum.other", params: { type } };
  }
  const key = `labels.gap.datum.${type}`;
  if (type === "nutrient") {
    const id = field(datum, "nutrientId");
    const name = typeof id === "number" ? names.nutrient(id) : null;
    return { key, params: { name: name ?? `#${text(id) ?? "?"}` } };
  }
  if (type === "allergen") {
    const id = field(datum, "allergenId");
    const name = typeof id === "number" ? names.allergen(id) : null;
    return { key, params: { name: name ?? `#${text(id) ?? "?"}` } };
  }
  return { key, params: {} };
}

function whereOf(target: GridGap["target"], names: NameLookup): Message {
  const type = target.type;
  if (type === "system") {
    return { key: "labels.gap.target.system", params: {} };
  }
  const id =
    text(field(target, "fidId")) ??
    text(field(target, "purchasedItemId")) ??
    text(field(target, "recipeId")) ??
    text(field(target, "productId")) ??
    "?";
  if (!KNOWN_TARGET.has(type)) {
    return { key: "labels.gap.target.other", params: { type, name: id } };
  }
  const resolved =
    type === "fid_ingredient"
      ? names.fidIngredient(id)
      : type === "purchased_item"
        ? names.purchasedItem(id)
        : type === "recipe"
          ? names.recipe(id)
          : names.product(id);
  return { key: `labels.gap.target.${type}`, params: { name: resolved ?? id } };
}

export function gridGapSentence(gap: GridGap, names: NameLookup): GapSentence {
  const platform = isPlatformGap(gap);
  return {
    kind: gap.kind,
    fixable: !platform,
    kindMessage: platform
      ? { key: "labels.gap.systemCannotBeHeld", params: {} }
      : { key: `labels.gap.kind.${gap.kind}`, params: {} },
    what: whatOf(gap.datum, names),
    where: whereOf(gap.target, names),
    occurrences: Math.max(gap.occurrences.length, 1),
  };
}

/** Rendering gaps (019) carry a datum and a route, but no target. */
export function renderingGapSentence(gap: RenderingGap, names: NameLookup): GapSentence {
  return {
    kind: gap.kind,
    fixable: gap.kind !== "cannot_be_held",
    kindMessage: { key: `labels.gap.kind.${gap.kind}`, params: {} },
    what: whatOf(gap.datum, names),
    where: null,
    occurrences: 1,
  };
}
