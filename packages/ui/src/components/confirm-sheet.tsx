import type { ReactNode } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { Button } from "./button";
import { textRole } from "./text-style";
import { useSheetRise } from "./use-sheet-rise";

/**
 * A confirmation before a destructive action, as a bottom sheet (09-more-clear-data; DESIGN.md
 * MA-24): a grab handle, the question, what happens (the caller's body), then Cancel and the
 * destructive action side by side at **the same size**. The scrim, the system back button and
 * Cancel all cancel; nothing traps the user. The one sheet motion (useSheetRise, MA-27 round 3):
 * the dim fades in place and only the sheet rises; everything fades under Reduce Motion.
 *
 * The corner radius is DESIGN.md's 12pt maximum; the corpus draws 20 (flagged to design-mobile).
 */
export function ConfirmSheet({
  visible,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const insets = useSafeAreaInsets();
  const { translateY, onShow } = useSheetRise(visible);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={onShow}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          style={[StyleSheet.absoluteFill, { backgroundColor: color.sheetScrim }]}
        />
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[
            styles.sheet,
            {
              backgroundColor: color.surface,
              shadowColor: color.shadowColor,
              paddingBottom: Math.max(insets.bottom, tokens.spacing.sectionGap) + 6,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.grab, { backgroundColor: color.outlineStrong }]} />
          <Text
            accessibilityRole="header"
            style={[textRole(theme, "headlineMd"), styles.title, { color: color.heading }]}
          >
            {title}
          </Text>
          {children}
          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={styles.action}
            />
            <Button
              label={confirmLabel}
              variant="destructive"
              onPress={onConfirm}
              style={styles.action}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingTop: 10,
    paddingHorizontal: 20,
    // DESIGN.md MA-8: a sheet is a genuinely floating element — offset 6, blur 18.
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 12,
  },
  grab: {
    width: 40,
    height: 5,
    borderRadius: tokens.radius.full,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { marginBottom: tokens.spacing.unit * 2 },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 },
  action: { flex: 1 },
});
