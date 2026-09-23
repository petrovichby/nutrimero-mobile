import { createTranslator as createIntlTranslator } from "use-intl/core";
import { type Locale, messages } from "./messages";

/**
 * A translator over one locale's catalog. Keys and ICU arguments are typed from the English
 * catalog, which every other catalog matches key for key (catalogs.test.ts).
 */
export function createTranslator(locale: Locale) {
  return createIntlTranslator({ locale, messages: messages[locale] });
}

export type Translator = ReturnType<typeof createTranslator>;
