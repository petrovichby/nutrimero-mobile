import type { Session } from "@nutrimero/core";
import type { HomeStore } from "./home-store";
import { HOME_WIPER_NAME } from "./keys";

/**
 * Registers Home's wiper with the session's wipe sequence. Call it at app start, **before**
 * `session.restore()`: restore runs the reinstall-orphan clear (ADR 0001 condition 3) through the
 * same sequence, so Home's keys are cleared on a fresh install only if the wiper is already in.
 * Sign-out (FR-011) and, later, account erase (FR-012) reach Home the same way.
 */
export function registerHomeWiper(session: Pick<Session, "registerWiper">, store: HomeStore) {
  return session.registerWiper(HOME_WIPER_NAME, () => store.wipeAll());
}
