import { StyleSheet, View } from "react-native";
import { tokens } from "../tokens";
import { PageTitle } from "./page-title";

/**
 * A tab's masthead: its page title (MA-25 — Pacifico, 31/46) on the screen margin.
 */
export function Masthead({ title }: { title: string }) {
  return (
    <View style={styles.bar}>
      <PageTitle>{title}</PageTitle>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: tokens.spacing.screenMargin,
    paddingTop: tokens.spacing.unit * 1.5,
    paddingBottom: tokens.spacing.unit * 2.5,
  },
});
