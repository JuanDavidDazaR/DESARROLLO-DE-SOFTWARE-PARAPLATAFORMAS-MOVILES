export default Add;

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
} from "@ionic/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

function Add() {
  const [texto, setTexto] = useState<string>("");
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const guardar = (): void => {
    if (texto.trim() === "") return;
    addTask({ tarea: texto.trim(), completada: false });
    navigate("/task");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Agregar Tarea</IonTitle>
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
        <IonButton expand="block" onClick={guardar}>
          Guardar
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
