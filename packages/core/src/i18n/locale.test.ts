import { describe, expect, it } from "vitest";
import { resolveLocale } from "./locale";
import { LOCALES } from "./messages";

describe("resolveLocale", () => {
  it("uses the first device language that is a rendered UI locale", () => {
    expect(resolveLocale(["de-AT", "en-US"])).toBe("de");
    expect(resolveLocale(["pl"])).toBe("pl");
    expect(resolveLocale(["hu-HU"])).toBe("hu");
    expect(resolveLocale(["lt_LT"])).toBe("lt");
  });

  it("skips languages that are not UI locales", () => {
    expect(resolveLocale(["fr-FR", "ru-RU", "de-DE"])).toBe("de");
  });

  it("falls back to English when no device language is a UI locale", () => {
    expect(resolveLocale(["fr-FR", "es"])).toBe("en");
    expect(resolveLocale([])).toBe("en");
  });

  it("renders English for be and uk until their faces are vendored (design G-2, phase 3c)", () => {
    expect(resolveLocale(["be-BY", "de"])).toBe("en");
    expect(resolveLocale(["uk-UA"])).toBe("en");
  });

  it("renders be and uk once every locale is renderable", () => {
    expect(resolveLocale(["be-BY"], LOCALES)).toBe("be");
    expect(resolveLocale(["uk-UA"], LOCALES)).toBe("uk");
  });
});
