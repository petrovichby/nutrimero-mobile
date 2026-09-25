/**
 * Reads an amount a baker typed (004 FR-014): digits with one decimal mark — the locale's comma
 * or a point, both accepted everywhere — and kitchen fractions ("½", "1½", "1 1/2", "3/4").
 * Returns null for anything that is not a finite, non-negative number; grouping separators are
 * not accepted (a comma is always a decimal mark).
 */
const GLYPH_VALUES: Readonly<Record<string, number>> = {
  "⅛": 1 / 8,
  "¼": 1 / 4,
  "⅓": 1 / 3,
  "⅜": 3 / 8,
  "½": 1 / 2,
  "⅝": 5 / 8,
  "⅔": 2 / 3,
  "¾": 3 / 4,
  "⅞": 7 / 8,
};

const DECIMAL = /^\d+(?:[.,]\d+)?$|^[.,]\d+$/;
const SLASH = /^(\d+)\s*[/⁄]\s*(\d+)$/;

function parsePart(part: string): number | null {
  if (DECIMAL.test(part)) return Number(part.replace(",", "."));
  const slash = SLASH.exec(part);
  if (slash) {
    const denominator = Number(slash[2]);
    return denominator === 0 ? null : Number(slash[1]) / denominator;
  }
  return null;
}

export function parseAmount(input: string): number | null {
  const text = input.replace(/[\s  ]+/g, " ").trim();
  if (text === "") return null;
  const glyph = /^(\d*)\s*([⅛¼⅓⅜½⅝⅔¾⅞])$/.exec(text);
  if (glyph) {
    const fraction = GLYPH_VALUES[glyph[2] ?? ""];
    if (fraction === undefined) return null;
    return (glyph[1] ? Number(glyph[1]) : 0) + fraction;
  }
  const mixed = /^(\d+) (\d+\s*[/⁄]\s*\d+)$/.exec(text);
  if (mixed) {
    const fraction = parsePart(mixed[2] ?? "");
    return fraction === null ? null : Number(mixed[1]) + fraction;
  }
  const value = parsePart(text);
  return value !== null && Number.isFinite(value) ? value : null;
}
