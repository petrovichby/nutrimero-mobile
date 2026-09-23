import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES, messages } from "../packages/core/src/i18n/messages";
import { FONT_FILES, type FontName, stampFace, uiFace } from "../packages/ui/src/fonts";
import { codePointsOf } from "./font-cmap";

/**
 * DESIGN.md 0.5.0 G-1 / G-2 and ADR 0001 *Fonts*, made mechanical: each locale's text sets in its
 * ruled face, and that face actually carries every character the locale's strings use — so no
 * translation can silently fall back to a platform font.
 */
const FONTS_DIR = path.resolve(__dirname, "../packages/ui/assets/fonts");

const cmaps = new Map<FontName, Set<number>>();
function coverage(face: FontName) {
  let points = cmaps.get(face);
  if (!points) {
    points = codePointsOf(readFileSync(path.join(FONTS_DIR, FONT_FILES[face])));
    cmaps.set(face, points);
  }
  return points;
}

function missing(text: string, face: FontName) {
  const points = coverage(face);
  return [...new Set(text)].filter(
    (char) => !/\s/.test(char) && !points.has(char.codePointAt(0) ?? 0),
  );
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value !== null && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("the font registry (G-1, G-2)", () => {
  it("sets each locale's UI text and stamp in its ruled face", () => {
    const faces = Object.fromEntries(
      LOCALES.map((locale) => [locale, [uiFace(locale), stampFace(locale)]]),
    );
    expect(faces).toEqual({
      en: ["PlusJakartaSans-400", "StardosStencil-700"],
      de: ["PlusJakartaSans-400", "StardosStencil-700"],
      hu: ["PlusJakartaSans-400", "StardosStencil-700"],
      lt: ["PlusJakartaSans-400", "StardosStencil-700"],
      pl: ["PlusJakartaSans-400", "StardosStencil-700"],
      be: ["Onest-400", "YesevaOne-400"],
      uk: ["Onest-400", "YesevaOne-400"],
    });
  });

  it("ships every registered file, with the OFL licence of its family", () => {
    for (const file of Object.values(FONT_FILES)) {
      expect(existsSync(path.join(FONTS_DIR, file)), file).toBe(true);
    }
    for (const family of [
      "plus-jakarta-sans",
      "onest",
      "pacifico",
      "stardos-stencil",
      "yeseva-one",
    ]) {
      const licence = readFileSync(path.join(FONTS_DIR, "licenses", `${family}-OFL.txt`), "utf8");
      expect(licence, family).toContain("SIL Open Font License");
    }
  });
});

describe("character coverage", () => {
  for (const locale of LOCALES) {
    it(`${locale}: every catalog string is covered by its UI face`, () => {
      expect(missing(strings(messages[locale]).join(""), uiFace(locale))).toEqual([]);
    });

    it(`${locale}: the stamp string, in capitals by role, is covered by its stamp face`, () => {
      const stamp = messages[locale].provenance.stamp.aiIllustration.toLocaleUpperCase(locale);
      expect(missing(stamp, stampFace(locale))).toEqual([]);
    });
  }

  it("the reader finds a face's gaps (Plus Jakarta Sans carries no Cyrillic)", () => {
    expect(missing("Ілюстрацыя", "PlusJakartaSans-400").length).toBeGreaterThan(0);
  });
});
