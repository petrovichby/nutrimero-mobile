import { LOCALES, type Locale, type Translator } from "@nutrimero/core";
import { Glyph, PageTitle, Screen, textRole, tokens, uiFace, useTheme } from "@nutrimero/ui";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * More → Language (08-language; DESIGN.md MA-22; 001 FR-026). The seven UI languages in their own
 * names, each set in its own script's face (Беларуская in Onest even inside an English UI) and
 * tagged with its own language for assistive tech; beneath each, its name in the current UI
 * language — or, for the device's language, the "Your device's language" tag. Choosing the device's
 * language removes the override (the app follows the device again); any other stores it. The
 * caller applies the choice in place — no restart.
 */
export function LanguageScreen({
  t,
  current,
  deviceLocale,
  onChoose,
  onBack,
}: {
  t: Translator;
  /** The language the UI is in now (override, else the device's). */
  current: Locale;
  /** The device's own UI locale (the system default, IX 1.2.0 rule 1). */
  deviceLocale: Locale;
  /** `null` = follow the device (removes the override). */
  onChoose: (choice: Locale | null) => void;
  onBack: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Screen>
      <View style={styles.topbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("home.language.back")}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Glyph name="back" color={color.heading} />
          <Text style={[textRole(theme, "bodyLg", "600"), { color: color.heading }]}>
            {t("home.language.back")}
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PageTitle>{t("home.language.title")}</PageTitle>
        <Text style={[textRole(theme, "bodyMd"), styles.intro, { color: color.ink2 }]}>
          {t("home.language.intro")}
        </Text>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={t("home.language.group")}
          style={[styles.list, { backgroundColor: color.surface1 }]}
        >
          {LOCALES.map((code, index) => {
            const selected = code === current;
            const isDevice = code === deviceLocale;
            const endonym = t(`common.languageEndonym.${code}`);
            const sub = isDevice ? t("home.language.deviceTag") : t(`home.language.names.${code}`);
            return (
              <Pressable
                key={code}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${endonym}, ${sub}`}
                onPress={() => onChoose(isDevice ? null : code)}
                style={({ pressed }) => [
                  styles.row,
                  index > 0 && { borderTopWidth: 1, borderTopColor: color.outline },
                  selected && { backgroundColor: color.actionSoft },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.rowText}>
                  <Text
                    accessibilityLanguage={code}
                    style={[
                      textRole(theme, "bodyLg", "600"),
                      // MA-22: an endonym sets in its own script's face, never a platform default.
                      {
                        fontFamily: uiFace(code, "600"),
                        color: selected ? color.heading : color.ink,
                      },
                    ]}
                  >
                    {endonym}
                  </Text>
                  {isDevice ? (
                    <Text
                      style={[
                        textRole(theme, "labelSm"),
                        styles.deviceTag,
                        {
                          color: color.ink2,
                          borderColor: color.outlineStrong,
                          backgroundColor: color.surface,
                        },
                      ]}
                    >
                      {sub}
                    </Text>
                  ) : (
                    <Text style={[textRole(theme, "bodySm"), { color: color.ink2 }]}>{sub}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.check,
                    selected
                      ? { backgroundColor: color.action, borderColor: color.action }
                      : { borderColor: color.outlineStrong },
                  ]}
                >
                  {selected && <Glyph name="check" size={16} color={color.onAction} />}
                </View>
              </Pressable>
            );
          })}
        </View>
        <Text style={[textRole(theme, "bodySm"), styles.note, { color: color.ink2 }]}>
          {t("home.language.note")}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: "row", paddingHorizontal: tokens.spacing.unit * 2, paddingTop: 2 },
  back: {
    minHeight: tokens.touchTarget.minimum,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: 4,
    paddingRight: 10,
  },
  pressed: { opacity: 0.7 },
  content: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingTop: 6,
    paddingBottom: tokens.spacing.sectionGap,
  },
  intro: { marginTop: 4, marginBottom: tokens.spacing.screenMargin },
  list: { borderRadius: tokens.radius.xl, overflow: "hidden" },
  row: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.unit * 3,
    paddingVertical: tokens.spacing.unit * 2,
    paddingHorizontal: tokens.spacing.screenMargin,
  },
  rowText: { flex: 1, alignItems: "flex-start", gap: 2 },
  deviceTag: {
    marginTop: 3,
    paddingHorizontal: tokens.spacing.unit * 2,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    overflow: "hidden",
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  note: { marginTop: 14, paddingHorizontal: 4 },
});
