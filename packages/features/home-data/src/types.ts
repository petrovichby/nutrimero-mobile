export const UNITS = ["metric", "imperial"] as const;
export type Units = (typeof UNITS)[number];

/** The six options of 07-onboarding-diet, in their on-screen order (001 FR-006). */
export const DIETARY_OPTIONS = [
  "glutenFree",
  "lactoseFree",
  "nutAllergy",
  "eggFree",
  "vegan",
  "vegetarian",
] as const;
export type DietaryOption = (typeof DIETARY_OPTIONS)[number];

export const ONBOARDING_STEPS = ["units", "diet", "pantry"] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];
export type StepState = "pending" | "answered" | "skipped";

export interface OnboardingState {
  readonly steps: Readonly<Record<OnboardingStep, StepState>>;
  readonly completed: boolean;
}

export const INITIAL_ONBOARDING: OnboardingState = {
  steps: { units: "pending", diet: "pending", pantry: "pending" },
  completed: false,
};
