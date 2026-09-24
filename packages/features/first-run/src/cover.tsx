/// <reference path="./assets.d.ts" />
import type { Translator } from "@nutrimero/core";
import { ProvenanceStamp, tokens, uiFace, useTheme } from "@nutrimero/ui";
import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import plate from "../assets/plate-rustic-sourdough.jpg";
import { NUTRIMERO_LOGO_SVG } from "./nutrimero-logo";

const cover = tokens.home.fixed.cover;
const LOGO_WIDTH = 100;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 508.93) / 2067.35); // the artwork's own viewBox ratio

/**
 * The cover (00-splash; DESIGN.md MA-5, owner-approved 2026-09-23): a rust structure band with the
 * typeset `nutrimero` (capitals by the `splash-wordmark` role) above the Pacifico title; the cream
 * field with the captioned plate in a rust double frame, stamped; one 2pt printer's rule and the
 * loading dots in the action gold (the only moving element); the real logo, unrecoloured, 100pt
 * wide, as the imprint. Scheme-fixed in fact: every ink is pinned, never a scheme variable.
 */
export function Cover({ t }: { t: Translator }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const caps = (text: string) => text.toLocaleUpperCase(theme.locale);
  return (
    <View style={[styles.root, { backgroundColor: cover.field }]}>
      <View style={[styles.band, { paddingTop: insets.top + tokens.spacing.sectionGap }]}>
        <Text
          accessibilityLabel={t("home.cover.wordmark")}
          style={[styles.wordmark, { fontFamily: uiFace(theme.locale, "800") }]}
        >
          {caps(t("home.cover.wordmark"))}
        </Text>
        <Text accessibilityRole="header" style={[styles.script, { fontFamily: theme.displayFace }]}>
          {t("home.cover.title")}
        </Text>
        <Fleuron />
      </View>
      <View style={styles.field}>
        <View style={styles.plateOuter}>
          <View style={styles.plateInner}>
            <Image
              source={plate}
              accessibilityLabel={t("home.cover.plateDescription")}
              style={styles.plateImage}
            />
            <ProvenanceStamp text={t("provenance.stamp.aiIllustration")} style={styles.stamp} />
          </View>
        </View>
        <Text
          accessibilityLabel={t("home.cover.plateCaption")}
          style={[styles.caption, { fontFamily: uiFace(theme.locale, "700") }]}
        >
          {caps(t("home.cover.plateCaption"))}
        </Text>
        <Text
          accessibilityLabel={t("home.cover.tagline")}
          style={[styles.tagline, { fontFamily: uiFace(theme.locale, "700") }]}
        >
          {caps(t("home.cover.tagline"))}
        </Text>
      </View>
      <View style={[styles.rule, { backgroundColor: tokens.home.fixed.action }]} />
      <View style={[styles.foot, { paddingBottom: insets.bottom + 10 }]}>
        <LoadingDots label={t("home.cover.loading")} />
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={t("home.cover.logoDescription")}
        >
          <SvgXml xml={NUTRIMERO_LOGO_SVG} width={LOGO_WIDTH} height={LOGO_HEIGHT} />
        </View>
      </View>
    </View>
  );
}

/** The printer's fleuron (rule–diamond–rule), ceremonial moments only. */
function Fleuron() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.fleuron}
    >
      <View style={styles.fleuronRule} />
      <View style={styles.diamond} />
      <View style={styles.fleuronRule} />
    </View>
  );
}

/**
 * The indeterminate loader (NOTES.md): three dots filling in sequence at a 400ms cadence, the
 * only moving element; announced once as "Loading". Reduce Motion ⇒ one dot, still.
 */
function LoadingDots({ label }: { label: string }) {
  const step = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (reduced) return;
      loop = Animated.loop(
        Animated.sequence(
          [0, 1, 2].map((to) =>
            Animated.timing(step, { toValue: to, duration: 400, useNativeDriver: true }),
          ),
        ),
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [step]);
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      style={styles.dots}
    >
      {[0, 1, 2].map((dot) => (
        <View key={dot} style={styles.dot}>
          <Animated.View
            style={[
              styles.dotFill,
              {
                opacity: step.interpolate({
                  inputRange: [dot - 0.5, dot, dot + 0.5],
                  outputRange: [0, 1, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const gold = tokens.home.fixed.action;
const styles = StyleSheet.create({
  root: { flex: 1 },
  band: {
    backgroundColor: cover.band,
    minHeight: "34%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.spacing.sectionGap,
    paddingBottom: 26,
  },
  wordmark: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 5.3, // 0.38em at 14pt
    color: cover.bandWordmark,
  },
  script: { fontSize: 56, lineHeight: 86, marginTop: 2, color: cover.bandInk },
  fleuron: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  fleuronRule: { width: 36, height: 1, backgroundColor: cover.bandFleuron },
  diamond: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: cover.bandFleuron,
    transform: [{ rotate: "45deg" }],
  },
  field: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 28,
    paddingHorizontal: tokens.spacing.sectionGap,
    paddingBottom: 12,
  },
  // The printed-plate double rule (border + outline offset 4pt), rust — nothing navy (MA-5).
  plateOuter: { borderWidth: 1, borderColor: tokens.home.fixed.coverFrame, padding: 4 },
  plateInner: {
    width: 296,
    maxWidth: "100%",
    aspectRatio: 4 / 3,
    borderWidth: 1,
    borderColor: tokens.home.fixed.coverFrame,
    overflow: "hidden",
  },
  plateImage: { width: "100%", height: "100%" },
  stamp: { position: "absolute", right: 8, bottom: 8 },
  caption: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2,
    color: cover.caption,
    textAlign: "center",
  },
  tagline: {
    marginTop: 20,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 2.9,
    color: cover.tagline,
    textAlign: "center",
  },
  rule: { height: 2 },
  foot: { alignItems: "center", gap: 14, paddingTop: 26 },
  dots: { flexDirection: "row", gap: 10 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: gold,
    overflow: "hidden",
  },
  dotFill: { flex: 1, backgroundColor: gold },
});
