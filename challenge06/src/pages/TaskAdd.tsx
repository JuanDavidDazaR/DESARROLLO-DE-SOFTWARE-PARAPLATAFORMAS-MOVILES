export default TaskAdd;
import { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { useRealTimeCollection } from "../hooks/useRealTimeCollection";
import { useNetwork } from "../hooks/useNetwork";

function TaskAdd() {
  const [tarea, setTarea] = useState("");
  const { isPending, error, add } = useRealTimeCollection("tasks");
  const { isOnline } = useNetwork();
  const navigate = useNavigate();

  const guardar = async () => {
    if (!tarea.trim()) return;
    const ref = await add({ tarea: tarea.trim(), completada: false });
    if (ref) {
      setTarea("");
      navigate("/tabs/tasks");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tasks" />
          </IonButtons>
          <IonTitle>Agregar tarea</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Tarea</IonLabel>
          <IonInput
            value={tarea}
            onIonInput={(e) => setTarea(e.detail.value ?? "")}
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={guardar}
          disabled={isPending || !isOnline}
        >
          {isPending ? <IonSpinner name="crescent" /> : "Guardar"}
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
