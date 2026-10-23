import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const sensors = [
  { label: 'Geolocalización', path: '/geolocation' },
  { label: 'Cámara', path: '/camera' },
  { label: 'Acelerómetro', path: '/accelerometer' },
  { label: 'Dispositivo', path: '/device' },
  { label: 'Haptics', path: '/haptics' },
  { label: 'Archivos', path: '/filesystem' },
  { label: 'Notificaciones locales', path: '/local-notifications' },
  { label: 'Notificaciones push', path: '/push-notifications' },
];

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sensores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {sensors.map((s) => (
          <IonButton key={s.path} expand="block" routerLink={s.path}>
            {s.label}
          </IonButton>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
