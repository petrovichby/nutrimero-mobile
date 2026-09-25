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
    expect(formatDuration(5400, t)).toEqual({
      text: "1\u00a0h 30\u00a0min",
      spoken: "1\u00a0hour 30\u00a0minutes",
    });
    expect(formatDuration(61, t)).toEqual({
      text: "1\u00a0min 1\u00a0s",
      spoken: "1\u00a0minute 1\u00a0second",
    });
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
    expect(formatDuration(5 * 60, createTranslator("pl")).spoken).toBe("5\u00a0minut");
    expect(formatDuration(2 * 60, createTranslator("uk")).spoken).toBe("2\u00a0хвилини");
    expect(formatDuration(21 * 60, createTranslator("lt")).spoken).toBe("21\u00a0minutė");
  });
});

describe("a number and its unit never wrap apart (owner, nutrimero-design 802f19e9)", () => {
  it("binds each number to its unit with U+00A0, and breaks only between parts", () => {
    const { text, spoken } = formatDuration(5400, createTranslator("de"));
    expect(text).toBe("1\u00a0Std. 30\u00a0Min.");
    expect(spoken).toContain("1\u00a0Stunde");
  });
});
