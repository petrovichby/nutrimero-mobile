import { LOCALES, type Locale } from "../i18n/messages";
import type { DeviceStoreAdapter } from "./adapter";

/**
 * Device preferences: settings of the device, not personal data (001 FR-027). They sit outside
 * every app's wiper and the session's own keys, so sign-out, erase and "Clear my data" leave them
 * in place; only the reinstall-orphan clear removes them (registered as fresh-install-only).
 */
export const DEVICE_PREFERENCE_KEYS = {
  uiLocale: "nutrimero.device.uiLocale",
} as const;

export interface DevicePreferences {
  /** The in-app interface-language choice (IX 1.2.0 rule 2), or null to follow the system. */
  uiLocale(): Promise<Locale | null>;
  setUiLocale(locale: Locale | null): Promise<void>;
}

export function createDevicePreferences(store: DeviceStoreAdapter): DevicePreferences {
  return {
    async uiLocale() {
      const stored = await store.get(DEVICE_PREFERENCE_KEYS.uiLocale);
      return LOCALES.find((locale) => locale === stored) ?? null;
    },
    setUiLocale(locale) {
      return locale === null
        ? store.delete(DEVICE_PREFERENCE_KEYS.uiLocale)
        : store.set(DEVICE_PREFERENCE_KEYS.uiLocale, locale);
    },
  };
}

/** Registers every device-preference key as fresh-install-only. Call before `restore()`. */
export function registerDevicePreferences(session: {
  registerFreshInstallOnlyKey(key: string): () => void;
}) {
  for (const key of Object.values(DEVICE_PREFERENCE_KEYS)) {
    session.registerFreshInstallOnlyKey(key);
  }
}
