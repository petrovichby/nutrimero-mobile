import type { Session } from "@nutrimero/core";
import type { TimerStore } from "./timer-store";

/** The name 005's wiper runs under in the session's wipe sequence. */
export const TIMERS_WIPER_NAME = "home.timers";

/**
 * Registers 005's wiper (FR-021). Call it at app start, **before** `session.restore()`: restore
 * runs the reinstall-orphan clear through the same sequence (ADR 0001 condition 3), so a fresh
 * install clears timers only if the wiper is already in. Sign-out and Clear my data (once it runs
 * every registered wiper) reach it the same way.
 *
 * `cancelAll` withdraws every scheduled notification the app holds; timers are the only local
 * notifications, and a wipe removes every one of them.
 */
export function registerTimersWiper(
  session: Pick<Session, "registerWiper">,
  store: Pick<TimerStore, "wipeAll">,
  cancelAll: () => Promise<void>,
) {
  return session.registerWiper(TIMERS_WIPER_NAME, async () => {
    await store.wipeAll();
    await cancelAll();
  });
}
