import { IonButton } from '@ionic/react';
import SensorPage from '../components/SensorPage';
import { useHaptics } from '../hooks/useHaptics';

const HapticsPage: React.FC = () => {
  const { impact, notify, vibrate } = useHaptics();

  return (
    <SensorPage title="Haptics">
      <IonButton onClick={() => impact('light')}>Impacto suave</IonButton>
      <IonButton onClick={() => impact('heavy')}>Impacto fuerte</IonButton>
      <IonButton onClick={() => notify('success')}>Éxito</IonButton>
      <IonButton onClick={() => notify('error')}>Error</IonButton>
      <IonButton onClick={() => vibrate(200)}>Vibrar</IonButton>
    </SensorPage>
  );
};

export default HapticsPage;
