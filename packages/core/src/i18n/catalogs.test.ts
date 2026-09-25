// Constitution IX: multilingual from day one. Mirrors nutrimero-web's catalog parity test:
// every locale must have exactly the English key set, and no non-English catalog may leave a
// string silently identical to English (untranslated keys must be caught, not shipped).
import { describe, expect, it } from "vitest";
import { LOCALES, messages } from "./messages";
import { EXPECTED_PLURAL_CATEGORIES } from "./plural";

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

/**
 * REGISTER (coordinator ruling, 2026-09-23 — every language, per app). Home Baker strings address
 * the user INFORMALLY (du / tu / ty / ти); Pro Baker strings FORMALLY (Sie / Ön / Państwo / Jūs /
 * Вы). Shared strings address no one: a shared string that cannot avoid a "you" moves into the
 * app namespaces and exists twice. Only English is checked mechanically below — elsewhere the
 * pronouns are ambiguous ("Sie" is also "they") — so every other locale is held to the rule in
 * review.
 */
const APP_NAMESPACES = ["app.homeBaker.", "app.proBaker.", "home.", "pro."];

/**
 * Strings legitimately identical to English, per key AND per locale — so allowing German "Vegan"
 * never lets an untranslated "Vegan" through in Polish. "all" is for brand words, endonyms and
 * unit symbols, which are the same in every language by definition.
 */
const IDENTICAL_ALLOWED: Record<string, "all" | readonly string[]> = {
  "app.homeBaker.name": "all",
  "app.proBaker.name": "all",
  "home.cover.wordmark": "all", // the brand, lowercase (MA-14)
  "home.cover.title": "all", // the app name
  "home.onboarding.units.sample.imperialValue": "all", // a numeral with a vulgar fraction
  "home.onboarding.units.sample.metricUnit": ["de", "hu", "lt", "pl"], // Latin "g"; be/uk use "г"
  "home.onboarding.units.values.celsius": "all",
  "home.onboarding.units.values.fahrenheit": "all",
  "home.onboarding.units.values.grams": ["de", "hu", "lt", "pl"], // Latin "g"; be/uk use "г"
  "home.onboarding.units.imperial": ["de"],
  "home.onboarding.diet.options.vegan": ["de"],
  "home.onboarding.units.values.stick": ["hu"], // the US "stick" has no Hungarian word
  "home.timers.unit.minutes": ["pl"], // Polish writes "min", as English does (005)
  "home.timers.unit.seconds": ["lt", "pl"], // the SI "s"; be/uk use Cyrillic "с" (005)
  "home.timers.stage.autolyse": ["de"], // the baking term is the same word in German (005)
  "home.onboarding.units.choice.sample.imperialValue": "all", // a numeral with a vulgar fraction (004)
  "home.onboarding.units.choice.sample.imperialUnit": ["de", "hu", "lt", "pl"], // Latin "oz"; be/uk "унц." (004)
  "home.onboarding.units.choice.region.optional": ["de"], // German writes "optional" too (004)
  "home.onboarding.units.choice.region.uk": ["de", "hu", "pl"], // "UK" as the chip label (MA-28, 004)
};
const ENDONYM_PREFIX = "common.languageEndonym."; // a language's own name is the same everywhere

function identicalAllowed(key: string, locale: string): boolean {
  const rule = IDENTICAL_ALLOWED[key];
  return key.startsWith(ENDONYM_PREFIX) || rule === "all" || (rule?.includes(locale) ?? false);
}

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
        (key) => !identicalAllowed(key, locale) && catalog[key] === en[key],
      );
      expect(identical).toEqual([]);
    });
  }
});

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

describe("register", () => {
  it("shared English strings address no one", () => {
    const addressing = Object.entries(en)
      .filter(([key]) => !APP_NAMESPACES.some((namespace) => key.startsWith(namespace)))
      .filter(([, message]) => /\byou(r|rs|rself)?\b/i.test(message))
      .map(([key]) => key);
    expect(addressing).toEqual([]);
  });
});

/**
 * Plural arguments are whole numbers (ruling 2026-09-24: every plural argument is a `count`; fractions are formatted as numbers, never pluralised): the forced plural
 * polyfill disagrees with CLDR on fractions in hu, lt and be (intl-polyfill.test.ts). So every
 * ICU plural argument is named `count` — a count of things, never a measurement. A fractional
 * quantity is formatted as a number (formatNumber / `{x, number}`), never pluralised.
 */
describe("plural arguments", () => {
  it("every plural argument in every catalog is a `count`", () => {
    const offenders: string[] = [];
    for (const locale of LOCALES) {
      for (const [key, message] of Object.entries(flatten(messages[locale]))) {
        for (const match of message.matchAll(/\{\s*(\w+)\s*,\s*plural\s*,/g)) {
          if (match[1] !== "count") offenders.push(`${locale} ${key}: ${match[1]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

/**
 * "Device", never "phone" (owner, 2026-09-24): the apps are planned for tablets and possibly iOS
 * apps on macOS, so no user-facing text in any language names the phone. A case-insensitive
 * substring match, so inflections are caught too (Telefons, telefonas, тэлефона, телефону …).
 */
const PHONE_WORDS = ["phone", "telefon", "handy", "тэлефон", "телефон", "smartphone"];

describe("device, never phone", () => {
  it("no catalog value in any language names the phone", () => {
    const offenders: string[] = [];
    for (const locale of LOCALES) {
      for (const [key, message] of Object.entries(flatten(messages[locale]))) {
        const lower = message.toLocaleLowerCase(locale);
        const word = PHONE_WORDS.find((phoneWord) => lower.includes(phoneWord));
        if (word) offenders.push(`${locale} ${key}: ${word}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
