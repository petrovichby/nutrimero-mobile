import {
  createApiClient,
  createDevicePreferences,
  createSession,
  registerDevicePreferences,
} from "@nutrimero/core";
import { fileInstallMarker, secureStoreAdapter } from "@nutrimero/core/native";
import { createHomeStore, registerHomeWiper } from "@nutrimero/feature-home-data";
import { createTimerStore, registerTimersWiper } from "@nutrimero/feature-timers";
import { notificationScheduler } from "@nutrimero/feature-timers/native";

/**
 * Launch order (ADR 0001 condition 3, 001 data-model): Home's and 005's timers wipers are registered with the
 * session's wipe sequence **before** `restore()`, so the reinstall-orphan clear and any resumed
 * wipe cover Home's keys too. Nothing reads device data until `ready` resolves.
 *
 * 001 has no sign-in and makes no api call: a signed-out `restore()` touches only the device
 * store. The api base URL is injected by the environment when a feature first needs it.
 */
export const session = createSession({
  client: createApiClient(process.env.EXPO_PUBLIC_API_URL ?? ""),
  store: secureStoreAdapter,
  marker: fileInstallMarker,
});

export const homeStore = createHomeStore(secureStoreAdapter);

export const devicePreferences = createDevicePreferences(secureStoreAdapter);

/** 005: timers, routine runs and saved routines — device-only (FR-021). */
export const timerStore = createTimerStore(secureStoreAdapter);

registerHomeWiper(session, homeStore);
// 005 (FR-021): before restore(), so a reinstall clears timers and withdraws their notifications;
// Clear my data reaches it through the same sequence. It throws only when a delete really fails.
registerTimersWiper(session, timerStore, notificationScheduler.cancelAll);
// Device preferences (the interface language) are cleared on reinstall only — never by sign-out,
// erase or "Clear my data" (001 FR-027).
registerDevicePreferences(session);

export const ready = session.restore();
