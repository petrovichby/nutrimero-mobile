import {
  celsiusFromFahrenheit,
  formatNumber,
  type Locale,
  roundToStep,
  type Translator,
} from "@nutrimero/core";
import type { Units } from "@nutrimero/feature-home-data";
import { SelectionCard, textRole, tokens, useTheme } from "@nutrimero/ui";
import { StyleSheet, Text, View } from "react-native";
import { OnboardingFrame, StepHeading } from "./onboarding-frame";

const OVEN_F = 350;
const OVEN_C = roundToStep(celsiusFromFahrenheit(OVEN_F), 5); // 175 — bakers round ovens to 5°
const FLOUR_CUP_G = 120; // illustrative densities from the comp (07-onboarding-units)
const BUTTER_STICK_G = 113;

/**
 * Onboarding 1 — units (07-onboarding-units; 001 FR-005). Metric is preselected; the cream card
 * shows how recipes will read in the chosen system and updates with it (NOTES.md). The card is
 * the scheme-fixed canvas, so its ink is too.
 */
export function UnitsStep({
  t,
  locale,
  units,
  onChange,
  onContinue,
  onSkip,
}: {
  t: Translator;
  locale: Locale;
  units: Units;
  onChange: (units: Units) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
  // The 76pt sample tile: value over unit (07-onboarding-units, design ruling 2026-09-24).
  const tile = (value: string, unit: string) => (
    <>
      <Text
        style={[
          styles.sampleValue,
          styles.tabular,
          { fontFamily: theme.face("700"), color: color.canvasHeading },
        ]}
      >
        {value}
      </Text>
      <Text style={[textRole(theme, "labelMd"), { color: color.canvasInk }]}>{unit}</Text>
    </>
  );
  const rows =
    units === "metric"
      ? [
          [
            t("home.onboarding.units.rows.flourCup"),
            t("home.onboarding.units.values.grams", { grams: FLOUR_CUP_G }),
          ],
          [
            t("home.onboarding.units.rows.butterStick"),
            t("home.onboarding.units.values.grams", { grams: BUTTER_STICK_G }),
          ],
          [
            t("home.onboarding.units.values.fahrenheit", { fahrenheit: OVEN_F }),
            t("home.onboarding.units.values.celsius", { celsius: OVEN_C }),
          ],
        ]
      : [
          [
            t("home.onboarding.units.rows.flourGrams", { grams: FLOUR_CUP_G }),
            t("home.onboarding.units.values.cup"),
          ],
          [
            t("home.onboarding.units.rows.butterGrams", { grams: BUTTER_STICK_G }),
            t("home.onboarding.units.values.stick"),
          ],
          [
            t("home.onboarding.units.values.celsius", { celsius: OVEN_C }),
            t("home.onboarding.units.values.fahrenheit", { fahrenheit: OVEN_F }),
          ],
        ];

  return (
    <OnboardingFrame
      t={t}
      step={1}
      primaryLabel={t("home.onboarding.continue")}
      onPrimary={onContinue}
      onSkip={onSkip}
    >
      <StepHeading
        title={t("home.onboarding.units.title")}
        body={t("home.onboarding.units.body")}
      />
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t("home.onboarding.units.group")}
        style={styles.cards}
      >
        <SelectionCard
          title={t("home.onboarding.units.metric")}
          description={t("home.onboarding.units.metricUnits")}
          sample={tile(formatNumber(420, locale), t("home.onboarding.units.sample.metricUnit"))}
          selected={units === "metric"}
          onPress={() => onChange("metric")}
        />
        <SelectionCard
          title={t("home.onboarding.units.imperial")}
          description={t("home.onboarding.units.imperialUnits")}
          sample={tile(
            t("home.onboarding.units.sample.imperialValue"),
            t("home.onboarding.units.sample.imperialUnit"),
          )}
          selected={units === "imperial"}
          onPress={() => onChange("imperial")}
        />
      </View>
      <View
        accessible
        accessibilityLabel={`${t("home.onboarding.units.convertLabel")}: ${rows.map(([from, to]) => `${from} — ${to}`).join("; ")}`}
        style={[styles.convert, { backgroundColor: color.illustrationCanvas }]}
      >
        <Text style={[textRole(theme, "labelMd"), styles.convertLabel, { color: color.canvasInk }]}>
          {t("home.onboarding.units.convertLabel")}
        </Text>
        {rows.map(([from, to]) => (
          <View key={from} style={styles.row}>
            <Text
              style={[textRole(theme, "bodyMd", "500"), styles.tabular, { color: color.canvasInk }]}
            >
              {from}
            </Text>
            <Text
              style={[
                textRole(theme, "bodyMd", "700"),
                styles.tabular,
                { color: color.canvasHeading },
              ]}
            >
              {to}
            </Text>
          </View>
        ))}
      </View>
      <Text style={[textRole(theme, "bodySm"), styles.tip, { color: color.ink2 }]}>
        {t("home.onboarding.units.tip")}
      </Text>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  cards: { gap: tokens.spacing.unit * 3 },
  tabular: { fontVariant: ["tabular-nums"] },
  sampleValue: { fontSize: 24, lineHeight: 28 },
  convert: {
    marginTop: 18,
    borderRadius: tokens.radius.xl,
    paddingVertical: 14,
    paddingHorizontal: tokens.spacing.screenMargin,
  },
  convertLabel: { marginBottom: tokens.spacing.unit * 2 },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: tokens.spacing.unit * 3,
    paddingVertical: 6,
  },
  tip: { marginTop: 14 },
});
