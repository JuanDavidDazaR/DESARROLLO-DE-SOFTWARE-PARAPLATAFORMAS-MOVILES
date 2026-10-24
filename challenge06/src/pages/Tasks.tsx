export default Tasks;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  useIonViewWillEnter,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { useRealTimeCollection } from "../hooks/useRealTimeCollection";
import { useNetwork } from "../hooks/useNetwork";
import Completed from "../components/Completed";
import Delete from "../components/Delete";
import LogoutButton from "../components/LogoutButton";

interface TaskItem {
  id: string;
  tarea: string;
  completada: boolean;
}

function Tasks() {
  const { results, error, getAll, update, remove } =
    useRealTimeCollection("tasks");
  const { isOnline } = useNetwork();
  const navigate = useNavigate();

  useIonViewWillEnter(() => {
    getAll();
  });

  const completar = async (id: string) => {
    await update(id, { completada: true });
    await getAll();
  };

  const eliminar = async (id: string) => {
    await remove(id);
    await getAll();
  };

  const irADetalle = (task: TaskItem): void => {
    navigate("/tabs/tasks/detail", { state: { task } });
  };

  const pendientes = results.filter((t: TaskItem) => !t.completada);
  const completadas = results.filter((t: TaskItem) => t.completada);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareas</IonTitle>
          <LogoutButton />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!isOnline && (
          <IonText color="warning">
            <p>Sin conexión. Las acciones están deshabilitadas.</p>
          </IonText>
        )}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          disabled={!isOnline}
          onClick={() => navigate("/tabs/tasks/add")}
        >
          Agregar tarea
        </IonButton>

        <h2>Pendientes</h2>
        <IonList>
          {pendientes.map((task: TaskItem) => (
            <IonItem key={task.id}>
              <IonLabel>{task.tarea}</IonLabel>
              <Completed
                onComplete={() => completar(task.id)}
                disabled={!isOnline}
              />
              <Delete onDelete={() => eliminar(task.id)} disabled={!isOnline} />
              <IonButton fill="clear" onClick={() => irADetalle(task)}>
                Detalle
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <h2>Completadas</h2>
        <IonList>
          {completadas.map((task: TaskItem) => (
            <IonItem key={task.id}>
              <IonLabel>{task.tarea}</IonLabel>
              <Delete onDelete={() => eliminar(task.id)} disabled={!isOnline} />
              <IonButton fill="clear" onClick={() => irADetalle(task)}>
                Detalle
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
