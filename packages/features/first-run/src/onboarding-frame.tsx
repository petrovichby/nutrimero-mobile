import type { Translator } from "@nutrimero/core";
import { Button, PageTitle, Screen, textRole, tokens, useTheme } from "@nutrimero/ui";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export const ONBOARDING_STEPS_TOTAL = 3;

/**
 * The shared onboarding frame (07-onboarding-* `.ob-top` / `.ob-body` / `.dock`): step dots and
 * Skip on top, the step's content scrolling in between, one primary action docked in the bottom
 * half (DESIGN.md *Layout*: thumb-first). A full-screen flow — no tab bar — that never traps:
 * Skip is always there and the system back works (the router's).
 */
export function OnboardingFrame({
  t,
  step,
  primaryLabel,
  onPrimary,
  onSkip,
  children,
}: {
  t: Translator;
  step: 1 | 2 | 3;
  primaryLabel: string;
  onPrimary: () => void;
  onSkip: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  const { color } = theme;
  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <View style={styles.top}>
        <View
          accessible
          accessibilityRole="text"
          accessibilityLabel={t("home.onboarding.progress", {
            step,
            total: ONBOARDING_STEPS_TOTAL,
          })}
          style={styles.dots}
        >
          {Array.from({ length: ONBOARDING_STEPS_TOTAL }, (_, index) => index + 1).map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                dot === step
                  ? { width: 20, backgroundColor: color.structure }
                  : { backgroundColor: color.surface2 },
              ]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("home.onboarding.skip")}
          onPress={onSkip}
          style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
        >
          <Text style={[textRole(theme, "bodyMd", "600"), { color: color.ink2 }]}>
            {t("home.onboarding.skip")}
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
      <View style={[styles.dock, { backgroundColor: color.surface }]}>
        <Button label={primaryLabel} onPress={onPrimary} />
      </View>
    </Screen>
  );
}

/** The step's page title (MA-25: Pacifico — onboarding steps are pages, not instructions) and its one-line explanation (body-md in ink-2). */
export function StepHeading({ title, body }: { title: string; body: string }) {
  const theme = useTheme();
  return (
    <View style={styles.heading}>
      <PageTitle>{title}</PageTitle>
      <Text style={[textRole(theme, "bodyMd"), styles.lede, { color: theme.color.ink2 }]}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    minHeight: tokens.touchTarget.minimum,
    paddingLeft: tokens.spacing.screenMargin,
    paddingRight: tokens.spacing.unit * 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: tokens.radius.full },
  skip: {
    minHeight: tokens.touchTarget.minimum,
    paddingHorizontal: tokens.spacing.unit * 3,
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: tokens.spacing.unit * 3 },
  heading: { marginBottom: 18 },
  lede: { marginTop: 6 },
  dock: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingTop: 10,
    paddingBottom: tokens.spacing.unit * 2,
  },
});
