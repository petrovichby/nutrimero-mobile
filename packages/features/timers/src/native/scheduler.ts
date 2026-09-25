import type { Translator } from "@nutrimero/core";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { routeOf } from "../model/content";
import { notBefore } from "../model/fire-time";
import type { SchedulerPort } from "../model/perform";
import type { Pending } from "../model/reconcile";

/** 005 FR-012: one channel, for timers only — nothing else is ever sent on it. */
export const TIMERS_CHANNEL_ID = "home-timers";

/**
 * FR-013 (owner's F27 decision): no exact alarms. A DATE trigger without SCHEDULE_EXACT_ALARM is
 * scheduled inexactly on Android; the help text states the lateness, and a build check
 * (scripts/android-exact-alarm.test.ts) proves the permission is never requested.
 */
export const notificationScheduler: SchedulerPort & {
  pending(): Promise<Pending[]>;
  cancelAll(): Promise<void>;
} = {
  async schedule(content) {
    return Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        body: content.body,
        data: { ...content.data },
        sound: "default",
        // FR-010b (owner, 2026-09-25): a timer ending is time-sensitive — it breaks through a
        // Focus the baker has allowed Time Sensitive notifications for. iOS 15+; ignored before.
        interruptionLevel: "timeSensitive",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        // iOS fires on a whole-second boundary at or before the date; never early (T027).
        date: notBefore(content.at),
        channelId: TIMERS_CHANNEL_ID,
      },
    });
  },

  async cancel(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async pending() {
    const requests = await Notifications.getAllScheduledNotificationsAsync();
    return requests.map((request) => ({
      notificationId: request.identifier,
      itemId: routeOf(request.content.data)?.itemId ?? null,
    }));
  },

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};

/** Android: the timers channel, named in the UI language (re-run when the language changes). */
export async function ensureTimersChannel(t: Translator): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(TIMERS_CHANNEL_ID, {
    name: t("home.timers.channelName"),
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
  });
}

/**
 * In the foreground the in-app completion alert shows instead of a banner (US1-5); the
 * notification still plays its sound (research R9: no second audio module).
 */
export function presentTimersInForeground(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
