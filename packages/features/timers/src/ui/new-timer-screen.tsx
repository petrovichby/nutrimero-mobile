import { Button, Glyph, PageTitle, Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatDuration } from "../model/duration";
import { atActiveLimit, MAX_ACTIVE_ITEMS } from "../model/limits";
import { MAX_NAME_LENGTH, MAX_SECONDS, MIN_SECONDS, validName } from "../model/stage";
import { BackBar, Choice, styles as parts, Refusal, RoundButton, Sheet } from "./parts";
import { useTimers } from "./timers-context";

const QUICK = [300, 600, 1200, 2700, 3600, 5400, 7200, 43_200] as const;

/**
 * New timer (17) and the permission moment over it (17b): a name, a duration from 5 s to 48 h,
 * then Start. The duration is typed straight into hours / minutes / seconds, stepped by one hour
 * or one minute, or picked from the quick durations (owner, 2026-09-25, from the T027 iPhone run:
 * the drawn ±5 min steps and the tap-to-type readout couldn't set 2 minutes). The first start ever shows one reason before the system prompt; the
 * timer starts either way (FR-016, MA-27).
 */
export function NewTimerScreen({
  onBack,
  onStarted,
}: {
  onBack: () => void;
  onStarted: (id: string) => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const timers = useTimers();
  const { t, items } = timers;
  const defaultName = t("home.timers.defaultTimerName", {
    number: items.filter((item) => item.kind === "timer").length + 1,
  });
  const [name, setName] = useState("");
  // Starts at 0:0:0 (owner, T027 iPhone run): the baker types or steps their own time; Start
  // stays off until it is at least 5 s.
  const [seconds, setSeconds] = useState(0);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const valid = seconds >= MIN_SECONDS && seconds <= MAX_SECONDS;
  // 17c: ten timers and routines running is the most; the eleventh is refused in words.
  const full = atActiveLimit(items.length);
  const clamp = (value: number) => Math.min(MAX_SECONDS, Math.max(0, value));

  const start = async () => {
    setBusy(true);
    const result = await timers.startTimer(validName(name) ?? defaultName, seconds);
    setBusy(false);
    if (result.ok && result.id !== undefined) onStarted(result.id);
  };
  const onStart = () => {
    if (timers.needsPermissionMoment()) setAsking(true);
    else void start();
  };

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <BackBar
        place={t("home.timers.ui.sheet.title")}
        label={t("home.timers.ui.back", { place: t("home.timers.ui.sheet.title") })}
        onPress={onBack}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PageTitle>{t("home.timers.ui.sheet.newTimer")}</PageTitle>
        <Text style={[textRole(theme, "labelMd"), styles.label, { color: color.ink2 }]}>
          {t("home.timers.ui.newTimer.nameLabel")}
        </Text>
        <TextInput
          accessibilityLabel={t("home.timers.ui.newTimer.nameLabel")}
          value={name}
          onChangeText={setName}
          placeholder={defaultName}
          placeholderTextColor={color.ink3}
          maxLength={MAX_NAME_LENGTH * 2}
          style={[
            textRole(theme, "bodyLg"),
            styles.input,
            { borderColor: color.outlineStrong, backgroundColor: color.surface, color: color.ink },
          ]}
        />

        <View style={styles.readout}>
          {(
            [
              ["hours", h, (v: number) => clamp(v * 3600 + m * 60 + s)],
              ["minutes", m, (v: number) => clamp(h * 3600 + Math.min(59, v) * 60 + s)],
              ["seconds", s, (v: number) => clamp(h * 3600 + m * 60 + Math.min(59, v))],
            ] as const
          ).map(([unit, value, next]) => (
            <View key={unit} style={styles.typed}>
              <TextInput
                accessibilityLabel={t(`home.timers.ui.newTimer.${unit}`)}
                keyboardType="number-pad"
                value={String(value)}
                selectTextOnFocus
                onChangeText={(text) =>
                  setSeconds(next(Number.parseInt(text.replace(/\D/g, "") || "0", 10)))
                }
                style={[
                  textRole(theme, "headlineLg", "700"),
                  styles.typedInput,
                  {
                    color: color.heading,
                    borderColor: color.outlineStrong,
                    fontVariant: ["tabular-nums"],
                  },
                ]}
              />
              <Text style={[textRole(theme, "bodySm", "600"), { color: color.ink2 }]}>
                {t(`home.timers.ui.newTimer.${unit}`)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.steppers}>
          <View style={[styles.stepper, { backgroundColor: color.surface1 }]}>
            <RoundButton
              glyph="minusCircle"
              label={t("home.timers.ui.newTimer.hourLess")}
              onPress={() => setSeconds(clamp(seconds - 3600))}
            />
            <Text style={[textRole(theme, "bodyMd", "600"), { color: color.ink2 }]}>
              {t("home.timers.ui.newTimer.hours")}
            </Text>
            <RoundButton
              glyph="plus"
              label={t("home.timers.ui.newTimer.hourMore")}
              onPress={() => setSeconds(clamp(seconds + 3600))}
            />
          </View>
          <View style={[styles.stepper, { backgroundColor: color.surface1 }]}>
            <RoundButton
              glyph="minusCircle"
              label={t("home.timers.ui.newTimer.minutesLess")}
              onPress={() => setSeconds(clamp(seconds - 60))}
            />
            <Text style={[textRole(theme, "bodyMd", "600"), { color: color.ink2 }]}>
              {t("home.timers.ui.newTimer.minutes")}
            </Text>
            <RoundButton
              glyph="plus"
              label={t("home.timers.ui.newTimer.minutesMore")}
              onPress={() => setSeconds(clamp(seconds + 60))}
            />
          </View>
        </View>

        <View accessibilityLabel={t("home.timers.ui.newTimer.quick")} style={styles.quick}>
          {QUICK.map((value) => (
            <Choice
              key={value}
              label={formatDuration(value, t).text}
              selected={seconds === value}
              onPress={() => setSeconds(value)}
            />
          ))}
        </View>
        <Text style={[textRole(theme, "bodySm"), styles.help, { color: color.ink3 }]}>
          {t("home.timers.ui.newTimer.help")}
        </Text>
      </ScrollView>
      <View style={styles.dock}>
        {full && <Refusal text={t("home.timers.ui.newTimer.limit", { count: MAX_ACTIVE_ITEMS })} />}
        <Button
          label={t("home.timers.ui.newTimer.start")}
          onPress={onStart}
          disabled={!valid || full || busy}
        />
      </View>

      <Sheet
        visible={asking}
        closeLabel={t("home.timers.ui.close")}
        onClose={() => {
          setAsking(false);
          void start();
        }}
      >
        <View style={[styles.ask, { backgroundColor: color.actionSoft }]}>
          <Glyph name="bell" size={28} color={color.heading} />
        </View>
        <Text
          accessibilityRole="header"
          style={[textRole(theme, "headlineMd"), { color: color.heading }]}
        >
          {t("home.timers.ui.permission.title")}
        </Text>
        <Text style={[textRole(theme, "bodyMd"), styles.askBody, { color: color.ink2 }]}>
          {t("home.timers.ui.permission.body")}
        </Text>
        <Button
          label={t("home.timers.ui.permission.continue")}
          onPress={() => {
            setAsking(false);
            void timers.askPermission().then(start);
          }}
          style={styles.askButton}
        />
        <Text
          style={[textRole(theme, "bodySm"), parts.center, styles.either, { color: color.ink3 }]}
        >
          {t("home.timers.ui.permission.either")}
        </Text>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: tokens.spacing.screenMargin, paddingBottom: 96 },
  label: { marginTop: 8, marginBottom: 6, marginHorizontal: 2 },
  input: { minHeight: 52, paddingHorizontal: 14, borderRadius: tokens.radius.xl, borderWidth: 1 },
  readout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 16,
    marginTop: 18,
    marginBottom: 6,
    minHeight: 64,
  },
  typed: { alignItems: "center", gap: 4 },
  typedInput: { minWidth: 72, minHeight: 56, textAlign: "center", borderBottomWidth: 2 },
  steppers: { flexDirection: "row", gap: 10 },
  stepper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: 6,
    borderRadius: tokens.radius.xl,
  },
  quick: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  help: { marginTop: 10 },
  dock: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 10,
  },
  ask: {
    width: 56,
    height: 56,
    borderRadius: tokens.radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  askBody: { marginTop: 8 },
  askButton: { marginTop: 18 },
  either: { marginTop: 10 },
});
