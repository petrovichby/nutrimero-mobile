// The native half of @nutrimero/feature-timers (005): expo-notifications and expo-keep-awake
// behind the pure core's ports. Apps import this at wiring time; tests import "./index".
export { useTimerKeepAwake } from "./native/keep-awake";
export { reconcileNow, useTimersLifecycle } from "./native/lifecycle";
export { readPermission, requestInContext } from "./native/permission";
export { timersPlatform } from "./native/platform";
export { useNotificationRouting } from "./native/routing";
export {
  ensureTimersChannel,
  notificationScheduler,
  presentTimersInForeground,
  TIMERS_CHANNEL_ID,
} from "./native/scheduler";
