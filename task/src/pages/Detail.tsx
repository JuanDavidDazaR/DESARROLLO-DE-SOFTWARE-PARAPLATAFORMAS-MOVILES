export default Detail;

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface TaskItem {
  tarea: string;
  completada: boolean;
}

function Detail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState<TaskItem | null>(null);
  const [index, setIndex] = useState<number>(-1);

  useEffect(() => {
    const state = location.state as { task?: TaskItem; index?: number } | null;
    if (state?.task) {
      setTask(state.task);
      setIndex(state.index ?? -1);
    }
  }, [location.state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle de Tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {task ? (
          <>
            <h2>{task.tarea}</h2>
            <p>Estado: {task.completada ? "Completada" : "Pendiente"}</p>
            <IonButton
              expand="block"
              onClick={() => navigate("/edit", { state: { task, index } })}
            >
              Editar
            </IonButton>
          </>
        ) : (
          <p>No se encontró la tarea.</p>
        )}
        <IonButton
          expand="block"
          fill="outline"
          onClick={() => navigate("/task")}
        >
          Volver a la lista de tareas
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
