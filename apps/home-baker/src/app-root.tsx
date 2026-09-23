import { createTranslator, pluralRuleMismatches, resolveLocale } from "@nutrimero/core";
import { tokens, uiFace } from "@nutrimero/ui";
import { fontAssets } from "@nutrimero/ui/native";
import { useFonts } from "expo-font";
import { getLocales } from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ready } from "./boot";

// Keep the native splash up until boot (the reinstall-orphan clear and session restore) has
// settled, the bundled faces are loaded, and the root view has laid out — so no text ever paints
// in a platform font (DESIGN.md: no platform-default fallbacks).
SplashScreen.preventAutoHideAsync();
// DESIGN.md motion rules: 150–250 ms; a fade is not a movement, so it is acceptable
// under reduced motion — no extra handling needed.
SplashScreen.setOptions({ fade: true, duration: 200 });

// Constitution IX: Hermes' Intl.PluralRules must give every UI locale its CLDR categories.
// Vitest checks Node's ICU; this checks the device's, once per dev launch (001 FR-022).
if (__DEV__) {
  const mismatches = pluralRuleMismatches();
  if (mismatches.length > 0) {
    throw new Error(`Intl.PluralRules is missing plural categories:\n${mismatches.join("\n")}`);
  }
}

// Bootstrap placeholder — replaced by 001's first-run screens (phase 5). The locale is read
// once at launch; reacting to a system-language change while running is phase 5's to decide.
const locale = resolveLocale(getLocales().map((tag) => tag.languageTag));
const t = createTranslator(locale);

export function AppRoot() {
  const [booted, setBooted] = useState(false);
  // A font that fails to load must not strand the user on the splash; text then falls back,
  // which the dev build makes visible rather than hiding.
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    // A store failure must not strand the user on the splash: reads fall back to their defaults,
    // and first run surfaces the "could not be saved" state (001 edge cases) in phase 5.
    ready.catch(() => undefined).finally(() => setBooted(true));
  }, []);

  if (!booted || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <View onLayout={() => SplashScreen.hideAsync()} style={styles.container}>
      <Text accessibilityRole="header" style={[styles.name, { fontFamily: uiFace(locale, "700") }]}>
        {t("app.homeBaker.name")}
      </Text>
      <Text style={[styles.tagline, { fontFamily: uiFace(locale) }]}>
        {t("app.homeBaker.tagline")}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.illustrationCanvas,
    alignItems: "center",
    justifyContent: "center",
    padding: tokens.spacing.screenMargin,
  },
  name: {
    color: tokens.color.primary,
    fontSize: tokens.type.headlineLg.fontSize,
    lineHeight: tokens.type.headlineLg.lineHeight,
    // No fontWeight: the registered face (uiFace(locale, "700")) is the weight.
  },
  tagline: {
    color: tokens.color.onSurface,
    fontSize: tokens.type.bodyLg.fontSize,
    lineHeight: tokens.type.bodyLg.lineHeight,
    marginTop: tokens.spacing.unit * 2,
  },
});
