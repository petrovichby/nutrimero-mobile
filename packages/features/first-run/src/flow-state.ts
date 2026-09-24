import {
  ONBOARDING_STEPS,
  type OnboardingState,
  type OnboardingStep,
  type StepState,
} from "@nutrimero/feature-home-data";

/** The step to show (001 FR-008): the first still pending, or none once onboarding is complete. */
export function currentStep(state: OnboardingState): OnboardingStep | null {
  if (state.completed) return null;
  return ONBOARDING_STEPS.find((step) => state.steps[step] === "pending") ?? null;
}

/** Records a step as answered or skipped; the last step's outcome completes onboarding. */
export function recordStep(
  state: OnboardingState,
  step: OnboardingStep,
  outcome: Exclude<StepState, "pending">,
): OnboardingState {
  const steps = { ...state.steps, [step]: outcome };
  return { steps, completed: ONBOARDING_STEPS.every((each) => steps[each] !== "pending") };
}
