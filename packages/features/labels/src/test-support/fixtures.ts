// All recorded fixtures (T005), re-exported under their generated contract types so tests work
// with the api's shapes rather than each fixture's narrow literal type. The annotations are
// checked assignments, not casts. See __fixtures__/README.md for how the fixtures were made.
import type { paths } from "@nutrimero/core";
import { counterCardDeDE as rawCounterCardDeDE } from "../__fixtures__/counter-card-de-de";
import { counterCardEnUS as rawCounterCardEnUS } from "../__fixtures__/counter-card-en-us";
import { declarationsOverview as rawOverview } from "../__fixtures__/declarations-overview";
import { gridCounterCardComplete as rawGridComplete } from "../__fixtures__/grid-counter-card-complete";
import { gridNoComposition as rawGridEmpty } from "../__fixtures__/grid-no-composition";
import { gridPackaging as rawGridPackaging } from "../__fixtures__/grid-packaging";
import { issuedActive as rawIssuedActive } from "../__fixtures__/issued-active";
import { issuedDrifted as rawIssuedDrifted } from "../__fixtures__/issued-drifted";
import { issuedList as rawIssuedList } from "../__fixtures__/issued-list";
import { issuedSuperseded as rawIssuedSuperseded } from "../__fixtures__/issued-superseded";
import { issuedWithdrawn as rawIssuedWithdrawn } from "../__fixtures__/issued-withdrawn";
import { meTwoBakeries as rawMe } from "../__fixtures__/me-two-bakeries";
import { noEngine as rawNoEngine } from "../__fixtures__/no-engine";
import { packagingEnUS as rawPackagingEnUS } from "../__fixtures__/packaging-en-us";
import { products as rawProducts } from "../__fixtures__/products";
import { ruleSets as rawRuleSets } from "../__fixtures__/rule-sets";
import type {
  IssuedLabel,
  IssuedList,
  OverviewPage,
  ProductGrid,
  ProductPage,
  Rendering,
  RuleSetList,
} from "../model/types";

type Me = paths["/api/v1/me"]["get"]["responses"][200]["content"]["application/json"];

export const counterCardDeDE: Rendering = rawCounterCardDeDE;
export const counterCardEnUS: Rendering = rawCounterCardEnUS;
export const packagingEnUS: Rendering = rawPackagingEnUS;
export const noEngine: Rendering = rawNoEngine;
export const declarationsOverview: OverviewPage = rawOverview;
export const gridCounterCardComplete: ProductGrid = rawGridComplete;
export const gridNoComposition: ProductGrid = rawGridEmpty;
export const gridPackaging: ProductGrid = rawGridPackaging;
export const issuedActive: IssuedLabel = rawIssuedActive;
export const issuedDrifted: IssuedLabel = rawIssuedDrifted;
export const issuedSuperseded: IssuedLabel = rawIssuedSuperseded;
export const issuedWithdrawn: IssuedLabel = rawIssuedWithdrawn;
export const issuedList: IssuedList = rawIssuedList;
export const meTwoBakeries: Me = rawMe;
export const products: ProductPage = rawProducts;
export const ruleSets: RuleSetList = rawRuleSets;
