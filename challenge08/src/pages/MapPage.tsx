import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import MapView from "../components/MapView";

function MapPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MapView />
      </IonContent>
    </IonPage>
  );
}

export default MapPage;
