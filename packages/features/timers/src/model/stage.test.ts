import { describe, expect, it } from "vitest";
import { isBakeStage, MAX_SECONDS, parseStage, STAGE_KEYS, validName, validSeconds } from "./stage";

describe("stages (005 data-model)", () => {
  it("lists the eleven localized stage picks", () => {
    expect(STAGE_KEYS).toHaveLength(11);
  });

  it("accepts whole seconds from 5 s to 48 h, and nothing else", () => {
    expect(validSeconds(5)).toBe(5);
    expect(validSeconds(MAX_SECONDS)).toBe(172_800);
    expect(validSeconds(4)).toBeNull();
    expect(validSeconds(MAX_SECONDS + 1)).toBeNull();
    expect(validSeconds(90.5)).toBeNull();
  });

  it("trims names and counts characters, not UTF-16 units", () => {
    expect(validName("  Final proof  ")).toBe("Final proof");
    expect(validName("")).toBeNull();
    expect(validName("🥐".repeat(40))).toBe("🥐".repeat(40));
    expect(validName("x".repeat(41))).toBeNull();
  });

  it("parses a picked, a typed and a hands-on stage; rejects the rest", () => {
    expect(parseStage({ name: { key: "coldProof" }, seconds: 43_200 })).toEqual({
      name: { key: "coldProof" },
      seconds: 43_200,
    });
    expect(parseStage({ name: { text: "Levain build" }, seconds: 3600 })).toEqual({
      name: { text: "Levain build" },
      seconds: 3600,
    });
    expect(parseStage({ name: { key: "shape" }, seconds: null })).toEqual({
      name: { key: "shape" },
      seconds: null,
    });
    expect(parseStage({ name: { key: "nap" }, seconds: 60 })).toBeNull();
    expect(parseStage({ name: { key: "bake" }, seconds: 1 })).toBeNull();
  });

  it("knows the bake stages for the one-time Android notice (FR-013a)", () => {
    expect(isBakeStage({ name: { key: "bake" }, seconds: 2700 })).toBe(true);
    expect(isBakeStage({ name: { key: "preheat" }, seconds: 1800 })).toBe(true);
    expect(isBakeStage({ name: { key: "proof" }, seconds: 3600 })).toBe(false);
    expect(isBakeStage({ name: { text: "Bake" }, seconds: 3600 })).toBe(false);
  });
});
