import { describe, expect, it } from "vitest";
import { createApiClient } from "../api/client";
import { createSession } from "../session/session";
import { BASE_URL, createFakeApi } from "../test-support/fake-api";
import { createMemoryAdapter } from "./adapter";
import { createMemoryMarker } from "./install-marker";
import {
  createDevicePreferences,
  DEVICE_PREFERENCE_KEYS,
  registerDevicePreferences,
} from "./preferences";

describe("device preferences (001 FR-026/027)", () => {
  it("stores, reads and clears the interface-language choice", async () => {
    const prefs = createDevicePreferences(createMemoryAdapter());
    expect(await prefs.uiLocale()).toBeNull();
    await prefs.setUiLocale("be");
    expect(await prefs.uiLocale()).toBe("be");
    await prefs.setUiLocale(null);
    expect(await prefs.uiLocale()).toBeNull();
  });

  it("reads an unknown stored value as no choice", async () => {
    const prefs = createDevicePreferences(
      createMemoryAdapter({ [DEVICE_PREFERENCE_KEYS.uiLocale]: "fr" }),
    );
    expect(await prefs.uiLocale()).toBeNull();
  });

  it("is registered as fresh-install-only: a reinstall clears it", async () => {
    const store = createMemoryAdapter({ [DEVICE_PREFERENCE_KEYS.uiLocale]: "uk" });
    const session = createSession({
      client: createApiClient(BASE_URL, { fetch: createFakeApi({}).fetch }),
      store,
      marker: createMemoryMarker(false),
    });
    registerDevicePreferences(session);
    await session.restore();
    expect(await createDevicePreferences(store).uiLocale()).toBeNull();
  });
});
