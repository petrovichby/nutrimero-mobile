import type { Translator } from "@nutrimero/core";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AccessibilityInfo, AppState, Vibration } from "react-native";
import { stageLabel } from "../model/content";
import { capitalizeFirst } from "../model/format";
import {
  type Action,
  createTimer,
  derive,
  type Item,
  type Outcome,
  startRoutine as startRoutineOutcome,
  transition,
  type View,
} from "../model/item";
import { performIntents, type SchedulerPort } from "../model/perform";
import { shouldAskInContext } from "../model/permission";
import type { Stage } from "../model/stage";
import {
  DEFAULT_PREFS,
  type Permission,
  type Prefs,
  type SavedRoutine,
  type SaveResult,
  type TimerStore,
} from "../store/timer-store";

/** The platform half, injected by the app at wiring time (`@nutrimero/feature-timers/native`). */
export interface TimersPlatform {
  readonly scheduler: SchedulerPort;
  readPermission(store: TimerStore): Promise<Permission>;
  requestInContext(store: TimerStore): Promise<Permission>;
  openSettings(): void;
  readonly isAndroid: boolean;
}

export interface TimersValue {
  readonly t: Translator;
  readonly locale: string;
  readonly now: number;
  readonly items: readonly Item[];
  readonly saved: readonly SavedRoutine[];
  readonly prefs: Prefs;
  readonly permission: Permission;
  readonly isAndroid: boolean;
  /** Items that ended while the app was open, oldest first (22-timer-alert). */
  readonly alerts: readonly View[];
  dismissAlert(id: string): void;
  /** FR-016: true when the next start must show the reason and the system prompt first. */
  needsPermissionMoment(): boolean;
  askPermission(): Promise<Permission>;
  startTimer(name: string, seconds: number): Promise<SaveResult & { id?: string }>;
  startRoutine(input: {
    name: string;
    stages: readonly Stage[];
    savedRoutineId: string | null;
  }): Promise<SaveResult & { id?: string }>;
  act(id: string, action: Action): Promise<void>;
  saveRoutine(routine: SavedRoutine): Promise<SaveResult>;
  deleteRoutine(id: string): Promise<void>;
  /** FR-013a: once per install. */
  acknowledgeAndroidNotice(): Promise<void>;
  openSettings(): void;
  newId(): string;
}

const TimersContext = createContext<TimersValue | null>(null);

export function useTimers(): TimersValue {
  const value = useContext(TimersContext);
  if (value === null) throw new Error("useTimers needs a <TimersProvider> above it");
  return value;
}

