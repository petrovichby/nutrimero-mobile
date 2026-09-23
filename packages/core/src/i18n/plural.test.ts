import { describe, expect, it } from "vitest";
import { LOCALES } from "./messages";
import { EXPECTED_PLURAL_CATEGORIES, pluralRuleMismatches } from "./plural";

describe("pluralRuleMismatches", () => {
  it("finds none on this runtime's Intl (Node's ICU)", () => {
    expect(pluralRuleMismatches()).toEqual([]);
  });

  it("reports a locale whose runtime lost plural categories", () => {
    const flattened = pluralRuleMismatches((locale) =>
      locale === "pl" ? ["one", "other"] : EXPECTED_PLURAL_CATEGORIES[locale],
    );
    expect(flattened).toEqual(["pl: expected few/many/one/other, got one/other"]);
  });

  it("covers every UI locale", () => {
    expect(Object.keys(EXPECTED_PLURAL_CATEGORIES).sort()).toEqual([...LOCALES].sort());
  });
});
