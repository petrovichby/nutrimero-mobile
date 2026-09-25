import { formatNumber, type Locale, type Translator } from "@nutrimero/core";
import type { MeasuresRegion, UnitsChoice } from "@nutrimero/feature-home-data";
import { SelectionCard, textRole, tokens, useTheme } from "@nutrimero/ui";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OnboardingFrame, StepHeading } from "./onboarding-frame";

/** A row of the "How your recipes will read" card, already formatted by the caller. */
export interface UnitsPreviewRow {
  readonly key: "flour" | "butter" | "milk";
  readonly value: string;
}

/**
 * Onboarding 1 — units, the system first, then where the measures come from (004 FR-028; DESIGN.md
 * MA-28). Built from the owner-walked frames at nutrimero-design 93cf290a (with 802f19e9's
 * no-break binding): 07-onboarding-units, -imperial-us, -imperial-europe, -uk, -imperial-uk, each
 * with a dark twin.
 *
 * - Two systems: Metric or Imperial. On a UK region the Imperial card lists fluid ounces and pints
 *   too (07-onboarding-units-uk).
 * - The region row: My device (named with the region it reports) · UK · US · Europe · Asia, later
 *   (shown, not available).
 * - The preview card's rows come from the caller: their values depend on the api's unit
 *   definitions and densities (FR-010), never on constants here.
 */
export function UnitsChoiceStep({
  t,
  locale,
  choice,
  deviceRegion,
  ukImperial,
  preview,
  onChange,
  onContinue,
  onSkip,
}: {
  t: Translator;
  locale: Locale;
  choice: UnitsChoice;
  /** The region "My device" resolves to, named after the chip: "My device · Europe". */
  deviceRegion: Exclude<MeasuresRegion, "device">;
  /** The choice resolves to the UK, so Imperial lists UK imperial in full (MA-28, the UK). */
  ukImperial: boolean;
  preview: readonly UnitsPreviewRow[];
  onChange: (choice: UnitsChoice) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const theme = useTheme();
  const { color } = theme;
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
  const regionName = (region: Exclude<MeasuresRegion, "device">) =>
    t(`home.onboarding.units.choice.region.${region}`);
  const setRegion = (region: MeasuresRegion) => onChange({ ...choice, region });
  const previewLabel = `${t("home.onboarding.units.convertLabel")}: ${preview
    .map((row) => `${t(`home.onboarding.units.choice.preview.${row.key}`)} ${row.value}`)
    .join("; ")}`;

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
        body={t("home.onboarding.units.choice.body")}
      />
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t("home.onboarding.units.group")}
        style={styles.cards}
      >
        <SelectionCard
          dense
          title={t("home.onboarding.units.metric")}
          description={t("home.onboarding.units.metricUnits")}
          sample={tile(formatNumber(420, locale), t("home.onboarding.units.sample.metricUnit"))}
          selected={choice.system === "metric"}
          onPress={() => onChange({ ...choice, system: "metric" })}
        />
        <SelectionCard
          dense
          title={t("home.onboarding.units.imperial")}
          description={t(
            ukImperial
              ? "home.onboarding.units.choice.imperialUnitsUk"
              : "home.onboarding.units.choice.imperialUnits",
          )}
          sample={tile(
            t("home.onboarding.units.choice.sample.imperialValue"),
            t("home.onboarding.units.choice.sample.imperialUnit"),
          )}
          selected={choice.system === "imperial"}
          onPress={() => onChange({ ...choice, system: "imperial" })}
        />
      </View>

      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t("home.onboarding.units.choice.region.label")}
        style={styles.region}
      >
        <Text
          style={[textRole(theme, "labelMd", "600"), styles.regionLabel, { color: color.ink2 }]}
        >
          {t("home.onboarding.units.choice.region.label")}{" "}
          <Text style={[textRole(theme, "labelMd", "500"), { color: color.ink3 }]}>
            {t("home.onboarding.units.choice.region.optional")}
          </Text>
        </Text>
        <View style={styles.chips}>
          <RegionChip
            selected={choice.region === "device"}
            accessibilityLabel={t("home.onboarding.units.choice.region.deviceA11y", {
              region: regionName(deviceRegion),
            })}
            onPress={() => setRegion("device")}
          >
            {t("home.onboarding.units.choice.region.device")}
            <Small> · {regionName(deviceRegion)}</Small>
          </RegionChip>
          {(["uk", "us", "europe"] as const).map((region) => (
            <RegionChip
              key={region}
              selected={choice.region === region}
              accessibilityLabel={regionName(region)}
              onPress={() => setRegion(region)}
            >
              {regionName(region)}
            </RegionChip>
          ))}
          <RegionChip
            selected={false}
            disabled
            accessibilityLabel={t("home.onboarding.units.choice.region.asiaA11y")}
          >
            {t("home.onboarding.units.choice.region.asia")}
            <Small> {t("home.onboarding.units.choice.region.later")}</Small>
          </RegionChip>
        </View>
      </View>

      <View
        accessible
        accessibilityLabel={previewLabel}
        style={[styles.convert, { backgroundColor: color.illustrationCanvas }]}
      >
        <Text style={[textRole(theme, "labelMd"), styles.convertLabel, { color: color.canvasInk }]}>
          {t("home.onboarding.units.convertLabel")}
        </Text>
        {preview.map((row) => (
          <View key={row.key} style={styles.row}>
            <Text style={[textRole(theme, "bodyMd", "500"), { color: color.canvasInk }]}>
              {t(`home.onboarding.units.choice.preview.${row.key}`)}
            </Text>
            <Text
              style={[
                textRole(theme, "bodyMd", "700"),
                styles.tabular,
                { color: color.canvasHeading },
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </OnboardingFrame>
  );
}

/** A region chip (07-onboarding-units `.rchip`): 44pt, the lime-soft fill and heading ink when chosen. */
function RegionChip({
  selected,
  disabled = false,
  accessibilityLabel,
  onPress,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  onPress?: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? color.heading : color.outline,
          borderWidth: selected ? 1.5 : 1,
          borderStyle: disabled ? "dashed" : "solid",
          backgroundColor: selected ? color.actionSoft : color.surface,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          textRole(theme, "bodyMd", "600"),
          styles.chipText,
          { color: disabled ? color.ink3 : selected ? color.heading : color.ink },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

/** The chip's secondary part ("· Europe", "· later"): lighter and smaller, as drawn. */
function Small({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <Text style={[textRole(theme, "labelMd", "500"), { color: theme.color.ink2 }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  cards: { gap: tokens.spacing.unit * 3 },
  tabular: { fontVariant: ["tabular-nums"] },
  sampleValue: { fontSize: 24, lineHeight: 28 },
  region: { marginTop: 14 },
  regionLabel: { marginHorizontal: 2, marginBottom: tokens.spacing.unit * 2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    minHeight: tokens.touchTarget.minimum,
    paddingHorizontal: 11,
    borderRadius: tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: 14.5 },
  pressed: { opacity: 0.85 },
  convert: {
    marginTop: 10,
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
});
