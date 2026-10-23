import SensorPage from '../components/SensorPage';
import { useDevice } from '../hooks/useDevice';

const DevicePage: React.FC = () => {
  const { battery, info, deviceId, loading } = useDevice();

  return (
    <SensorPage title="Dispositivo">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <p>Batería: {battery?.batteryLevel * 100}%</p>
          <p>{battery?.isCharging ? 'Cargando' : 'No cargando'}</p>

          <p>Modelo: {info?.model}</p>
          <p>Plataforma: {info?.platform}</p>
          <p>OS: {info?.operatingSystem}</p>

          <p>ID: {deviceId}</p>
        </>
      )}
    </SensorPage>
  );
};

export default DevicePage;
