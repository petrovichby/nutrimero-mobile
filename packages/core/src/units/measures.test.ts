import { describe, expect, it } from "vitest";
import { convertByFactor } from "./convert";
import { foldForSearch, foldWithoutNormalize } from "./fold";
import { formatMeasure, formatSpokenAmount } from "./format";
import { toPracticalFraction } from "./fraction";
import { parseAmount } from "./parse";

const NBSP = " ";

describe("convertByFactor (factors from the api, 004 FR-010)", () => {
  it("converts through a common base, both ways", () => {
    // 1 cup of 250 ml in US cups of 236.59 ml, and back.
    const us = convertByFactor(1, 250, 236.59);
    expect(us).toBeCloseTo(1.0567, 4);
    expect(convertByFactor(us, 236.59, 250)).toBeCloseTo(1, 12);
  });

  it("refuses a missing or non-positive factor", () => {
    expect(() => convertByFactor(1, 0, 5)).toThrow(RangeError);
    expect(() => convertByFactor(1, 5, Number.NaN)).toThrow(RangeError);
  });
});

describe("toPracticalFraction (004 FR-013)", () => {
  it("snaps cups to eighths and thirds, keeping the exact value", () => {
    expect(toPracticalFraction(1.125, "cup")).toEqual({ whole: 1, fraction: "⅛", exact: 1.125 });
    expect(toPracticalFraction(0.33, "cup").fraction).toBe("⅓");
    expect(toPracticalFraction(0.66, "cup").fraction).toBe("⅔");
    expect(toPracticalFraction(2.5, "cup")).toMatchObject({ whole: 2, fraction: "½" });
  });

  it("snaps spoons to quarters only", () => {
    expect(toPracticalFraction(0.33, "spoon").fraction).toBe("¼");
    expect(toPracticalFraction(1.7, "spoon")).toMatchObject({ whole: 1, fraction: "¾" });
  });

  it("carries a remainder close to one into the whole number", () => {
    expect(toPracticalFraction(1.97, "cup")).toMatchObject({ whole: 2, fraction: null });
    expect(toPracticalFraction(3, "spoon")).toMatchObject({ whole: 3, fraction: null });
  });

  it("refuses negative and non-finite amounts", () => {
    expect(() => toPracticalFraction(-1, "cup")).toThrow(RangeError);
    expect(() => toPracticalFraction(Number.POSITIVE_INFINITY, "cup")).toThrow(RangeError);
  });
});

describe("formatMeasure (004 FR-013, FR-014, FR-015)", () => {
  it("rounds grams to 1 g below 100 g and to 5 g from 100 g", () => {
    expect(formatMeasure(93.6, "grams", "g", "en")).toBe(`94${NBSP}g`);
    expect(formatMeasure(137.2, "grams", "g", "en")).toBe(`135${NBSP}g`);
    expect(formatMeasure(1253, "grams", "g", "de")).toBe(`1.255${NBSP}g`);
  });

  it("shows cups and spoons as kitchen fractions, never pluralised", () => {
    expect(formatMeasure(1.125, "cup", "cup", "en")).toBe(`1⅛${NBSP}cup`);
    expect(formatMeasure(0.75, "spoon", "tsp", "en")).toBe(`¾${NBSP}tsp`);
    expect(formatMeasure(2, "cup", "cup", "en")).toBe(`2${NBSP}cup`);
  });

  it("shows an amount too small to snap as its exact value, not as zero", () => {
    expect(formatMeasure(0.04, "cup", "cup", "de")).toBe(`0,04${NBSP}cup`);
    expect(formatMeasure(0, "cup", "cup", "en")).toBe(`0${NBSP}cup`);
  });

  it("rounds oven temperatures to 5 degrees and other units to two decimals, per locale", () => {
    expect(formatMeasure(176.7, "oven", "°C", "en")).toBe(`175${NBSP}°C`);
    expect(formatMeasure(8.8185, "decimal", "oz", "pl")).toBe(`8,82${NBSP}oz`);
    expect(formatMeasure(250.4, "millilitres", "ml", "lt")).toBe(`250${NBSP}ml`);
  });

  it("speaks a decimal, never a glyph (gate-2 item 4)", () => {
    expect(formatSpokenAmount(1.125, "en")).toBe("1.125");
    expect(formatSpokenAmount(1.125, "de")).toBe("1,125");
  });
});

describe("parseAmount (004 FR-014)", () => {
  it("accepts a comma or a point as the decimal mark in every locale", () => {
    expect(parseAmount("1,5")).toBe(1.5);
    expect(parseAmount("1.5")).toBe(1.5);
    expect(parseAmount(" 250 ")).toBe(250);
    expect(parseAmount(",5")).toBe(0.5);
  });

  it("accepts kitchen fractions", () => {
    expect(parseAmount("½")).toBe(0.5);
    expect(parseAmount("1½")).toBe(1.5);
    expect(parseAmount("1 ½")).toBe(1.5);
    expect(parseAmount("3/4")).toBe(0.75);
    expect(parseAmount("1 1/2")).toBe(1.5);
  });

  it("refuses what is not a finite, non-negative number", () => {
    for (const input of ["", "  ", "-1", "abc", "1,234.5", "1/0", "1..2", "½½"]) {
      expect(parseAmount(input), input).toBeNull();
    }
  });
});

describe("foldForSearch (004 FR-012, research R9)", () => {
  it("folds case and diacritics in every UI locale's script", () => {
    expect(foldForSearch("Weizenmehl")).toBe("weizenmehl");
    expect(foldForSearch("migdolų miltai")).toBe("migdolu miltai");
    expect(foldForSearch("Búzaliszt")).toBe("buzaliszt");
    expect(foldForSearch("Mąka ŁATWA")).toBe("maka latwa");
    expect(foldForSearch("Süßrahm")).toBe("sussrahm");
    expect(foldForSearch("Мёд")).toBe("мед");
  });

  it("collapses spacing", () => {
    expect(foldForSearch("  rolled   oat ")).toBe("rolled oat");
  });

  it("folds the same without String#normalize (Hermes fallback)", () => {
    for (const text of ["migdolų", "Búzaliszt", "Mąka ŁATWA", "Süßrahm", "Мёд", "Ґлазур"]) {
      expect(foldWithoutNormalize(text), text).toBe(foldForSearch(text));
    }
  });
});
