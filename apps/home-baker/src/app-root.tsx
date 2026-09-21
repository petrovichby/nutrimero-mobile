import { messages } from "@nutrimero/core";
import { tokens } from "@nutrimero/ui";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Bootstrap placeholder — replaced by the first specced feature. Locale resolution is
// hardwired to "en" until the i18n runtime is chosen (Constitution IX gates the catalogs,
// not the runtime).
const t = messages.en;

export function AppRoot() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.name}>
        {t.app.homeBaker.name}
      </Text>
      <Text style={styles.tagline}>{t.app.homeBaker.tagline}</Text>
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
    fontWeight: tokens.type.headlineLg.fontWeight,
  },
  tagline: {
    color: tokens.color.onSurface,
    fontSize: tokens.type.bodyLg.fontSize,
    lineHeight: tokens.type.bodyLg.lineHeight,
    marginTop: tokens.spacing.unit * 2,
  },
});
