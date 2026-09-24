import type { Translator } from "@nutrimero/core";
import { ConfirmSheet, textRole, useTheme } from "@nutrimero/ui";
import { StyleSheet, Text, View } from "react-native";

const ITEMS = ["profile", "units", "pantry"] as const;

/**
 * Clear my data on this device (09-more-clear-data; 001 FR-013; DESIGN.md MA-24): names what is
 * deleted, says the user starts again from the first question and that it cannot be undone, and
 * that the app language stays (FR-027). Cancel and the destructive action are the same size.
 */
export function ClearDataSheet({
  t,
  visible,
  onConfirm,
  onCancel,
}: {
  t: Translator;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <ConfirmSheet
      visible={visible}
      title={t("home.clearData.title")}
      confirmLabel={t("home.clearData.confirm")}
      cancelLabel={t("home.clearData.cancel")}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <Text style={[textRole(theme, "bodyMd"), { color: color.ink2 }]}>
        {t("home.clearData.lead")}
      </Text>
      <View accessibilityRole="list" style={styles.list}>
        {ITEMS.map((item) => (
          <View key={item} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: color.destructive }]} />
            <Text style={[textRole(theme, "bodyMd"), styles.itemText, { color: color.ink }]}>
              {t(`home.clearData.items.${item}`)}
            </Text>
          </View>
        ))}
      </View>
      <Text style={[textRole(theme, "bodyMd"), styles.restart, { color: color.ink }]}>
        {t("home.clearData.restart")}
      </Text>
      <Text style={[textRole(theme, "bodySm"), styles.keeps, { color: color.ink2 }]}>
        {t("home.clearData.keeps")}
      </Text>
    </ConfirmSheet>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 12 },
  item: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  itemText: { flex: 1 },
  restart: { marginTop: 12 },
  keeps: { marginTop: 12 },
});
