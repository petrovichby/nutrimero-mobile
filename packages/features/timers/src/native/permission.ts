import * as Notifications from "expo-notifications";
import { shouldAskInContext } from "../model/permission";
import type { Permission, TimerStore } from "../store/timer-store";

function toPermission(status: Notifications.PermissionStatus): Permission {
  return status === Notifications.PermissionStatus.GRANTED
    ? "granted"
    : status === Notifications.PermissionStatus.DENIED
      ? "denied"
      : "undetermined";
}

/** The current permission, remembered for the refused-state note (FR-017). */
export async function readPermission(
  store: Pick<TimerStore, "prefs" | "setPrefs">,
): Promise<Permission> {
  const current = toPermission((await Notifications.getPermissionsAsync()).status);
  const prefs = await store.prefs();
  if (prefs.lastPermission !== current) await store.setPrefs({ ...prefs, lastPermission: current });
  return current;
}

/**
 * FR-016: called only from the first timer or routine start, after the in-app reason. It shows the
 * system prompt at most once ever, and resolves to the permission either way; the timer starts
 * regardless (US1-1).
 */
export async function requestInContext(
  store: Pick<TimerStore, "prefs" | "setPrefs">,
): Promise<Permission> {
  const prefs = await store.prefs();
  const current = toPermission((await Notifications.getPermissionsAsync()).status);
  if (!shouldAskInContext(prefs, current)) return current;
  await store.setPrefs({ ...prefs, permissionAsked: true });
  const answer = toPermission((await Notifications.requestPermissionsAsync()).status);
  await store.setPrefs({ ...prefs, permissionAsked: true, lastPermission: answer });
  return answer;
}
