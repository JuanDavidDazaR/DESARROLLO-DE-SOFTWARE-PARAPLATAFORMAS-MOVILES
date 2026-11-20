import { useEffect, useState } from "react";
import { IonButton, IonChip, IonLabel, IonText } from "@ionic/react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import "../utils/leafletIcon";
import "./MapComponent.css";
import { Haptics } from "@capacitor/haptics";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNetwork } from "../hooks/useNetwork";
import { getAddress } from "../services/opencage";

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

const MapView = () => {
  const {
    position,
    tracking,
    error,
    getCurrentLocation,
    startTracking,
    stopTracking,
  } = useGeolocation();

  const { online, connectionType } = useNetwork();

  const [path, setPath] = useState<[number, number][]>([]);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Cada posición nueva se agrega al recorrido mientras se hace tracking
  useEffect(() => {
    if (!position || !tracking) return;
    setPath((prev) => [...prev, [position.latitude, position.longitude]]);
  }, [position]);

  const handleStart = async () => {
    setPath([]);
    try {
      await Haptics.vibrate({ duration: 300 });
    } catch {
      /* dispositivo sin vibrador */
    }
    await startTracking();
  };

  const handleStop = async () => {
    await stopTracking();
  };

  const handleGetAddress = async () => {
    if (!position) return;
    try {
      const data = await getAddress(position.latitude, position.longitude);
      setAddress(data.results?.[0]?.formatted ?? "Sin resultados");
    } catch {
      setAddress("No se pudo obtener la dirección");
    }
  };

  return (
    <>
      <div className="ion-padding">
        <IonChip color={online ? "success" : "danger"}>
          <IonLabel>
            {online ? `Conectado (${connectionType})` : "Sin conexión"}
          </IonLabel>
        </IonChip>

        <IonButton onClick={handleStart} disabled={tracking}>
          Iniciar
        </IonButton>
        <IonButton onClick={handleStop} disabled={!tracking}>
          Detener
        </IonButton>
        <IonButton onClick={() => getCurrentLocation()}>
          Obtener ubicación
        </IonButton>
        <IonButton onClick={handleGetAddress} disabled={!online || !position}>
          Obtener dirección
        </IonButton>

        {address && <p>{address}</p>}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </div>

      {position ? (
        <MapContainer
          center={[position.latitude, position.longitude]}
          zoom={18}
          className="map-container"
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <RecenterMap lat={position.latitude} lng={position.longitude} />
          <Marker position={[position.latitude, position.longitude]} />
          <Polyline positions={path} />
        </MapContainer>
      ) : (
        <div className="map-loading">Obteniendo ubicación...</div>
      )}
    </>
  );
};

export default MapView;
