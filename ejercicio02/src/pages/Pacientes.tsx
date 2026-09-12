export default Pacientes;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

function Pacientes() {
  const pacientes = ["Juan Pérez", "Maria Gómez", "Pedro López"];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pacientes.map((p, i) => (
            <IonItem key={i}>
              <IonLabel>{p}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
