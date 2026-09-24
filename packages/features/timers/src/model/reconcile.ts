import type { Intent, Item } from "./item";

/** A pending platform notification that belongs to this feature. */
export interface Pending {
  readonly notificationId: string;
  /** From the notification's data; null when it carries none (an orphan). */
  readonly itemId: string | null;
}

/** 005 FR-002 / research R4: at most 10 active items, so at most 10 pending notifications. */
export const MAX_ACTIVE_ITEMS = 10;

/**
 * Brings the platform's pending notifications into line with the stored truth, at launch and on
 * every foreground (research R1):
 * - an item still running with no pending notification is scheduled again (a reboot, a force-stop,
 *   or permission granted later dropped or never made it);
 * - a pending notification no stored item claims is cancelled (a wipe that raced a crash);
 * - a stored item that is no longer running keeps nothing pending.
 */
export function reconcile(
  items: readonly Item[],
  pending: readonly Pending[],
  now: number,
): Intent[] {
  const intents: Intent[] = [];
  const pendingIds = new Set(pending.map((entry) => entry.notificationId));
  const claimed = new Set<string>();

  for (const item of items) {
    const shouldPend = item.clock.status === "running" && item.clock.endAt > now;
    const has = item.notificationId !== null && pendingIds.has(item.notificationId);
    if (has && item.notificationId !== null) claimed.add(item.notificationId);
    if (shouldPend && !has) {
      intents.push({ type: "schedule", itemId: item.id });
    } else if (!shouldPend && has && item.notificationId !== null) {
      intents.push({ type: "cancel", notificationId: item.notificationId });
    }
  }
  for (const entry of pending) {
    if (!claimed.has(entry.notificationId)) {
      intents.push({ type: "cancel", notificationId: entry.notificationId });
    }
  }
  return intents;
}
