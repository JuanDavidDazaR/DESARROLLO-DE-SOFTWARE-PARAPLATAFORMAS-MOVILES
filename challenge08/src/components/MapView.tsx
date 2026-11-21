import { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonToggle,
} from "@ionic/react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "../utils/leafletIcon";
import "./MapComponent.css";
import { Haptics } from "@capacitor/haptics";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNetwork } from "../hooks/useNetwork";
import { useBattery } from "../hooks/useBattery";
import { useNotifications } from "../hooks/useNotifications";
import { useMotion } from "../hooks/useMotion";
import { usePhotoWatermark } from "../hooks/usePhotoWatermark";
import { getAddress, getNearbyPlaces } from "../services/opencage";
import type { Place } from "../services/opencage";
import { saveTrack } from "../services/trackingStorage";
import { speedKmh, totalDistance } from "../utils/geo";

const LOW_BATTERY = 0.15; // 15 %
const FAST_KMH = 25; // "movimiento rápido"
const STILL_ALERT_SECONDS = 30; // aviso "llevas tiempo sin moverte"
const AUTO_STOP_SECONDS = 60; // el modo automático detiene el tracking

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
  const { level, isCharging } = useBattery();
  const { notify } = useNotifications();
  const { photo, saving, photoError, takeWithWatermark } = usePhotoWatermark();

  const [path, setPath] = useState<[number, number][]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState("restaurante");
  const [loadingApi, setLoadingApi] = useState(false);

  const pathRef = useRef<[number, number][]>([]);
  const startedAtRef = useRef<string>("");
  const lastPointRef = useRef<{ lat: number; lng: number; ts: number } | null>(
    null,
  );

  const { moving, stillSeconds, supported } = useMotion(autoMode || tracking);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!position || !tracking) return;

    const point: [number, number] = [position.latitude, position.longitude];
    const next = [...pathRef.current, point];
    pathRef.current = next;
    setPath(next);

    // g: movimiento rápido (se ignoran lecturas con GPS impreciso)
    const last = lastPointRef.current;
    if (last && position.accuracy <= 50) {
      const kmh = speedKmh(
        last.lat,
        last.lng,
        last.ts,
        position.latitude,
        position.longitude,
        position.timestamp,
      );
      if (kmh > FAST_KMH) {
        notify(
          "Movimiento rápido",
          `Vas a ${kmh.toFixed(0)} km/h`,
          "fast",
          60000,
        );
      }
    }
    lastPointRef.current = {
      lat: position.latitude,
      lng: position.longitude,
      ts: position.timestamp,
    };
  }, [position]);

  const handleStart = async () => {
    if (tracking) return;
    pathRef.current = [];
    lastPointRef.current = null;
    startedAtRef.current = new Date().toISOString();
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

    const points = pathRef.current;
    pathRef.current = []; // evita guardar dos veces si se llama otra vez
    if (points.length < 2) return;

    try {
      await saveTrack({
        id: startedAtRef.current || String(Date.now()),
        startedAt: startedAtRef.current || new Date().toISOString(),
        endedAt: new Date().toISOString(),
        distanceMeters: totalDistance(points),
        points,
      });
    } catch (e) {
      console.log("No se pudo guardar el recorrido", e);
    }
  };

  // f: batería baja → detiene el tracking
  useEffect(() => {
    if (!tracking || level === null || level < 0 || isCharging) return;
    if (level <= LOW_BATTERY) {
      handleStop();
      notify(
        "Batería baja",
        `Tracking detenido (${Math.round(level * 100)} %)`,
        "battery",
        600000,
      );
    }
  }, [level, isCharging, tracking]);

  // g: sin conexión
  useEffect(() => {
    if (!online) {
      notify(
        "Sin conexión",
        "Estás sin internet: el mapa y las direcciones pueden fallar",
        "offline",
        120000,
      );
    }
  }, [online]);

  // b: modo automático → inicia al moverse, detiene tras un rato quieto
  useEffect(() => {
    if (!autoMode || !supported) return;
    if (moving && !tracking) {
      handleStart();
    }
    if (!moving && tracking && stillSeconds >= AUTO_STOP_SECONDS) {
      handleStop();
      notify(
        "Tracking detenido",
        "Estuviste quieto 1 minuto",
        "autostop",
        60000,
      );
    }
  }, [moving, stillSeconds, autoMode, supported, tracking]);

  // g: mucho tiempo sin moverse
  useEffect(() => {
    if (tracking && supported && stillSeconds >= STILL_ALERT_SECONDS) {
      notify(
        "Sin movimiento",
        `Llevas ${stillSeconds} s sin moverte`,
        "still",
        120000,
      );
    }
  }, [stillSeconds, tracking, supported]);

  const handleGetAddress = async () => {
    if (!position) return;
    try {
      const data = await getAddress(position.latitude, position.longitude);
      setAddress(data.results?.[0]?.formatted ?? "Sin resultados");
    } catch {
      setAddress("No se pudo obtener la dirección");
    }
  };

  const handlePlaces = async () => {
    if (!position) return;
    setLoadingApi(true);
    try {
      setPlaces(
        await getNearbyPlaces(position.latitude, position.longitude, category),
      );
    } catch {
      setPlaces([]);
      setAddress("No se pudieron obtener los lugares cercanos");
    }
    setLoadingApi(false);
  };

  const handlePhoto = async () => {
    if (!position) return;
    await takeWithWatermark(
      position.latitude,
      position.longitude,
      address ?? undefined,
    );
  };

  return (
    <>
      <div className="ion-padding">
        <IonChip color={online ? "success" : "danger"}>
          <IonLabel>
            {online ? `Conectado (${connectionType})` : "Sin conexión"}
          </IonLabel>
        </IonChip>

        {level !== null && level >= 0 && (
          <IonChip color={level <= LOW_BATTERY ? "danger" : "medium"}>
            <IonLabel>
              Batería {Math.round(level * 100)} %
              {isCharging ? " (cargando)" : ""}
            </IonLabel>
          </IonChip>
        )}

        <IonItem lines="none">
          <IonToggle
            checked={autoMode}
            onIonChange={(e) => setAutoMode(e.detail.checked)}
          >
            Modo automático (acelerómetro)
          </IonToggle>
        </IonItem>
        {autoMode && !supported && (
          <IonNote color="warning">
            Esperando datos del acelerómetro (en PC no funciona, pruébalo en el
            celular)
          </IonNote>
        )}

        <IonButton onClick={() => handleStart()} disabled={tracking || autoMode}>
          Iniciar
        </IonButton>
        <IonButton onClick={() => handleStop()} disabled={!tracking || autoMode}>
          Detener
        </IonButton>
        <IonButton onClick={() => getCurrentLocation()}>
          Obtener ubicación
        </IonButton>
        <IonButton onClick={handleGetAddress} disabled={!online || !position}>
          Obtener dirección
        </IonButton>
        <IonButton onClick={handlePhoto} disabled={!position || saving}>
          {saving ? <IonSpinner name="crescent" /> : "Foto con ubicación"}
        </IonButton>

        <IonItem>
          <IonSelect
            label="Categoría"
            value={category}
            onIonChange={(e) => setCategory(e.detail.value)}
          >
            <IonSelectOption value="restaurante">Restaurantes</IonSelectOption>
            <IonSelectOption value="farmacia">Farmacias</IonSelectOption>
            <IonSelectOption value="café">Cafés</IonSelectOption>
            <IonSelectOption value="supermercado">Supermercados</IonSelectOption>
            <IonSelectOption value="hospital">Hospitales</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonButton
          onClick={handlePlaces}
          disabled={!online || !position || loadingApi}
        >
          {loadingApi ? <IonSpinner name="crescent" /> : "Lugares cercanos"}
        </IonButton>

        <p>Distancia: {Math.round(totalDistance(path))} m</p>
        {address && <p>{address}</p>}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
        {photoError && (
          <IonText color="danger">
            <p>{photoError}</p>
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
          {places.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng]}>
              <Popup>
                {p.name}
                <br />
                {Math.round(p.distance)} m
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="map-loading">Obteniendo ubicación...</div>
      )}

      {places.length > 0 && (
        <IonList>
          {places.map((p, i) => (
            <IonItem key={i}>
              <IonLabel>
                {p.name}
                <p>{p.formatted}</p>
              </IonLabel>
              <IonNote slot="end">{Math.round(p.distance)} m</IonNote>
            </IonItem>
          ))}
        </IonList>
      )}

      {photo && (
        <img
          src={photo}
          alt="Foto con ubicación"
          style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
        />
      )}
    </>
  );
};

export default MapView;
