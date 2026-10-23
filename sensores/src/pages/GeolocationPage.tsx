import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useGeolocation } from '../hooks/useGeolocation';

const GeolocationPage: React.FC = () => {
  const { position, error, getCurrentLocation, startTracking, stopTracking } = useGeolocation();

  return (
    <SensorPage title="Geolocalización">
      <IonButton onClick={getCurrentLocation}>Obtener ubicación</IonButton>
      <IonButton onClick={startTracking}>Iniciar</IonButton>
      <IonButton onClick={stopTracking}>Detener</IonButton>

      <p>Latitud: {position?.latitude}</p>
      <p>Longitud: {position?.longitude}</p>
      {error && <p>Error: {error.message}</p>}
    </SensorPage>
  );
};

export default GeolocationPage;
