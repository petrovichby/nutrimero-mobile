// @nutrimero/feature-timers (005): the platform-free core. Importable from Node (Vitest); the
// native adapters (notifications, keep-awake) live in "./native".
export {
  type NotificationContent,
  type NotificationData,
  notificationContent,
  routeOf,
  stageLabel,
} from "./model/content";
export { durationParts, formatDuration } from "./model/duration";
export {
  type Action,
  type Clock,
  chipItem,
  createTimer,
  derive,
  type Intent,
  type Item,
  type Outcome,
  type RoutineRun,
  type Status,
  startRoutine,
  type Timer,
  transition,
  type View,
} from "./model/item";
export { performIntents, rescheduleAll, type SchedulerPort } from "./model/perform";
export { shouldAskInContext, showsRefusedNote } from "./model/permission";
export { MAX_ACTIVE_ITEMS, type Pending, reconcile } from "./model/reconcile";
export {
  isBakeStage,
  isStageKey,
  MAX_NAME_LENGTH,
  MAX_SECONDS,
  MAX_STAGES,
  MIN_SECONDS,
  parseStage,
  STAGE_KEYS,
  type Stage,
  type StageKey,
  type StageName,
  validName,
  validSeconds,
} from "./model/stage";
export {
  createTimerStore,
  DEFAULT_PREFS,
  MAX_SAVED_ROUTINES,
  type Permission,
  type Prefs,
  parseItem,
  parseSavedRoutine,
  type SavedRoutine,
  type SaveResult,
  TIMER_KEYS,
  type TimerStore,
  VALUE_CEILING_BYTES,
} from "./store/timer-store";
export { registerTimersWiper, TIMERS_WIPER_NAME } from "./store/wiper";
