import type { Translator } from "@nutrimero/core";
import { Button, Glyph, textRole, tokens, useTheme } from "@nutrimero/ui";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { derive, type View as ItemView } from "../model/item";
import { describe } from "./describe";
import { Pill, styles as parts, RefusedNote, RoundButton, Sheet, SheetHead } from "./parts";
import { useTimers } from "./timers-context";

const RANK = { done: 0, running: 1, waiting: 2, paused: 3 } as const;

/**
 * The timers sheet (16; DESIGN.md MA-27): done items first (Dismiss), then running and paused
 * timers and routines, each with its one action; then New timer, New routine and Saved routines.
 * Tapping a row opens its screen.
 */
export function TimersSheet({
  visible,
  onClose,
  onOpen,
  onNewTimer,
  onNewRoutine,
  onSavedRoutines,
}: {
  visible: boolean;
  onClose: () => void;
  onOpen: (id: string) => void;
  onNewTimer: () => void;
  onNewRoutine: () => void;
  onSavedRoutines: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const { items, now, t, locale, act, permission, openSettings } = useTimers();
  const views = items
    .map((item) => derive(item, now))
    .sort((a, b) => RANK[a.status] - RANK[b.status] || (a.endsAt ?? 0) - (b.endsAt ?? 0));
  const closeLabel = t("home.timers.ui.close");

  return (
    <Sheet visible={visible} onClose={onClose} closeLabel={closeLabel}>
      <SheetHead
        title={t("home.timers.ui.sheet.title")}
        closeLabel={closeLabel}
        onClose={onClose}
      />
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} bounces={false}>
        {views.map((view, index) => (
          <SheetRow
            key={view.id}
            view={view}
            first={index === 0}
            onOpen={() => onOpen(view.id)}
            action={rowAction(view)}
            t={t}
            locale={locale}
            now={now}
          />
        ))}
      </ScrollView>
      {permission === "denied" && (
        <RefusedNote
          title={t("home.timers.ui.refused.title")}
          body={t("home.timers.ui.refused.body")}
          actionLabel={t("home.timers.refused.openSettings")}
          onAction={openSettings}
        />
      )}
      <View style={styles.actions}>
        <Button
          label={t("home.timers.ui.sheet.newTimer")}
          onPress={onNewTimer}
          style={parts.flex}
        />
        <Button
          label={t("home.timers.ui.sheet.newRoutine")}
          variant="secondary"
          onPress={onNewRoutine}
          style={parts.flex}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("home.timers.ui.sheet.savedRoutines")}
        onPress={onSavedRoutines}
        style={({ pressed }) => [styles.link, pressed && parts.pressed]}
      >
        <Text style={[textRole(theme, "bodyMd", "600"), { color: color.heading }]}>
          {t("home.timers.ui.sheet.savedRoutines")}
        </Text>
        <Glyph name="chevron" size={16} color={color.heading} />
      </Pressable>
    </Sheet>
  );

  function rowAction(view: ItemView) {
    const name = view.name;
    if (view.status === "done") {
      const lastOrTimer = view.stage === null || view.stage.next === null;
      return lastOrTimer ? (
        <Pill
          label={t("home.timers.ui.dismiss")}
          onPress={() => act(view.id, { type: "dismiss" })}
        />
      ) : (
        <RoundButton
          glyph="chevron"
          label={t("home.timers.ui.sheet.openA11y", { name })}
          onPress={() => onOpen(view.id)}
        />
      );
    }
    if (view.stage !== null) {
      return (
        <RoundButton
          glyph="chevron"
          label={t("home.timers.ui.sheet.openA11y", { name })}
          onPress={() => onOpen(view.id)}
        />
      );
    }
    return view.status === "paused" ? (
      <RoundButton
        glyph="play"
        label={t("home.timers.ui.sheet.resumeA11y", { name })}
        onPress={() => act(view.id, { type: "resume" })}
      />
    ) : (
      <RoundButton
        glyph="pause"
        label={t("home.timers.ui.sheet.pauseA11y", { name })}
        onPress={() => act(view.id, { type: "pause" })}
      />
    );
  }
}

function SheetRow({
  view,
  first,
  onOpen: open,
  action,
  t,
  locale,
  now,
}: {
  view: ItemView;
  first: boolean;
  onOpen: () => void;
  action: ReactNode;
  t: Translator;
  locale: string;
  now: number;
}) {
  const theme = useTheme();
  const { color } = theme;
  const d = describe(view, t, locale, now);
  const done = view.status === "done";
  return (
    <View
      style={[
        styles.row,
        !first && { borderTopWidth: 1, borderTopColor: color.outline },
        done && [
          styles.doneRow,
          { backgroundColor: color.actionSoft, borderTopColor: "transparent" },
        ],
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={d.a11y}
        onPress={open}
        style={({ pressed }) => [styles.main, pressed && parts.pressed]}
      >
        <View style={[styles.icon, { backgroundColor: color.surface1 }]}>
          <Glyph
            name={done ? "bell" : view.stage !== null ? "routine" : "timer"}
            size={20}
            color={color.heading}
          />
        </View>
        <View style={parts.flex}>
          <Text numberOfLines={1} style={[textRole(theme, "bodyLg", "600"), { color: color.ink }]}>
            {d.name}
          </Text>
          <Text numberOfLines={2} style={[textRole(theme, "bodySm"), { color: color.ink2 }]}>
            {d.sub}
          </Text>
        </View>
        {d.readout !== null && (
          <Text
            style={[
              textRole(theme, "headlineMd", "700"),
              {
                color: view.status === "paused" ? color.ink3 : color.heading,
                fontVariant: ["tabular-nums"],
              },
            ]}
          >
            {d.readout}
          </Text>
        )}
      </Pressable>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  // The list runs to the sheet's edges so a done row's tint is full-bleed (16: margin 0 -16px);
  // a ScrollView clips its children, so the bleed has to be inside it.
  list: { maxHeight: 360, marginTop: 4, marginHorizontal: -16 },
  listContent: { paddingHorizontal: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 72, paddingVertical: 10 },
  doneRow: { marginHorizontal: -16, paddingHorizontal: 18 },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 44,
    marginTop: 6,
  },
});
