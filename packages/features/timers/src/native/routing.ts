import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { type NotificationData, routeOf } from "../model/content";

/**
 * Gate 1, Q1: tapping a stage notification opens the routine at "Start next stage"; a timer's opens
 * its timer. Works for a running app (the response listener) and a cold start (the last response).
 */
export function useNotificationRouting(onOpen: (route: NotificationData) => void): void {
  useEffect(() => {
    const last = Notifications.getLastNotificationResponse();
    const initial = last === null ? null : routeOf(last.notification.request.content.data);
    if (initial !== null) onOpen(initial);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = routeOf(response.notification.request.content.data);
      if (route !== null) onOpen(route);
    });
    return () => subscription.remove();
  }, [onOpen]);
}
