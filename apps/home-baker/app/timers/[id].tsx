import { RoutineScreen, TimerScreen, useTimers } from "@nutrimero/feature-timers/screens";
import { router, useIsFocused, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useShell } from "../../src/shell";

/**
 * A timer (18) or a routine (20), by id — from the sheet, the chip, the completion alert or a
 * notification tap (gate 1, Q1). Keep-awake follows focus (F37). After a cold start from a
 * notification there is nothing behind it: "‹ Timers" opens the Timers sheet over Recipes, as the
 * label promises (MA-27, round 3 — nutrimero-design f7b75e5f).
 */
export default function TimerRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const focused = useIsFocused();
  const { items } = useTimers();
  const { openTimers } = useShell();
  const onBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
    openTimers();
  }, [openTimers]);
  const item = items.find((entry) => entry.id === id);
  return item?.kind === "routine" ? (
    <RoutineScreen id={id} focused={focused} onBack={onBack} />
  ) : (
    <TimerScreen id={id} focused={focused} onBack={onBack} />
  );
}
