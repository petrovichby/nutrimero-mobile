import { StyleSheet, View } from "react-native";

/**
 * The selected-state check drawn from views (a rotated corner), so the shared set needs no icon
 * library for its one built-in glyph. Decorative: the control announces its own checked state.
 */
export function Check({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.box, { width: size, height: size }]}
    >
      <View
        style={[
          styles.mark,
          {
            width: size * 0.36,
            height: size * 0.7,
            borderColor: color,
            borderRightWidth: size * 0.14,
            borderBottomWidth: size * 0.14,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center" },
  mark: { transform: [{ translateY: -1 }, { rotate: "45deg" }] },
});
