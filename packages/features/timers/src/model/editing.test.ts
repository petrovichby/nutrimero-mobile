import { describe, expect, it } from "vitest";
import { dropIndex, moveEntry, stepAside } from "./editing";

describe("routine editor reorder (19)", () => {
  it("moves an entry up or down, and ignores a move out of range", () => {
    const list = ["mix", "bulk", "shape", "bake"];
    expect(moveEntry(list, 0, 2)).toEqual(["bulk", "shape", "mix", "bake"]);
    expect(moveEntry(list, 3, 0)).toEqual(["bake", "mix", "bulk", "shape"]);
    expect(moveEntry(list, 0, -1)).toBe(list);
    expect(moveEntry(list, 3, 4)).toBe(list);
  });

  it("drops a dragged row on the nearest slot, inside the list", () => {
    expect(dropIndex(1, 0, 60, 5)).toBe(1);
    expect(dropIndex(1, 29, 60, 5)).toBe(1);
    expect(dropIndex(1, 31, 60, 5)).toBe(2);
    expect(dropIndex(1, -200, 60, 5)).toBe(0);
    expect(dropIndex(1, 999, 60, 5)).toBe(4);
    expect(dropIndex(1, 999, 0, 5)).toBe(1);
  });

  it("steps the rows between aside, toward the dragged row's old place", () => {
    // Row 1 dragged down to 3: rows 2 and 3 move up; 0 and 4 stay.
    expect([0, 2, 3, 4].map((i) => stepAside(i, 1, 3, 60))).toEqual([0, -60, -60, 0]);
    // Row 3 dragged up to 1: rows 1 and 2 move down.
    expect([0, 1, 2, 4].map((i) => stepAside(i, 3, 1, 60))).toEqual([0, 60, 60, 0]);
  });
});
