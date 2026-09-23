import * as SecureStore from "expo-secure-store";
import { assertValidKey, assertWithinBudget, type DeviceStoreAdapter } from "./adapter";

/**
 * ADR 0001 condition 1: one Keychain class for every key in both apps, set here once and never
 * per call. A background read, if one ever appears, is an amendment to ADR 0001.
 */
const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const secureStoreAdapter: DeviceStoreAdapter = {
  get(key) {
    return SecureStore.getItemAsync(assertValidKey(key), OPTIONS);
  },
  set(key, value) {
    return SecureStore.setItemAsync(assertValidKey(key), assertWithinBudget(key, value), OPTIONS);
  },
  delete(key) {
    return SecureStore.deleteItemAsync(assertValidKey(key), OPTIONS);
  },
};
