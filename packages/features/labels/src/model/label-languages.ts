/**
 * FR-011 (owner's ruling, 2026-09-23): the offered label languages are **the owner's list, each
 * entry present only once an api rendering test proves it**. `provenBy` names that test — spec
 * file › describe › test title, verbatim, never a line number (coordinator ruling). An entry with
 * no proof is listed but not offered. Label languages are separate from the seven UI languages.
 *
 * hu-HU, lt-LT and pl-PL wait on two api PRs (a refuse-on-gap fix and the vocabulary completion);
 * `query-cost.e2e-spec.ts` is never a proof — it asserts query counts, not rendered content.
 */
export interface LabelLanguage {
  readonly tag: "en-US" | "de-DE" | "hu-HU" | "lt-LT" | "pl-PL";
  readonly provenBy: string | null;
}

const RENDERING_TEST =
  "nutrimero-api src/label-text/labels.e2e-spec.ts › a product label, read (019 US1, US2, US4, US5) › US2: the decimal mark is the label language s, at the same figures (FR-020)";

export const OWNER_LABEL_LANGUAGES: readonly LabelLanguage[] = [
  { tag: "en-US", provenBy: RENDERING_TEST },
  { tag: "de-DE", provenBy: RENDERING_TEST },
  { tag: "hu-HU", provenBy: null },
  { tag: "lt-LT", provenBy: null },
  { tag: "pl-PL", provenBy: null },
];

export function offeredLabelLanguages(
  list: readonly LabelLanguage[] = OWNER_LABEL_LANGUAGES,
): readonly LabelLanguage["tag"][] {
  return list.filter((entry) => entry.provenBy !== null).map((entry) => entry.tag);
}

/** UI language → label language (FR-011). be and uk have no EU label language. */
const UI_MATCH: Readonly<Record<string, LabelLanguage["tag"] | null>> = {
  en: "en-US",
  de: "de-DE",
  hu: "hu-HU",
  lt: "lt-LT",
  pl: "pl-PL",
  be: null,
  uk: null,
};

export function defaultLabelLanguage(
  lastUsed: string | null,
  uiLocale: string,
  offered: readonly LabelLanguage["tag"][] = offeredLabelLanguages(),
): LabelLanguage["tag"] {
  const last = offered.find((tag) => tag === lastUsed);
  if (last !== undefined) {
    return last;
  }
  const match = UI_MATCH[uiLocale] ?? null;
  if (match !== null && offered.includes(match)) {
    return match;
  }
  return "en-US";
}
