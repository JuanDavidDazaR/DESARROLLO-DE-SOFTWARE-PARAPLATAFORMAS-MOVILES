export default Fruits;
import { useState, useMemo } from "react";
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
  IonText,
} from "@ionic/react";
import { useDexie } from "../hooks/useDexie";
import Delete from "../components/Delete";
import LogoutButton from "../components/LogoutButton";

function Fruits() {
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const filterFn = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return null;
    return (item: any) => item.nombre?.toLowerCase().includes(texto);
  }, [busqueda]);

  const { results, isPending, error, add, deleteItem } = useDexie(
    "frutas",
    filterFn,
  );

  const handleAgregar = async () => {
    if (!nombre.trim()) return;
    await add({ nombre });
    setNombre("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Frutas</IonTitle>
          <LogoutButton />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Nombre de la fruta</IonLabel>
          <IonInput
            value={nombre}
            onIonChange={(e) => setNombre(e.detail.value ?? "")}
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleAgregar}
          disabled={isPending}
        >
          Agregar
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonItem className="ion-margin-top">
          <IonLabel position="floating">Buscar fruta</IonLabel>
          <IonInput
            value={busqueda}
            onIonChange={(e) => setBusqueda(e.detail.value ?? "")}
          />
        </IonItem>

        <IonList className="ion-margin-top">
          {results.map((fruta: any) => (
            <IonItem key={fruta.id}>
              <IonLabel>{fruta.nombre}</IonLabel>
              <Delete onDelete={() => deleteItem(fruta.id)} />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
