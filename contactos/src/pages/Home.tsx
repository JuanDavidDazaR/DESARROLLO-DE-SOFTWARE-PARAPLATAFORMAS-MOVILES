export default Home;
import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButton,
} from "@ionic/react";
import cifar from "/public/cifar.jpg";
import "./Home.css";
import Contact from "../components/Contact";
import Counter from "../components/Counter";

function Home({ onLogout }: { onLogout: () => void }) {
  const [cargando, setCargando] = useState<boolean>(true);

  const terminarCarga = (): void => {
    setCargando(false);
  };

  if (cargando) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista de contactos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="App-container">
          <Counter onFinish={terminarCarga} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de contactos</IonTitle>
          <IonButton slot="end" onClick={onLogout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="App-container">
        <Contact />
        <IonImg src={cifar} alt="cifar10" className="cifar-img" />
      </IonContent>
    </IonPage>
  );
}
