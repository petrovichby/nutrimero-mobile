import { RoutineScreen, TimerScreen, useTimers } from "@nutrimero/feature-timers/screens";
import { router, useIsFocused, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";

/**
 * A timer (18) or a routine (20), by id — from the sheet, the chip, the completion alert or a
 * notification tap (gate 1, Q1). Keep-awake follows focus (F37). A cold start from a
 * notification has nothing to go back to, so back lands on Recipes.
 */
export default function TimerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const focused = useIsFocused();
  const { items } = useTimers();
  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, []);
  const item = items.find((entry) => entry.id === id);
  return item?.kind === "routine" ? (
    <RoutineScreen id={id} focused={focused} onBack={onBack} />
  ) : (
    <TimerScreen id={id} focused={focused} onBack={onBack} />
  );
}
