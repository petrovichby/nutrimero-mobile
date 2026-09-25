import type { Translator } from "@nutrimero/core";
import type { NotificationData } from "@nutrimero/feature-timers";
import {
  timersPlatform,
  useNotificationRouting,
  useTimersLifecycle,
} from "@nutrimero/feature-timers/native";
import { CompletionAlert, TimersProvider, TimersSheet } from "@nutrimero/feature-timers/screens";
import { deactivateKeepAwake, ExpoKeepAwakeTag } from "expo-keep-awake";
import { router } from "expo-router";
import { type ReactNode, useCallback, useEffect } from "react";
import { timerStore } from "./boot";

/** Where each timers surface lives in the router (005 wiring). */
export const timersRoutes = {
  item: (id: string) => ({ pathname: "/timers/[id]", params: { id } }) as const,
  newTimer: "/timers/new",
  newRoutine: "/timers/routine-editor",
  editRoutine: (routineId: string) =>
    ({ pathname: "/timers/routine-editor", params: { routineId } }) as const,
  savedRoutines: "/timers/routines",
} as const;

/**
 * 005's app-root pieces, mounted once the first run is done (so after boot's restore): the state
 * provider, the launch/foreground reconcile, notification taps, the timers sheet and the in-app
 * completion alert. Clear my data unmounts it with the tabs, so nothing stale survives a wipe.
 */
export function TimersRoot({
  t,
  locale,
  sheetOpen,
  onSheetClose,
  children,
}: {
  t: Translator;
  locale: string;
  sheetOpen: boolean;
  onSheetClose: () => void;
  children: ReactNode;
}) {
  useTimersLifecycle(timerStore, t, locale);
  useReleaseDevKeepAwake();
  const openItem = useCallback((route: NotificationData) => {
    router.push(timersRoutes.item(route.itemId));
  }, []);
  useNotificationRouting(openItem);

  const go = (to: Parameters<typeof router.push>[0]) => {
    onSheetClose();
    router.push(to);
  };

  return (
    <TimersProvider store={timerStore} platform={timersPlatform} t={t} locale={locale}>
      {children}
      <TimersSheet
        visible={sheetOpen}
        onClose={onSheetClose}
        onOpen={(id) => go(timersRoutes.item(id))}
        onNewTimer={() => go(timersRoutes.newTimer)}
        onNewRoutine={() => go(timersRoutes.newRoutine)}
        onSavedRoutines={() => go(timersRoutes.savedRoutines)}
      />
      <CompletionAlert onOpen={(id) => router.push(timersRoutes.item(id))} />
    </TimersProvider>
  );
}

/**
 * F37 in development builds (T027, owner's iPhone run 2026-09-25: the phone never dimmed on any
 * screen). In development Expo keeps the whole app awake — `expo/src/launch/withDevTools`
 * activates `ExpoKeepAwakeTag` at the root whenever `expo-keep-awake` is installed, which 005
 * added. That hid the real behaviour: only a focused timer or routine screen may hold the screen.
 * Release Expo's dev tag once the timers layer is up, so a dev build dims like a release build
 * (where the dev wrapper and this hook's work are both absent). Runs after the root's effect:
 * this layer mounts only after boot and first run, in a later commit.
 */
function useReleaseDevKeepAwake(): void {
  useEffect(() => {
    if (!__DEV__) return;
    void deactivateKeepAwake(ExpoKeepAwakeTag);
  }, []);
}
