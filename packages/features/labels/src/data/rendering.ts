import type { ApiClient } from "@nutrimero/core";
import type { LabelLanguage } from "../model/label-languages";
import type { CompanyHeaders } from "./products";
import { attempt } from "./result";

/** The live rendering (O9), online only; the language comes from the proven set (FR-011). */
export function loadRendering(
  client: ApiClient,
  headers: CompanyHeaders,
  productId: string,
  ruleSetId: string,
  language: LabelLanguage["tag"],
) {
  return attempt(() =>
    client.GET("/api/v1/products/{id}/labels/{ruleSetId}", {
      params: { header: headers, path: { id: productId, ruleSetId }, query: { language } },
    }),
  );
}

/** The offered label types (O5) — reference data, no company header. */
export function loadRuleSets(client: ApiClient) {
  return attempt(() =>
    client.GET("/api/v1/fid/declaration-rule-sets", { params: { query: { limit: 50 } } }),
  );
}
