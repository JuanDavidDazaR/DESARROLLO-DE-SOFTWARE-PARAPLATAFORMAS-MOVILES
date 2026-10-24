export default TaskDetail;
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";

interface TaskItem {
  id: string;
  tarea: string;
  completada: boolean;
}

function TaskDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskItem | undefined>(undefined);

  useEffect(() => {
    const recibida = (location.state as { task?: TaskItem } | null)?.task;
    if (recibida) setTask(recibida);
  }, [location.state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tasks" />
          </IonButtons>
          <IonTitle>Detalle de tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {task ? (
          <>
            <h2>{task.tarea}</h2>
            <p>Estado: {task.completada ? "Completada" : "Pendiente"}</p>
            <IonButton
              expand="block"
              onClick={() => navigate("/tabs/tasks/edit", { state: { task } })}
            >
              Editar
            </IonButton>
          </>
        ) : (
          <p>No se encontró la tarea.</p>
        )}
      </IonContent>
    </IonPage>
  );
}
