import { ComingSoon } from "@nutrimero/feature-home-shell";
import { router } from "expo-router";
import { useShell } from "../../src/shell";

export default function ShoppingTab() {
  const { t } = useShell();
  return <ComingSoon t={t} tab="shopping" onBack={() => router.navigate("/")} />;
}
