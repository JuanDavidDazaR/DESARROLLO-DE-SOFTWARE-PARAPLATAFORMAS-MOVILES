export default ContactEdit;
import { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useNetwork } from "../hooks/useNetwork";

interface Contacto {
  id: string;
  nombre: string;
  telefono: string;
}

function ContactEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isPending, error, update } = useCollection("contacts");
  const { isOnline } = useNetwork();

  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const recibido = (location.state as { contact?: Contacto } | null)?.contact;
    if (recibido) {
      setId(recibido.id);
      setNombre(recibido.nombre);
      setTelefono(recibido.telefono);
    }
  }, [location.state]);

  const guardar = async () => {
    if (!id || !nombre.trim()) return;
    const ok = await update(id, {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });
    if (ok) navigate("/tabs/contacts");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/contacts" />
          </IonButtons>
          <IonTitle>Editar contacto</IonTitle>
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
          {isPending ? <IonSpinner name="crescent" /> : "Guardar cambios"}
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
