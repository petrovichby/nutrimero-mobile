import { RoutineEditorScreen } from "@nutrimero/feature-timers/screens";
import { router, useLocalSearchParams } from "expo-router";
import { timersRoutes } from "../../src/timers-root";

/** A new routine, or a saved one's stages (19, 19b, 19c). */
export default function RoutineEditorRoute() {
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  return (
    <RoutineEditorScreen
      routineId={routineId ?? null}
      onBack={() => router.back()}
      onSaved={() => router.back()}
      onStarted={(id) => router.replace(timersRoutes.item(id))}
    />
  );
}
