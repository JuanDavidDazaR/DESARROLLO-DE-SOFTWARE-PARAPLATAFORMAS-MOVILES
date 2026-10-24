export default Contacts;
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
import { useCollection } from "../hooks/useCollection";
import { useNetwork } from "../hooks/useNetwork";
import Delete from "../components/Delete";
import LogoutButton from "../components/LogoutButton";
import "./Contacts.css";

interface Contacto {
  id: string;
  nombre: string;
  telefono: string;
}

function Contacts() {
  const { results, error, getAll, remove } = useCollection("contacts");
  const { isOnline } = useNetwork();
  const navigate = useNavigate();

  useIonViewWillEnter(() => {
    getAll();
  });

  const handleEliminar = async (id: string) => {
    await remove(id);
    await getAll();
  };

  const irADetalle = (contact: Contacto): void => {
    navigate("/tabs/contacts/detail", { state: { contact } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contactos</IonTitle>
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
          onClick={() => navigate("/tabs/contacts/create")}
        >
          Crear contacto
        </IonButton>

        <IonList className="ion-margin-top">
          {results.map((contact: Contacto) => (
            <IonItem key={contact.id}>
              <IonLabel>
                {contact.nombre} - {contact.telefono}
              </IonLabel>
              <IonButton fill="clear" onClick={() => irADetalle(contact)}>
                Detalle
              </IonButton>
              <Delete
                onDelete={() => handleEliminar(contact.id)}
                disabled={!isOnline}
              />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
