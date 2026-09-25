import type { DeviceStoreAdapter } from "@nutrimero/core";
import { HOME_KEYS, HOME_OWN_KEYS } from "./keys";
import {
  DIETARY_OPTIONS,
  type DietaryOption,
  INITIAL_ONBOARDING,
  MEASURES_REGIONS,
  ONBOARDING_STEPS,
  type OnboardingState,
  type StepState,
  UNITS,
  type Units,
  type UnitsChoice,
} from "./types";

/**
 * Home's device-only data (001 data-model, Constitution VI) over the shared adapter. Nothing here
 * is ever sent anywhere. Reads never throw on stored data: a missing, corrupt or out-of-range value
 * reads as its default, so a bad write can never lock a user out of first run.
 */
export interface HomeStore {
  units(): Promise<Units>;
  setUnits(units: Units): Promise<void>;
  /**
   * The system and the region together (004 FR-028). A legacy stored `imperial` with no region —
   * 001's cups · ounces · °F — reads as Imperial with region US (owner ruling, 2026-09-25).
   */
  unitsChoice(): Promise<UnitsChoice>;
  /** Writes both, so an explicit choice is never read as the legacy one. */
  setUnitsChoice(choice: UnitsChoice): Promise<void>;
  dietaryProfile(): Promise<readonly DietaryOption[]>;
  setDietaryProfile(options: readonly DietaryOption[]): Promise<void>;
  pantrySeed(): Promise<readonly string[]>;
  setPantrySeed(fidIds: readonly string[]): Promise<void>;
  onboarding(): Promise<OnboardingState>;
  setOnboarding(state: OnboardingState): Promise<void>;
  /** Home's single wipe path (FR-011–013): idempotent, Home's keys only. */
  wipeAll(): Promise<void>;
}

const STEP_STATES: readonly StepState[] = ["pending", "answered", "skipped"];

function parse(raw: string | null): unknown {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function member<T extends string>(allowed: readonly T[], value: unknown): T | undefined {
  return allowed.find((candidate) => candidate === value);
}

function field(value: unknown, name: string): unknown {
  return typeof value === "object" && value !== null ? Reflect.get(value, name) : undefined;
}

/** Keeps allowed values once each, in canonical order. */
function canonicalOptions(value: unknown): DietaryOption[] {
  const given = Array.isArray(value) ? value : [];
  return DIETARY_OPTIONS.filter((option) => given.includes(option));
}

/** Keeps non-empty strings once each, in the order given (the staples manifest's order). */
function distinctIds(value: unknown): string[] {
  const given = Array.isArray(value) ? value : [];
  const ids: string[] = [];
  for (const id of given) {
    if (typeof id === "string" && id.length > 0 && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function readOnboarding(value: unknown): OnboardingState {
  const steps = field(value, "steps");
  const read = (step: (typeof ONBOARDING_STEPS)[number]) =>
    member(STEP_STATES, field(steps, step)) ?? "pending";
  return {
    steps: { units: read("units"), diet: read("diet"), pantry: read("pantry") },
    completed: field(value, "completed") === true,
  };
}

export function createHomeStore(adapter: DeviceStoreAdapter): HomeStore {
  const write = (key: string, value: unknown) => adapter.set(key, JSON.stringify(value));

  return {
    async units() {
      return member(UNITS, parse(await adapter.get(HOME_KEYS.units))) ?? "metric";
    },
    setUnits(units) {
      return write(HOME_KEYS.units, units);
    },
    async unitsChoice() {
      const system = member(UNITS, parse(await adapter.get(HOME_KEYS.units))) ?? "metric";
      const region = member(MEASURES_REGIONS, parse(await adapter.get(HOME_KEYS.measuresRegion)));
      if (region !== undefined) return { system, region };
      return { system, region: system === "imperial" ? "us" : "device" };
    },
    async setUnitsChoice(choice) {
      await write(HOME_KEYS.units, member(UNITS, choice.system) ?? "metric");
      await write(HOME_KEYS.measuresRegion, member(MEASURES_REGIONS, choice.region) ?? "device");
    },
    async dietaryProfile() {
      return canonicalOptions(parse(await adapter.get(HOME_KEYS.dietaryProfile)));
    },
    setDietaryProfile(options) {
      return write(HOME_KEYS.dietaryProfile, canonicalOptions(options));
    },
    async pantrySeed() {
      return distinctIds(parse(await adapter.get(HOME_KEYS.pantrySeed)));
    },
    setPantrySeed(fidIds) {
      return write(HOME_KEYS.pantrySeed, distinctIds(fidIds));
    },
    async onboarding() {
      const stored = parse(await adapter.get(HOME_KEYS.onboarding));
      return stored === undefined ? INITIAL_ONBOARDING : readOnboarding(stored);
    },
    setOnboarding(state) {
      return write(HOME_KEYS.onboarding, readOnboarding(state));
    },
    async wipeAll() {
      for (const key of HOME_OWN_KEYS) {
        await adapter.delete(key);
      }
    },
  };
}
