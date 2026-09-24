import type { Translator } from "@nutrimero/core";
import { DIETARY_OPTIONS, type DietaryOption } from "@nutrimero/feature-home-data";
import { Glyph, type StrokeGlyphName, ToggleChip, textRole, tokens, useTheme } from "@nutrimero/ui";
import { StyleSheet, Text, View } from "react-native";
import { OnboardingFrame, StepHeading } from "./onboarding-frame";

/**
 * The strike grammar (DESIGN.md *Imagery*): "-free" options wear the struck glyph; the nut
 * allergy wears the plain nut — it names what to avoid, not what fits.
 */
const GLYPH: Record<DietaryOption, StrokeGlyphName> = {
  glutenFree: "glutenFree",
  lactoseFree: "lactoseFree",
  nutAllergy: "nut",
  eggFree: "eggFree",
  vegan: "vegan",
  vegetarian: "vegetarian",
};

/**
 * Onboarding 2 — dietary profile (07-onboarding-diet; 001 FR-006, FR-009). Multi-select toggles;
 * the reassurance card (C4 `note-assurance`) says the profile stays on the device; the note says
 * allergen flags come from verified declarations and labels still need checking.
 */
export function DietStep({
  t,
  profile,
  onToggle,
  onContinue,
  onSkip,
}: {
  t: Translator;
  profile: readonly DietaryOption[];
  onToggle: (option: DietaryOption) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <OnboardingFrame
      t={t}
      step={2}
      primaryLabel={t("home.onboarding.continue")}
      onPrimary={onContinue}
      onSkip={onSkip}
    >
      <StepHeading title={t("home.onboarding.diet.title")} body={t("home.onboarding.diet.body")} />
      <View
        accessibilityRole="list"
        accessibilityLabel={t("home.onboarding.diet.group")}
        style={styles.grid}
      >
        {DIETARY_OPTIONS.map((option) => (
          <ToggleChip
            key={option}
            label={t(`home.onboarding.diet.options.${option}`)}
            glyph={GLYPH[option]}
            selected={profile.includes(option)}
            onPress={() => onToggle(option)}
          />
        ))}
      </View>
      <View
        accessible
        style={[styles.privacy, { backgroundColor: color.noteBg, borderColor: color.noteLine }]}
      >
        <View style={styles.privacyGlyph}>
          <Glyph name="lock" size={20} color={color.noteGlyph} />
        </View>
        <Text style={[textRole(theme, "bodySm"), styles.privacyText, { color: color.noteInk }]}>
          <Text style={{ fontFamily: theme.face("700") }}>
            {t("home.onboarding.diet.privacyTitle")}
          </Text>{" "}
          {t("home.onboarding.diet.privacyBody")}
        </Text>
      </View>
      <Text style={[textRole(theme, "bodySm"), styles.note, { color: color.ink2 }]}>
        {t("home.onboarding.diet.note")}
      </Text>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  privacy: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: tokens.radius.xl,
    paddingVertical: tokens.spacing.unit * 3,
    paddingHorizontal: 14,
  },
  privacyGlyph: { marginTop: 1 },
  privacyText: { flex: 1 },
  note: { marginTop: tokens.spacing.sectionGap },
});
