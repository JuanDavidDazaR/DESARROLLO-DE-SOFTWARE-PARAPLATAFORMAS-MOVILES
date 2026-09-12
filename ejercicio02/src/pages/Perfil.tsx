export default Perfil;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";

function Perfil() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Dr. Maria Alejandra Manjarres</h2>
        <p>Médico general</p>
      </IonContent>
    </IonPage>
  );
}
