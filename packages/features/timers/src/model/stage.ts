/**
 * A routine stage (005 data-model). A stage is either timed (it notifies when it ends) or
 * hands-on (no timer and no notification; the baker marks it done). Names are a localized pick
 * or the baker's own text. There are no preset durations (gate 1, Q3; constitution IV).
 */
export const STAGE_KEYS = [
  "mix",
  "autolyse",
  "bulkFerment",
  "stretchAndFold",
  "preShape",
  "shape",
  "proof",
  "coldProof",
  "preheat",
  "bake",
  "cool",
] as const;

export type StageKey = (typeof STAGE_KEYS)[number];

export type StageName = { readonly key: StageKey } | { readonly text: string };

export interface Stage {
  readonly name: StageName;
  /** Whole seconds, 5 to 172,800 (48 h); null for a hands-on stage. */
  readonly seconds: number | null;
}

export const MIN_SECONDS = 5;
export const MAX_SECONDS = 48 * 60 * 60;
export const MAX_NAME_LENGTH = 40;
export const MAX_STAGES = 12;

export function isStageKey(value: unknown): value is StageKey {
  return STAGE_KEYS.some((key) => key === value);
}

/** A valid duration, or null for "not a duration". */
export function validSeconds(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_SECONDS &&
    value <= MAX_SECONDS
    ? value
    : null;
}

/** Trimmed, 1–40 characters (counted as characters, not UTF-16 units), or null. */
export function validName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  const length = [...trimmed].length;
  return length >= 1 && length <= MAX_NAME_LENGTH ? trimmed : null;
}

/** A stage from untrusted input, or null when it is not valid. */
export function parseStage(value: unknown): Stage | null {
  if (typeof value !== "object" || value === null) return null;
  const rawName = Reflect.get(value, "name");
  const rawSeconds = Reflect.get(value, "seconds");
  let name: StageName | null = null;
  if (typeof rawName === "object" && rawName !== null) {
    const key = Reflect.get(rawName, "key");
    const text = validName(Reflect.get(rawName, "text"));
    name = isStageKey(key) ? { key } : text !== null ? { text } : null;
  }
  if (name === null) return null;
  if (rawSeconds === null) return { name, seconds: null };
  const seconds = validSeconds(rawSeconds);
  return seconds === null ? null : { name, seconds };
}

/** FR-013a: the stages whose Android lateness the app mentions once. */
export function isBakeStage(stage: Stage): boolean {
  return "key" in stage.name && (stage.name.key === "bake" || stage.name.key === "preheat");
}
