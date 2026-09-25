import { SavedRoutinesScreen } from "@nutrimero/feature-timers/screens";
import { router } from "expo-router";
import { timersRoutes } from "../../src/timers-root";

/** Saved routines (21). */
export default function SavedRoutinesRoute() {
  return (
    <SavedRoutinesScreen
      onBack={() => router.back()}
      onStarted={(id) => router.push(timersRoutes.item(id))}
      onEdit={(routineId) => router.push(timersRoutes.editRoutine(routineId))}
      onNew={() => router.push(timersRoutes.newRoutine)}
    />
  );
}
