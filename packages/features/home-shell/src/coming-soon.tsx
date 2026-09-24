import type { Translator } from "@nutrimero/core";
import { EmptyState, Masthead, Screen } from "@nutrimero/ui";
import { Image, StyleSheet } from "react-native";
import { SHELL_ART } from "./art";

export type SoonTab = "builder" | "pantry" | "shopping";

/**
 * An unbuilt tab (03-builder-soon, 04-pantry-soon, 05-shopping-soon; DESIGN.md MA-24): its page
 * title, a stamped engraving, one sentence, and one quiet action back to Recipes.
 */
export function ComingSoon({
  t,
  tab,
  onBack,
}: {
  t: Translator;
  tab: SoonTab;
  onBack: () => void;
}) {
  return (
    <Screen>
      <Masthead title={t(`home.soon.${tab}.title`)} />
      <EmptyState
        art={
          <Image
            source={SHELL_ART[tab]}
            accessibilityLabel={t(`home.soon.${tab}.art`)}
            style={styles.art}
          />
        }
        artStamp={t("provenance.stamp.aiIllustration")}
        body={t(`home.soon.${tab}.body`)}
        action={{ label: t("home.soon.back"), onPress: onBack, variant: "secondary" }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ art: { width: "100%", height: "100%" } });
