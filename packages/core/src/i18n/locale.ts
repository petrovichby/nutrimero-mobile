import { LOCALES, type Locale } from "./messages";

export const FALLBACK_LOCALE: Locale = "en";

/**
 * The locales a screen may render. be and uk are catalogued and their faces are ruled (design G-2:
 * Onest for UI text, Yeseva One for stamps), but they render only once those faces are vendored
 * in packages/ui (001 phase 3c). That change widens this list to all of LOCALES.
 */
export const RENDERED_LOCALES: readonly Locale[] = ["en", "de", "hu", "lt", "pl"];

/**
 * The UI locale for a device's preferred languages (BCP 47 tags, most preferred first). The first
 * tag whose language is a UI locale decides: a rendered locale is used as is, an unrendered one
 * falls back to English. No UI locale in the list also means English.
 */
export function resolveLocale(
  deviceLanguageTags: readonly string[],
  rendered: readonly Locale[] = RENDERED_LOCALES,
): Locale {
  for (const tag of deviceLanguageTags) {
    const language = tag.toLowerCase().split(/[-_]/)[0];
    const locale = LOCALES.find((candidate) => candidate === language);
    if (locale) return rendered.includes(locale) ? locale : FALLBACK_LOCALE;
  }
  return FALLBACK_LOCALE;
}
