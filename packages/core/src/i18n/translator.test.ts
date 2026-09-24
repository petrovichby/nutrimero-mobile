import { describe, expect, it } from "vitest";
import { createTranslator } from "./translator";

describe("createTranslator", () => {
  it("reads the locale's own catalog", () => {
    expect(createTranslator("de")("common.offlineBanner")).toBe(
      "Offline — gespeicherte Daten werden angezeigt",
    );
    expect(createTranslator("uk")("common.offlineBanner")).toBe("Офлайн — показано збережені дані");
  });

  it("keeps brand names identical across locales", () => {
    expect(createTranslator("lt")("app.homeBaker.name")).toBe("nutrimero Home Baker");
  });
});

describe("the whole-number plural rule at runtime (ruling 2026-09-24)", () => {
  it("formats a whole-number count", () => {
    expect(createTranslator("en")("labels.readiness.incomplete", { count: 2 })).toBeTruthy();
  });

  it("throws in dev for a fractional count, naming the value", () => {
    expect(() => createTranslator("lt")("labels.readiness.incomplete", { count: 1.5 })).toThrow(
      /whole number, got 1\.5/,
    );
  });

  it("leaves calls without a count alone", () => {
    expect(createTranslator("de")("common.offlineBanner")).toBe(
      "Offline — gespeicherte Daten werden angezeigt",
    );
  });

  it("is skipped in release builds (__DEV__ === false)", () => {
    Reflect.set(globalThis, "__DEV__", false);
    try {
      expect(() =>
        createTranslator("en")("labels.readiness.incomplete", { count: 1.5 }),
      ).not.toThrow();
    } finally {
      Reflect.deleteProperty(globalThis, "__DEV__");
    }
  });
});
