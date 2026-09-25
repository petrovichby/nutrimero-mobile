import { createTranslator } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { agoFor, leftLabel, nextStageLine } from "./describe";

const en = createTranslator("en");

describe("the next-stage line (20–20c)", () => {
  const coldProof = { name: { key: "coldProof" as const }, seconds: 12 * 3600 };
  const shape = { name: { key: "shape" as const }, seconds: null };

  it("promises a notification only when notifications are allowed", () => {
    expect(nextStageLine(coldProof, false, true, en)).toBe("12\u00a0h · you’ll get a notification");
    expect(nextStageLine(coldProof, false, false, en)).toBe("12\u00a0h");
  });

  it("says hands-on, and take your time once the stage before it has ended", () => {
    expect(nextStageLine(shape, false, true, en)).toBe("hands-on");
    expect(nextStageLine(shape, true, false, en)).toBe("hands-on · take your time");
  });
});

describe("how long ago something ended (16, 18b)", () => {
  it('reads "just now" in the first minute (18c), then whole minutes', () => {
    expect(agoFor(0, 0, en)).toBe("just now");
    expect(agoFor(0, 59_000, en)).toBe("just now");
    expect(agoFor(0, 60_000, en)).toBe("1\u00a0min ago");
    expect(agoFor(0, 416_000, en)).toBe("6\u00a0min ago");
    expect(agoFor(0, 3_725_000, en)).toBe("1\u00a0h 2\u00a0min ago");
  });
});

describe("the readout, spoken (18d, 20e)", () => {
  it("says it is paused before the time left", () => {
    expect(leftLabel(4200, false, en, "en")).toBe("1\u00a0hour 10\u00a0minutes left");
    expect(leftLabel(4200, true, en, "en")).toBe("Paused, 1\u00a0hour 10\u00a0minutes left");
  });
});
