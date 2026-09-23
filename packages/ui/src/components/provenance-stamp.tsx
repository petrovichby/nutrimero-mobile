import { StyleSheet, Text, type ViewStyle } from "react-native";
import { useTheme } from "../theme/provider";

/**
 * The on-image provenance stamp — the `provenance-stamp` role (DESIGN.md 0.5.0 MA-2, MA-14, G-2):
 * a rubber-stamp impression in capitals by role, tracked, single unrounded 1pt border, tilted +5°,
 * rust ink in Home Baker (navy in Pro) on a faint cream backdrop. Stardos Stencil 700 in Latin
 * locales, Yeseva One in be/uk. Scheme-fixed like the plate it sits on; place it at the image
 * corner, away from any control.
 *
 * The string comes from the catalog in sentence case; the capitals are the role's. Screen readers
 * get the sentence-case string, so it is read as words, not spelled.
 */
export function ProvenanceStamp({ text, style }: { text: string; style?: ViewStyle }) {
  const { color, stampFace, locale } = useTheme();
  return (
    <Text
      accessibilityLabel={text}
      style={[
        styles.stamp,
        {
          fontFamily: stampFace,
          color: color.stampInk,
          borderColor: color.stampLine,
          backgroundColor: color.stampBg,
        },
        style,
      ]}
    >
      {text.toLocaleUpperCase(locale)}
    </Text>
  );
}

const styles = StyleSheet.create({
  stamp: {
    alignSelf: "flex-start",
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 1.12, // 0.14em at 8pt
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 0,
    transform: [{ rotate: "5deg" }],
  },
});
