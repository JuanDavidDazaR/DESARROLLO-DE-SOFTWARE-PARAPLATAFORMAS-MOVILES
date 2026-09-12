export default ContactDetail;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/react";
import { useLocation } from "react-router-dom";

interface Contacto {
  nombre: string;
  telefono: string;
}

function ContactDetail() {
  const location = useLocation();
  const contact = (location.state as { contact: Contacto })?.contact;
  console.log("location.state:", location.state);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Detalle del contacto</IonTitle>
          <IonButton slot="end" routerLink="/home">
            Volver
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Nombre: {contact?.nombre}</h2>
        <p>Teléfono: {contact?.telefono}</p>
      </IonContent>
    </IonPage>
  );
}
