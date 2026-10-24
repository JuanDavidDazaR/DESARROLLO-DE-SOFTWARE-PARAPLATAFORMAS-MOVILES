export default ContactDetail;
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNetwork } from "../hooks/useNetwork";

interface Contacto {
  id: string;
  nombre: string;
  telefono: string;
}

function ContactDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [contact, setContact] = useState<Contacto | undefined>(undefined);

  useEffect(() => {
    const recibido = (location.state as { contact?: Contacto } | null)?.contact;
    if (recibido) setContact(recibido);
  }, [location.state]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/contacts" />
          </IonButtons>
          <IonTitle>Detalle del contacto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {contact ? (
          <>
            <h2>Nombre: {contact.nombre}</h2>
            <p>Teléfono: {contact.telefono}</p>
            <IonButton
              expand="block"
              disabled={!isOnline}
              onClick={() =>
                navigate("/tabs/contacts/edit", { state: { contact } })
              }
            >
              Editar
            </IonButton>
          </>
        ) : (
          <p>No se encontró el contacto.</p>
        )}
      </IonContent>
    </IonPage>
  );
}
