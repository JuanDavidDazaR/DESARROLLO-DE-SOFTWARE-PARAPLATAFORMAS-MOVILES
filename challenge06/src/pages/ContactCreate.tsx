export default ContactCreate;
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
import { useCollection } from "../hooks/useCollection";
import { useNetwork } from "../hooks/useNetwork";

function ContactCreate() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const { isPending, error, add } = useCollection("contacts");
  const { isOnline } = useNetwork();
  const navigate = useNavigate();

  const guardar = async () => {
    if (!nombre.trim()) return;
    const ref = await add({ nombre: nombre.trim(), telefono: telefono.trim() });
    if (ref) {
      setNombre("");
      setTelefono("");
      navigate("/tabs/contacts");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/contacts" />
          </IonButtons>
          <IonTitle>Crear contacto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput
            value={nombre}
            onIonInput={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput
            value={telefono}
            onIonInput={(e) => setTelefono(e.detail.value ?? "")}
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
