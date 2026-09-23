import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

export interface TabItem {
  key: string;
  label: string;
  /** The owned filled chrome glyph (DESIGN.md *Imagery*), drawn by the caller in the given colour. */
  icon: (color: string) => ReactNode;
}

/**
 * The bottom tab bar (DESIGN.md *Navigation*): at most five destinations, labels always visible
 * (icon-only tabs are prohibited), the selected tab on the action-soft pill with heading ink —
 * pill plus colour, never colour alone. Each tab is a full-height target; the bar owns the bottom
 * safe-area inset. Presentational: navigation state belongs to the router.
 */
export function TabBar({
  items,
  selectedKey,
  onSelect,
}: {
  items: readonly TabItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { color } = theme;
  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: color.surface,
          borderTopColor: color.outline,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {items.map((item) => {
        const selected = item.key === selectedKey;
        const ink = selected ? color.heading : color.ink3;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.label}
            onPress={() => onSelect(item.key)}
            style={styles.tab}
          >
            <View style={[styles.pill, selected && { backgroundColor: color.actionSoft }]}>
              {item.icon(ink)}
            </View>
            <Text
              numberOfLines={2}
              style={[textRole(theme, "labelSm", "600"), styles.label, { color: ink }]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", borderTopWidth: 1, paddingTop: 6 },
  tab: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center", gap: 3 },
  pill: {
    width: 48,
    height: 28,
    borderRadius: tokens.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { letterSpacing: 0.11 },
});
