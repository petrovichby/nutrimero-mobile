import { Button, Glyph, Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { stageLabel } from "../model/content";
import { formatDuration } from "../model/duration";
import { capitalizeFirst, clockText, timeOfDay } from "../model/format";
import { derive } from "../model/item";
import { isBakeStage } from "../model/stage";
import { useTimerKeepAwake } from "../native/keep-awake";
import { nextStageLine } from "./describe";
import {
  AwakeFootnote,
  BackBar,
  Control,
  styles as parts,
  QuietDestructive,
  RefusedNote,
  Sheet,
} from "./parts";
import { useTimers } from "./timers-context";

/**
 * A running routine (20), its ended stage (20b), a hands-on stage (20c) and the Android bake note
 * (20d, FR-013a: once per install, never on iOS). The next stage starts only when the baker says
 * so (gate 1, Q1). The routine's name is the baker's data, so it heads the screen in the UI face
 * (MA-27); stage names are lowercase picks, capitalized only where a sentence starts with one.
 */
export function RoutineScreen({
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
  const { t, locale, now, loaded, items, permission, prefs, isAndroid } = timers;
  const item = items.find((entry) => entry.id === id);
  useTimerKeepAwake(`routine-${id}`, focused && item !== undefined);

  // Once the store has been read, a missing item was dismissed, cancelled or cleared: leave.
  useEffect(() => {
    if (loaded && item === undefined) onBack();
  }, [loaded, item, onBack]);
  if (item === undefined) return null;

  const view = derive(item, now);
  const stage = view.stage;
  if (stage === null) return null;
  const current = stageLabel(stage.current, t);
  const next = stage.next === null ? null : stageLabel(stage.next, t);
  const act = (action: Parameters<typeof timers.act>[1]) => void timers.act(id, action);
  const five = formatDuration(300, t);
  const androidNote =
    isAndroid &&
    focused &&
    view.status === "running" &&
    isBakeStage(stage.current) &&
    !prefs.androidBakeNoticeShown;

  const title =
    view.status === "done"
      ? capitalizeFirst(t("home.timers.ui.routine.stageDone", { stage: current }), locale)
      : current;
  const sub =
    view.status === "done" && view.endsAt !== null
      ? t("home.timers.ui.endedAt", { time: timeOfDay(view.endsAt, locale) })
      : view.status === "running" && view.endsAt !== null
        ? t("home.timers.ui.endsAt", { time: timeOfDay(view.endsAt, locale) })
        : view.status === "paused"
          ? t("home.timers.ui.sheet.paused")
          : t("home.timers.ui.routine.whenReady");
  const nextSub =
    stage.next === null
      ? null
      : nextStageLine(stage.next, view.status === "done", permission === "granted", t);

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
        <View style={styles.position}>
          <Text
            accessibilityLabel={t("home.timers.ui.routine.positionA11y", {
              position: stage.position,
              total: stage.total,
            })}
            style={[
              textRole(theme, "bodyMd", "700"),
              { color: color.heading, fontVariant: ["tabular-nums"] },
            ]}
          >
            {`${stage.position} / ${stage.total}`}
          </Text>
          <View
            style={styles.segments}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {Array.from({ length: stage.total }, (_, position) => position).map((index) => (
              <View
                key={index}
                style={[
                  styles.segment,
                  index < stage.position - 1
                    ? { backgroundColor: color.action, borderColor: color.action }
                    : { borderColor: color.outlineStrong },
                ]}
              />
            ))}
          </View>
        </View>

        <Text
          accessibilityRole={view.status === "done" ? "alert" : "text"}
          style={[styles.stage, { color: color.ink, fontFamily: theme.face("700") }]}
        >
          {title}
        </Text>
        <Text style={[textRole(theme, "bodyMd"), { color: color.ink2 }]}>{sub}</Text>

        {view.secondsLeft !== null && (
          <Text
            accessibilityRole="text"
            accessibilityLabel={t("home.timers.ui.leftA11y", {
              duration: formatDuration(view.secondsLeft, t).spoken,
            })}
            style={[styles.big, { color: color.heading, fontFamily: theme.face("700") }]}
          >
            {clockText(view.secondsLeft)}
          </Text>
        )}

        {next !== null && (
          <View style={[styles.next, { backgroundColor: color.surface1 }]}>
            <Glyph name="routine" size={22} color={color.heading} />
            <View style={parts.flex}>
              <Text style={[textRole(theme, "labelSm", "700"), { color: color.ink2 }]}>
                {t("home.timers.ui.routine.next")}
              </Text>
              <Text style={[textRole(theme, "bodyLg", "600"), { color: color.ink }]}>{next}</Text>
              {nextSub !== null && (
                <Text style={[textRole(theme, "bodySm"), { color: color.ink2 }]}>{nextSub}</Text>
              )}
            </View>
          </View>
        )}

        {(view.status === "running" || view.status === "paused") && (
          <>
            <View style={styles.ctrls}>
              {view.status === "paused" ? (
                <Control
                  glyph="play"
                  label={t("home.timers.ui.resume")}
                  onPress={() => act({ type: "resume" })}
                  style={parts.flex}
                />
              ) : (
                <Control
                  glyph="pause"
                  label={t("home.timers.ui.pause")}
                  onPress={() => act({ type: "pause" })}
                  style={parts.flex}
                />
              )}
              <Control
                label={`+${five.text}`}
                a11yLabel={t("home.timers.ui.addA11y", { duration: five.spoken })}
                onPress={() => act({ type: "addTime", seconds: 300 })}
                style={parts.flex}
              />
              <Control
                label={t("home.timers.ui.routine.doneEarly")}
                onPress={() => act({ type: "finishEarly" })}
                style={styles.wide}
              />
            </View>
            <QuietDestructive
              label={t("home.timers.ui.routine.cancel")}
              onPress={() => act({ type: "cancel" })}
            />
          </>
        )}

        {view.status === "done" && (
          <>
            <Button
              label={
                next === null
                  ? t("home.timers.ui.routine.finish")
                  : t("home.timers.ui.routine.startNext", { stage: next })
              }
              onPress={() => act(next === null ? { type: "dismiss" } : { type: "startNextStage" })}
              style={styles.bigButton}
            />
            {next !== null && (
              <QuietDestructive
                label={t("home.timers.ui.routine.cancel")}
                onPress={() => act({ type: "cancel" })}
              />
            )}
          </>
        )}

        {view.status === "waiting" && (
          <>
            <Button
              label={
                next === null
                  ? t("home.timers.ui.routine.finish")
                  : t("home.timers.ui.routine.doneNext")
              }
              onPress={() => act({ type: "doneHandsOn" })}
              style={styles.bigButton}
            />
            {next !== null && (
              <QuietDestructive
                label={t("home.timers.ui.routine.cancel")}
                onPress={() => act({ type: "cancel" })}
              />
            )}
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

      <Sheet
        visible={androidNote}
        closeLabel={t("home.timers.ui.close")}
        onClose={() => void timers.acknowledgeAndroidNotice()}
      >
        <Text
          accessibilityRole="header"
          style={[textRole(theme, "headlineMd"), { color: color.heading }]}
        >
          {t("home.timers.ui.android.title")}
        </Text>
        <Text style={[textRole(theme, "bodyMd"), styles.noteLine, { color: color.ink }]}>
          {t("home.timers.ui.android.late")}
        </Text>
        <Text style={[textRole(theme, "bodyMd"), styles.noteLine, { color: color.ink2 }]}>
          {t("home.timers.ui.android.keepOpen")}
        </Text>
        <Button
          label={t("home.timers.ui.android.gotIt")}
          onPress={() => void timers.acknowledgeAndroidNotice()}
          style={styles.gotIt}
        />
        <Text style={[textRole(theme, "bodySm"), parts.center, styles.once, { color: color.ink3 }]}>
          {t("home.timers.ui.android.once")}
        </Text>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: tokens.spacing.screenMargin, paddingBottom: 24 },
  position: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  segments: { flex: 1, flexDirection: "row", gap: 4 },
  segment: { flex: 1, height: 5, borderRadius: tokens.radius.full, borderWidth: 1 },
  stage: { marginTop: 18, fontSize: 30, lineHeight: 36 },
  big: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 72,
    lineHeight: 80,
    letterSpacing: -1.5,
    fontVariant: ["tabular-nums"],
  },
  next: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: tokens.radius.xl,
  },
  ctrls: { flexDirection: "row", gap: 10, marginTop: 18 },
  wide: { flex: 1.2 },
  bigButton: { marginTop: 16, minHeight: 56 },
  noteLine: { marginTop: 8 },
  gotIt: { marginTop: 18 },
  once: { marginTop: 10 },
});
