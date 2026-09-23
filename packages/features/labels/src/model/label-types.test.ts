import { describe, expect, it } from "vitest";
import { hasEnKey } from "../test-support/catalog";
import { ruleSets } from "../test-support/fixtures";
import { labelTypeName, offeredLabelTypes } from "./label-types";

describe("label types (FR-025)", () => {
  it("offers the active, offered rule-sets and never the background ones", () => {
    const offered = offeredLabelTypes(ruleSets).map((item) => item.id);
    expect(offered).toHaveLength(8);
    expect(offered).not.toContain("japan_counter_card");
    expect(offered).toContain("eu1_counter_card");
  });

  it("names every seeded rule-set from the catalogs", () => {
    for (const item of ruleSets.items) {
      expect(labelTypeName(item, hasEnKey)).toEqual({
        message: { key: `labels.labelType.${item.id}`, params: {} },
      });
    }
  });

  it("falls back to the api's name for a rule-set the catalogs do not know", () => {
    expect(labelTypeName({ id: "mars_counter_card", name: "Mars counter card" }, hasEnKey)).toEqual(
      {
        apiName: "Mars counter card",
      },
    );
  });
});
