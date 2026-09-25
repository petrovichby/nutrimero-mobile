import { Button, Glyph, textRole, tokens, useTheme } from "@nutrimero/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { stageLabel } from "../model/content";
import { timeOfDay } from "../model/format";
import { derive } from "../model/item";
import { describe } from "./describe";
import { styles as parts } from "./parts";
import { useTimers } from "./timers-context";

/**
 * The in-app completion alert (22, US1-5): when something ends while the app is open it takes
 * over from the banner, over whatever screen is showing — what ended, what is next, and one
 * action: Start next stage for a routine (gate 1, Q1: manual), Dismiss for a timer or a last
 * stage. Later only closes the alert; the item stays done in the sheet and on the chip.
 * Mount once at the app root, above the screens.
 */
export function CompletionAlert({ onOpen }: { onOpen: (id: string) => void }) {
  const theme = useTheme();
  const { color } = theme;
  const insets = useSafeAreaInsets();
  const timers = useTimers();
  const { t, locale, now, items, alerts } = timers;
  // The oldest alert whose item is still done (one restarted or removed meanwhile is skipped).
  const view = alerts
    .map((alert) => items.find((entry) => entry.id === alert.id))
    .map((item) => (item === undefined ? null : derive(item, now)))
    .find((candidate) => candidate?.status === "done");
  if (view === undefined || view === null) return null;
  const said = describe(view, t, locale, now);
  const next = view.stage?.next ?? null;
  const sub =
    view.stage === null
      ? view.endsAt === null
        ? ""
        : t("home.timers.ui.endedAt", { time: timeOfDay(view.endsAt, locale) })
      : next === null
        ? view.name
        : t("home.timers.ui.alert.routineSub", { routine: view.name, next: stageLabel(next, t) });
  const later = () => timers.dismissAlert(view.id);

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[
        styles.alert,
        {
          top: insets.top + 8,
          backgroundColor: color.surface,
          borderColor: color.outline,
          shadowColor: color.shadowColor,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${said.doneTitle}. ${sub}`}
        onPress={() => {
          later();
          onOpen(view.id);
        }}
        style={({ pressed }) => [styles.top, pressed && parts.pressed]}
      >
        <View style={[styles.dial, { backgroundColor: color.action }]}>
          <Glyph name="bell" size={20} color={color.onAction} />
        </View>
        <View style={parts.flex}>
          <Text style={[textRole(theme, "bodyLg", "700"), { color: color.ink }]}>
            {said.doneTitle}
          </Text>
          {sub.length > 0 && (
            <Text style={[textRole(theme, "bodySm"), { color: color.ink2 }]}>{sub}</Text>
          )}
        </View>
      </Pressable>
      <View style={styles.acts}>
        <Button
          label={t("home.timers.ui.alert.later")}
          variant="secondary"
          onPress={later}
          style={parts.flex}
        />
        <Button
          label={next === null ? t("home.timers.ui.dismiss") : t("home.timers.ui.alert.startNext")}
          onPress={() => {
            later();
            void timers.act(
              view.id,
              next === null ? { type: "dismiss" } : { type: "startNextStage" },
            );
          }}
          style={styles.main}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    position: "absolute",
    left: tokens.spacing.screenMargin,
    right: tokens.spacing.screenMargin,
    zIndex: 20,
    padding: 14,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    shadowOpacity: 1,
    elevation: 16,
  },
  top: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
  dial: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  acts: { flexDirection: "row", gap: 8, marginTop: 12 },
  main: { flex: 1.4 },
});
