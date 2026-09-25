import { useEffect, useRef } from "react";
import { Animated, Easing, useWindowDimensions } from "react-native";
import { useReduceMotion } from "./use-reduce-motion";

/**
 * The one sheet motion (DESIGN.md MA-27, round 3 — nutrimero-design f7b75e5f, owner walk
 * 2026-09-25): the dim fades in place and only the sheet rises, 240 ms ease-out cubic; closing
 * fades both; under Reduce Motion everything fades. Use it with a Modal whose
 * `animationType` is "fade": pass `onShow` to the Modal and `translateY` to the sheet.
 */
export function useSheetRise(visible: boolean): {
  translateY: Animated.Value;
  onShow: () => void;
} {
  const reduceMotion = useReduceMotion();
  const { height } = useWindowDimensions();
  // Starts below the screen, so no frame shows the sheet in place before it rises.
  const translateY = useRef(new Animated.Value(reduceMotion ? 0 : height)).current;
  useEffect(() => {
    if (visible) return;
    // Back below the screen once the fade-out has finished, ready for the next rise.
    const id = setTimeout(() => translateY.setValue(reduceMotion ? 0 : height), 300);
    return () => clearTimeout(id);
  }, [visible, reduceMotion, height, translateY]);
  const onShow = () => {
    if (reduceMotion) {
      translateY.setValue(0);
      return;
    }
    Animated.timing(translateY, {
      toValue: 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  return { translateY, onShow };
}
