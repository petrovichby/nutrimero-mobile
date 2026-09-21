// Constitution IX: multilingual from day one. Mirrors nutrimero-web's catalog parity test:
// every locale must have exactly the English key set, and no non-English catalog may leave a
// string silently identical to English (untranslated keys must be caught, not shipped).
import { describe, expect, it } from "vitest";
import { messages } from "./messages";

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
const locales = ["de", "lt"] as const;

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
