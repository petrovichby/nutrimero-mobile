import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Glyph } from "../glyphs/glyph";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

/**
 * One option of a single choice (07-onboarding-units `.unit-card`): a leading sample on the cream
 * canvas, a title and a description, and the check disc on the right when selected. Selected =
 * the structure edge on surface-1 — colour plus the check, never colour alone. Announced as a
 * radio with its checked state; the whole card is the target.
 */
export function SelectionCard({
  title,
  description,
  sample,
  selected,
  onPress,
  dense = false,
}: {
  title: string;
  description?: string;
  /** Leading 76pt sample tile (value over unit, 07-onboarding-units), on the scheme-fixed canvas. */
  sample?: ReactNode;
  selected: boolean;
  onPress: () => void;
  /**
   * 12pt top and bottom instead of 16, to make room for the region row below the cards
   * (07-onboarding-units at design 93cf290a); the 76pt tile is kept.
   */
  dense?: boolean;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={description ? `${title}, ${description}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        dense && styles.dense,
        {
          borderColor: selected ? color.selectedLine : color.outline,
          backgroundColor: selected ? color.surface1 : color.surface,
        },
        pressed && styles.pressed,
      ]}
    >
      {sample !== undefined && (
        <View style={[styles.sample, { backgroundColor: color.illustrationCanvas }]}>{sample}</View>
      )}
      <View style={styles.copy}>
        <Text style={[textRole(theme, "bodyLg", "700"), { color: color.heading }]}>{title}</Text>
        {description !== undefined && (
          <Text style={[textRole(theme, "bodySm"), styles.description, { color: color.ink2 }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={[styles.disc, selected && { backgroundColor: color.action }]}>
        {selected && <Glyph name="check" size={15} color={color.onAction} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: tokens.spacing.screenMargin,
    borderWidth: 1.5,
    borderRadius: tokens.radius.xl,
    minHeight: tokens.touchTarget.minimum,
  },
  dense: { paddingVertical: 12 },
  pressed: { opacity: 0.9 },
  sample: {
    width: 76,
    height: 76,
    gap: 1,
    borderRadius: tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1 },
  description: { marginTop: 2, fontVariant: ["tabular-nums"] },
  disc: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
});
