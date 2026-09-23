import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { Button } from "./button";
import { textRole } from "./text-style";
import { useReduceMotion } from "./use-reduce-motion";

/**
 * A confirmation before a destructive action (DESIGN.md *Buttons*: destructive with a confirmation
 * step; 001 FR-013). It names what will happen; the confirm and cancel actions are the same size
 * and sit together — cancel is never a small link. The scrim, the system back button and the
 * cancel action all cancel; nothing traps the user. Rises as a sheet, or fades under Reduce Motion.
 */
export function ConfirmSheet({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? "fade" : "slide"}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.color.scrim }]}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: theme.color.surface,
              shadowColor: theme.color.shadowColor,
              paddingBottom: Math.max(insets.bottom, tokens.spacing.screenMargin),
            },
          ]}
        >
          <Text
            accessibilityRole="header"
            style={[textRole(theme, "headlineSm"), { color: theme.color.heading }]}
          >
            {title}
          </Text>
          <Text style={[textRole(theme, "bodyMd"), styles.body, { color: theme.color.ink2 }]}>
            {body}
          </Text>
          <View style={styles.actions}>
            <Button label={confirmLabel} variant="destructive" onPress={onConfirm} />
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingTop: tokens.spacing.sectionGap,
    paddingHorizontal: tokens.spacing.screenMargin,
    // DESIGN.md MA-8: a sheet is a genuinely floating element — offset 6, blur 18.
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 12,
  },
  body: { marginTop: tokens.spacing.unit * 2 },
  actions: { marginTop: tokens.spacing.sectionGap, gap: tokens.spacing.unit * 3 },
});
