export default Missions;
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import LogoutButton from "../components/LogoutButton";
import ProgressSummary from "../components/ProgressSummary";
import PhotoMission from "../components/PhotoMission";
import MovementMission from "../components/MovementMission";
import StillMission from "../components/StillMission";

function Missions() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Misiones</IonTitle>
          <LogoutButton />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ProgressSummary />
        <PhotoMission />
        <MovementMission />
        <StillMission />
      </IonContent>
    </IonPage>
  );
}
