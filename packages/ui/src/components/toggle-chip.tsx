import { Pressable, StyleSheet, Text, View } from "react-native";
import { Glyph } from "../glyphs/glyph";
import type { StrokeGlyphName } from "../glyphs/glyph-data";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

/**
 * A multi-select option (07-onboarding-diet `.diet-chip`, the pantry staples): 48pt tall, 12pt
 * radius, 1.5pt outline; pressed-in = structure edge on surface-1 with heading ink. Announced as a
 * toggle with its checked state. The optional glyph is from the owned diet/allergen stroke set
 * (ink-2, heading when selected), following the strike grammar.
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
  glyph?: StrokeGlyphName;
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
      {glyph !== undefined && (
        <View style={styles.glyph}>
          <Glyph name={glyph} size={20} color={selected ? color.heading : color.ink2} />
        </View>
      )}
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
