import { createTranslator, LOCALES } from "@nutrimero/core";
import { describe, expect, it } from "vitest";
import { durationParts, formatDuration } from "./duration";

describe("durations in words (FR-022, research R10)", () => {
  it("uses whole units, and drops zero parts", () => {
    expect(durationParts(5400)).toEqual([
      { unit: "hours", value: 1 },
      { unit: "minutes", value: 30 },
    ]);
    expect(durationParts(7200)).toEqual([{ unit: "hours", value: 2 }]);
    expect(durationParts(270)).toEqual([
      { unit: "minutes", value: 4 },
      { unit: "seconds", value: 30 },
    ]);
    expect(durationParts(3661)).toEqual([
      { unit: "hours", value: 1 },
      { unit: "minutes", value: 1 },
    ]);
    expect(durationParts(0)).toEqual([{ unit: "seconds", value: 0 }]);
  });

  it("reads compactly on screen and in words for screen readers (en)", () => {
    const t = createTranslator("en");
    expect(formatDuration(5400, t)).toEqual({ text: "1 h 30 min", spoken: "1 hour 30 minutes" });
    expect(formatDuration(61, t)).toEqual({ text: "1 min 1 s", spoken: "1 minute 1 second" });
  });

  it("formats in every UI language with integer counts only", () => {
    for (const locale of LOCALES) {
      const t = createTranslator(locale);
      for (const seconds of [1, 2, 5, 21, 60, 125, 3600, 7322, 22 * 3600]) {
        const { text, spoken } = formatDuration(seconds, t);
        expect(text.length).toBeGreaterThan(0);
        expect(spoken.length).toBeGreaterThan(0);
        expect(spoken).not.toMatch(/\{|\}/);
      }
    }
  });

  it("declines the Slavic and Baltic plurals", () => {
    expect(formatDuration(5 * 60, createTranslator("pl")).spoken).toBe("5 minut");
    expect(formatDuration(2 * 60, createTranslator("uk")).spoken).toBe("2 хвилини");
    expect(formatDuration(21 * 60, createTranslator("lt")).spoken).toBe("21 minutė");
  });
});
