import { TimerChip } from "@nutrimero/feature-timers/screens";
import { type FilledGlyphName, TabBar } from "@nutrimero/ui";
import { Tabs } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useShell } from "../../src/shell";

/** The five destinations, in the corpus order (09-more's tab bar); `index` is Recipes. */
const TABS = [
  { name: "index", label: "recipes", glyph: "book" },
  { name: "builder", label: "builder", glyph: "builder" },
  { name: "shopping", label: "shopping", glyph: "basket" },
  { name: "pantry", label: "pantry", glyph: "pantry" },
  { name: "more", label: "more", glyph: "dots" },
] as const satisfies readonly { name: string; label: string; glyph: FilledGlyphName }[];

/**
 * The tabs, and 005's timer chip floating bottom-left just above the tab bar on every tab (MA-27).
 * The chip's layer is measured from the bar, and passes touches through everywhere but the chip.
 */
export default function TabsLayout() {
  const { t, openTimers } = useShell();
  const [barHeight, setBarHeight] = useState(0);
  const items = TABS.map((tab) => ({
    key: tab.name,
    label: t(`home.tabs.${tab.label}`),
    glyph: tab.glyph,
  }));
  return (
    <View style={styles.fill}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state, navigation }) => (
          <View onLayout={(event) => setBarHeight(event.nativeEvent.layout.height)}>
            <TabBar
              items={items}
              selectedKey={state.routes[state.index]?.name ?? "index"}
              onSelect={(name) => navigation.navigate(name)}
            />
          </View>
        )}
      >
        {TABS.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} />
        ))}
      </Tabs>
      <View pointerEvents="box-none" style={[styles.chipLayer, { bottom: barHeight }]}>
        <TimerChip onPress={openTimers} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  chipLayer: { position: "absolute", left: 0, right: 0, height: 96 },
});
