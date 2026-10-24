export default TaskEdit;
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRealTimeCollection } from "../hooks/useRealTimeCollection";
import { useNetwork } from "../hooks/useNetwork";

interface TaskItem {
  id: string;
  tarea: string;
  completada: boolean;
}

function TaskEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { update, error } = useRealTimeCollection("tasks");
  const { isOnline } = useNetwork();

  const [id, setId] = useState("");
  const [texto, setTexto] = useState("");
  const [completada, setCompletada] = useState(false);

  useEffect(() => {
    const recibida = (location.state as { task?: TaskItem } | null)?.task;
    if (recibida) {
      setId(recibida.id);
      setTexto(recibida.tarea);
      setCompletada(recibida.completada);
    }
  }, [location.state]);

  const guardar = async () => {
    if (!id || !texto.trim()) return;
    const ok = await update(id, { tarea: texto.trim(), completada });
    if (ok) navigate("/tabs/tasks");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tasks" />
          </IonButtons>
          <IonTitle>Editar tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            placeholder="Tarea"
            value={texto}
            onIonInput={(e) => setTexto(e.detail.value ?? "")}
          />
        </IonItem>

        <IonSegment
          value={completada ? "completada" : "pendiente"}
          onIonChange={(e) => setCompletada(e.detail.value === "completada")}
        >
          <IonSegmentButton value="pendiente">
            <IonLabel>Pendiente</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="completada">
            <IonLabel>Completada</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={guardar}
          disabled={!isOnline}
        >
          Guardar cambios
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
}
