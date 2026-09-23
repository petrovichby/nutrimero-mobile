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
    expect(createTranslator("lt")("app.homeBaker.name")).toBe("Nutrimero Home Baker");
  });
});
