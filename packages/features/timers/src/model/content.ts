import type { Translator } from "@nutrimero/core";
import type { Item } from "./item";
import type { Stage } from "./stage";

/** A stage's display name: the baker's text, or the localized pick. */
export function stageLabel(stage: Stage, t: Translator): string {
  return "text" in stage.name ? stage.name.text : t(`home.timers.stage.${stage.name.key}`);
}

export interface NotificationData {
  readonly kind: "timer" | "stage";
  readonly itemId: string;
}

export interface NotificationContent {
  readonly title: string;
  readonly body: string;
  readonly data: NotificationData;
  /** When it fires: the item's end time. */
  readonly at: number;
}

/**
 * What a running item's notification says (FR-010, gate 1 Q1): a timer names itself; a routine
 * stage names the stage that ended and the next one ("Bulk ferment done: shape next"), or says it
 * was the last. Null when the item has nothing to notify (paused, hands-on).
 */
export function notificationContent(item: Item, t: Translator): NotificationContent | null {
  if (item.clock.status !== "running") return null;
  const at = item.clock.endAt;
  if (item.kind === "timer") {
    return {
      title: t("home.timers.notification.timerDone.title", { name: item.name }),
      body: t("home.timers.notification.timerDone.body"),
      data: { kind: "timer", itemId: item.id },
      at,
    };
  }
  const current = item.stages[item.index];
  if (current === undefined) return null;
  const next = item.stages[item.index + 1];
  const stage = stageLabel(current, t);
  return next === undefined
    ? {
        title: t("home.timers.notification.lastStageDone.title", { stage }),
        body: t("home.timers.notification.lastStageDone.body"),
        data: { kind: "stage", itemId: item.id },
        at,
      }
    : {
        title: t("home.timers.notification.stageDone.title", { stage, next: stageLabel(next, t) }),
        body: t("home.timers.notification.stageDone.body"),
        data: { kind: "stage", itemId: item.id },
        at,
      };
}

/** The route a tapped notification carries, or null when it is not one of ours (gate 1, Q1). */
export function routeOf(data: unknown): NotificationData | null {
  if (typeof data !== "object" || data === null) return null;
  const kind = Reflect.get(data, "kind");
  const itemId = Reflect.get(data, "itemId");
  return (kind === "timer" || kind === "stage") && typeof itemId === "string"
    ? { kind, itemId }
    : null;
}
