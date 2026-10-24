export default PhotoMission;
import { IonButton, IonSpinner, IonText } from "@ionic/react";
import MissionCard from "./MissionCard";
import { usePhotoMission } from "../hooks/usePhotoMission";
import { useMissions, MISSIONS } from "../context/MissionsContext";

const mission = MISSIONS[0];

function PhotoMission() {
  const { isCompleted, completeMission } = useMissions();
  const { preview, saving, error, takeAndSave } = usePhotoMission();
  const completed = isCompleted(mission.id);

  const handleTake = async () => {
    const saved = await takeAndSave();
    if (saved) await completeMission(mission.id);
  };

  return (
    <MissionCard
      title={mission.title}
      description={mission.description}
      points={mission.points}
      completed={completed}
    >
      {preview && (
        <img
          src={preview}
          alt="Evidencia"
          style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
        />
      )}
      <IonButton
        expand="block"
        onClick={handleTake}
        disabled={completed || saving}
      >
        {saving ? (
          <IonSpinner name="crescent" />
        ) : completed ? (
          "Foto guardada"
        ) : (
          "Tomar foto"
        )}
      </IonButton>
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}
    </MissionCard>
  );
}
