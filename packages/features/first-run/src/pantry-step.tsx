import type { Locale, Translator } from "@nutrimero/core";
import { FID_SNAPSHOT, stapleName } from "@nutrimero/feature-diet-profile";
import { Glyph, textRole, tokens, useTheme } from "@nutrimero/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OnboardingFrame, StepHeading } from "./onboarding-frame";

/**
 * Onboarding 3 — pantry seed (07-onboarding-pantry; 001 FR-007). The 13 owner-confirmed staples,
 * named from the FID snapshot exactly as stored (MA-14 — lowercase, singular, never re-cased), in
 * the user's language; lt/pl/be/uk show English until api feat/021 (FR-017). A live count; the
 * selection is stored on the device only.
 */
export function PantryStep({
  t,
  locale,
  selected,
  onToggle,
  onDone,
  onSkip,
}: {
  t: Translator;
  locale: Locale;
  selected: readonly string[];
  onToggle: (fidId: string) => void;
  onDone: () => void;
  onSkip: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <OnboardingFrame
      t={t}
      step={3}
      primaryLabel={t("home.onboarding.pantry.done")}
      onPrimary={onDone}
      onSkip={onSkip}
    >
      <StepHeading
        title={t("home.onboarding.pantry.title")}
        body={t("home.onboarding.pantry.body")}
      />
      <View accessibilityLabel={t("home.onboarding.pantry.group")} style={styles.staples}>
        {FID_SNAPSHOT.staples.map((staple) => {
          const on = selected.includes(staple.fidId);
          const name = stapleName(staple, locale);
          return (
            <Pressable
              key={staple.fidId}
              accessibilityRole="togglebutton"
              accessibilityState={{ checked: on }}
              accessibilityLabel={name}
              onPress={() => onToggle(staple.fidId)}
              style={({ pressed }) => [
                styles.staple,
                on
                  ? { borderColor: color.action, backgroundColor: color.actionSoft }
                  : { borderColor: color.outline, backgroundColor: color.surface },
                pressed && styles.pressed,
              ]}
            >
              <Glyph name={on ? "check" : "plus"} size={15} color={on ? color.ink : color.ink2} />
              <Text style={[textRole(theme, "bodyMd", "600"), { color: color.ink }]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[textRole(theme, "bodySm", "600"), styles.count, { color: color.ink2 }]}
      >
        {t("home.onboarding.pantry.count", { count: selected.length })}
      </Text>
      <Text style={[textRole(theme, "bodySm"), styles.note, { color: color.ink2 }]}>
        {t("home.onboarding.pantry.note")}
      </Text>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  staples: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  staple: {
    minHeight: tokens.touchTarget.minimum,
    paddingHorizontal: 14,
    paddingVertical: tokens.spacing.unit * 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1.5,
    borderRadius: tokens.radius.xl,
  },
  pressed: { opacity: 0.9 },
  count: { marginTop: tokens.spacing.screenMargin, fontVariant: ["tabular-nums"] },
  note: { marginTop: tokens.spacing.sectionGap },
});
