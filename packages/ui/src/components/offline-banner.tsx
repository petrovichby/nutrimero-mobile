import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { textRole } from "./text-style";

/**
 * The quiet offline indicator (DESIGN.md *Offline indicator*): a label-md line on the status field,
 * never a blocking modal. Announced politely once when it appears. The component only — whether
 * the device is offline is decided by the caller (wired in 003).
 */
export function OfflineBanner({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: theme.color.statusBg }]}
    >
      <Text style={[textRole(theme, "labelMd"), { color: theme.color.ink2 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingVertical: tokens.spacing.unit * 2,
  },
});
