import type { FidState } from "./evaluate-fit";

/** The seven UI locales the snapshot carries names for (Constitution IX 1.1.0). */
export type SnapshotLocale = "en" | "de" | "hu" | "lt" | "be" | "pl" | "uk";

/**
 * FID names per UI locale. A locale may be absent: lt, pl, be and uk arrive with api feat/021's
 * translation run (001 FR-017's temporary fallback — the UI shows English meanwhile).
 */
export type LocalizedNames = Partial<Record<SnapshotLocale, string>>;

/**
 * Every FID name an ingredient carries per UI locale, in the api's order (alphabetical — the
 * contract at 4a4356b has no primary or display name). Which one the pantry step shows is ruled
 * separately; the snapshot keeps them all so that ruling needs no api.
 */
export type LocalizedNameSets = Partial<Record<SnapshotLocale, readonly string[]>>;

export interface FidSnapshot {
  readonly apiCommit: string;
  readonly contractSource: string;
  readonly staples: readonly {
    readonly fidId: string;
    readonly names: LocalizedNameSets;
    readonly dietary: Readonly<
      Record<"vegan" | "vegetarian" | "lactoseFree" | "glutenFree", FidState>
    >;
    readonly allergens: Readonly<Record<string, FidState>>;
  }[];
  readonly allergens: readonly {
    readonly id: number;
    readonly code: string;
    readonly names: LocalizedNames;
  }[];
}
