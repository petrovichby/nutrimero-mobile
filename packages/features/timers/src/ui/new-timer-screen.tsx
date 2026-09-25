import { Button, Glyph, PageTitle, Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatDuration } from "../model/duration";
import { split, stepped, typed, type Unit } from "../model/duration-input";
import { atActiveLimit, MAX_ACTIVE_ITEMS } from "../model/limits";
import { MAX_NAME_LENGTH, MAX_SECONDS, MIN_SECONDS, validName } from "../model/stage";
import { BackBar, Choice, styles as parts, Refusal, RoundButton, Sheet } from "./parts";
import { useTimers } from "./timers-context";

const QUICK = [300, 600, 1200, 2700, 3600, 5400, 7200, 43_200] as const;
const UNITS: readonly Unit[] = ["hours", "minutes", "seconds"];

/**
 * New timer (17) and the permission moment over it (17b), as drawn at nutrimero-design b0dade59
 * (owner walk 2026-09-25): a name, then hours, minutes and seconds — each a typed number with its
 * own − and + by one — or a quick duration; 5 s to 48 h. It opens at 0 0 0 and Start stays off
 * until the time is at least 5 s. The first start ever shows one reason before the system prompt; the
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
  // Opens at 0 0 0 with Start off until the time is at least 5 s (b0dade59).
  const [seconds, setSeconds] = useState(0);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  const hms = split(seconds);
  const valid = seconds >= MIN_SECONDS && seconds <= MAX_SECONDS;
  // 17c: ten timers and routines running is the most; the eleventh is refused in words.
  const full = atActiveLimit(items.length);

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

        <View accessibilityLabel={t("home.timers.ui.newTimer.duration")} style={styles.hms}>
          {UNITS.map((unit) => (
            <View key={unit} style={[styles.unit, { backgroundColor: color.surface1 }]}>
              <TextInput
                accessibilityLabel={t(`home.timers.ui.newTimer.${unit}`)}
                keyboardType="number-pad"
                value={String(hms[unit])}
                selectTextOnFocus
                maxLength={2}
                onChangeText={(text) => setSeconds(typed(seconds, unit, text))}
                style={[
                  styles.num,
                  {
                    color: color.heading,
                    borderBottomColor: color.outlineStrong,
                    fontFamily: theme.face("700"),
                  },
                ]}
              />
              <Text style={[textRole(theme, "labelMd"), { color: color.ink2 }]}>
                {t(`home.timers.ui.newTimer.${unit}`)}
              </Text>
              <View style={styles.pm}>
                <RoundButton
                  glyph="minusCircle"
                  label={t(`home.timers.ui.newTimer.${unit}Less`)}
                  onPress={() => setSeconds(stepped(seconds, unit, -1))}
                />
                <RoundButton
                  glyph="plus"
                  label={t(`home.timers.ui.newTimer.${unit}More`)}
                  onPress={() => setSeconds(stepped(seconds, unit, 1))}
                />
              </View>
            </View>
          ))}
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
  hms: { flexDirection: "row", gap: 8, marginTop: 16 },
  unit: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    borderRadius: tokens.radius.xl,
  },
  num: {
    minWidth: 64,
    textAlign: "center",
    fontSize: 44,
    lineHeight: 52,
    fontVariant: ["tabular-nums"],
    borderBottomWidth: 2,
  },
  pm: { flexDirection: "row", gap: 8, marginTop: 4 },
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
