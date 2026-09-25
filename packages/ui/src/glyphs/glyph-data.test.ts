import { describe, expect, it } from "vitest";
import { FILLED_GLYPHS, STRIKE, STROKE_GLYPHS } from "./glyph-data";

const FREE = ["glutenFree", "lactoseFree", "eggFree"] as const;
const CONTAINS = ["wheat", "milk", "egg", "nut", "vegan", "vegetarian"] as const;

const struck = (name: keyof typeof STROKE_GLYPHS) =>
  STROKE_GLYPHS[name].some((shape) => shape.kind === "path" && shape.d === STRIKE);

describe("the owned glyph sets (DESIGN.md *Imagery*)", () => {
  it("strike grammar: every '-free' glyph carries the strike, every 'contains' glyph none", () => {
    expect(FREE.map(struck)).toEqual([true, true, true]);
    expect(CONTAINS.map(struck)).toEqual([false, false, false, false, false, false]);
  });

  it("each '-free' glyph is its 'contains' glyph plus the strike, nothing else", () => {
    const pairs = [
      ["glutenFree", "wheat"],
      ["lactoseFree", "milk"],
      ["eggFree", "egg"],
    ] as const;
    for (const [free, contains] of pairs) {
      expect(STROKE_GLYPHS[free]).toEqual([
        ...STROKE_GLYPHS[contains],
        { kind: "path", d: STRIKE },
      ]);
    }
  });

  it("carries the five tab glyphs and the controls' glyphs", () => {
    for (const name of [
      "book",
      "builder",
      "basket",
      "pantry",
      "dots",
      "check",
      "plus",
      "lock",
    ] as const) {
      expect(FILLED_GLYPHS[name].length).toBeGreaterThan(0);
    }
  });

  it("carries the timers glyphs (spec 005, MA-27), in the family each is drawn in", () => {
    for (const name of [
      "timer",
      "routine",
      "close",
      "pause",
      "play",
      "bell",
      "sun",
      "grip",
      "moreVertical",
      "pencil",
    ] as const) {
      expect(FILLED_GLYPHS[name].length).toBeGreaterThan(0);
    }
    for (const name of ["bellOff", "minusCircle", "info"] as const) {
      expect(STROKE_GLYPHS[name].length).toBeGreaterThan(0);
    }
  });

  it("every glyph draws on the 24-unit grid", () => {
    for (const shapes of [...Object.values(FILLED_GLYPHS), ...Object.values(STROKE_GLYPHS)]) {
      for (const shape of shapes) {
        if (shape.kind === "circle") expect(shape.cx + shape.r).toBeLessThanOrEqual(24);
        if (shape.kind === "rect") expect(shape.x + shape.width).toBeLessThanOrEqual(24);
      }
    }
  });
});
