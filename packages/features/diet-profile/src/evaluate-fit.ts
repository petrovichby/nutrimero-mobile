import type { DietaryOption } from "@nutrimero/feature-home-data";
import { DIETARY_MAPPING } from "./mapping";

/** FID's four-valued state, for an allergen ("contains?") or a dietary fact ("is vegan?"). */
export type FidState = "yes" | "no" | "unknown" | "depends_on_brand";

export interface FitFacts {
  /** Allergen code → state, from FID joins only (Constitution IV). A missing code is not "no". */
  allergens: Readonly<Record<string, FidState>>;
  dietary: Readonly<Partial<Record<"vegan" | "vegetarian", FidState>>>;
}

export type Fit = "fits" | "check" | "notFitting";

const WORST: readonly Fit[] = ["notFitting", "check", "fits"];

/**
 * Whether something fits a dietary profile, on the device (001 FR-010, FR-018; the owner's ruling):
 * an allergen that is contained ⇒ notFitting; unknown or depends-on-brand ⇒ check, never fitting;
 * only an explicit "does not contain" fits. A dietary fact: yes ⇒ fits, no ⇒ notFitting, unknown
 * or depends-on-brand ⇒ check. Missing data is never read as safe: it is "check". Across the
 * profile the worst result wins; an empty profile fits.
 */
export function evaluateFit(profile: readonly DietaryOption[], facts: FitFacts): Fit {
  const results = profile.flatMap((option): Fit[] => {
    const rule = DIETARY_MAPPING[option];
    if (rule.kind === "allergens") {
      return rule.codes.map((code) => {
        const state = facts.allergens[code];
        if (state === "yes") return "notFitting";
        if (state === "no") return "fits";
        return "check";
      });
    }
    const state = facts.dietary[rule.fact];
    if (state === "yes") return ["fits"];
    if (state === "no") return ["notFitting"];
    return ["check"];
  });
  return WORST.find((fit) => results.includes(fit)) ?? "fits";
}
