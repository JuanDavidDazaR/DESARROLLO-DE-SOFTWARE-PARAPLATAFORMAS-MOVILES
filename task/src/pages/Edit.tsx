export default Edit;

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
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import type { TaskItem } from "../context/TasksContext";

function Edit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateTask } = useTasks();

  const [texto, setTexto] = useState<string>("");
  const [completada, setCompletada] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    const state = location.state as { task?: TaskItem; index?: number } | null;
    if (state?.task) {
      setTexto(state.task.tarea);
      setCompletada(state.task.completada);
      setIndex(state.index ?? -1);
    }
  }, [location.state]);

  const guardar = (): void => {
    if (index < 0 || texto.trim() === "") return;
    updateTask(index, { tarea: texto.trim(), completada });
    navigate("/task");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Tarea</IonTitle>
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

        <IonButton expand="block" onClick={guardar}>
          Guardar cambios
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          onClick={() => navigate("/task")}
        >
          Cancelar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
