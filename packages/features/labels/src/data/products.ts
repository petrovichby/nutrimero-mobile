import type { ApiClient } from "@nutrimero/core";
import { type Bound, boundOf, PAGE_SIZE, remainingOffsets } from "../model/product-filter";
import type { ProductGrid, ProductRow } from "../model/types";
import { attempt, type Result } from "./result";

export type CompanyHeaders = { "X-Company-Id": string };

/**
 * The product list (O6) and the readiness overview (O7), each bounded at five pages (R2).
 * Online only (FR-021): nothing here is persisted.
 */
export async function loadProducts(
  client: ApiClient,
  headers: CompanyHeaders,
): Promise<Result<{ rows: readonly ProductRow[]; bound: Bound }>> {
  const page = (offset: number) =>
    attempt(() =>
      client.GET("/api/v1/products", {
        params: { header: headers, query: { limit: PAGE_SIZE, offset } },
      }),
    );
  const first = await page(0);
  if (!first.ok) {
    return first;
  }
  const rest = await Promise.all(remainingOffsets(first.value.total).map(page));
  const failed = rest.find((result) => !result.ok);
  if (failed !== undefined && !failed.ok) {
    return failed;
  }
  const rows = [first, ...rest].flatMap((result) => (result.ok ? result.value.products : []));
  return {
    ok: true,
    value: { rows, bound: boundOf(rows.length, first.value.total) },
    serverDate: first.serverDate,
  };
}

/** Readiness rows by product id; a product with no assigned label type has no row (US1-3). */
export async function loadOverview(
  client: ApiClient,
  headers: CompanyHeaders,
): Promise<Result<ReadonlyMap<string, ProductGrid>>> {
  const page = (offset: number) =>
    attempt(() =>
      client.GET("/api/v1/declarations", {
        params: { header: headers, query: { limit: PAGE_SIZE, offset } },
      }),
    );
  const first = await page(0);
  if (!first.ok) {
    return first;
  }
  const rest = await Promise.all(remainingOffsets(first.value.total).map(page));
  const failed = rest.find((result) => !result.ok);
  if (failed !== undefined && !failed.ok) {
    return failed;
  }
  const byProduct = new Map<string, ProductGrid>();
  for (const result of [first, ...rest]) {
    if (result.ok) {
      for (const grid of result.value.items) {
        byProduct.set(grid.productId, grid);
      }
    }
  }
  return { ok: true, value: byProduct, serverDate: first.serverDate };
}

/** One product's grid (O8). */
export function loadGrid(client: ApiClient, headers: CompanyHeaders, productId: string) {
  return attempt(() =>
    client.GET("/api/v1/products/{id}/declarations", {
      params: { header: headers, path: { id: productId } },
    }),
  );
}
