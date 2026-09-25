import { Linking, Platform } from "react-native";
import type { TimersPlatform } from "../ui/timers-context";
import { readPermission, requestInContext } from "./permission";
import { notificationScheduler } from "./scheduler";

/** The device half the screens need, handed to `<TimersProvider platform>` at the app root. */
export const timersPlatform: TimersPlatform = {
  scheduler: notificationScheduler,
  readPermission,
  requestInContext,
  openSettings: () => {
    void Linking.openSettings();
  },
  isAndroid: Platform.OS === "android",
};
