import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { usePushNotifications } from '../hooks/usePushNotifications';

const PushNotificationsPage: React.FC = () => {
  const { requestPermission, token, notification } = usePushNotifications();

  return (
    <SensorPage title="Notificaciones push">
      <IonButton onClick={requestPermission}>Activar Push</IonButton>

      <p>Token: {token}</p>

      {notification && (
        <p>{notification.title} - {notification.body}</p>
      )}
    </SensorPage>
  );
};

export default PushNotificationsPage;
