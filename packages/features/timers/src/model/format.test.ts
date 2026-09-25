import { describe, expect, it } from "vitest";
import { capitalizeFirst, clockText, elapsedShare, timedSeconds, timeOfDay } from "./format";

describe("display helpers (005 screens)", () => {
  it("lays out the readout: h:mm:ss from an hour, m:ss below", () => {
    expect(clockText(4360)).toBe("1:12:40");
    expect(clockText(492)).toBe("8:12");
    expect(clockText(2698)).toBe("44:58");
    expect(clockText(5)).toBe("0:05");
    expect(clockText(-3)).toBe("0:00");
  });

  it("capitalizes a leading stage name, locale-aware and code-point safe", () => {
    expect(capitalizeFirst("bulk ferment is done", "en")).toBe("Bulk ferment is done");
    expect(capitalizeFirst("ïnfusion", "en")).toBe("Ïnfusion");
    expect(capitalizeFirst("илгая расстойка", "be")).toBe("Илгая расстойка");
    expect(capitalizeFirst("🥣 mix", "en")).toBe("🥣 mix");
    expect(capitalizeFirst("", "en")).toBe("");
    // Turkish-style dotted i is locale-aware; our locales keep the plain mapping.
    expect(capitalizeFirst("išankstinis formavimas", "lt")).toBe("Išankstinis formavimas");
  });

  it("formats a clock time in the locale's convention", () => {
    const at = Date.UTC(2026, 8, 25, 13, 44);
    expect(timeOfDay(at, "de")).toMatch(/\d{1,2}:44/);
  });

  it("sums the timed seconds of a routine and the elapsed share of a clock", () => {
    expect(
      timedSeconds([
        { name: { key: "mix" }, seconds: null },
        { name: { key: "bulkFerment" }, seconds: 14_400 },
        { name: { key: "bake" }, seconds: 2700 },
      ]),
    ).toBe(17_100);
    expect(elapsedShare(1_000_000, 100, 1_000_000 - 25_000)).toBeCloseTo(0.75);
    expect(elapsedShare(0, 0, 0)).toBe(1);
  });
});
