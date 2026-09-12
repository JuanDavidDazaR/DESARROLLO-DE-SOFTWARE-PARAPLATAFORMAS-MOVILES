export default ContactCreate;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function ContactCreate() {
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const navigate = useNavigate();

  const guardarContacto = (): void => {
    navigate("/home", {
      state: { nuevoContacto: { nombre, telefono } },
      replace: true,
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear contacto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            placeholder="Nombre"
            value={nombre}
            onIonInput={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            placeholder="Teléfono"
            value={telefono}
            onIonInput={(e) => setTelefono(e.detail.value ?? "")}
          />
        </IonItem>
        <IonButton expand="block" onClick={guardarContacto}>
          Guardar
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
