import { LOCALES, type Locale } from "./messages";

export const FALLBACK_LOCALE: Locale = "en";

/**
 * The locales a screen may render: all seven. be and uk render since their ruled faces (G-1 Onest
 * for UI text, G-2 Yeseva One for the stamp) are vendored in packages/ui (001 phase 3c).
 */
export const RENDERED_LOCALES: readonly Locale[] = LOCALES;

/**
 * The UI locale (Constitution IX 1.2.0). The user's in-app choice, when stored, decides first
 * (rule 2). Otherwise the device's preferred languages (BCP 47 tags, most preferred first) do: the
 * first tag whose language is a UI locale decides, a rendered locale is used as is, an unrendered
 * one falls back to English; no UI locale in the list also means English (rule 1).
 */
export function resolveLocale(
  override: Locale | null,
  deviceLanguageTags: readonly string[],
  rendered: readonly Locale[] = RENDERED_LOCALES,
): Locale {
  if (override !== null && rendered.includes(override)) return override;
  for (const tag of deviceLanguageTags) {
    const language = tag.toLowerCase().split(/[-_]/)[0];
    const locale = LOCALES.find((candidate) => candidate === language);
    if (locale) return rendered.includes(locale) ? locale : FALLBACK_LOCALE;
  }
  return FALLBACK_LOCALE;
}
