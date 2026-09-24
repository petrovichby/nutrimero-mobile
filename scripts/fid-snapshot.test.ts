import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FID_SNAPSHOT } from "../packages/features/diet-profile/src/fid-snapshot.generated";
import type { SnapshotLocale } from "../packages/features/diet-profile/src/fid-snapshot-types";
import { MAPPED_ALLERGEN_CODES } from "../packages/features/diet-profile/src/mapping";
import {
  CURATED_STAPLE_NAMES,
  STAPLE_FID_IDS,
  stapleName,
} from "../packages/features/diet-profile/src/staples";

/**
 * 001 FR-014–FR-017, made mechanical. The snapshot is generated from a local api at
 * contract/SOURCE's commit (scripts/fid-snapshot.mts); a hand edit is a suppression-class
 * violation, and this test holds what the generator promised.
 */
const ROOT = path.resolve(__dirname, "..");
const REQUIRED: readonly SnapshotLocale[] = ["en", "de", "hu"];
/** Coordinator Ruling 2 (2026-09-23): names arrive with api feat/021; the UI shows English meanwhile. */
const PENDING_TRANSLATION_RUN: readonly SnapshotLocale[] = ["lt", "pl", "be", "uk"];

describe("the FID snapshot (001 FR-014–FR-017)", () => {
  it("names the api commit it was taken at — contract/SOURCE's, not api main", () => {
    const source = readFileSync(path.join(ROOT, "contract/SOURCE"), "utf8");
    expect(FID_SNAPSHOT.apiCommit).toMatch(/^[0-9a-f]{40}$/);
    expect(source).toContain(FID_SNAPSHOT.apiCommit);
    const header = readFileSync(
      path.join(ROOT, "packages/features/diet-profile/src/fid-snapshot.generated.ts"),
      "utf8",
    );
    expect(header).toContain(`LOCAL nutrimero-api at ${FID_SNAPSHOT.apiCommit}`);
    expect(header).toContain("NOT from api main");
    expect(header).toContain("DO NOT EDIT");
  });

  it("carries exactly the owner-confirmed staples, in order", () => {
    expect(FID_SNAPSHOT.staples.map((staple) => staple.fidId)).toEqual([...STAPLE_FID_IDS]);
  });

  it("names every staple in en, de and hu", () => {
    const missing = FID_SNAPSHOT.staples.flatMap((staple) =>
      REQUIRED.filter((locale) => (staple.names[locale]?.length ?? 0) === 0).map(
        (locale) => `${staple.fidId}: ${locale}`,
      ),
    );
    expect(missing).toEqual([]);
  });

  it("marks lt, pl, be and uk as pending the translation run, and no other locale", () => {
    const absent = new Set(
      FID_SNAPSHOT.staples.flatMap((staple) =>
        [...REQUIRED, ...PENDING_TRANSLATION_RUN].filter(
          (locale) => (staple.names[locale]?.length ?? 0) === 0,
        ),
      ),
    );
    // Every gap is a pending one — a gap anywhere else fails and goes to the owner.
    expect([...absent].filter((locale) => !PENDING_TRANSLATION_RUN.includes(locale))).toEqual([]);
    // A tripwire, on purpose: when feat/021's names are imported and the snapshot regenerated,
    // this fails until PENDING_TRANSLATION_RUN shrinks and the spec's fallback clause is retired
    // with its own dated entry (Ruling 2).
    expect([...absent].sort()).toEqual([...PENDING_TRANSLATION_RUN].sort());
  });

  it("resolves every allergen code the dietary mapping uses, named in en, de and hu", () => {
    for (const code of MAPPED_ALLERGEN_CODES) {
      const allergen = FID_SNAPSHOT.allergens.find((entry) => entry.code === code);
      expect(allergen?.id, code).toBeGreaterThan(0);
      for (const locale of REQUIRED)
        expect(allergen?.names[locale], `${code} ${locale}`).toBeTruthy();
    }
  });

  it("carries every mapped allergen's state for every staple", () => {
    for (const staple of FID_SNAPSHOT.staples) {
      expect(Object.keys(staple.allergens).sort(), staple.fidId).toEqual(
        [...MAPPED_ALLERGEN_CODES].sort(),
      );
    }
  });

  it("every curated display name is one of that staple's own FID names (never hand-typed)", () => {
    for (const [fidId, picks] of Object.entries(CURATED_STAPLE_NAMES)) {
      const staple = FID_SNAPSHOT.staples.find((entry) => entry.fidId === fidId);
      expect(staple, fidId).toBeDefined();
      for (const [locale, name] of Object.entries(picks)) {
        const stored = Object.entries(staple?.names ?? {}).find(([code]) => code === locale)?.[1];
        expect(stored, `${fidId} ${locale}`).toContain(name);
      }
    }
  });

  it("shows the owner's German picks, else FID's first name, else English (FR-017)", () => {
    const byId = (id: string) => FID_SNAPSHOT.staples.find((entry) => entry.fidId === id);
    const sugar = byId("4BEC221");
    const flour = byId("389D858");
    if (!sugar || !flour) throw new Error("staples missing");
    expect(stapleName(sugar, "de")).toBe("Zucker");
    expect(stapleName(flour, "de")).toBe("Weizenmehl");
    expect(stapleName(flour, "en")).toBe("wheat flour"); // exactly as stored (MA-14)
    expect(stapleName(flour, "uk")).toBe("wheat flour"); // pending feat/021 ⇒ English
    expect(["Zucker", "Ei", "Salz", "Zartbitter-Schokolade"]).toEqual(
      ["4BEC221", "14A64E9", "007BBC5", "4B24CC7"].map((id) => {
        const staple = byId(id);
        return staple ? stapleName(staple, "de") : "";
      }),
    );
  });

  it("every staple with more than one stored name in a locale has a curated pick there", () => {
    // The snapshot holds the api's ALPHABETICAL order at 4a4356b, not FID's delivery order, so a
    // first name is only trustworthy when it is the only name (coordinator, 2026-09-24).
    const unpicked = FID_SNAPSHOT.staples.flatMap((staple) =>
      Object.entries(staple.names)
        .filter(([, names]) => (names?.length ?? 0) > 1)
        .filter(([locale]) => {
          const picks = Object.entries(CURATED_STAPLE_NAMES).find(
            ([id]) => id === staple.fidId,
          )?.[1];
          return !Object.entries(picks ?? {}).some(([pickLocale]) => pickLocale === locale);
        })
        .map(([locale]) => `${staple.fidId} ${locale}`),
    );
    expect(unpicked).toEqual([]);
  });
});
