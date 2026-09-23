import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

export type ButtonVariant = "primary" | "secondary" | "destructive";

/**
 * DESIGN.md *Buttons* (MA-6): primary = the app's action fill with its near-black text; secondary
 * = the app's structure outline (in dark the outline-strong edge with ink text); destructive = the
 * destructive pair. 52pt tall (above the 44pt floor), 12pt radius, one primary per screen. The
 * label wraps rather than truncates at 1.3× text, so the height is a minimum, not fixed.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  accessibilityHint,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const { color } = theme;
  const look = {
    primary: { fill: color.action, line: color.action, ink: color.onAction, weight: "700" },
    secondary: {
      fill: "transparent",
      line: color.secondaryLine,
      ink: color.secondaryInk,
      weight: "600",
    },
    destructive: {
      fill: color.destructive,
      line: color.destructive,
      ink: color.onDestructive,
      weight: "700",
    },
  } as const;
  const v = look[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.fill, borderColor: v.line },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[textRole(theme, "bodyLg", v.weight), styles.label, { color: v.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: tokens.spacing.unit * 2,
    borderRadius: tokens.radius.xl,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { textAlign: "center" },
  // A press darkens by opacity only — immediate feedback that needs no Reduce Motion variant.
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
});
