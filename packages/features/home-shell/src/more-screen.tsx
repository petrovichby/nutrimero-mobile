import type { Locale, Translator } from "@nutrimero/core";
import {
  type FilledGlyphName,
  Glyph,
  Masthead,
  Screen,
  textRole,
  tokens,
  useTheme,
} from "@nutrimero/ui";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * More (09-more; DESIGN.md MA-24, MA-27): Timers, Language, Clear my data on this device, and the
 * app and version line. Rows sit in grouped cards on surface-1; the destructive row carries
 * its danger colour on the glyph and label, never colour alone (the label names the action).
 */
export function MoreScreen({
  t,
  locale,
  version,
  onTimers,
  onLanguage,
  onClearData,
}: {
  t: Translator;
  locale: Locale;
  /** The app version (Expo config), shown in the version line. */
  version: string;
  /** Opens the timers sheet (005): the way in before anything runs; then the chip takes over. */
  onTimers: () => void;
  onLanguage: () => void;
  onClearData: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Screen>
      <Masthead title={t("home.more.title")} />
      <ScrollView contentContainerStyle={styles.content}>
        <Group>
          <MoreRow
            glyph="timer"
            title={t("home.timers.ui.sheet.title")}
            hint={t("home.more.timersHint")}
            onPress={onTimers}
          />
        </Group>
        <Group>
          <MoreRow
            glyph="globe"
            title={t("home.language.title")}
            value={t(`common.languageEndonym.${locale}`)}
            valueLanguage={locale}
            onPress={onLanguage}
          />
        </Group>
        <Group>
          <MoreRow
            glyph="trash"
            title={t("home.more.clearTitle")}
            hint={t("home.more.clearHint")}
            danger
            onPress={onClearData}
          />
        </Group>
        <Text style={[textRole(theme, "labelMd", "400"), styles.version, { color: color.ink3 }]}>
          {t("home.more.version", { app: t("app.homeBaker.name"), version })}
        </Text>
      </ScrollView>
    </Screen>
  );
}

function Group({ children }: { children: ReactNode }) {
  const { color } = useTheme();
  return <View style={[styles.group, { backgroundColor: color.surface1 }]}>{children}</View>;
}

function MoreRow({
  glyph,
  title,
  hint,
  value,
  valueLanguage,
  danger = false,
  onPress,
}: {
  glyph: FilledGlyphName;
  title: string;
  hint?: string;
  value?: string;
  valueLanguage?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  const tone = danger ? color.destructiveInk : color.heading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[title, value, hint].filter(Boolean).join(", ")}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Glyph name={glyph} color={tone} />
      <View style={styles.rowText}>
        <Text
          style={[
            textRole(theme, "bodyLg", "600"),
            styles.rowTitle,
            { color: danger ? tone : color.ink },
          ]}
        >
          {title}
        </Text>
        {hint !== undefined && (
          <Text style={[textRole(theme, "bodySm"), { color: color.ink2 }]}>{hint}</Text>
        )}
      </View>
      {value !== undefined && (
        <Text
          accessibilityLanguage={valueLanguage}
          style={[textRole(theme, "bodyMd"), { color: color.ink2 }]}
        >
          {value}
        </Text>
      )}
      <Glyph name="chevron" size={18} color={color.ink3} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingBottom: tokens.spacing.sectionGap,
    gap: tokens.spacing.screenMargin,
  },
  group: { borderRadius: tokens.radius.xl, overflow: "hidden" },
  row: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: tokens.spacing.unit * 2,
    paddingLeft: tokens.spacing.screenMargin,
    paddingRight: 14,
  },
  pressed: { opacity: 0.7 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, lineHeight: 22 },
  version: { marginTop: 2, textAlign: "center", fontVariant: ["tabular-nums"] },
});
