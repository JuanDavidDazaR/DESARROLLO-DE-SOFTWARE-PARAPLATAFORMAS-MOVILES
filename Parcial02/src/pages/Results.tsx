export default Results;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { checkmarkCircle, ellipseOutline } from "ionicons/icons";
import LogoutButton from "../components/LogoutButton";
import { useMissions, MISSIONS } from "../context/MissionsContext";

function Results() {
  const {
    progress,
    completedCount,
    total,
    percent,
    isCompleted,
    resetProgress,
  } = useMissions();

  const estado =
    completedCount === total
      ? "Completado"
      : completedCount === 0
        ? "Sin iniciar"
        : "En progreso";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resultados</IonTitle>
          <LogoutButton />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Puntos totales</IonCardSubtitle>
            <IonCardTitle>{progress.points}</IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonList>
          <IonItem>
            <IonLabel>Misiones completadas</IonLabel>
            <IonNote slot="end">
              {completedCount} / {total}
            </IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Progreso</IonLabel>
            <IonNote slot="end">{percent}%</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Estado general</IonLabel>
            <IonNote slot="end">{estado}</IonNote>
          </IonItem>

          {MISSIONS.map((m) => (
            <IonItem key={m.id}>
              <IonIcon
                slot="start"
                icon={isCompleted(m.id) ? checkmarkCircle : ellipseOutline}
                color={isCompleted(m.id) ? "success" : "medium"}
              />
              <IonLabel>{m.title}</IonLabel>
              <IonNote slot="end">{m.points} pts</IonNote>
            </IonItem>
          ))}
        </IonList>

        <div className="ion-padding">
          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={resetProgress}
          >
            Reiniciar progreso (para pruebas)
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
