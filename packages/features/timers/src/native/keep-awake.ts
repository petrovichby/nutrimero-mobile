import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect } from "react";

/**
 * F37 / FR-020: the screen stays on only while a timer or routine screen is focused in the
 * foreground. The OS drops the lock when the app backgrounds; leaving the screen (or losing focus
 * under a sheet) releases it at once.
 */
export function useTimerKeepAwake(tag: string, focused: boolean): void {
  useEffect(() => {
    if (!focused) return;
    void activateKeepAwakeAsync(tag);
    return () => {
      void deactivateKeepAwake(tag);
    };
  }, [tag, focused]);
}
