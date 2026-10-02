export default Contacts;
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
} from "@ionic/react";
import { useCollection } from "../hooks/useCollection";
import "./Contacts.css";
import Delete from "../components/Delete";
import { useNetwork } from "../hooks/useNetwork";

function Contacts() {
  const { isOnline } = useNetwork();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const { results, isPending, error, getAll, add, remove } =
    useCollection("contacts");

  useEffect(() => {
    getAll();
  }, []);

  const handleAgregar = async () => {
    if (!nombre.trim()) return;
    await add({ nombre, telefono });
    setNombre("");
    setTelefono("");
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
          <IonTitle>Contactos</IonTitle>
        </IonToolbar>
      </IonHeader>
      {!isOnline && (
        <IonText color="warning">
          <p>Sin conexión. Las acciones están deshabilitadas.</p>
        </IonText>
      )}
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput
            value={nombre}
            onIonChange={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput
            value={telefono}
            onIonChange={(e) => setTelefono(e.detail.value ?? "")}
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
          {results.map((contact) => (
            <IonItem key={contact.id}>
              <IonLabel>
                {contact.nombre} - {contact.telefono}
              </IonLabel>
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
