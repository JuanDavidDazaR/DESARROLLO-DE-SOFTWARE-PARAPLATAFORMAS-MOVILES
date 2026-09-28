export default Task;
import { useTasks } from "../context/TasksContext";
import type { TaskItem } from "../context/TasksContext";
import { useAuthContext } from "../context/AuthContext";
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
} from "@ionic/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Completed from "../components/Completed";
import Delete from "../components/Delete";

function Task() {
  const { tasks: myTasks, deleteTask, updateTask } = useTasks();
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  const completarTask = (index: number): void => {
    updateTask(index, { ...myTasks[index], completada: true });
  };

  const irADetalle = (task: TaskItem): void => {
    navigate("/detail", { state: { task, index: myTasks.indexOf(task) } });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading]);

  const handleLogout = async (): Promise<void> => {
    await logout();
  };
  const pendientes = myTasks.filter((task) => !task.completada);
  const completadas = myTasks.filter((task) => task.completada);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareas</IonTitle>
          <IonButton slot="end" onClick={handleLogout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2 className="ion-padding-start">Pendientes</h2>
        <IonList className="task-list">
          {pendientes.map((task) => (
            <IonItem className="task-item" key={myTasks.indexOf(task)}>
              <IonLabel>{task.tarea}</IonLabel>
              <Completed
                onComplete={() => completarTask(myTasks.indexOf(task))}
              />
              <Delete onDelete={() => deleteTask(myTasks.indexOf(task))} />
              <IonButton onClick={() => irADetalle(task)}>Detalle</IonButton>
            </IonItem>
          ))}
        </IonList>

        <h2 className="ion-padding-start">Completadas</h2>
        <IonList className="task-list">
          {completadas.map((task) => (
            <IonItem className="task-item" key={myTasks.indexOf(task)}>
              <IonLabel>{task.tarea}</IonLabel>
              <Delete onDelete={() => deleteTask(myTasks.indexOf(task))} />
              <IonButton onClick={() => irADetalle(task)}>Detalle</IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="block" onClick={() => navigate("/add")}>
          Agregar tarea
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
