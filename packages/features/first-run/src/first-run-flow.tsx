import type { Locale, Translator } from "@nutrimero/core";
import {
  type DietaryOption,
  type HomeStore,
  INITIAL_ONBOARDING,
  type OnboardingState,
  type OnboardingStep,
  type Units,
} from "@nutrimero/feature-home-data";
import { useEffect, useState } from "react";
import { DietStep } from "./diet-step";
import { currentStep, recordStep } from "./flow-state";
import { PantryStep } from "./pantry-step";
import { UnitsStep } from "./units-step";

/**
 * The three onboarding steps as one flow (001 FR-003–FR-008): it resumes at the first unfinished
 * step, writes every answer to the device store as it is given (never anywhere else — FR-009), and
 * calls `onComplete` once the last step is finished or skipped. A write failure never blocks the
 * flow: the answer stays in memory and onboarding is offered again next launch (001 edge cases).
 */
export function FirstRunFlow({
  t,
  locale,
  store,
  onComplete,
}: {
  t: Translator;
  locale: Locale;
  store: HomeStore;
  onComplete: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<OnboardingState>(INITIAL_ONBOARDING);
  const [units, setUnits] = useState<Units>("metric");
  const [profile, setProfile] = useState<readonly DietaryOption[]>([]);
  const [pantry, setPantry] = useState<readonly string[]>([]);

  useEffect(() => {
    Promise.all([store.onboarding(), store.units(), store.dietaryProfile(), store.pantrySeed()])
      .then(([saved, savedUnits, savedProfile, savedPantry]) => {
        setState(saved);
        setUnits(savedUnits);
        setProfile(savedProfile);
        setPantry(savedPantry);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [store]);

  const finish = (
    step: OnboardingStep,
    outcome: "answered" | "skipped",
    save?: () => Promise<void>,
  ) => {
    const next = recordStep(state, step, outcome);
    setState(next);
    Promise.resolve(save?.())
      .then(() => store.setOnboarding(next))
      .catch(() => undefined);
    if (next.completed) onComplete();
  };

  if (!loaded) return null;
  const step = currentStep(state);
  if (step === null) return null;

  if (step === "units") {
    return (
      <UnitsStep
        t={t}
        locale={locale}
        units={units}
        onChange={setUnits}
        onContinue={() => finish("units", "answered", () => store.setUnits(units))}
        onSkip={() => finish("units", "skipped")}
      />
    );
  }
  if (step === "diet") {
    return (
      <DietStep
        t={t}
        profile={profile}
        onToggle={(option) =>
          setProfile((current) =>
            current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
          )
        }
        onContinue={() => finish("diet", "answered", () => store.setDietaryProfile(profile))}
        onSkip={() => finish("diet", "skipped")}
      />
    );
  }
  return (
    <PantryStep
      t={t}
      locale={locale}
      selected={pantry}
      onToggle={(fidId) =>
        setPantry((current) =>
          current.includes(fidId) ? current.filter((id) => id !== fidId) : [...current, fidId],
        )
      }
      onDone={() => finish("pantry", "answered", () => store.setPantrySeed(pantry))}
      onSkip={() => finish("pantry", "skipped")}
    />
  );
}
