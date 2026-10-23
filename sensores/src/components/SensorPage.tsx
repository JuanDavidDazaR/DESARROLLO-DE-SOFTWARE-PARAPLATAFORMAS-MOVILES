import {
  IonBackButton, IonButtons, IonContent, IonHeader,
  IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const SensorPage: React.FC<Props> = ({ title, children }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">{children}</IonContent>
  </IonPage>
);

export default SensorPage;
