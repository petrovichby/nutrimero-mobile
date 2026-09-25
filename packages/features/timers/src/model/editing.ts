/**
 * The routine editor's reorder (19; coordinator 2026-09-25: a drag on the grip, and Move up /
 * Move down for assistive technology — no gesture dependency). Pure, so the drag's arithmetic is
 * tested without a device.
 */

/** The list with the entry at `from` moved to `to`; the same list when either is out of range. */
export function moveEntry<T>(list: readonly T[], from: number, to: number): readonly T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return list;
  next.splice(to, 0, moved);
  return next;
}

/** Where a row dragged `dy` points from `from` lands, rows being `rowHeight` tall. */
export function dropIndex(from: number, dy: number, rowHeight: number, count: number): number {
  if (rowHeight <= 0 || count <= 0) return from;
  return Math.min(count - 1, Math.max(0, from + Math.round(dy / rowHeight)));
}

/** How far another row steps aside while one is dragged from `from` toward `to`. */
export function stepAside(index: number, from: number, to: number, rowHeight: number): number {
  if (index > from && index <= to) return -rowHeight;
  if (index < from && index >= to) return rowHeight;
  return 0;
}
