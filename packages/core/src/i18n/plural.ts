import { LOCALES, type Locale } from "./messages";

/**
 * Constitution IX (1.1.0): the CLDR plural categories each UI locale needs, written out so a
 * runtime whose plural data drifts is caught instead of silently falling back to "other".
 */
export const EXPECTED_PLURAL_CATEGORIES: Record<Locale, readonly string[]> = {
  en: ["one", "other"],
  de: ["one", "other"],
  hu: ["one", "other"],
  lt: ["few", "many", "one", "other"],
  be: ["few", "many", "one", "other"],
  pl: ["few", "many", "one", "other"],
  uk: ["few", "many", "one", "other"],
};

export type PluralCategoriesOf = (locale: Locale) => readonly string[];

const intlPluralCategories: PluralCategoriesOf = (locale) =>
  new Intl.PluralRules(locale).resolvedOptions().pluralCategories;

/**
 * Every locale whose runtime plural categories differ from CLDR's, as readable lines. Empty means
 * the runtime is sound. The app runs this at startup in dev builds, so Hermes' `Intl.PluralRules`
 * is checked on each device platform — Vitest can only check Node's.
 */
export function pluralRuleMismatches(categoriesOf: PluralCategoriesOf = intlPluralCategories) {
  const mismatches: string[] = [];
  for (const locale of LOCALES) {
    const actual = [...categoriesOf(locale)].sort().join("/");
    const expected = [...EXPECTED_PLURAL_CATEGORIES[locale]].sort().join("/");
    if (actual !== expected) mismatches.push(`${locale}: expected ${expected}, got ${actual}`);
  }
  return mismatches;
}
