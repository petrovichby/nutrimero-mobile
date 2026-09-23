import { DIETARY_OPTIONS } from "@nutrimero/feature-home-data";
import { describe, expect, it } from "vitest";
import { evaluateFit, type FidState, type Fit } from "./evaluate-fit";
import { DIETARY_MAPPING, MAPPED_ALLERGEN_CODES } from "./mapping";

const STATES: readonly FidState[] = ["yes", "no", "unknown", "depends_on_brand"];
const ALLERGEN_EXPECTED: Record<FidState, Fit> = {
  yes: "notFitting",
  no: "fits",
  unknown: "check",
  depends_on_brand: "check",
};
const FACT_EXPECTED: Record<FidState, Fit> = {
  yes: "fits",
  no: "notFitting",
  unknown: "check",
  depends_on_brand: "check",
};

describe("the owner's dietary mapping (001 FR-018)", () => {
  it("maps each option as ruled", () => {
    expect(DIETARY_MAPPING).toEqual({
      glutenFree: { kind: "allergens", codes: ["CCG"] },
      lactoseFree: { kind: "allergens", codes: ["MIL"] },
      nutAllergy: { kind: "allergens", codes: ["NUT", "PEN"] },
      eggFree: { kind: "allergens", codes: ["EGG"] },
      vegan: { kind: "dietaryFact", fact: "vegan" },
      vegetarian: { kind: "dietaryFact", fact: "vegetarian" },
    });
    expect([...MAPPED_ALLERGEN_CODES].sort()).toEqual(["CCG", "EGG", "MIL", "NUT", "PEN"]);
  });
});

describe("evaluateFit — every option × every state", () => {
  for (const option of DIETARY_OPTIONS) {
    const rule = DIETARY_MAPPING[option];
    for (const state of STATES) {
      if (rule.kind === "allergens") {
        it(`${option}: every mapped allergen ${state} ⇒ ${ALLERGEN_EXPECTED[state]}`, () => {
          const allergens = Object.fromEntries(rule.codes.map((code) => [code, state]));
          expect(evaluateFit([option], { allergens, dietary: {} })).toBe(ALLERGEN_EXPECTED[state]);
        });
      } else {
        it(`${option}: dietary fact ${state} ⇒ ${FACT_EXPECTED[state]}`, () => {
          expect(evaluateFit([option], { allergens: {}, dietary: { [rule.fact]: state } })).toBe(
            FACT_EXPECTED[state],
          );
        });
      }
    }
    it(`${option}: missing data is never read as safe ⇒ check`, () => {
      expect(evaluateFit([option], { allergens: {}, dietary: {} })).toBe("check");
    });
  }
});

describe("evaluateFit — combining", () => {
  it("nut allergy: peanuts alone make it not fit, even when tree nuts are absent", () => {
    expect(evaluateFit(["nutAllergy"], { allergens: { NUT: "no", PEN: "yes" }, dietary: {} })).toBe(
      "notFitting",
    );
    expect(
      evaluateFit(["nutAllergy"], { allergens: { NUT: "no", PEN: "unknown" }, dietary: {} }),
    ).toBe("check");
  });

  it("the worst result across the profile wins", () => {
    const facts = {
      allergens: { CCG: "no", MIL: "unknown", EGG: "yes" },
      dietary: { vegan: "yes" },
    } as const;
    expect(evaluateFit(["glutenFree", "vegan"], facts)).toBe("fits");
    expect(evaluateFit(["glutenFree", "lactoseFree"], facts)).toBe("check");
    expect(evaluateFit(["glutenFree", "lactoseFree", "eggFree"], facts)).toBe("notFitting");
  });

  it("an empty profile fits", () => {
    expect(evaluateFit([], { allergens: {}, dietary: {} })).toBe("fits");
  });
});
