import { Glyph, textRole, tokens, useTheme } from "@nutrimero/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { chipItem } from "../model/item";
import { agoFor, describe } from "./describe";
import { styles as parts } from "./parts";
import { useTimers } from "./timers-context";

/**
 * The timer chip (15, 15b; DESIGN.md MA-27): bottom-left above the tab bar, naming the item ending
 * soonest with its time left and a count of the others. It turns gold and says what is done when
 * one ends; it never pulses (a state change, not a motion — so Reduce Motion needs no variant).
 * Hidden while nothing runs or waits: the entry is More → Timers then.
 */
export function TimerChip({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const { color } = theme;
  const { items, now, t, locale } = useTimers();
  const view = chipItem(items, now);
  if (view === null) return null;
  const others = items.length - 1;
  const done = view.status === "done";
  const d = describe(view, t, locale, now);
  const title = done ? d.doneTitle : view.name;
  const second = done && view.endsAt !== null ? agoFor(view.endsAt, now, t) : (d.readout ?? d.sub);
  const label = [
    done ? title : d.a11y,
    others > 0 ? t("home.timers.ui.chip.others", { count: others }) : null,
    t("home.timers.ui.chip.open"),
  ]
    .filter((part): part is string => part !== null)
    .join(". ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: done ? color.actionSoft : color.surface,
          borderColor: done ? color.action : color.outlineStrong,
          shadowColor: color.shadowColor,
        },
        pressed && parts.pressed,
      ]}
    >
      <View style={[styles.dial, { backgroundColor: color.action }]}>
        <Glyph name={done ? "bell" : "timer"} size={18} color={color.onAction} />
      </View>
      <View style={styles.text}>
        <Text
          numberOfLines={1}
          style={[textRole(theme, "bodyMd", "600"), styles.name, { color: color.ink }]}
        >
          {title}
        </Text>
        <Text
          style={[
            textRole(theme, done ? "bodyMd" : "headlineSm", "700"),
            { color: color.heading, fontVariant: ["tabular-nums"] },
          ]}
        >
          {second}
        </Text>
      </View>
      {others > 0 && (
        <Text
          style={[
            textRole(theme, "labelMd", "700"),
            styles.more,
            { color: color.ink2, borderLeftColor: color.outline },
          ]}
        >
          +{others}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    position: "absolute",
    left: 12,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    maxWidth: "80%",
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    shadowOpacity: 1,
    elevation: 6,
  },
  dial: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flexShrink: 1 },
  name: { maxWidth: 180 },
  more: { paddingLeft: 8, borderLeftWidth: 1 },
});
