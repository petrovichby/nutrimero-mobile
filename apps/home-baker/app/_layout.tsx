import {
  createTranslator,
  type Locale,
  pluralRuleMismatches,
  resolveLocale,
} from "@nutrimero/core";
import { Cover, FirstRunFlow } from "@nutrimero/feature-first-run";
import { ThemeProvider } from "@nutrimero/ui";
import { fontAssets } from "@nutrimero/ui/native";
import { useFonts } from "expo-font";
import { getLocales } from "expo-localization";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { devicePreferences, homeStore, ready } from "../src/boot";
import { type Shell, ShellProvider } from "../src/shell";

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

const deviceLanguageTags = () => getLocales().map((tag) => tag.languageTag);

/**
 * The root: boot, faces, locale, and the first-run gate. Until first run is complete the tabs do
 * not exist; completing it mounts them on Recipes, and Clear my data unmounts them again.
 */
export default function RootLayout() {
  const [booted, setBooted] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  // The locale is state, so the in-app choice (FR-026, IX 1.2.0) re-renders in place — no restart.
  // It starts from the system and takes the stored choice once boot has run the reinstall clear.
  const [locale, setLocale] = useState<Locale>(() => resolveLocale(null, deviceLanguageTags()));
  const t = useMemo(() => createTranslator(locale), [locale]);
  // A font that fails to load must not strand the user on the splash; text then falls back,
  // which the dev build makes visible rather than hiding.
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    // A store failure must not strand the user on the splash: reads fall back to their defaults.
    ready
      .then(() => devicePreferences.uiLocale())
      .then((choice) => setLocale(resolveLocale(choice, deviceLanguageTags())))
      .then(() => homeStore.onboarding())
      .then((state) => setOnboarded(state.completed))
      .catch(() => setOnboarded(false))
      .finally(() => setBooted(true));
  }, []);

  const chooseLocale = useCallback((choice: Locale | null) => {
    setLocale(resolveLocale(choice, deviceLanguageTags()));
    // The choice shows at once; if storing it fails it lasts only until the next launch.
    devicePreferences.setUiLocale(choice).catch(() => undefined);
  }, []);

  const clearData = useCallback(async () => {
    // Home's keys only — the language is a device preference and stays (FR-027).
    await homeStore.wipeAll();
    setOnboarded(false);
  }, []);

  const shell = useMemo<Shell>(
    () => ({
      t,
      locale,
      deviceLocale: resolveLocale(null, deviceLanguageTags()),
      chooseLocale,
      clearData,
    }),
    [t, locale, chooseLocale, clearData],
  );

  // The native splash (the cream field) holds until the faces load; the composed cover then shows
  // only while boot is still settling — never for a fixed duration (001 FR-001/FR-002).
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider app="home" locale={locale}>
        <ShellProvider value={shell}>
          <View style={styles.fill} onLayout={() => SplashScreen.hideAsync()}>
            {!booted || onboarded === null ? (
              <Cover t={t} />
            ) : onboarded ? (
              <Stack screenOptions={{ headerShown: false }} />
            ) : (
              <FirstRunFlow
                t={t}
                locale={locale}
                store={homeStore}
                onComplete={() => setOnboarded(true)}
              />
            )}
          </View>
          <StatusBar style="auto" />
        </ShellProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
