/**
 * The set of Unicode code points a TrueType/OpenType font maps to glyphs, read from its `cmap`
 * table (formats 4 and 12 — the Unicode subtables every font we vendor carries). Test support for
 * the font-coverage instrument; nothing here ships.
 */
export function codePointsOf(font: Uint8Array): Set<number> {
  const view = new DataView(font.buffer, font.byteOffset, font.byteLength);
  const tableCount = view.getUint16(4);
  let cmap = -1;
  for (let i = 0; i < tableCount; i++) {
    const record = 12 + i * 16;
    const tag = String.fromCharCode(...font.subarray(record, record + 4));
    if (tag === "cmap") cmap = view.getUint32(record + 8);
  }
  if (cmap < 0) throw new Error("font has no cmap table");

  const points = new Set<number>();
  const subtables = view.getUint16(cmap + 2);
  for (let i = 0; i < subtables; i++) {
    const entry = cmap + 4 + i * 8;
    const platform = view.getUint16(entry);
    const encoding = view.getUint16(entry + 2);
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode) continue;
    const table = cmap + view.getUint32(entry + 4);
    const format = view.getUint16(table);
    if (format === 4) readFormat4(view, table, points);
    if (format === 12) readFormat12(view, table, points);
  }
  return points;
}

function readFormat4(view: DataView, table: number, points: Set<number>) {
  const segments = view.getUint16(table + 6) / 2;
  const ends = table + 14;
  const starts = ends + segments * 2 + 2;
  const deltas = starts + segments * 2;
  const offsets = deltas + segments * 2;
  for (let s = 0; s < segments; s++) {
    const end = view.getUint16(ends + s * 2);
    const start = view.getUint16(starts + s * 2);
    const delta = view.getInt16(deltas + s * 2);
    const offsetAt = offsets + s * 2;
    const offset = view.getUint16(offsetAt);
    for (let code = start; code <= end && code !== 0xffff; code++) {
      const glyph =
        offset === 0
          ? (code + delta) & 0xffff
          : view.getUint16(offsetAt + offset + (code - start) * 2);
      if (glyph !== 0) points.add(code);
    }
  }
}

function readFormat12(view: DataView, table: number, points: Set<number>) {
  const groups = view.getUint32(table + 12);
  for (let g = 0; g < groups; g++) {
    const group = table + 16 + g * 12;
    const start = view.getUint32(group);
    const end = view.getUint32(group + 4);
    const firstGlyph = view.getUint32(group + 8);
    for (let code = start; code <= end; code++) {
      if (firstGlyph + (code - start) !== 0) points.add(code);
    }
  }
}
