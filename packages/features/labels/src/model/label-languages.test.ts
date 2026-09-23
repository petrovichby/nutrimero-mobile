import { describe, expect, it } from "vitest";
import { hasEnKey } from "../test-support/catalog";
import {
  defaultLabelLanguage,
  type LabelLanguage,
  OWNER_LABEL_LANGUAGES,
  offeredLabelLanguages,
} from "./label-languages";

describe("label languages (FR-011, owner's ruling)", () => {
  it("lists exactly the owner's five EU languages", () => {
    expect(OWNER_LABEL_LANGUAGES.map((entry) => entry.tag)).toEqual([
      "en-US",
      "de-DE",
      "hu-HU",
      "lt-LT",
      "pl-PL",
    ]);
  });

  it("offers only the entries an api rendering test proves — today en-US and de-DE", () => {
    expect(offeredLabelLanguages()).toEqual(["en-US", "de-DE"]);
  });

  it("every citation is a rendering test named by title, never the query-cost suite or a line", () => {
    for (const entry of OWNER_LABEL_LANGUAGES) {
      if (entry.provenBy === null) continue;
      expect(entry.provenBy).toMatch(/labels\.e2e-spec\.ts › .+ › .+/);
      expect(entry.provenBy).not.toMatch(/query-cost/);
      expect(entry.provenBy).not.toMatch(/:\d+/);
    }
  });

  it("an entry without proof is never offered", () => {
    const list: LabelLanguage[] = [{ tag: "hu-HU", provenBy: null }];
    expect(offeredLabelLanguages(list)).toEqual([]);
  });

  it("never lists mt-MT (proven, not asked for) or be-BY (no EU source)", () => {
    const tags: string[] = OWNER_LABEL_LANGUAGES.map((entry) => entry.tag);
    expect(tags).not.toContain("mt-MT");
    expect(tags).not.toContain("be-BY");
  });

  it("defaults to the last used language, else the UI language's match, else en-US", () => {
    expect(defaultLabelLanguage("de-DE", "en")).toBe("de-DE");
    expect(defaultLabelLanguage("lt-LT", "de")).toBe("de-DE"); // lt-LT not offered yet
    expect(defaultLabelLanguage(null, "lt")).toBe("en-US");
    expect(defaultLabelLanguage(null, "uk")).toBe("en-US");
    expect(defaultLabelLanguage(null, "lt", ["en-US", "de-DE", "lt-LT"])).toBe("lt-LT");
  });

  it("every owner language has a display name in the catalogs", () => {
    for (const entry of OWNER_LABEL_LANGUAGES) {
      expect(hasEnKey(`labels.labelLanguage.${entry.tag}`)).toBe(true);
    }
  });
});
