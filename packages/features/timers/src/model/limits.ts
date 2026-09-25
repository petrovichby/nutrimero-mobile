import { MAX_SAVED_ROUTINES } from "../store/timer-store";
import { MAX_ACTIVE_ITEMS } from "./reconcile";

/**
 * The two caps the store enforces, asked before the action so the screens can refuse in words
 * (17c, 19d; owner walk 2026-09-25) instead of failing silently at the write.
 */
export function atActiveLimit(activeCount: number): boolean {
  return activeCount >= MAX_ACTIVE_ITEMS;
}

/** Saving a *new* routine at the cap is refused; editing one already saved never is. */
export function atSavedLimit(savedCount: number, editingSaved: boolean): boolean {
  return !editingSaved && savedCount >= MAX_SAVED_ROUTINES;
}

export { MAX_ACTIVE_ITEMS, MAX_SAVED_ROUTINES };
