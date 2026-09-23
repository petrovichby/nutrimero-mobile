import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/provider";

/**
 * A screen inside the safe-area insets (DESIGN.md *Layout & touch*: no hardcoded status-bar
 * offsets), on the app's surface. On tablets the content relaxes into a capped ~600pt column
 * rather than stretching full-bleed.
 */
export function Screen({
  children,
  edges = ["top", "left", "right"],
  style,
}: {
  children: ReactNode;
  /** The tab bar owns the bottom inset on tabbed screens; modal flows pass all four edges. */
  edges?: readonly Edge[];
  style?: ViewStyle;
}) {
  const { color } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: color.surface }]}>
      <View style={[styles.column, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  column: { flex: 1, width: "100%", maxWidth: 600, alignSelf: "center" },
});
