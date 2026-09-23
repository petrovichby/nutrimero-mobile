import { describe, expect, it } from "vitest";
import { resolveLocale } from "./locale";
import { LOCALES } from "./messages";

describe("resolveLocale", () => {
  it("uses the first device language that is a rendered UI locale", () => {
    expect(resolveLocale(null, ["de-AT", "en-US"])).toBe("de");
    expect(resolveLocale(null, ["pl"])).toBe("pl");
    expect(resolveLocale(null, ["hu-HU"])).toBe("hu");
    expect(resolveLocale(null, ["lt_LT"])).toBe("lt");
  });

  it("skips languages that are not UI locales", () => {
    expect(resolveLocale(null, ["fr-FR", "ru-RU", "de-DE"])).toBe("de");
  });

  it("falls back to English when no device language is a UI locale", () => {
    expect(resolveLocale(null, ["fr-FR", "es"])).toBe("en");
    expect(resolveLocale(null, [])).toBe("en");
  });

  it("renders be and uk in their own locale (faces vendored, G-1/G-2)", () => {
    expect(resolveLocale(null, ["be-BY", "de"])).toBe("be");
    expect(resolveLocale(null, ["uk-UA"])).toBe("uk");
  });

  it("still falls back to English for a UI locale a caller has not made renderable", () => {
    expect(
      resolveLocale(
        null,
        ["uk-UA"],
        LOCALES.filter((locale) => locale !== "uk"),
      ),
    ).toBe("en");
  });

  it("takes the stored in-app choice first (IX 1.2.0 rule 2)", () => {
    expect(resolveLocale("uk", ["de-DE", "en"])).toBe("uk");
    expect(resolveLocale("lt", [])).toBe("lt");
  });

  it("follows the device when no choice is stored", () => {
    expect(resolveLocale(null, ["pl-PL"])).toBe("pl");
  });
});
