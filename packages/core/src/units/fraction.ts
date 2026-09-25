/**
 * Practical kitchen fractions (004 FR-013, research R7): cups snap to eighths and thirds, spoons
 * to quarters. The exact value always travels with the snapped one, so a screen can show both.
 */
/** cup: eighths and thirds; spoon: quarters; eighth: eighths only (ounces, MA-29 charts). */
export type FractionKind = "cup" | "spoon" | "eighth";

const GLYPHS: Readonly<Record<string, string>> = {
  "1/8": "⅛",
  "1/4": "¼",
  "1/3": "⅓",
  "3/8": "⅜",
  "1/2": "½",
  "5/8": "⅝",
  "2/3": "⅔",
  "3/4": "¾",
  "7/8": "⅞",
};

const STEPS: Readonly<Record<FractionKind, readonly (readonly [number, number])[]>> = {
  cup: [
    [0, 1],
    [1, 8],
    [1, 4],
    [1, 3],
    [3, 8],
    [1, 2],
    [5, 8],
    [2, 3],
    [3, 4],
    [7, 8],
    [1, 1],
  ],
  spoon: [
    [0, 1],
    [1, 4],
    [1, 2],
    [3, 4],
    [1, 1],
  ],
  eighth: [
    [0, 1],
    [1, 8],
    [1, 4],
    [3, 8],
    [1, 2],
    [5, 8],
    [3, 4],
    [7, 8],
    [1, 1],
  ],
};

export interface PracticalFraction {
  /** Whole units after snapping (a remainder close to 1 carries over). */
  readonly whole: number;
  /** The fraction glyph, or null when the snapped value is whole. */
  readonly fraction: string | null;
  /** The unsnapped value. */
  readonly exact: number;
}

export function toPracticalFraction(value: number, kind: FractionKind): PracticalFraction {
  if (!(value >= 0) || !Number.isFinite(value)) {
    throw new RangeError("A measure is a finite, non-negative number");
  }
  const whole = Math.floor(value);
  const remainder = value - whole;
  let best: readonly [number, number] = [0, 1];
  for (const step of STEPS[kind]) {
    if (Math.abs(remainder - step[0] / step[1]) < Math.abs(remainder - best[0] / best[1])) {
      best = step;
    }
  }
  if (best[0] === best[1]) return { whole: whole + 1, fraction: null, exact: value };
  if (best[0] === 0) return { whole, fraction: null, exact: value };
  return { whole, fraction: GLYPHS[`${best[0]}/${best[1]}`] ?? null, exact: value };
}
