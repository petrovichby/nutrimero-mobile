import { Button, Glyph, PageTitle, Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import { useRef, useState } from "react";
import {
  type AccessibilityActionEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { stageLabel } from "../model/content";
import { formatDuration } from "../model/duration";
import { dropIndex, moveEntry, stepAside } from "../model/editing";
import { MAX_NAME_LENGTH, MAX_STAGES, type Stage, validName } from "../model/stage";
import { routineFits } from "../store/timer-store";
import { BackBar, styles as parts } from "./parts";
import { StagePicker } from "./stage-picker";
import { useTimers } from "./timers-context";

interface Row {
  readonly key: number;
  readonly stage: Stage;
}

/** The row height the drag measures from before the first layout (the drawn 60pt minimum). */
const ROW_HEIGHT = 60;

/**
 * The routine editor (19), its stage picker (19b) and its too-long refusal (19c). Stages reorder
 * by dragging the grip, or by Move up / Move down for assistive technology (coordinator,
 * 2026-09-25). At twelve stages the add row says why it is off. A routine that would not fit the
 * device store is refused at the save action, before anything is written.
 */
export function RoutineEditorScreen({
  routineId = null,
  onBack,
  onSaved,
  onStarted,
}: {
  /** A saved routine to edit, or null for a new one. */
  routineId?: string | null;
  onBack: () => void;
  onSaved: () => void;
  onStarted: (id: string) => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const timers = useTimers();
  const { t } = timers;
  const existing = timers.saved.find((routine) => routine.id === routineId) ?? null;
  const nextKey = useRef(0);
  const keyed = (stage: Stage): Row => ({ key: nextKey.current++, stage });
  const [name, setName] = useState(existing?.name ?? "");
  const [rows, setRows] = useState<readonly Row[]>(() => existing?.stages.map(keyed) ?? []);
  const [picking, setPicking] = useState<{ index: number | null } | null>(null);
  const [drag, setDrag] = useState<{ from: number; dy: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const rowHeight = useRef(ROW_HEIGHT);

  const stages = rows.map((row) => row.stage);
  const finalName = validName(name) ?? t("home.timers.defaultRoutineName");
  const fits = routineFits(finalName, stages);
  const full = rows.length >= MAX_STAGES;
  const canSave = rows.length > 0 && fits && !busy;
  const target =
    drag === null ? null : dropIndex(drag.from, drag.dy, rowHeight.current, rows.length);
  const editing = picking?.index ?? null;
  const editingStage = editing === null ? null : (rows[editing]?.stage ?? null);

  const move = (from: number, to: number) => setRows((current) => moveEntry(current, from, to));
  const save = async (): Promise<string | null> => {
    const id = existing?.id ?? timers.newId();
    setBusy(true);
    const result = await timers.saveRoutine({ id, name: finalName, stages });
    setBusy(false);
    return result.ok ? id : null;
  };

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <BackBar
        place={t("home.timers.ui.sheet.title")}
        label={t("home.timers.ui.back", { place: t("home.timers.ui.sheet.title") })}
        onPress={onBack}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={drag === null}
      >
        <PageTitle>
          {t(
            existing === null
              ? "home.timers.ui.editor.newTitle"
              : "home.timers.ui.editor.editTitle",
          )}
        </PageTitle>
        <Text style={[textRole(theme, "labelMd"), styles.label, { color: color.ink2 }]}>
          {t("home.timers.ui.newTimer.nameLabel")}
        </Text>
        <TextInput
          accessibilityLabel={t("home.timers.ui.newTimer.nameLabel")}
          value={name}
          onChangeText={setName}
          placeholder={t("home.timers.defaultRoutineName")}
          placeholderTextColor={color.ink3}
          maxLength={MAX_NAME_LENGTH * 2}
          style={[
            textRole(theme, "bodyLg"),
            styles.input,
            { borderColor: color.outlineStrong, backgroundColor: color.surface, color: color.ink },
          ]}
        />

        <Text
          accessibilityRole="header"
          style={[
            textRole(theme, "labelMd"),
            styles.label,
            styles.stagesLabel,
            { color: color.ink2 },
          ]}
        >
          {full
            ? t("home.timers.ui.editor.stagesCount", { current: rows.length })
            : t("home.timers.ui.editor.stagesHeader")}
        </Text>
        {rows.length > 0 && (
          <View style={[styles.card, { backgroundColor: color.surface1 }]}>
            {rows.map((row, index) => (
              <StageRow
                key={row.key}
                stage={row.stage}
                index={index}
                count={rows.length}
                offset={
                  drag === null || target === null
                    ? 0
                    : index === drag.from
                      ? drag.dy
                      : stepAside(index, drag.from, target, rowHeight.current)
                }
                dragging={drag?.from === index}
                onLayoutHeight={(height) => {
                  if (index === 0) rowHeight.current = height;
                }}
                onDragStart={() => setDrag({ from: index, dy: 0 })}
                onDragMove={(dy) => setDrag({ from: index, dy })}
                onDragEnd={(dy) => {
                  move(index, dropIndex(index, dy, rowHeight.current, rows.length));
                  setDrag(null);
                }}
                onMove={(to) => move(index, to)}
                onEdit={() => setPicking({ index })}
                onRemove={() =>
                  setRows((current) => current.filter((entry) => entry.key !== row.key))
                }
              />
            ))}
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            full ? t("home.timers.ui.editor.maxStages") : t("home.timers.ui.editor.addStage")
          }
          accessibilityState={{ disabled: full }}
          disabled={full}
          onPress={() => setPicking({ index: null })}
          style={({ pressed }) => [
            styles.add,
            { borderColor: full ? color.outline : color.outlineStrong },
            pressed && parts.pressed,
          ]}
        >
          {!full && <Glyph name="plus" size={18} color={color.heading} />}
          <Text
            style={[
              textRole(theme, "bodyMd", "700"),
              parts.center,
              { color: full ? color.ink3 : color.heading },
            ]}
          >
            {full ? t("home.timers.ui.editor.maxStages") : t("home.timers.ui.editor.addStage")}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.dock}>
        {!fits && (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.refuse, { borderColor: color.destructiveInk }]}
          >
            <Glyph name="info" size={18} color={color.destructiveInk} />
            <Text style={[textRole(theme, "bodySm"), parts.flex, { color: color.ink }]}>
              {t("home.timers.ui.editor.tooLong")}
            </Text>
          </View>
        )}
        <View style={styles.saves}>
          <Button
            label={t("home.timers.ui.editor.save")}
            variant="secondary"
            disabled={!canSave}
            onPress={() => {
              void save().then((id) => {
                if (id !== null) onSaved();
              });
            }}
            style={parts.flex}
          />
          <Button
            label={t("home.timers.ui.editor.saveAndStart")}
            disabled={!canSave}
            onPress={() => {
              void save().then(async (id) => {
                if (id === null) return;
                const result = await timers.startRoutine({
                  name: finalName,
                  stages,
                  savedRoutineId: id,
                });
                if (result.ok && result.id !== undefined) onStarted(result.id);
              });
            }}
            style={styles.primary}
          />
        </View>
      </View>

      <StagePicker
        visible={picking !== null}
        initial={editingStage}
        onClose={() => setPicking(null)}
        onDone={(stage) => {
          setRows((current) =>
            editing === null
              ? [...current, keyed(stage)]
              : current.map((row, index) => (index === editing ? { ...row, stage } : row)),
          );
          setPicking(null);
        }}
      />
    </Screen>
  );
}

function StageRow({
  stage,
  index,
  count,
  offset,
  dragging,
  onLayoutHeight,
  onDragStart,
  onDragMove,
  onDragEnd,
  onMove,
  onEdit,
  onRemove,
}: {
  stage: Stage;
  index: number;
  count: number;
  offset: number;
  dragging: boolean;
  onLayoutHeight: (height: number) => void;
  onDragStart: () => void;
  onDragMove: (dy: number) => void;
  onDragEnd: (dy: number) => void;
  onMove: (to: number) => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const { t } = useTimers();
  const label = stageLabel(stage, t);
  const duration = stage.seconds === null ? null : formatDuration(stage.seconds, t);
  // The responder is made once; the latest handlers are read through a ref.
  const handlers = useRef({ onDragStart, onDragMove, onDragEnd });
  handlers.current = { onDragStart, onDragMove, onDragEnd };
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => handlers.current.onDragStart(),
      onPanResponderMove: (_, gesture) => handlers.current.onDragMove(gesture.dy),
      onPanResponderRelease: (_, gesture) => handlers.current.onDragEnd(gesture.dy),
      onPanResponderTerminate: (_, gesture) => handlers.current.onDragEnd(gesture.dy),
    }),
  ).current;

  const actions = [
    ...(index > 0 ? [{ name: "moveUp", label: t("home.timers.ui.editor.moveUp") }] : []),
    ...(index < count - 1
      ? [{ name: "moveDown", label: t("home.timers.ui.editor.moveDown") }]
      : []),
  ];
  const onAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "moveUp") onMove(index - 1);
    if (event.nativeEvent.actionName === "moveDown") onMove(index + 1);
  };

  return (
    <View
      onLayout={(event) => onLayoutHeight(event.nativeEvent.layout.height)}
      style={[
        styles.row,
        index > 0 && { borderTopWidth: 1, borderTopColor: color.outline },
        { transform: [{ translateY: offset }] },
        dragging && [
          styles.lifted,
          { backgroundColor: color.surface, shadowColor: color.shadowColor },
        ],
      ]}
    >
      <View
        {...pan.panHandlers}
        style={styles.grip}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Glyph name="grip" size={22} color={color.ink3} />
      </View>
      <View
        accessible
        accessibilityLabel={`${index + 1}. ${label}`}
        accessibilityActions={actions}
        onAccessibilityAction={onAction}
        style={styles.named}
      >
        <Text style={[textRole(theme, "bodySm", "700"), styles.number, { color: color.ink3 }]}>
          {index + 1}
        </Text>
        <Text
          numberOfLines={2}
          style={[textRole(theme, "bodyLg", "600"), parts.flex, { color: color.ink }]}
        >
          {label}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("home.timers.ui.editor.durationA11y", {
          stage: label,
          duration: duration?.spoken ?? t("home.timers.ui.editor.handsOn"),
        })}
        onPress={onEdit}
        style={({ pressed }) => [
          styles.duration,
          { borderColor: color.outline, backgroundColor: color.surface },
          pressed && parts.pressed,
        ]}
      >
        <Text
          style={[
            textRole(theme, "bodyMd", duration === null ? "500" : "600"),
            duration === null
              ? { color: color.ink2, fontStyle: "italic" }
              : { color: color.heading, fontVariant: ["tabular-nums"] },
          ]}
        >
          {duration?.text ?? t("home.timers.ui.editor.handsOn")}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("home.timers.ui.editor.removeA11y", { stage: label })}
        onPress={onRemove}
        style={({ pressed }) => [styles.remove, pressed && parts.pressed]}
      >
        <Glyph name="minusCircle" size={22} color={color.ink3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: tokens.spacing.screenMargin, paddingBottom: 24 },
  label: { marginTop: 8, marginBottom: 6, marginHorizontal: 2 },
  stagesLabel: { marginTop: 16 },
  input: { minHeight: 52, paddingHorizontal: 14, borderRadius: tokens.radius.xl, borderWidth: 1 },
  card: { borderRadius: tokens.radius.xl, paddingVertical: 4, paddingHorizontal: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 60, paddingVertical: 6 },
  lifted: {
    zIndex: 2,
    marginHorizontal: -12,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 1,
    elevation: 6,
  },
  grip: {
    width: 32,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },
  named: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
  number: { width: 22, fontVariant: ["tabular-nums"] },
  duration: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  remove: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    marginTop: 6,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: tokens.radius.xl,
    paddingHorizontal: 12,
  },
  dock: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 10,
  },
  refuse: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
  },
  saves: { flexDirection: "row", gap: 10 },
  primary: { flex: 1.3 },
});
