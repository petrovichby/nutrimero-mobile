import { type FilledGlyphName, TabBar } from "@nutrimero/ui";
import { Tabs } from "expo-router";
import { useShell } from "../../src/shell";

/** The five destinations, in the corpus order (09-more's tab bar); `index` is Recipes. */
const TABS = [
  { name: "index", label: "recipes", glyph: "book" },
  { name: "builder", label: "builder", glyph: "builder" },
  { name: "shopping", label: "shopping", glyph: "basket" },
  { name: "pantry", label: "pantry", glyph: "pantry" },
  { name: "more", label: "more", glyph: "dots" },
] as const satisfies readonly { name: string; label: string; glyph: FilledGlyphName }[];

export default function TabsLayout() {
  const { t } = useShell();
  const items = TABS.map((tab) => ({
    key: tab.name,
    label: t(`home.tabs.${tab.label}`),
    glyph: tab.glyph,
  }));
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <TabBar
          items={items}
          selectedKey={state.routes[state.index]?.name ?? "index"}
          onSelect={(name) => navigation.navigate(name)}
        />
      )}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}
