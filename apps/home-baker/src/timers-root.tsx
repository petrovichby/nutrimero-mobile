import type { Translator } from "@nutrimero/core";
import type { NotificationData } from "@nutrimero/feature-timers";
import {
  timersPlatform,
  useNotificationRouting,
  useTimersLifecycle,
} from "@nutrimero/feature-timers/native";
import { CompletionAlert, TimersProvider, TimersSheet } from "@nutrimero/feature-timers/screens";
import { router } from "expo-router";
import { type ReactNode, useCallback } from "react";
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
