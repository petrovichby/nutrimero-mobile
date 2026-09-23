import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";

/**
 * The screen masthead in the display face (DESIGN.md *Typography rules*: Pacifico for brand
 * moments only — screen mastheads, splash title, paywall headline; masthead metrics 31/46). The
 * heading role colour; announced as a header.
 */
export function Masthead({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <View style={styles.bar}>
      <Text
        accessibilityRole="header"
        style={[styles.title, { fontFamily: theme.displayFace, color: theme.color.heading }]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingTop: tokens.spacing.unit * 1.5,
    paddingBottom: tokens.spacing.unit * 2.5,
  },
  title: { fontSize: 31, lineHeight: 46 },
});
