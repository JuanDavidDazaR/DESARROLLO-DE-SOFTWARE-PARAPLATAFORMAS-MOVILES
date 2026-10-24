export default StillMission;
import { IonButton, IonText } from "@ionic/react";
import MissionCard from "./MissionCard";
import { useStillness } from "../hooks/useStillness";
import {
  useMissions,
  MISSIONS,
  STILL_SECONDS,
} from "../context/MissionsContext";

const mission = MISSIONS[2];

function StillMission() {
  const { isCompleted, completeMission } = useMissions();
  const completed = isCompleted(mission.id);
  const locked = !isCompleted(MISSIONS[1].id); // se habilita al completar la misión 2

  const { running, remaining, error, start, stop } = useStillness(
    STILL_SECONDS,
    () => completeMission(mission.id),
  );

  return (
    <MissionCard
      title={mission.title}
      description={mission.description}
      points={mission.points}
      completed={completed}
      locked={locked && !completed}
    >
      {running && (
        <>
          <h1 style={{ textAlign: "center", margin: "8px 0" }}>
            {remaining} s
          </h1>
          <p style={{ textAlign: "center" }}>
            No muevas el celular. Si te mueves, la cuenta se reinicia.
          </p>
        </>
      )}

      {!running ? (
        <IonButton expand="block" onClick={start} disabled={completed}>
          {completed ? "Misión completada" : "Iniciar permanencia"}
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
