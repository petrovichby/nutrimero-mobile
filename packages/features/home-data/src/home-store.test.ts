// Tests import core's native-free modules by path: core's index also exports the platform
// adapters (expo-secure-store, expo-file-system), which cannot load under Node.
import {
  createMemoryAdapter,
  utf8ByteLength,
  VALUE_BUDGET_BYTES,
} from "@nutrimero/core/src/device-store/adapter";
import { createDevicePreferences } from "@nutrimero/core/src/device-store/preferences";
import { describe, expect, it } from "vitest";
import { createHomeStore } from "./home-store";
import { HOME_KEYS } from "./keys";
import { DIETARY_OPTIONS, INITIAL_ONBOARDING } from "./types";

describe("the Home store (001 data-model)", () => {
  it("reads defaults on a fresh device", async () => {
    const home = createHomeStore(createMemoryAdapter());
    expect(await home.units()).toBe("metric");
    expect(await home.dietaryProfile()).toEqual([]);
    expect(await home.pantrySeed()).toEqual([]);
    expect(await home.onboarding()).toEqual(INITIAL_ONBOARDING);
  });

  it("round-trips every value", async () => {
    const home = createHomeStore(createMemoryAdapter());
    await home.setUnits("imperial");
    await home.setDietaryProfile(["vegan", "nutAllergy"]);
    await home.setPantrySeed(["fid-2", "fid-1"]);
    await home.setOnboarding({
      steps: { units: "answered", diet: "skipped", pantry: "pending" },
      completed: false,
    });
    expect(await home.units()).toBe("imperial");
    expect(await home.dietaryProfile()).toEqual(["nutAllergy", "vegan"]);
    expect(await home.pantrySeed()).toEqual(["fid-2", "fid-1"]);
    expect((await home.onboarding()).steps).toEqual({
      units: "answered",
      diet: "skipped",
      pantry: "pending",
    });
  });

  it("stores the profile as a canonical set and the pantry without duplicates", async () => {
    const adapter = createMemoryAdapter();
    const home = createHomeStore(adapter);
    await home.setDietaryProfile(["vegan", "glutenFree", "vegan"]);
    await home.setPantrySeed(["a", "b", "a", ""]);
    expect(adapter.snapshot()[HOME_KEYS.dietaryProfile]).toBe('["glutenFree","vegan"]');
    expect(adapter.snapshot()[HOME_KEYS.pantrySeed]).toBe('["a","b"]');
  });

  it("reads corrupt or out-of-range stored values as defaults, never throwing", async () => {
    const home = createHomeStore(
      createMemoryAdapter({
        [HOME_KEYS.units]: '"kelvin"',
        [HOME_KEYS.dietaryProfile]: '["vegan","carnivore",7]',
        [HOME_KEYS.pantrySeed]: "{not json",
        [HOME_KEYS.onboarding]: '{"steps":{"units":"answered","diet":"maybe"},"completed":"yes"}',
      }),
    );
    expect(await home.units()).toBe("metric");
    expect(await home.dietaryProfile()).toEqual(["vegan"]);
    expect(await home.pantrySeed()).toEqual([]);
    expect(await home.onboarding()).toEqual({
      steps: { units: "answered", diet: "pending", pantry: "pending" },
      completed: false,
    });
  });

  it("wipes Home's keys and nothing else", async () => {
    const adapter = createMemoryAdapter({ "nutrimero.session.userId": "someone" });
    const home = createHomeStore(adapter);
    await home.setUnits("imperial");
    await home.setDietaryProfile(["eggFree"]);
    await home.setPantrySeed(["a"]);
    await home.setOnboarding({ ...INITIAL_ONBOARDING, completed: true });
    await home.wipeAll();
    await home.wipeAll(); // idempotent
    expect(adapter.snapshot()).toEqual({ "nutrimero.session.userId": "someone" });
  });

  it("clears my data back to the first question and keeps the app language (FR-013, FR-027)", async () => {
    const adapter = createMemoryAdapter();
    const home = createHomeStore(adapter);
    const preferences = createDevicePreferences(adapter);
    await preferences.setUiLocale("lt");
    await home.setUnits("imperial");
    await home.setOnboarding({ ...INITIAL_ONBOARDING, completed: true });
    await home.wipeAll();
    expect(await home.onboarding()).toEqual(INITIAL_ONBOARDING);
    expect(await home.units()).toBe("metric");
    expect(await preferences.uiLocale()).toBe("lt");
  });

  it("reads the units choice as the system plus a region (004 FR-028)", async () => {
    const home = createHomeStore(createMemoryAdapter());
    expect(await home.unitsChoice()).toEqual({ system: "metric", region: "device" });
    await home.setUnitsChoice({ system: "imperial", region: "europe" });
    expect(await home.unitsChoice()).toEqual({ system: "imperial", region: "europe" });
    expect(await home.units()).toBe("imperial");
  });

  it("reads 001's stored imperial as Imperial with region US (owner ruling, 2026-09-25)", async () => {
    const adapter = createMemoryAdapter({ [HOME_KEYS.units]: JSON.stringify("imperial") });
    const home = createHomeStore(adapter);
    expect(await home.unitsChoice()).toEqual({ system: "imperial", region: "us" });
    // Idempotent: reading writes nothing.
    expect(adapter.snapshot()).toEqual({ [HOME_KEYS.units]: JSON.stringify("imperial") });
    // A stored metric reads as Metric with My device.
    const metric = createHomeStore(
      createMemoryAdapter({ [HOME_KEYS.units]: JSON.stringify("metric") }),
    );
    expect(await metric.unitsChoice()).toEqual({ system: "metric", region: "device" });
  });

  it("never reads an explicit Imperial + My device as the legacy value", async () => {
    const home = createHomeStore(createMemoryAdapter());
    await home.setUnitsChoice({ system: "imperial", region: "device" });
    expect(await home.unitsChoice()).toEqual({ system: "imperial", region: "device" });
  });

  it("reads a corrupt region as absent, and Clear my data resets the choice (FR-022)", async () => {
    const adapter = createMemoryAdapter({
      [HOME_KEYS.units]: JSON.stringify("metric"),
      [HOME_KEYS.measuresRegion]: JSON.stringify("asia"),
    });
    const home = createHomeStore(adapter);
    expect(await home.unitsChoice()).toEqual({ system: "metric", region: "device" });
    await home.setUnitsChoice({ system: "imperial", region: "uk" });
    await home.wipeAll();
    expect(await home.unitsChoice()).toEqual({ system: "metric", region: "device" });
    expect(adapter.snapshot()).toEqual({});
  });

  it("keeps every Home key's maximal value inside the 2,048-byte budget (ADR 0001 condition 5)", () => {
    // 14 staples; FID ids are short strings — 64 characters each is a generous ceiling.
    const maximal = {
      [HOME_KEYS.units]: JSON.stringify("imperial"),
      [HOME_KEYS.measuresRegion]: JSON.stringify("europe"),
      [HOME_KEYS.dietaryProfile]: JSON.stringify(DIETARY_OPTIONS),
      [HOME_KEYS.pantrySeed]: JSON.stringify(Array.from({ length: 14 }, () => "x".repeat(64))),
      [HOME_KEYS.onboarding]: JSON.stringify({
        steps: { units: "answered", diet: "answered", pantry: "answered" },
        completed: true,
      }),
    };
    for (const value of Object.values(maximal)) {
      expect(utf8ByteLength(value)).toBeLessThanOrEqual(VALUE_BUDGET_BYTES);
    }
  });
});
