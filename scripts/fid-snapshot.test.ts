import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FID_SNAPSHOT } from "../packages/features/diet-profile/src/fid-snapshot.generated";
import type { SnapshotLocale } from "../packages/features/diet-profile/src/fid-snapshot-types";
import { MAPPED_ALLERGEN_CODES } from "../packages/features/diet-profile/src/mapping";
import { STAPLE_FID_IDS } from "../packages/features/diet-profile/src/staples";

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
});
