// Constitution IX: multilingual from day one. Mirrors nutrimero-web's catalog parity test:
// every locale must have exactly the English key set, and no non-English catalog may leave a
// string silently identical to English (untranslated keys must be caught, not shipped).
import { describe, expect, it } from "vitest";
import { LOCALES, type Locale, messages } from "./messages";

type Flat = Record<string, string>;

function flatten(obj: unknown, prefix = "", out: Flat = {}): Flat {
  if (typeof obj === "string") {
    out[prefix] = obj;
    return out;
  }
  if (obj !== null && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

// Brand/product names are legitimately identical across locales.
const IDENTICAL_ALLOWED = new Set(["app.homeBaker.name", "app.proBaker.name"]);

const en = flatten(messages.en);
const locales = LOCALES.filter((locale) => locale !== "en");

describe("message catalogs", () => {
  for (const locale of locales) {
    const catalog = flatten(messages[locale]);

    it(`${locale} has exactly the same keys as en`, () => {
      expect(Object.keys(catalog).sort()).toEqual(Object.keys(en).sort());
    });

    it(`${locale} has no untranslated strings identical to en`, () => {
      const identical = Object.keys(en).filter(
        (key) => !IDENTICAL_ALLOWED.has(key) && catalog[key] === en[key],
      );
      expect(identical).toEqual([]);
    });
  }
});

/**
 * Constitution IX (1.1.0): each locale's ICU plural categories are covered by its catalog.
 *
 * The expected sets are CLDR's, written out so a runtime whose plural data drifts fails here
 * rather than silently picking "other". This runs on Node's ICU; the same check against Hermes
 * on device lands with the i18n runtime (001 phase 3), because Vitest cannot run Hermes.
 */
const EXPECTED_PLURAL_CATEGORIES: Record<Locale, readonly string[]> = {
  en: ["one", "other"],
  de: ["one", "other"],
  hu: ["one", "other"],
  lt: ["few", "many", "one", "other"],
  be: ["few", "many", "one", "other"],
  pl: ["few", "many", "one", "other"],
  uk: ["few", "many", "one", "other"],
};

/** The selector keys of every top-level ICU `plural` argument in a message. */
function pluralSelectors(message: string): string[][] {
  const found: string[][] = [];
  const marker = /\{\s*\w+\s*,\s*plural\s*,/g;
  for (let match = marker.exec(message); match; match = marker.exec(message)) {
    const keys: string[] = [];
    let depth = 1;
    let token = "";
    for (let i = match.index + match[0].length; i < message.length && depth > 0; i++) {
      const char = message[i];
      if (char === "{") {
        if (depth === 1 && token.trim()) keys.push(token.trim());
        token = "";
        depth++;
      } else if (char === "}") {
        depth--;
      } else if (depth === 1) {
        token += char;
      }
    }
    found.push(keys);
  }
  return found;
}

describe("plural categories", () => {
  for (const locale of LOCALES) {
    it(`${locale} resolves the CLDR plural categories`, () => {
      const categories = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;
      expect([...categories].sort()).toEqual([...EXPECTED_PLURAL_CATEGORIES[locale]].sort());
    });

    it(`${locale} plural messages cover every category the locale needs`, () => {
      const missing: string[] = [];
      for (const [key, message] of Object.entries(flatten(messages[locale]))) {
        for (const selectors of pluralSelectors(message)) {
          for (const category of EXPECTED_PLURAL_CATEGORIES[locale]) {
            if (!selectors.includes(category)) missing.push(`${key}: ${category}`);
          }
        }
      }
      expect(missing).toEqual([]);
    });
  }

  it("reads the selectors of an ICU plural message", () => {
    expect(pluralSelectors("{count, plural, one {# item} few {# items} other {# items}}")).toEqual([
      ["one", "few", "other"],
    ]);
  });
});
