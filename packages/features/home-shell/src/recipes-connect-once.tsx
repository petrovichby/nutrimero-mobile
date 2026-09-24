import type { Translator } from "@nutrimero/core";
import { EmptyState, Masthead, Screen } from "@nutrimero/ui";
import { Image, StyleSheet } from "react-native";
import { SHELL_ART } from "./art";

/**
 * The Recipes tab before any catalog exists (01-recipes-connect-once; 001 FR-019; DESIGN.md MA-24):
 * the masthead, the stamped sourdough plate and one sentence — and NO action. "Try again" appears
 * only after a real failure or a timeout, and 001 makes no download to fail (003 wires it).
 */
export function RecipesConnectOnce({ t }: { t: Translator }) {
  return (
    <Screen>
      <Masthead title={t("home.recipes.title")} />
      <EmptyState
        art={
          <Image
            source={SHELL_ART.connectOnce}
            accessibilityLabel={t("home.cover.plateDescription")}
            style={styles.art}
          />
        }
        artStamp={t("provenance.stamp.aiIllustration")}
        body={t("home.recipes.connectOnce")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ art: { width: "100%", height: "100%" } });
