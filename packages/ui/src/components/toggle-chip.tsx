import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

/**
 * A multi-select option (07-onboarding-diet `.diet-chip`, the pantry staples): 48pt tall, 12pt
 * radius, 1.5pt outline; pressed-in = structure edge on surface-1 with heading ink. Announced as a
 * toggle with its checked state. The glyph slot takes an owned domain glyph (the diet/allergen
 * stroke set) from the caller — this package ships no icon library.
 */
export function ToggleChip({
  label,
  selected,
  onPress,
  glyph,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  glyph?: ReactNode;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Pressable
      accessibilityRole="togglebutton"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? color.selectedLine : color.outline,
          backgroundColor: selected ? color.surface1 : color.surface,
        },
        pressed && styles.pressed,
      ]}
    >
      {glyph !== undefined && <View style={styles.glyph}>{glyph}</View>}
      <Text
        style={[textRole(theme, "bodyMd", "600"), { color: selected ? color.heading : color.ink }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 48,
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingVertical: tokens.spacing.unit * 2,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.unit * 2,
    borderWidth: 1.5,
    borderRadius: tokens.radius.xl,
  },
  pressed: { opacity: 0.9 },
  glyph: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
});
