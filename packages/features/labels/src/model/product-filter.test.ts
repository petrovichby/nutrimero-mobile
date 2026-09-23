import { describe, expect, it } from "vitest";
import { products } from "../test-support/fixtures";
import {
  boundOf,
  filterProducts,
  LOAD_BOUND,
  PAGE_SIZE,
  remainingOffsets,
  searchKey,
} from "./product-filter";
import type { ProductRow } from "./types";

const [loaf] = products.products;

function many(count: number): ProductRow[] {
  if (loaf === undefined) throw new Error("fixture has no products");
  return Array.from({ length: count }, (_, index) => ({
    ...loaf,
    id: `id-${index}`,
    name: `Produkt ${index}`,
    number: `P-${index}`,
  }));
}

describe("the bounded product filter (FR-005, plan R2)", () => {
  it("loads at most five pages of 200", () => {
    expect(PAGE_SIZE).toBe(200);
    expect(LOAD_BOUND).toBe(1000);
    expect(remainingOffsets(150)).toEqual([]);
    expect(remainingOffsets(400)).toEqual([200]);
    expect(remainingOffsets(1200)).toEqual([200, 400, 600, 800]);
    expect(remainingOffsets(0)).toEqual([]);
  });

  it("says when the list is bounded — never a silent truncation", () => {
    expect(boundOf(1000, 1200)).toEqual({ bounded: true, loaded: 1000, total: 1200 });
    expect(boundOf(3, 3)).toEqual({ bounded: false, loaded: 3, total: 3 });
  });

  it("matches name or number, ignoring case and diacritics", () => {
    expect(searchKey("Haselnußbrot")).toBe("haselnussbrot");
    expect(searchKey("Žolė")).toBe("zole");
    expect(filterProducts(products.products, "hasel").map((row) => row.name)).toEqual([
      "Haselnussbrot",
    ]);
    expect(filterProducts(products.products, "ne-1").map((row) => row.number)).toEqual(["NE-120"]);
    expect(filterProducts(products.products, "  ")).toHaveLength(products.products.length);
  });

  it("filters over the loaded rows only", () => {
    const loaded = many(1000);
    expect(filterProducts(loaded, "Produkt 99")).toHaveLength(11);
    expect(filterProducts(loaded, "Produkt 1100")).toEqual([]);
  });
});
