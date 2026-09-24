import { INITIAL_ONBOARDING } from "@nutrimero/feature-home-data";
import { describe, expect, it } from "vitest";
import { currentStep, recordStep } from "./flow-state";

describe("the first-run flow (001 FR-003, FR-008)", () => {
  it("starts at units, then diet, then pantry, then is done", () => {
    let state = INITIAL_ONBOARDING;
    expect(currentStep(state)).toBe("units");
    state = recordStep(state, "units", "answered");
    expect(currentStep(state)).toBe("diet");
    state = recordStep(state, "diet", "skipped");
    expect(currentStep(state)).toBe("pantry");
    state = recordStep(state, "pantry", "answered");
    expect(state.completed).toBe(true);
    expect(currentStep(state)).toBeNull();
  });

  it("skipping every step still completes onboarding", () => {
    const state = (["units", "diet", "pantry"] as const).reduce(
      (acc, step) => recordStep(acc, step, "skipped"),
      INITIAL_ONBOARDING,
    );
    expect(state.completed).toBe(true);
  });

  it("resumes an interrupted run at the first unfinished step, keeping earlier answers", () => {
    const interrupted = recordStep(INITIAL_ONBOARDING, "units", "answered");
    expect(currentStep(interrupted)).toBe("diet");
    expect(interrupted.steps.units).toBe("answered");
    expect(interrupted.completed).toBe(false);
  });
});
