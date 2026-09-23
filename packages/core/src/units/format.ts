import type { Locale } from "../i18n/messages";

/**
 * A number in the locale's own digits, grouping and decimal separator. Unit labels are not added
 * here: they come from the catalogs (and, for recipe quantities, the FID unit catalog).
 */
export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
}
