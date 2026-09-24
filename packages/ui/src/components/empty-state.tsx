import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { Button, type ButtonVariant } from "./button";
import { Plate } from "./plate";
import { textRole } from "./text-style";

/**
 * An empty, not-yet or connect-once state (DESIGN.md *Empty/error states*, MA-24): an engraved
 * plate (220×165, framed and stamped — MA-17), an optional heading, one sentence, and at most one
 * action. The page title lives in the masthead above. **No action unless there is something to
 * do** — a connect-once state with nothing to retry has none (retry appears only after a real
 * failure or a timeout); an unbuilt tab has one quiet way back.
 */
export function EmptyState({
  art,
  artStamp,
  title,
  body,
  action,
}: {
  art: ReactNode;
  /** The provenance stamp text for the art (catalog string); null only for a real photo. */
  artStamp: string | null;
  title?: string;
  body: string;
  action?: { label: string; onPress: () => void; variant?: ButtonVariant };
}) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Plate stamp={artStamp} style={styles.art}>
        {art}
      </Plate>
      {title !== undefined && (
        <Text
          accessibilityRole="header"
          style={[textRole(theme, "headlineMd"), styles.title, { color: theme.color.heading }]}
        >
          {title}
        </Text>
      )}
      <Text style={[textRole(theme, "bodyMd"), styles.body, { color: theme.color.ink2 }]}>
        {body}
      </Text>
      {action !== undefined && (
        <Button
          label={action.label}
          variant={action.variant ?? "primary"}
          onPress={action.onPress}
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    paddingBottom: tokens.spacing.sectionGap,
  },
  art: { width: 220, height: 165, marginBottom: 22 },
  title: { textAlign: "center", marginBottom: tokens.spacing.unit * 2 },
  // ~28ch measure (the comp's max-width) keeps the one sentence a short, centred block.
  body: { textAlign: "center", maxWidth: 300 },
  action: { marginTop: 22, alignSelf: "stretch" },
});
