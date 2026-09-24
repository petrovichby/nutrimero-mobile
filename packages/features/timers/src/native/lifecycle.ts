import type { Translator } from "@nutrimero/core";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { performIntents, rescheduleAll } from "../model/perform";
import { reconcile } from "../model/reconcile";
import type { TimerStore } from "../store/timer-store";
import { readPermission } from "./permission";
import { ensureTimersChannel, notificationScheduler } from "./scheduler";

/** One pass of the launch/foreground reconcile (research R1, FR-004, FR-014, US5-3). */
export async function reconcileNow(
  store: TimerStore,
  t: Translator,
  now = Date.now(),
): Promise<void> {
  const permitted = (await readPermission(store)) === "granted";
  const intents = reconcile(await store.items(), await notificationScheduler.pending(), now);
  await performIntents(intents, { store, scheduler: notificationScheduler, t, permitted });
}

/**
 * Mount once in the Home root layout (005 wiring, PR 4): reconciles at launch and on every return
 * to the foreground, and re-schedules every pending text when the UI language changes (FR-015).
 */
export function useTimersLifecycle(store: TimerStore, t: Translator, locale: string): void {
  const firstLocale = useRef(locale);

  useEffect(() => {
    void ensureTimersChannel(t).then(() => reconcileNow(store, t));
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void reconcileNow(store, t);
    });
    return () => subscription.remove();
  }, [store, t]);

  useEffect(() => {
    if (locale === firstLocale.current) return;
    firstLocale.current = locale;
    void (async () => {
      await ensureTimersChannel(t);
      const permitted = (await readPermission(store)) === "granted";
      const intents = rescheduleAll(await store.items(), Date.now());
      await performIntents(intents, { store, scheduler: notificationScheduler, t, permitted });
    })();
  }, [locale, store, t]);
}
