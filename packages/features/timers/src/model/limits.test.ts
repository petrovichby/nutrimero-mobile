import { describe, expect, it } from "vitest";
import { atActiveLimit, atSavedLimit, MAX_ACTIVE_ITEMS, MAX_SAVED_ROUTINES } from "./limits";

describe("limit refusals (17c, 19d)", () => {
  it("refuses an 11th active timer or routine, not a 10th", () => {
    expect(MAX_ACTIVE_ITEMS).toBe(10);
    expect(atActiveLimit(9)).toBe(false);
    expect(atActiveLimit(10)).toBe(true);
  });

  it("refuses a 21st saved routine, but never an edit of a saved one", () => {
    expect(MAX_SAVED_ROUTINES).toBe(20);
    expect(atSavedLimit(19, false)).toBe(false);
    expect(atSavedLimit(20, false)).toBe(true);
    expect(atSavedLimit(20, true)).toBe(false);
  });
});
