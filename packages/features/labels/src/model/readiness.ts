import type { Category, Cell, GridGap, ProductGrid, RuleSetGrid } from "./types";

/**
 * Display readiness of one label type for one product, read off the api's own cells (FR-004).
 * Nothing here judges completeness: the api's `required` and `complete` decide.
 */
export type Readiness =
  | { readonly state: "ready" }
  | { readonly state: "incomplete"; readonly missing: number }
  /**
   * A required cell holds a gap the platform itself cannot fill yet — today the Additives cell
   * of every packaging label type (FR-018, PARKED P-02). Derived from the gap (kind
   * `cannot_be_held`, target `system`), never from the rule-set's id, so the day the api can hold
   * additives the desk follows with no change.
   */
  | {
      readonly state: "notIssuable";
      readonly blockedBy: readonly Category[];
      readonly missing: number;
    };

export function isPlatformGap(gap: GridGap): boolean {
  return gap.kind === "cannot_be_held" && gap.target?.type === "system";
}

function isMissing(cell: Cell): boolean {
  return cell.required && !cell.complete;
}

export function readinessOf(ruleSet: RuleSetGrid): Readiness {
  const missing = ruleSet.cells.filter(isMissing);
  if (missing.length === 0) {
    return { state: "ready" };
  }
  const blockedBy = missing
    .filter((cell) => cell.gaps.some(isPlatformGap))
    .map((cell) => cell.category);
  if (blockedBy.length > 0) {
    return { state: "notIssuable", blockedBy, missing: missing.length };
  }
  return { state: "incomplete", missing: missing.length };
}

export interface LabelTypeReadiness {
  readonly ruleSetId: string;
  readonly region: string;
  readonly readiness: Readiness;
}

/** Every assigned label type of a product, in the api's order; empty when none is assigned. */
export function productReadiness(grid: ProductGrid): readonly LabelTypeReadiness[] {
  return grid.ruleSets.map((ruleSet) => ({
    ruleSetId: ruleSet.ruleSetId,
    region: ruleSet.region,
    readiness: readinessOf(ruleSet),
  }));
}
