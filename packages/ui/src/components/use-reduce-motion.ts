import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** The OS Reduce Motion setting, live (DESIGN.md *Motion*: reduced ⇒ an immediate change). */
export function useReduceMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}
