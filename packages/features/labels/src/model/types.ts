import type { paths } from "@nutrimero/core";

/** The 200 body of a GET operation, from the generated contract types (Constitution II). */
type Read<P extends keyof paths> = paths[P] extends {
  get: { responses: { 200: { content: { "application/json": infer Body } } } };
}
  ? Body
  : never;

export type ProductPage = Read<"/api/v1/products">;
export type ProductRow = ProductPage["products"][number];
export type OverviewPage = Read<"/api/v1/declarations">;
export type ProductGrid = Read<"/api/v1/products/{id}/declarations">;
export type RuleSetGrid = ProductGrid["ruleSets"][number];
export type Cell = RuleSetGrid["cells"][number];
export type Category = Cell["category"];
export type GridGap = Cell["gaps"][number];
export type GapKind = GridGap["kind"];
export type RuleSetList = Read<"/api/v1/fid/declaration-rule-sets">;
export type RuleSet = RuleSetList["items"][number];
export type Rendering = Read<"/api/v1/products/{id}/labels/{ruleSetId}">;
export type Section = Rendering["sections"][number];
export type Run = Extract<Section, { runs: unknown }>["runs"][number];
export type NutritionSection = Extract<Section, { kind: "nutrition" }>;
export type RenderingGap = Rendering["gaps"][number];
export type Notice = Rendering["notices"][number];
export type IssuedList = Read<"/api/v1/products/{id}/labels/{ruleSetId}/issued">;
export type IssuedListItem = IssuedList["items"][number];
export type IssuedLabel = Read<"/api/v1/issued-labels/{issuedId}">;
export type IssuedStatus = IssuedLabel["status"];
