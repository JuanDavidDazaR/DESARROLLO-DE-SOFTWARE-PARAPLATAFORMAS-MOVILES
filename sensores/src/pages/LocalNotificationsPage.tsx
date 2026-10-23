import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useLocalNotifications } from '../hooks/useLocalNotifications';

const LocalNotificationsPage: React.FC = () => {
  const { requestPermission, sendNotification, scheduleNotification } = useLocalNotifications();

  return (
    <SensorPage title="Notificaciones locales">
      <IonButton onClick={requestPermission}>Permisos</IonButton>

      <IonButton
        onClick={() =>
          sendNotification({
            title: 'Hola tu',
            body: 'Notificación inmediata',
          })
        }
      >
        Enviar ahora
      </IonButton>

      <IonButton
        onClick={() =>
          scheduleNotification({
            title: 'Recordatorio',
            body: 'En 5 segundos',
            seconds: 5,
          })
        }
      >
        Programar
      </IonButton>
    </SensorPage>
  );
};

export default LocalNotificationsPage;
