import type { Translator } from "@nutrimero/core";
import type { TimerStore } from "../store/timer-store";
import { notificationContent } from "./content";
import type { Intent, Item } from "./item";

/** The platform half of scheduling, implemented by `./native` with expo-notifications. */
export interface SchedulerPort {
  schedule(content: NonNullable<ReturnType<typeof notificationContent>>): Promise<string>;
  cancel(notificationId: string): Promise<void>;
}

/**
 * Carries out scheduling intents against the platform and writes each new notification id back to
 * the stored item (research R1). Without permission a schedule intent is skipped, not an error: the
 * launch reconcile re-issues it once permission appears (US5-3). A cancel always runs.
 */
export async function performIntents(
  intents: readonly Intent[],
  deps: {
    readonly store: Pick<TimerStore, "items" | "saveItem">;
    readonly scheduler: SchedulerPort;
    readonly t: Translator;
    readonly permitted: boolean;
  },
): Promise<void> {
  let items: Item[] | null = null;
  for (const intent of intents) {
    if (intent.type === "cancel") {
      await deps.scheduler.cancel(intent.notificationId);
      continue;
    }
    if (!deps.permitted) continue;
    items ??= await deps.store.items();
    const item: Item | undefined = items.find((entry) => entry.id === intent.itemId);
    const content = item === undefined ? null : notificationContent(item, deps.t);
    if (item === undefined || content === null) continue;
    const notificationId = await deps.scheduler.schedule(content);
    const updated: Item = { ...item, notificationId };
    await deps.store.saveItem(updated);
    items = items.map((entry): Item => (entry.id === updated.id ? updated : entry));
  }
}

/**
 * FR-015: every pending text in the new UI language. Each running item's notification is
 * cancelled and scheduled again from its stored end time.
 */
export function rescheduleAll(items: readonly Item[], now: number): Intent[] {
  const intents: Intent[] = [];
  for (const item of items) {
    if (item.clock.status !== "running" || item.clock.endAt <= now) continue;
    if (item.notificationId !== null) {
      intents.push({ type: "cancel", notificationId: item.notificationId });
    }
    intents.push({ type: "schedule", itemId: item.id });
  }
  return intents;
}
