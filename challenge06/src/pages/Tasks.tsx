export default Tasks;
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonSpinner,
  IonText,
  IonCheckbox,
} from "@ionic/react";
import { useRealTimeCollection } from "../hooks/useRealTimeCollection";
import Delete from "../components/Delete";
import { useNetwork } from "../hooks/useNetwork";

function Tasks() {
  const { isOnline } = useNetwork();
  const [tarea, setTarea] = useState("");
  const { results, isPending, error, getAll, add, update, remove } =
    useRealTimeCollection("tasks");

  useEffect(() => {
    getAll();
  }, []);

  const handleAgregar = async () => {
    if (!tarea.trim()) return;
    await add({ tarea, completada: false });
    setTarea("");
    await getAll();
  };

  const handleCompletar = async (id: string, completada: boolean) => {
    await update(id, { completada: !completada });
    await getAll();
  };

  const handleEliminar = async (id: string) => {
    await remove(id);
    await getAll();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      {!isOnline && (
        <IonText color="warning">
          <p>Sin conexión. Las acciones están deshabilitadas.</p>
        </IonText>
      )}
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Tarea</IonLabel>
          <IonInput
            value={tarea}
            onIonChange={(e) => setTarea(e.detail.value ?? "")}
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleAgregar}
          disabled={isPending || !isOnline}
        >
          {isPending ? <IonSpinner name="crescent" /> : "Agregar"}
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonList className="ion-margin-top">
          {results.map((task) => (
            <IonItem key={task.id}>
              <IonCheckbox
                slot="start"
                checked={task.completada}
                onIonChange={() => handleCompletar(task.id, task.completada)}
                disabled={!isOnline}
              />
              <IonLabel>{task.tarea}</IonLabel>
              <Delete
                onDelete={() => handleEliminar(task.id)}
                disabled={!isOnline}
              />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
