import type { ProductRow } from "./types";

/**
 * FR-005 / plan R2 (gate 1 Q3-A): until `/products?q=` ships (ask B2), the desk loads at most
 * five pages of 200 — 1,000 active products — and filters those on the device. Past the bound a
 * persistent line says so: never a silent truncation.
 */
export const PAGE_SIZE = 200;
export const MAX_PAGES = 5;
export const LOAD_BOUND = PAGE_SIZE * MAX_PAGES;

/** Offsets of the pages still to load after the first page revealed `total`. */
export function remainingOffsets(total: number): readonly number[] {
  const pages = Math.min(Math.ceil(total / PAGE_SIZE), MAX_PAGES);
  return Array.from({ length: Math.max(pages - 1, 0) }, (_, index) => (index + 1) * PAGE_SIZE);
}

export interface Bound {
  readonly bounded: boolean;
  readonly loaded: number;
  readonly total: number;
}

export function boundOf(loaded: number, total: number): Bound {
  return { bounded: total > loaded, loaded, total };
}

/** Case- and diacritic-insensitive: "hasel" finds "Haselnußbrot", "zolė" finds "Zole". */
export function searchKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/ß/g, "ss")
    .toLocaleLowerCase("en")
    .trim();
}

export function filterProducts(rows: readonly ProductRow[], query: string): readonly ProductRow[] {
  const needle = searchKey(query);
  if (needle === "") {
    return rows;
  }
  return rows.filter(
    (row) =>
      searchKey(row.name).includes(needle) ||
      (row.number !== null && searchKey(row.number).includes(needle)),
  );
}
