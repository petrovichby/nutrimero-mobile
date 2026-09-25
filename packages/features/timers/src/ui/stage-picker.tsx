import { Button, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { stageLabel } from "../model/content";
import { formatDuration } from "../model/duration";
import {
  MAX_NAME_LENGTH,
  MAX_SECONDS,
  MIN_SECONDS,
  STAGE_KEYS,
  type Stage,
  type StageKey,
  validName,
} from "../model/stage";
import { Choice, Sheet, SheetHead } from "./parts";
import { useTimers } from "./timers-context";

/** The drawn durations (19b); hands-on is `null`, and "other…" opens typed hours and minutes. */
const QUICK = [null, 900, 1800, 3600] as const;

type Length =
  | { readonly kind: "quick"; readonly seconds: number | null }
  | { readonly kind: "other" };

/**
 * Add a stage (19b) and edit one (19f-stage-edit, d74e8ed3: "other…" with typed hours and
 * minutes, and Save): a common stage (a localized pick) or the baker's own name, then how long —
 * hands-on, a quick duration, or other…. The same sheet edits a stage when the editor opens it on
 * one; the action then reads Save. There are no preset durations per stage (gate 1, Q3).
 */
export function StagePicker({
  visible,
  initial,
  onClose,
  onDone,
}: {
  visible: boolean;
  /** The stage being edited, or null to add one. */
  initial: Stage | null;
  onClose: () => void;
  onDone: (stage: Stage) => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const { t } = useTimers();
  const [key, setKey] = useState<StageKey | null>(null);
  const [own, setOwn] = useState("");
  const [length, setLength] = useState<Length | null>(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const name = initial?.name;
    setKey(name !== undefined && "key" in name ? name.key : null);
    setOwn(name !== undefined && "text" in name ? name.text : "");
    const seconds = initial === null ? undefined : initial.seconds;
    const quick = QUICK.find((value) => value === seconds);
    if (seconds === undefined) setLength(null);
    else if (quick !== undefined) setLength({ kind: "quick", seconds: quick });
    else setLength({ kind: "other" });
    setHours(seconds ? Math.floor(seconds / 3600) : 0);
    setMinutes(seconds ? Math.floor((seconds % 3600) / 60) : 0);
  }, [visible, initial]);

  const ownName = validName(own);
  const name = key !== null ? { key } : ownName !== null ? { text: ownName } : null;
  const typed = hours * 3600 + minutes * 60;
  const seconds =
    length === null
      ? undefined
      : length.kind === "quick"
        ? length.seconds
        : typed >= MIN_SECONDS && typed <= MAX_SECONDS
          ? typed
          : undefined;
  const stage: Stage | null = name !== null && seconds !== undefined ? { name, seconds } : null;
  const label =
    initial !== null
      ? t("home.timers.ui.editor.save")
      : t("home.timers.ui.picker.add", {
          stage: name === null ? "" : stageLabel({ name, seconds: null }, t),
        });
  const closeLabel = t("home.timers.ui.close");
  const field = [
    textRole(theme, "bodyLg"),
    styles.input,
    { borderColor: color.outlineStrong, backgroundColor: color.surface, color: color.ink },
  ];
  const number = (text: string, max: number) =>
    Math.min(max, Number.parseInt(text.replace(/\D/g, "") || "0", 10));

  return (
    <Sheet visible={visible} onClose={onClose} closeLabel={closeLabel}>
      <SheetHead
        title={
          // 19f-stage-edit (nutrimero-design d74e8ed3): "Edit stage" when editing, else "Add a stage".
          initial !== null
            ? t("home.timers.ui.editor.editStage")
            : t("home.timers.ui.editor.addStage")
        }
        closeLabel={closeLabel}
        onClose={onClose}
      />
      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled" bounces={false}>
        <View accessibilityLabel={t("home.timers.ui.picker.common")} style={styles.pick}>
          {STAGE_KEYS.map((value) => (
            <Choice
              key={value}
              label={t(`home.timers.stage.${value}`)}
              selected={key === value}
              onPress={() => {
                setKey(value);
                setOwn("");
              }}
            />
          ))}
        </View>
        <Text style={[textRole(theme, "labelMd"), styles.or, { color: color.ink2 }]}>
          {t("home.timers.ui.picker.orOwn")}
        </Text>
        <TextInput
          accessibilityLabel={t("home.timers.ui.picker.orOwn")}
          value={own}
          onChangeText={(text) => {
            setOwn(text);
            if (text.length > 0) setKey(null);
          }}
          placeholder={t("home.timers.ui.picker.ownPlaceholder")}
          placeholderTextColor={color.ink3}
          maxLength={MAX_NAME_LENGTH * 2}
          style={field}
        />
        <Text style={[textRole(theme, "labelMd"), styles.or, { color: color.ink2 }]}>
          {t("home.timers.ui.picker.howLong")}
        </Text>
        <View accessibilityLabel={t("home.timers.ui.picker.howLong")} style={styles.pick}>
          {QUICK.map((value) => (
            <Choice
              key={String(value)}
              label={
                value === null ? t("home.timers.ui.editor.handsOn") : formatDuration(value, t).text
              }
              selected={length?.kind === "quick" && length.seconds === value}
              onPress={() => setLength({ kind: "quick", seconds: value })}
            />
          ))}
          <Choice
            label={t("home.timers.ui.picker.other")}
            selected={length?.kind === "other"}
            onPress={() => setLength({ kind: "other" })}
          />
        </View>
        {length?.kind === "other" && (
          <View style={styles.typed}>
            {(
              [
                ["hours", hours, (text: string) => setHours(number(text, 48))],
                ["minutes", minutes, (text: string) => setMinutes(number(text, 59))],
              ] as const
            ).map(([unit, value, change]) => (
              <View key={unit} style={styles.typedField}>
                <TextInput
                  accessibilityLabel={t(`home.timers.ui.newTimer.${unit}`)}
                  keyboardType="number-pad"
                  value={String(value)}
                  selectTextOnFocus
                  onChangeText={change}
                  style={[field, styles.typedInput, { fontVariant: ["tabular-nums"] }]}
                />
                <Text style={[textRole(theme, "bodySm", "600"), { color: color.ink2 }]}>
                  {t(`home.timers.ui.newTimer.${unit}`)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Button
        label={label}
        disabled={stage === null}
        onPress={() => {
          if (stage !== null) onDone(stage);
        }}
        style={styles.action}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { maxHeight: 460 },
  pick: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  or: { marginTop: 14, marginBottom: 6, marginHorizontal: 2 },
  input: { minHeight: 52, paddingHorizontal: 14, borderRadius: tokens.radius.xl, borderWidth: 1 },
  typed: { flexDirection: "row", gap: 12, marginTop: 12 },
  typedField: { flex: 1, gap: 4 },
  typedInput: { textAlign: "center" },
  action: { marginTop: 16 },
});
