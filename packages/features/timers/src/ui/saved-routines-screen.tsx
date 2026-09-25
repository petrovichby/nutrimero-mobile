import {
  Button,
  ConfirmSheet,
  Glyph,
  type GlyphName,
  Screen,
  textRole,
  tokens,
  useTheme,
} from "@nutrimero/ui";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { formatDuration } from "../model/duration";
import { timedSeconds } from "../model/format";
import { MAX_NAME_LENGTH, validName } from "../model/stage";
import type { SavedRoutine } from "../store/timer-store";
import { BackBar, DetailTitle, Pill, styles as parts, Sheet, SheetHead } from "./parts";
import { useTimers } from "./timers-context";

/**
 * Saved routines (21): each with Start and a menu — Edit stages, Rename, Delete (confirmed in a
 * sheet, MA-24). Empty, it says what the list is for. New routine sits under the list.
 */
export function SavedRoutinesScreen({
  onBack,
  onStarted,
  onEdit,
  onNew,
}: {
  onBack: () => void;
  onStarted: (id: string) => void;
  onEdit: (routineId: string) => void;
  onNew: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const timers = useTimers();
  const { t, saved } = timers;
  const [menu, setMenu] = useState<{ routine: SavedRoutine; top: number } | null>(null);
  const [renaming, setRenaming] = useState<SavedRoutine | null>(null);
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState<SavedRoutine | null>(null);
  const [rowTops, setRowTops] = useState<Readonly<Record<string, { y: number; height: number }>>>(
    {},
  );

  const start = async (routine: SavedRoutine) => {
    const result = await timers.startRoutine({
      name: routine.name,
      stages: routine.stages,
      savedRoutineId: routine.id,
    });
    if (result.ok && result.id !== undefined) onStarted(result.id);
  };
  const renamed = validName(newName);

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <BackBar
        place={t("home.timers.ui.sheet.title")}
        label={t("home.timers.ui.back", { place: t("home.timers.ui.sheet.title") })}
        onPress={onBack}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <DetailTitle>{t("home.timers.ui.saved.title")}</DetailTitle>
        <View>
          {saved.length === 0 ? (
            <Text style={[textRole(theme, "bodyMd"), styles.empty, { color: color.ink2 }]}>
              {t("home.timers.ui.saved.empty")}
            </Text>
          ) : (
            <View style={[styles.card, { backgroundColor: color.surface1 }]}>
              {saved.map((routine, index) => (
                <View
                  key={routine.id}
                  onLayout={(event) => {
                    const { y, height } = event.nativeEvent.layout;
                    setRowTops((current) => ({ ...current, [routine.id]: { y, height } }));
                  }}
                  style={[
                    styles.row,
                    index > 0 && { borderTopWidth: 1, borderTopColor: color.outline },
                  ]}
                >
                  <View style={parts.flex}>
                    <Text style={[textRole(theme, "bodyLg", "600"), { color: color.ink }]}>
                      {routine.name}
                    </Text>
                    <Text
                      style={[
                        textRole(theme, "bodySm"),
                        { color: color.ink2, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {t("home.timers.ui.saved.summary", {
                        count: routine.stages.length,
                        duration: formatDuration(timedSeconds(routine.stages), t).text,
                      })}
                    </Text>
                  </View>
                  <Pill
                    label={t("home.timers.ui.saved.start")}
                    a11yLabel={`${t("home.timers.ui.saved.start")}: ${routine.name}`}
                    onPress={() => void start(routine)}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("home.timers.ui.saved.moreA11y", { name: routine.name })}
                    accessibilityState={{ expanded: menu?.routine.id === routine.id }}
                    onPress={() => {
                      const place = rowTops[routine.id];
                      setMenu({
                        routine,
                        top: place === undefined ? 0 : place.y + place.height - 8,
                      });
                    }}
                    style={({ pressed }) => [styles.more, pressed && parts.pressed]}
                  >
                    <Glyph name="moreVertical" size={22} color={color.ink3} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {menu !== null && (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("home.timers.ui.close")}
                onPress={() => setMenu(null)}
                style={styles.menuScrim}
              />
              <View
                accessibilityRole="menu"
                style={[
                  styles.menu,
                  {
                    top: menu.top,
                    backgroundColor: color.surface,
                    borderColor: color.outline,
                    shadowColor: color.shadowColor,
                  },
                ]}
              >
                <MenuItem
                  first
                  glyph="pencil"
                  label={t("home.timers.ui.saved.edit")}
                  onPress={() => {
                    setMenu(null);
                    onEdit(menu.routine.id);
                  }}
                />
                <MenuItem
                  glyph="pencil"
                  label={t("home.timers.ui.saved.rename")}
                  onPress={() => {
                    setMenu(null);
                    setNewName(menu.routine.name);
                    setRenaming(menu.routine);
                  }}
                />
                <MenuItem
                  glyph="trash"
                  danger
                  label={t("home.timers.ui.saved.delete")}
                  onPress={() => {
                    setMenu(null);
                    setDeleting(menu.routine);
                  }}
                />
              </View>
            </>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("home.timers.ui.sheet.newRoutine")}
          onPress={onNew}
          style={({ pressed }) => [
            styles.add,
            { borderColor: color.outlineStrong },
            pressed && parts.pressed,
          ]}
        >
          <Glyph name="plus" size={18} color={color.heading} />
          <Text style={[textRole(theme, "bodyMd", "700"), { color: color.heading }]}>
            {t("home.timers.ui.sheet.newRoutine")}
          </Text>
        </Pressable>
      </ScrollView>

      <Sheet
        visible={renaming !== null}
        onClose={() => setRenaming(null)}
        closeLabel={t("home.timers.ui.close")}
      >
        <SheetHead
          title={t("home.timers.ui.saved.renameTitle")}
          closeLabel={t("home.timers.ui.close")}
          onClose={() => setRenaming(null)}
        />
        <TextInput
          accessibilityLabel={t("home.timers.ui.newTimer.nameLabel")}
          value={newName}
          onChangeText={setNewName}
          autoFocus
          maxLength={MAX_NAME_LENGTH * 2}
          style={[
            textRole(theme, "bodyLg"),
            styles.input,
            { borderColor: color.outlineStrong, backgroundColor: color.surface, color: color.ink },
          ]}
        />
        <Button
          label={t("home.timers.ui.editor.save")}
          disabled={renamed === null}
          onPress={() => {
            if (renaming === null || renamed === null) return;
            void timers.saveRoutine({ ...renaming, name: renamed }).then(() => setRenaming(null));
          }}
          style={styles.renameSave}
        />
      </Sheet>

      <ConfirmSheet
        visible={deleting !== null}
        title={t("home.timers.ui.saved.deleteTitle")}
        confirmLabel={t("home.timers.ui.saved.delete")}
        cancelLabel={t("home.timers.ui.cancel")}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting === null) return;
          void timers.deleteRoutine(deleting.id).then(() => setDeleting(null));
        }}
      >
        <Text style={[textRole(theme, "bodyMd"), { color: color.ink2 }]}>
          {t("home.timers.ui.saved.deleteBody", { name: deleting?.name ?? "" })}
        </Text>
      </ConfirmSheet>
    </Screen>
  );
}

function MenuItem({
  glyph,
  label,
  danger = false,
  first = false,
  onPress,
}: {
  first?: boolean;
  glyph: GlyphName;
  label: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const ink = danger ? color.destructiveInk : color.ink;
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        !first && { borderTopWidth: 1, borderTopColor: color.outline },
        pressed && parts.pressed,
      ]}
    >
      <Glyph name={glyph} size={18} color={danger ? color.destructiveInk : color.heading} />
      <Text style={[textRole(theme, "bodyMd"), { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: tokens.spacing.screenMargin, paddingBottom: 24 },
  empty: { marginTop: 8 },
  card: { borderRadius: tokens.radius.xl, paddingHorizontal: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 76, paddingVertical: 10 },
  more: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  menuScrim: {
    position: "absolute",
    top: -2000,
    bottom: -2000,
    left: -100,
    right: -100,
    zIndex: 4,
  },
  menu: {
    position: "absolute",
    right: 0,
    zIndex: 5,
    width: 196,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    marginTop: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: tokens.radius.xl,
  },
  input: {
    minHeight: 52,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
  },
  renameSave: { marginTop: 16 },
});
