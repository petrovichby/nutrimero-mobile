import { Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { formatDuration } from "../model/duration";
import { clockText, elapsedShare, timeOfDay } from "../model/format";
import { derive } from "../model/item";
import { useTimerKeepAwake } from "../native/keep-awake";
import { agoFor } from "./describe";
import { AwakeFootnote, BackBar, Control, QuietDestructive, RefusedNote } from "./parts";
import { useTimers } from "./timers-context";

/**
 * A timer (18) and its done state (18b). The screen keeps the device awake while it is focused
 * and says so (F37, MA-27). The name is the baker's data, so it heads the screen in the UI face,
 * not Pacifico (MA-27's title rule). Refused notifications show the note with Open settings.
 */
export function TimerScreen({
  id,
  focused = true,
  onBack,
}: {
  id: string;
  focused?: boolean;
  onBack: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const timers = useTimers();
  const { t, locale, now, loaded, items, permission } = timers;
  const item = items.find((entry) => entry.id === id);
  useTimerKeepAwake(`timer-${id}`, focused && item !== undefined);

  // Once the store has been read, a missing item was dismissed, cancelled or cleared: leave.
  // 18c (a46f00c8): while this screen is open, its item's ending turns it to done in place.
  const { setOnScreen } = timers;
  const present = item !== undefined;
  useEffect(() => {
    if (!focused || !present) return;
    setOnScreen(id);
    return () => setOnScreen(null);
  }, [focused, present, id, setOnScreen]);

  useEffect(() => {
    if (loaded && item === undefined) onBack();
  }, [loaded, item, onBack]);
  if (item === undefined) return null;

  const view = derive(item, now);
  const done = view.status === "done";
  const plus = (seconds: number) => ({
    label: `+${formatDuration(seconds, t).text}`,
    a11y: t("home.timers.ui.addA11y", { duration: formatDuration(seconds, t).spoken }),
  });
  const one = plus(60);
  const five = plus(300);
  const total = item.clock.status === "running" ? (item.clock.total ?? 0) : 0;

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <BackBar
        place={t("home.timers.ui.sheet.title")}
        label={t("home.timers.ui.back", { place: t("home.timers.ui.sheet.title") })}
        onPress={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text
          accessibilityRole="header"
          style={[textRole(theme, "headlineMd", "700"), { color: color.ink }]}
        >
          {view.name}
        </Text>

        {done ? (
          <>
            <Text
              accessibilityRole="text"
              accessibilityLabel={t("home.timers.ui.timer.doneA11y", {
                name: view.name,
                ago: view.endsAt === null ? "" : agoFor(view.endsAt, now, t),
              })}
              style={[
                styles.doneBig,
                textRole(theme, "headlineLg", "700"),
                { color: color.heading },
              ]}
            >
              {t("home.timers.ui.done")}
            </Text>
            {view.endsAt !== null && (
              <Text style={[textRole(theme, "bodyMd"), styles.ends, { color: color.ink2 }]}>
                {t("home.timers.ui.doneAt", {
                  ago: agoFor(view.endsAt, now, t),
                  time: timeOfDay(view.endsAt, locale),
                })}
              </Text>
            )}
            <View style={styles.ctrls}>
              <Control
                main
                label={t("home.timers.ui.dismiss")}
                onPress={() => void timers.act(id, { type: "dismiss" })}
                style={{ flex: 1.6 }}
              />
              <Control
                label={five.label}
                a11yLabel={five.a11y}
                onPress={() => void timers.act(id, { type: "addTime", seconds: 300 })}
                style={styles.flex}
              />
            </View>
          </>
        ) : (
          <>
            <Text
              accessibilityRole="text"
              accessibilityLabel={
                view.secondsLeft === null
                  ? undefined
                  : t("home.timers.ui.leftA11y", {
                      duration: formatDuration(view.secondsLeft, t).spoken,
                    })
              }
              style={[styles.big, { color: color.heading, fontFamily: theme.face("700") }]}
            >
              {clockText(view.secondsLeft ?? 0)}
            </Text>
            {view.endsAt !== null && (
              <Text style={[textRole(theme, "bodyMd"), styles.ends, { color: color.ink2 }]}>
                {t("home.timers.ui.endsAt", { time: timeOfDay(view.endsAt, locale) })}
              </Text>
            )}
            {view.endsAt !== null && total > 0 && (
              <View
                style={[styles.bar, { backgroundColor: color.surface2 }]}
                accessibilityElementsHidden
              >
                <View
                  style={[
                    styles.fill,
                    {
                      backgroundColor: color.action,
                      width: `${Math.round(elapsedShare(view.endsAt, total, now) * 100)}%`,
                    },
                  ]}
                />
              </View>
            )}
            <View style={styles.ctrls}>
              {view.status === "paused" ? (
                <Control
                  main
                  glyph="play"
                  label={t("home.timers.ui.resume")}
                  onPress={() => void timers.act(id, { type: "resume" })}
                  style={styles.flex}
                />
              ) : (
                <Control
                  main
                  glyph="pause"
                  label={t("home.timers.ui.pause")}
                  onPress={() => void timers.act(id, { type: "pause" })}
                  style={styles.flex}
                />
              )}
              <Control
                label={one.label}
                a11yLabel={one.a11y}
                onPress={() => void timers.act(id, { type: "addTime", seconds: 60 })}
                style={styles.flex}
              />
              <Control
                label={five.label}
                a11yLabel={five.a11y}
                onPress={() => void timers.act(id, { type: "addTime", seconds: 300 })}
                style={styles.flex}
              />
            </View>
            <QuietDestructive
              label={t("home.timers.ui.timer.cancel")}
              onPress={() => void timers.act(id, { type: "cancel" })}
            />
          </>
        )}

        {permission === "denied" && (
          <RefusedNote
            title={t("home.timers.ui.refused.title")}
            body={t("home.timers.ui.refused.body")}
            actionLabel={t("home.timers.refused.openSettings")}
            onAction={timers.openSettings}
          />
        )}
      </ScrollView>
      <AwakeFootnote text={t("home.timers.ui.awake")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: tokens.spacing.screenMargin, paddingBottom: 24 },
  big: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 84,
    lineHeight: 92,
    letterSpacing: -1.5,
    fontVariant: ["tabular-nums"],
  },
  doneBig: { marginTop: 24, textAlign: "center", fontSize: 44, lineHeight: 52 },
  ends: { textAlign: "center", marginTop: 6, fontVariant: ["tabular-nums"] },
  bar: { height: 6, borderRadius: tokens.radius.full, marginTop: 22, overflow: "hidden" },
  fill: { height: "100%", borderRadius: tokens.radius.full },
  ctrls: { flexDirection: "row", gap: 10, marginTop: 24 },
});
