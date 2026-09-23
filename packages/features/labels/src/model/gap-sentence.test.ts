import { messages } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { hasEnKey } from "../test-support/catalog";
import {
  counterCardDeDE,
  counterCardEnUS,
  gridCounterCardComplete,
  gridNoComposition,
  gridPackaging,
  noEngine,
  packagingEnUS,
} from "../test-support/fixtures";
import {
  type GapSentence,
  gridGapSentence,
  KNOWN_DATUM_TYPES,
  KNOWN_TARGET_TYPES,
  type NameLookup,
  renderingGapSentence,
} from "./gap-sentence";

function must<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`fixture has no ${what}`);
  return value;
}

const names: NameLookup = {
  fidIngredient: (id) => (id === "389D858" ? "Weizenmehl" : null),
  purchasedItem: () => null,
  recipe: () => null,
  product: () => null,
  nutrient: (id) => (id === 1 ? "Energie" : null),
  allergen: () => null,
};

const grids = [gridCounterCardComplete, gridPackaging, gridNoComposition];
const gridGaps = grids.flatMap((grid) =>
  grid.ruleSets.flatMap((ruleSet) => ruleSet.cells.flatMap((cell) => cell.gaps)),
);
const renderingGaps = [counterCardDeDE, counterCardEnUS, packagingEnUS, noEngine].flatMap(
  (rendering) => rendering.gaps,
);

function keysOf(sentence: GapSentence): string[] {
  return [
    sentence.kindMessage.key,
    sentence.what.key,
    ...(sentence.where ? [sentence.where.key] : []),
  ];
}

describe("gap sentences (FR-007, FR-008, SC-002)", () => {
  it("the fixtures hold real gaps to test against", () => {
    expect(gridGaps.length).toBeGreaterThan(5);
    expect(renderingGaps.length).toBeGreaterThan(0);
  });

  it("every gap the api reports becomes exactly one sentence whose keys exist in the catalog", () => {
    const sentences = [
      ...gridGaps.map((gap) => gridGapSentence(gap, names)),
      ...renderingGaps.map((gap) => renderingGapSentence(gap, names)),
    ];
    expect(sentences).toHaveLength(gridGaps.length + renderingGaps.length);
    const missing = sentences.flatMap(keysOf).filter((key) => !hasEnKey(key));
    expect(missing).toEqual([]);
  });

  it("the platform's own gap reads as 'not yet possible', not as data to add (P-02)", () => {
    const additives = gridPackaging.ruleSets
      .flatMap((ruleSet) => ruleSet.cells)
      .filter((cell) => cell.category === "additives")
      .flatMap((cell) => cell.gaps);
    const sentence = gridGapSentence(must(additives[0], "additives gap"), names);
    expect(sentence.fixable).toBe(false);
    expect(sentence.kindMessage.key).toBe("labels.gap.systemCannotBeHeld");
    expect(sentence.where?.key).toBe("labels.gap.target.system");
  });

  it("resolves names, and falls back to the id rather than hiding the gap", () => {
    const flour = must(
      gridGaps.find(
        (gap) => gap.target.type === "fid_ingredient" && gap.target.fidId === "389D858",
      ),
      "wheat flour gap",
    );
    expect(gridGapSentence(flour, names).where?.params).toEqual({ name: "Weizenmehl" });
    const unnamed = gridGapSentence(
      { ...flour, target: { type: "fid_ingredient", fidId: "0A0D77E" } },
      names,
    );
    expect(unnamed.where?.params).toEqual({ name: "0A0D77E" });
  });

  it("an unknown datum or target type still becomes a sentence, naming the type", () => {
    const sentence = gridGapSentence(
      {
        kind: "not_recorded",
        datum: { type: "something_new" },
        target: { type: "warehouse", warehouseId: "w1" },
        occurrences: [{ path: [] }],
      },
      names,
    );
    expect(sentence.what).toEqual({
      key: "labels.gap.datum.other",
      params: { type: "something_new" },
    });
    expect(sentence.where?.key).toBe("labels.gap.target.other");
  });

  it("the no-engine rendering gap is named", () => {
    const [gap] = noEngine.gaps;
    expect(gap && renderingGapSentence(gap, names).what.key).toBe("labels.gap.datum.no_engine");
  });

  it("the catalog holds a template for every known kind, datum and target", () => {
    const keys = [
      "labels.gap.kind.not_recorded",
      "labels.gap.kind.cannot_be_held",
      "labels.gap.kind.mass_unresolvable",
      "labels.gap.systemCannotBeHeld",
      "labels.gap.datum.other",
      "labels.gap.target.other",
      ...KNOWN_DATUM_TYPES.map((type) => `labels.gap.datum.${type}`),
      ...KNOWN_TARGET_TYPES.map((type) => `labels.gap.target.${type}`),
    ];
    expect(keys.filter((key) => !hasEnKey(key))).toEqual([]);
    expect(Object.keys(messages)).toHaveLength(7);
  });
});
