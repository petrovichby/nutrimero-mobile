import { RecipesConnectOnce } from "@nutrimero/feature-home-shell";
import { useShell } from "../../src/shell";

/** Recipes. Downloads are not wired yet, so the connect-once state rests without a retry (MA-24). */
export default function RecipesTab() {
  const { t } = useShell();
  return <RecipesConnectOnce t={t} />;
}
