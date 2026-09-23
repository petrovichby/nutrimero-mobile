import { describe, expect, it } from "vitest";
import {
  gridCounterCardComplete,
  gridNoComposition,
  gridPackaging,
} from "../test-support/fixtures";
import { productReadiness, readinessOf } from "./readiness";
import type { RuleSetGrid } from "./types";

function ruleSet(grid: { ruleSets: readonly RuleSetGrid[] }, id: string): RuleSetGrid {
  const found = grid.ruleSets.find((entry) => entry.ruleSetId === id);
  if (found === undefined) throw new Error(`no ${id} in fixture`);
  return found;
}

describe("readiness (FR-004, FR-018)", () => {
  it("a complete counter card is ready", () => {
    expect(readinessOf(ruleSet(gridCounterCardComplete, "eu1_counter_card"))).toEqual({
      state: "ready",
    });
  });

  it("packaging is not issuable: the Additives cell is a platform gap (P-02)", () => {
    const readiness = readinessOf(ruleSet(gridPackaging, "eu1_packaging"));
    expect(readiness.state).toBe("notIssuable");
    expect(readiness.state === "notIssuable" && readiness.blockedBy).toEqual(["additives"]);
  });

  it("is derived from the gap, not the rule-set id: packaging with additives held is not blocked", () => {
    const packaging = ruleSet(gridPackaging, "eu1_packaging");
    const heldAdditives: RuleSetGrid = {
      ...packaging,
      cells: packaging.cells.map((cell) =>
        cell.category === "additives" ? { ...cell, complete: true, gaps: [] } : cell,
      ),
    };
    expect(readinessOf(heldAdditives).state).not.toBe("notIssuable");
  });

  it("a product with no composition is incomplete, with every missing required category counted", () => {
    const readiness = readinessOf(ruleSet(gridNoComposition, "eu1_counter_card"));
    expect(readiness).toEqual({ state: "incomplete", missing: 1 });
  });

  it("lists every assigned label type in the api's order", () => {
    expect(productReadiness(gridPackaging).map((entry) => entry.ruleSetId)).toEqual(
      gridPackaging.ruleSets.map((entry) => entry.ruleSetId),
    );
  });
});
