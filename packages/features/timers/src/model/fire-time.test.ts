import { describe, expect, it } from "vitest";
import { notBefore } from "./fire-time";

describe("a notification never fires before the end (FR-013, SC-001; T027)", () => {
  it("rounds a fractional end up to the next whole second", () => {
    expect(notBefore(1_790_325_053_879)).toBe(1_790_325_054_000);
    expect(notBefore(1_790_325_053_001)).toBe(1_790_325_054_000);
  });

  it("leaves a whole-second end as it is", () => {
    expect(notBefore(1_790_325_054_000)).toBe(1_790_325_054_000);
  });

  it("is never before the end, and at most a second after it", () => {
    for (const endAt of [0, 1, 999, 1000, 1001, 123_456_789]) {
      expect(notBefore(endAt)).toBeGreaterThanOrEqual(endAt);
      expect(notBefore(endAt) - endAt).toBeLessThan(1000);
    }
  });
});
