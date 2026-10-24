export default ProgressSummary;
import { IonCard, IonCardContent, IonProgressBar } from "@ionic/react";
import { useMissions } from "../context/MissionsContext";

function ProgressSummary() {
  const { progress, completedCount, total, percent } = useMissions();

  return (
    <IonCard>
      <IonCardContent>
        <h1 style={{ margin: 0 }}>{progress.points} puntos</h1>
        <p>
          {completedCount} / {total} misiones completadas ({percent}%)
        </p>
        <IonProgressBar value={percent / 100} />
      </IonCardContent>
    </IonCard>
  );
}
