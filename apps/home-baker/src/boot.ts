import {
  createApiClient,
  createSession,
  fileInstallMarker,
  secureStoreAdapter,
} from "@nutrimero/core";
import { createHomeStore, registerHomeWiper } from "@nutrimero/feature-home-data";

/**
 * Launch order (ADR 0001 condition 3, 001 data-model): Home's wiper is registered with the
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

registerHomeWiper(session, homeStore);

export const ready = session.restore();
