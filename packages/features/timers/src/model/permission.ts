import type { Permission, Prefs } from "../store/timer-store";

/**
 * FR-016/FR-017: the system prompt is shown in context, at the first timer or routine start, and
 * only once ever — never at launch, never in onboarding, never again after a refusal.
 */
export function shouldAskInContext(prefs: Prefs, current: Permission): boolean {
  return current === "undetermined" && !prefs.permissionAsked;
}

/** FR-017: the refused-state note shows whenever notifications are not allowed. */
export function showsRefusedNote(current: Permission): boolean {
  return current === "denied";
}
