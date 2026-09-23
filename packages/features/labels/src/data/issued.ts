import type { ApiClient } from "@nutrimero/core";
import type { IssuedListItem, IssuedStatus } from "../model/types";
import type { CompanyHeaders } from "./products";
import { attempt, type Result } from "./result";

const STATUS_ORDER: Readonly<Record<IssuedStatus, number>> = {
  active: 0,
  superseded: 1,
  withdrawn: 2,
};

/** FR-015: grouped by label type and language, active first, newest first within a status. */
export function orderIssued(items: readonly IssuedListItem[]): readonly IssuedListItem[] {
  return [...items].sort(
    (a, b) =>
      a.ruleSetId.localeCompare(b.ruleSetId) ||
      a.language.localeCompare(b.language) ||
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      b.issuedAt.localeCompare(a.issuedAt),
  );
}

/**
 * A product's issued labels (O10), read once per offered rule-set in parallel (plan R7) — no
 * hardcoded regions. When the api serves a per-product list (ask B6) this becomes one call.
 */
export async function loadIssuedForProduct(
  client: ApiClient,
  headers: CompanyHeaders,
  productId: string,
  ruleSetIds: readonly string[],
): Promise<Result<readonly IssuedListItem[]>> {
  const reads = await Promise.all(
    ruleSetIds.map((ruleSetId) =>
      attempt(() =>
        client.GET("/api/v1/products/{id}/labels/{ruleSetId}/issued", {
          params: { header: headers, path: { id: productId, ruleSetId } },
        }),
      ),
    ),
  );
  const failed = reads.find((read) => !read.ok);
  if (failed !== undefined && !failed.ok) {
    return failed;
  }
  const items = reads.flatMap((read) => (read.ok ? read.value.items : []));
  return {
    ok: true,
    value: orderIssued(items),
    serverDate: reads[0]?.ok ? reads[0].serverDate : null,
  };
}

/** One issued label (O11), with the api's match verdict and the server's `Date` (R8). */
export function loadIssued(client: ApiClient, headers: CompanyHeaders, issuedId: string) {
  return attempt(() =>
    client.GET("/api/v1/issued-labels/{issuedId}", {
      params: { header: headers, path: { issuedId } },
    }),
  );
}
