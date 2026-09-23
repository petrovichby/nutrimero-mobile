import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "../theme/provider";
import { tokens } from "../tokens";
import { ProvenanceStamp } from "./provenance-stamp";

/**
 * An illustration plate (DESIGN.md *Vintage voice*, MA-4): the scheme-fixed cream canvas with the
 * printed-plate hairline — the structure ink at 30% (Home) / 28% (Pro), 5pt inset, square corners.
 * Every AI illustration is stamped (constitution V; MA-17), so the stamp text is required whenever
 * the plate holds an AI illustration; pass `stamp={null}` only for a real photo.
 */
export function Plate({
  children,
  stamp,
  style,
}: {
  children: ReactNode;
  stamp: string | null;
  style?: ViewStyle;
}) {
  const { color } = useTheme();
  return (
    <View style={[styles.plate, { backgroundColor: color.illustrationCanvas }, style]}>
      {children}
      <View pointerEvents="none" style={[styles.frame, { borderColor: color.plateFrame }]} />
      {stamp !== null && <ProvenanceStamp text={stamp} style={styles.stamp} />}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: { borderRadius: tokens.radius.xl, overflow: "hidden", position: "relative" },
  frame: {
    position: "absolute",
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
    borderWidth: 1,
    borderRadius: 0,
  },
  stamp: { position: "absolute", right: 8, top: 8 },
});
