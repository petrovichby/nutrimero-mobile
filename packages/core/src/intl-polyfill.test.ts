import { describe, expect, it } from "vitest";
import { LOCALES } from "./i18n/messages";

/**
 * The forced Intl.PluralRules polyfill (ADR 0001 amendment) against Node's native ICU.
 *
 * WHOLE NUMBERS — the only plural arguments the catalogs may take (see catalogs.test.ts): the
 * polyfill must select ICU's category for every sample that separates one/few/many/other across
 * the seven languages, the teens (11–14), the 21/22/25 tails and 101 included.
 *
 * FRACTIONS — a known upstream defect (ruling 2026-09-24): every
 * @formatjs/intl-pluralrules 6.x release tests only a decimal's integer part, so hu, lt and be
 * disagree with CLDR on fractions. The exact divergence is asserted, not ignored: the day an
 * upgrade fixes it, this test fails and the whole-number-only rule can be revisited.
 */
const WHOLE_SAMPLES = [0, 1, 2, 3, 4, 5, 11, 12, 14, 21, 22, 25, 101];
const FRACTION_SAMPLES = [0.5, 1.5, 2.5, 21.5];

/** Polyfill category vs CLDR (Node ICU), pinned at @formatjs/intl-pluralrules 6.3.15. */
const KNOWN_FRACTION_DIVERGENCE: Record<string, readonly string[]> = {
  hu: ["1.5: one (CLDR other)"],
  lt: [
    "0.5: other (CLDR many)",
    "1.5: one (CLDR many)",
    "2.5: few (CLDR many)",
    "21.5: one (CLDR many)",
  ],
  be: [
    "0.5: many (CLDR other)",
    "1.5: one (CLDR other)",
    "2.5: few (CLDR other)",
    "21.5: one (CLDR other)",
  ],
};

// Captured before the polyfill replaces the global.
const NativePluralRules = Intl.PluralRules;

function divergence(locale: string, samples: readonly number[]): string[] {
  const polyfilled = new Intl.PluralRules(locale);
  const native = new NativePluralRules(locale);
  return samples
    .filter((n) => polyfilled.select(n) !== native.select(n))
    .map((n) => `${n}: ${polyfilled.select(n)} (CLDR ${native.select(n)})`);
}

describe("the forced Intl.PluralRules polyfill (ADR 0001)", () => {
  it("replaces the engine's PluralRules and installs Intl.Locale", async () => {
    await import("./intl-polyfill");
    expect(Intl.PluralRules).not.toBe(NativePluralRules);
    expect(typeof Intl.Locale).toBe("function");
  });

  for (const locale of LOCALES) {
    it(`${locale}: selects ICU's category for every whole-number sample`, async () => {
      await import("./intl-polyfill");
      expect(new Intl.PluralRules(locale).resolvedOptions().locale).toBe(locale);
      expect(divergence(locale, WHOLE_SAMPLES)).toEqual([]);
    });

    it(`${locale}: diverges from CLDR on fractions exactly as the known upstream defect`, async () => {
      await import("./intl-polyfill");
      expect(divergence(locale, FRACTION_SAMPLES)).toEqual(KNOWN_FRACTION_DIVERGENCE[locale] ?? []);
    });
  }

  it("carries data for the seven UI languages only", async () => {
    await import("./intl-polyfill");
    expect(Intl.PluralRules.supportedLocalesOf([...LOCALES, "fr", "es"])).toEqual([...LOCALES]);
  });
});
