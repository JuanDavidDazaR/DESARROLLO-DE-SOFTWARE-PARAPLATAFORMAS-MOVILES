import SensorPage from '../components/SensorPage';
import { useAccelerometer } from '../hooks/useAccelerometer';

const AccelerometerPage: React.FC = () => {
  const { acceleration, magnitude, isShaking, isMoving } = useAccelerometer({ threshold: 18 });

  return (
    <SensorPage title="Acelerómetro">
      <p>X: {acceleration.x.toFixed(2)}</p>
      <p>Y: {acceleration.y.toFixed(2)}</p>
      <p>Z: {acceleration.z.toFixed(2)}</p>

      <p>Movimiento: {isMoving ? 'Sí' : 'No'}</p>
      <p>Magnitud: {magnitude.toFixed(2)}</p>

      {isShaking && <h1>SHAKE DETECTADO</h1>}
    </SensorPage>
  );
};

export default AccelerometerPage;
