import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useCamera } from '../hooks/useCamera';

const CameraPage: React.FC = () => {
  const { photo, takePhoto } = useCamera();

  return (
    <SensorPage title="Cámara">
      <IonButton onClick={takePhoto}>Tomar Foto</IonButton>
      {photo && <img src={photo} style={{ width: '100%' }} />}
    </SensorPage>
  );
};

export default CameraPage;
