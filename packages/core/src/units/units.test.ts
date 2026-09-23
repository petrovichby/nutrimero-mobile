import { describe, expect, it } from "vitest";
import {
  celsiusFromFahrenheit,
  fahrenheitFromCelsius,
  gramsFromOunces,
  ouncesFromGrams,
  roundToStep,
} from "./convert";
import { formatNumber } from "./format";

describe("unit conversion", () => {
  it("converts oven temperatures both ways", () => {
    expect(celsiusFromFahrenheit(212)).toBe(100);
    expect(fahrenheitFromCelsius(180)).toBe(356);
    expect(roundToStep(celsiusFromFahrenheit(350), 5)).toBe(175);
  });

  it("converts weights both ways", () => {
    expect(gramsFromOunces(1)).toBeCloseTo(28.35, 2);
    expect(ouncesFromGrams(gramsFromOunces(4))).toBeCloseTo(4, 10);
  });
});

describe("formatNumber", () => {
  it("uses each locale's separators", () => {
    expect(formatNumber(1234.5, "en")).toBe("1,234.5");
    expect(formatNumber(1234.5, "de")).toBe("1.234,5");
    expect(formatNumber(1234.5, "pl")).toBe("1234,5");
    expect(formatNumber(12345.5, "lt")).toBe("12 345,5");
  });

  it("limits fraction digits", () => {
    expect(formatNumber(2.345, "en", 2)).toBe("2.35");
    expect(formatNumber(120, "en")).toBe("120");
  });
});