/** Ids inside the device store's key alphabet (base 36, ≤ 24 characters). */
function createId(): string {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 36 ** 6)
    .toString(36)
    .padStart(6, "0")}`;
}

/** What an item is called in an alert or announcement (a stage name starts it, capitalized). */
function doneTitle(view: View, t: Translator, locale: string): string {
  if (view.stage !== null) {
    const stage = stageLabel(view.stage.current, t);
    return capitalizeFirst(t("home.timers.ui.routine.stageDone", { stage }), locale);
  }
  return t("home.timers.notification.timerDone.title", { name: view.name });
}

/**
 * The timers state for every screen (005 contracts/timers-package.md). The stored end times are
 * the truth; `now` is a display-only refresh (research R8) that runs once a second while anything
 * is running and the app is in the foreground — it never writes. When a running item's end
 * passes while the app is open, the in-app alert takes over from the banner (US1-5): text, a
 * vibration, and a screen-reader announcement (FR-019).
 */
export function TimersProvider({
  store,
  platform,
  t,
  locale,
  children,
}: {
  store: TimerStore;
  platform: TimersPlatform;
  t: Translator;
  locale: string;
  children: ReactNode;
}) {
  const [items, setItems] = useState<readonly Item[]>([]);
  const [saved, setSaved] = useState<readonly SavedRoutine[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [permission, setPermission] = useState<Permission>("undetermined");
  const [now, setNow] = useState(() => Date.now());
  const [alerts, setAlerts] = useState<readonly View[]>([]);
  const [active, setActive] = useState(AppState.currentState === "active");
  const running = useRef(new Set<string>());

  const reload = useCallback(async () => {
    const [nextItems, nextSaved, nextPrefs] = await Promise.all([
      store.items(),
      store.savedRoutines(),
      store.prefs(),
    ]);
    setItems(nextItems);
    setSaved(nextSaved);
    setPrefs(nextPrefs);
    setNow(Date.now());
  }, [store]);

  useEffect(() => {
    void reload();
    void platform.readPermission(store).then(setPermission);
    const subscription = AppState.addEventListener("change", (state) => {
      setActive(state === "active");
      if (state === "active") {
        void reload();
        void platform.readPermission(store).then(setPermission);
      }
    });
    return () => subscription.remove();
  }, [platform, reload, store]);

  const anyRunning = items.some(
    (item) => item.clock.status === "running" && item.clock.endAt > now,
  );
  useEffect(() => {
    if (!anyRunning || !active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [anyRunning, active]);

  // Completion while open: running → done between two display refreshes.
  useEffect(() => {
    const ended: View[] = [];
    const nowRunning = new Set<string>();
    for (const item of items) {
      const view = derive(item, now);
      if (view.status === "running") nowRunning.add(item.id);
      else if (view.status === "done" && running.current.has(item.id)) ended.push(view);
    }
    running.current = nowRunning;
    if (ended.length === 0 || !active) return;
    setAlerts((current) => [...current, ...ended]);
    Vibration.vibrate([0, 400, 200, 400]);
    for (const view of ended)
      AccessibilityInfo.announceForAccessibility(doneTitle(view, t, locale));
  }, [items, now, active, t, locale]);

  const apply = useCallback(
    async (outcome: Outcome, removedId?: string): Promise<SaveResult> => {
      if (outcome.item !== null) {
        const result = await store.saveItem(outcome.item);
        if (!result.ok) return result;
      } else if (removedId !== undefined) {
        await store.removeItem(removedId);
      }
      // Read fresh, not from state: right after the in-context prompt the state may be stale, and
      // the first timer must schedule at once (FR-016).
      const current = await platform.readPermission(store);
      setPermission(current);
      await performIntents(outcome.intents, {
        store,
        scheduler: platform.scheduler,
        t,
        locale,
        permitted: current === "granted",
      });
      await reload();
      return { ok: true };
    },
    [locale, platform, reload, store, t],
  );

  const value = useMemo<TimersValue>(
    () => ({
      t,
      locale,
      now,
      items,
      saved,
      prefs,
      permission,
      isAndroid: platform.isAndroid,
      alerts,
      dismissAlert: (id) => setAlerts((current) => current.filter((view) => view.id !== id)),
      needsPermissionMoment: () => shouldAskInContext(prefs, permission),
      askPermission: async () => {
        const answer = await platform.requestInContext(store);
        setPermission(answer);
        await reload();
        return answer;
      },
      startTimer: async (name, seconds) => {
        const id = createId();
        const result = await apply(createTimer({ id, name, seconds, now: Date.now() }));
        return result.ok ? { ...result, id } : result;
      },
      startRoutine: async (input) => {
        const id = createId();
        const outcome = startRoutineOutcome({ id, ...input, now: Date.now() });
        if (outcome === null) return { ok: false, reason: "size" };
        const result = await apply(outcome);
        return result.ok ? { ...result, id } : result;
      },
      act: async (id, action) => {
        const item = items.find((entry) => entry.id === id);
        if (item === undefined) return;
        const outcome = transition(item, action, Date.now());
        if (!outcome.applied) return;
        await apply(outcome, id);
        if (outcome.item === null) {
          setAlerts((current) => current.filter((view) => view.id !== id));
        }
      },
      saveRoutine: async (routine) => {
        const result = await store.saveRoutine(routine);
        await reload();
        return result;
      },
      deleteRoutine: async (id) => {
        await store.removeRoutine(id);
        await reload();
      },
      acknowledgeAndroidNotice: async () => {
        await store.setPrefs({ ...prefs, androidBakeNoticeShown: true });
        await reload();
      },
      openSettings: platform.openSettings,
      newId: createId,
    }),
    [alerts, apply, items, locale, now, permission, platform, prefs, reload, saved, store, t],
  );

  return <TimersContext.Provider value={value}>{children}</TimersContext.Provider>;
}
