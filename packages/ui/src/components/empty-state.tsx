import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { Button } from "./button";
import { Plate } from "./plate";
import { textRole } from "./text-style";

/**
 * An empty or connect-once state (03-builder-empty; DESIGN.md *Empty/error states*): an engraved
 * plate (220×165, framed and stamped — MA-17), one heading, one sentence of guidance, one action.
 * Announced as one heading and one action. An empty state is an onboarding moment, not a dead end.
 */
export function EmptyState({
  art,
  artStamp,
  title,
  body,
  actionLabel,
  onAction,
}: {
  art: ReactNode;
  /** The provenance stamp text for the art (catalog string); null only for a real photo. */
  artStamp: string | null;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Plate stamp={artStamp} style={styles.art}>
        {art}
      </Plate>
      <Text
        accessibilityRole="header"
        style={[textRole(theme, "headlineMd"), styles.title, { color: theme.color.heading }]}
      >
        {title}
      </Text>
      <Text style={[textRole(theme, "bodyMd"), styles.body, { color: theme.color.ink2 }]}>
        {body}
      </Text>
      <Button label={actionLabel} onPress={onAction} style={styles.action} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.spacing.unit * 10,
  },
  art: { width: 220, height: 165, marginBottom: 22 },
  title: { textAlign: "center", marginBottom: tokens.spacing.unit * 2 },
  // ~26ch measure (the comp's max-width) keeps the one sentence a short, centred block.
  body: { textAlign: "center", maxWidth: 280 },
  action: { marginTop: 22, alignSelf: "stretch" },
});
