import { createTranslator } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { agoFor, nextStageLine } from "./describe";

const en = createTranslator("en");

describe("the next-stage line (20–20c)", () => {
  const coldProof = { name: { key: "coldProof" as const }, seconds: 12 * 3600 };
  const shape = { name: { key: "shape" as const }, seconds: null };

  it("promises a notification only when notifications are allowed", () => {
    expect(nextStageLine(coldProof, false, true, en)).toBe("12 h · you’ll get a notification");
    expect(nextStageLine(coldProof, false, false, en)).toBe("12 h");
  });

  it("says hands-on, and take your time once the stage before it has ended", () => {
    expect(nextStageLine(shape, false, true, en)).toBe("hands-on");
    expect(nextStageLine(shape, true, false, en)).toBe("hands-on · take your time");
  });
});

describe("how long ago something ended (16, 18b)", () => {
  it("counts seconds under a minute, then whole minutes", () => {
    expect(agoFor(0, 13_000, en)).toBe("13 s ago");
    expect(agoFor(0, 416_000, en)).toBe("6 min ago");
    expect(agoFor(0, 3_725_000, en)).toBe("1 h 2 min ago");
  });
});
