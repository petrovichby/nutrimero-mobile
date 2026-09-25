import { Glyph, type GlyphName, textRole, tokens, useSheetRise, useTheme } from "@nutrimero/ui";
import type { ReactNode } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * The pieces every timers screen shares, drawn after the walked corpus (15–22,
 * `_gen/gen_timers.py`). Every control is at least 44pt and names its action; glyphs are
 * decorative inside a labelled control (DESIGN.md: glyph + text, colour never alone).
 */

/**
 * A detail page's title (New timer, New routine, Routines — nutrimero-design ff47b350, owner walk
 * 2026-09-25: "it's a 'detail' page, not top level"): Plus Jakarta Sans at headline-lg, heading ink.
 * Pacifico stays on top-level pages and More's own pages.
 */
export function DetailTitle({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={[
        textRole(theme, "headlineLg", "700"),
        styles.detailTitle,
        { color: theme.color.heading },
      ]}
    >
      {children}
    </Text>
  );
}

/** "‹ Timers": back to a named place (the topbar of 17–21). */
export function BackBar({
  place,
  label,
  onPress,
}: {
  place: string;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.topbar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        hitSlop={4}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Glyph name="back" size={24} color={theme.color.heading} />
        <Text style={[textRole(theme, "bodyLg", "600"), { color: theme.color.heading }]}>
          {place}
        </Text>
      </Pressable>
    </View>
  );
}

/** The round 44pt control (sheet rows, steppers): an outlined circle with one glyph. */
export function RoundButton({
  glyph,
  label,
  onPress,
  disabled = false,
}: {
  glyph: GlyphName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { color } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.round,
        { borderColor: color.outlineStrong, backgroundColor: color.surface },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Glyph name={glyph} size={18} color={color.heading} />
    </Pressable>
  );
}

/** The pill action (Dismiss, Start): the action fill, near-black text. */
export function Pill({
  label,
  onPress,
  a11yLabel,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  a11yLabel?: string;
  /** 21b: off at the limit; the refusal above the list says why. */
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: theme.color.action },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[textRole(theme, "bodyMd", "700"), { color: theme.color.onAction }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** A screen control (18/20): 64pt, glyph over label; `main` takes the action fill. */
export function Control({
  label,
  a11yLabel,
  glyph,
  main = false,
  onPress,
  style,
}: {
  label: string;
  a11yLabel?: string;
  glyph?: GlyphName;
  main?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const { color } = theme;
  const ink = main ? color.onAction : color.heading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11yLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        main
          ? { backgroundColor: color.action, borderColor: color.action }
          : { backgroundColor: color.surface, borderColor: color.outlineStrong },
        pressed && styles.pressed,
        style,
      ]}
    >
      {glyph !== undefined && <Glyph name={glyph} size={22} color={ink} />}
      <Text style={[textRole(theme, "bodyMd", "700"), styles.center, { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

/** The quiet destructive text action (Cancel timer / Cancel routine). */
export function QuietDestructive({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.quiet, pressed && styles.pressed]}
    >
      <Text style={[textRole(theme, "bodyMd", "600"), { color: theme.color.destructiveInk }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** "Your screen stays on while this is open" (MA-27: timer and routine screens say so). */
export function AwakeFootnote({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.awake}>
      <Glyph name="sun" size={16} color={theme.color.heading} />
      <Text style={[textRole(theme, "bodySm"), { color: theme.color.ink2, flexShrink: 1 }]}>
        {text}
      </Text>
    </View>
  );
}

/** The refused-permission note (18b; FR-017): words and a glyph, and Open settings. */
export function RefusedNote({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <View style={[styles.note, { borderColor: color.outlineStrong }]}>
      <Glyph name="bellOff" size={20} color={color.ink2} />
      <Text style={[textRole(theme, "bodySm"), styles.noteText, { color: color.ink2 }]}>
        <Text style={{ color: color.ink, fontFamily: theme.face("600") }}>{title}</Text> {body}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        style={({ pressed }) => [
          styles.noteAct,
          { borderColor: color.outlineStrong, backgroundColor: color.surface },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[textRole(theme, "bodySm", "700"), { color: color.heading }]}>
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * A refusal at the action (19c too long, 17c ten running, 19d twenty saved): one sentence with an
 * icon, above the disabled action, announced as an alert. Words and a glyph, never colour alone.
 */
export function Refusal({ text }: { text: string }) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.refusal, { borderColor: color.destructiveInk }]}
    >
      <Glyph name="info" size={18} color={color.destructiveInk} />
      <Text style={[textRole(theme, "bodySm"), styles.noteText, { color: color.ink }]}>{text}</Text>
    </View>
  );
}

/**
 * A bottom sheet (16, 17b, 19b, 20d): grab handle, scrim that closes it, system back closes it.
 * The scrim fades in place and only the sheet rises (owner, T027 iPhone run: the whole overlay
 * sliding up read wrong); under Reduce Motion it only fades. DESIGN.md motion: 150–250 ms.
 * The children own the content and actions.
 */
export function Sheet({
  visible,
  onClose,
  closeLabel,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  const { color } = theme;
  const insets = useSafeAreaInsets();
  const { translateY: rise, onShow } = useSheetRise(visible);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={onShow}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.sheetRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: color.sheetScrim }]}
        />
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: color.surface,
              shadowColor: color.shadowColor,
              paddingBottom: Math.max(insets.bottom, tokens.spacing.sectionGap) + 2,
              transform: [{ translateY: rise }],
            },
          ]}
        >
          <View style={[styles.grab, { backgroundColor: color.outlineStrong }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

/** The sheet's heading row with its close button (16, 19b). */
export function SheetHead({
  title,
  closeLabel,
  onClose,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.sheetHead}>
      <Text
        accessibilityRole="header"
        style={[textRole(theme, "headlineMd"), styles.flex, { color: theme.color.heading }]}
      >
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        onPress={onClose}
        style={({ pressed }) => [styles.xbtn, pressed && styles.pressed]}
      >
        <Glyph name="close" size={22} color={theme.color.ink2} />
      </Pressable>
    </View>
  );
}

/** A choice chip (quick durations, stage picks): pressed state in text and edge, never colour alone. */
export function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected
          ? { borderColor: color.heading, borderWidth: 1.5, backgroundColor: color.actionSoft }
          : { borderColor: color.outline, backgroundColor: color.surface },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          textRole(theme, "bodyMd", "600"),
          { color: selected ? color.heading : color.ink, fontVariant: ["tabular-nums"] },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  detailTitle: { marginTop: 4, marginBottom: 4 },
  center: { textAlign: "center" },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
  topbar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingTop: 2 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 44,
    paddingLeft: 4,
    paddingRight: 10,
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: tokens.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  control: {
    minHeight: 64,
    borderRadius: tokens.radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quiet: {
    alignSelf: "center",
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginTop: 18,
  },
  awake: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 16,
  },
  noteText: { flex: 1 },
  refusal: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
  },
  noteAct: {
    alignSelf: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  sheetRoot: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingTop: 10,
    paddingHorizontal: 16,
    // DESIGN.md MA-8: a sheet is a genuinely floating element — offset 6, blur 18.
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 18,
    shadowOpacity: 1,
    elevation: 12,
  },
  grab: {
    width: 40,
    height: 5,
    borderRadius: tokens.radius.full,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  xbtn: { width: 44, height: 44, marginRight: -10, alignItems: "center", justifyContent: "center" },
  choice: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
});
