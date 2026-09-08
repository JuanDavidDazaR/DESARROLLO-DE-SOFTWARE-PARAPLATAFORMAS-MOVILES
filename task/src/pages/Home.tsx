export default Home;
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
} from "@ionic/react";
import "./Home.css";
import Task from "../components/Task";

function Home() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de tareas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="App-container">
        <Task />
      </IonContent>
    </IonPage>
  );
}
