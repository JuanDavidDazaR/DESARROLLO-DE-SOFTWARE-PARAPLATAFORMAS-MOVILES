export default MovementMission;
import { IonButton, IonProgressBar, IonText } from "@ionic/react";
import MissionCard from "./MissionCard";
import { useMovementMission } from "../hooks/useMovementMission";
import {
  useMissions,
  MISSIONS,
  MOVE_DISTANCE_METERS,
} from "../context/MissionsContext";

const mission = MISSIONS[1];

function MovementMission() {
  const { isCompleted, completeMission } = useMissions();
  const completed = isCompleted(mission.id);

  const { tracking, distance, error, start, stop } = useMovementMission(
    MOVE_DISTANCE_METERS,
    () => completeMission(mission.id),
  );

  return (
    <MissionCard
      title={mission.title}
      description={mission.description}
      points={mission.points}
      completed={completed}
    >
      {tracking && (
        <>
          <p>
            Distancia: {distance.toFixed(1)} m / {MOVE_DISTANCE_METERS} m
          </p>
          <IonProgressBar
            value={Math.min(distance / MOVE_DISTANCE_METERS, 1)}
          />
        </>
      )}

      {!tracking ? (
        <IonButton expand="block" onClick={start} disabled={completed}>
          {completed ? "Recorrido completado" : "Iniciar"}
        </IonButton>
      ) : (
        <IonButton expand="block" color="medium" onClick={stop}>
          Cancelar
        </IonButton>
      )}

      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}
    </MissionCard>
  );
}
