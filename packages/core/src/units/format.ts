import type { Locale } from "../i18n/messages";
import { toPracticalFraction } from "./fraction";

/**
 * A number in the locale's own digits, grouping and decimal separator. Unit labels are not added
 * here: they come from the catalogs (and, for recipe quantities, the FID unit catalog).
 */
export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}

/**
 * How a measure is rounded for display (004 FR-013): grams to 1 g below 100 g and 5 g from 100 g;
 * millilitres to 1 ml; cups and spoons to practical fractions; oven temperatures to 5 degrees;
 * everything else (ounces, pounds, fluid ounces, pints) to two decimals.
 */
export type MeasureKind = "grams" | "millilitres" | "cup" | "spoon" | "oven" | "decimal";

/** Keeps a quantity and its unit on one line (the units tile rule, 07-onboarding-units). */
const NBSP = " ";

function amount(value: number, kind: MeasureKind, locale: Locale): string {
  switch (kind) {
    case "grams":
      return formatNumber(value < 100 ? Math.round(value) : Math.round(value / 5) * 5, locale, 0);
    case "millilitres":
      return formatNumber(Math.round(value), locale, 0);
    case "oven":
      return formatNumber(Math.round(value / 5) * 5, locale, 0);
    case "decimal":
      return formatNumber(value, locale, 2);
    case "cup":
    case "spoon": {
      const { whole, fraction } = toPracticalFraction(value, kind);
      if (fraction === null) {
        // Too small to snap to a kitchen fraction: the exact amount, not a misleading "0".
        return whole === 0 && value > 0
          ? formatNumber(value, locale, 2)
          : formatNumber(whole, locale, 0);
      }
      return whole === 0 ? fraction : `${formatNumber(whole, locale, 0)}${fraction}`;
    }
  }
}

/**
 * A measure for display: the rounded amount and the unit's symbol, joined by a no-break space.
 * The symbol comes from the catalogs, never pluralised: a fractional amount is a number, not a
 * count (ruling 2026-09-24).
 */
export function formatMeasure(
  value: number,
  kind: MeasureKind,
  unitSymbol: string,
  locale: Locale,
): string {
  return `${amount(value, kind, locale)}${NBSP}${unitSymbol}`;
}

/**
 * The amount a screen reader speaks (004 FR-021, gate-2 item 4): a decimal in the locale's format,
 * never a fraction glyph. The catalog composes it with the unit's name as label and value.
 */
export function formatSpokenAmount(value: number, locale: Locale): string {
  return formatNumber(value, locale, 3);
}
