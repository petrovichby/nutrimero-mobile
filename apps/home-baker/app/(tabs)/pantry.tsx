import { ComingSoon } from "@nutrimero/feature-home-shell";
import { router } from "expo-router";
import { useShell } from "../../src/shell";

export default function PantryTab() {
  const { t } = useShell();
  return <ComingSoon t={t} tab="pantry" onBack={() => router.navigate("/")} />;
}
