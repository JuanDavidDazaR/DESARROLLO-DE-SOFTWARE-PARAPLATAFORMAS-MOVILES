import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonButton,
  useIonViewWillEnter,
} from "@ionic/react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import "../utils/leafletIcon";
import "../components/MapComponent.css";
import { clearTracks, loadTracks } from "../services/trackingStorage";
import type { TrackSession } from "../services/trackingStorage";

const FitBounds = ({ points }: { points: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (points.length) map.fitBounds(points, { padding: [20, 20] });
  }, [points]);
  return null;
};

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

const distLabel = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;

const minutes = (t: TrackSession) =>
  Math.max(
    1,
    Math.round(
      (new Date(t.endedAt).getTime() - new Date(t.startedAt).getTime()) / 60000,
    ),
  );

function History() {
  const [tracks, setTracks] = useState<TrackSession[]>([]);
  const [selected, setSelected] = useState<TrackSession | null>(null);

  const load = async () => {
    const all = await loadTracks();
    setTracks([...all].reverse()); // más recientes primero
  };

  useIonViewWillEnter(() => {
    load();
  });

  const handleClear = async () => {
    await clearTracks();
    setSelected(null);
    await load();
  };

  // Agrupa los recorridos por día
  const groups = tracks.reduce<Record<string, TrackSession[]>>((acc, t) => {
    const key = dayLabel(t.startedAt);
    (acc[key] = acc[key] ?? []).push(t);
    return acc;
  }, {});

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {selected && (
          <MapContainer
            key={selected.id}
            center={selected.points[0]}
            zoom={16}
            style={{ height: "40vh", width: "100%" }}
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <Polyline positions={selected.points} />
            <FitBounds points={selected.points} />
          </MapContainer>
        )}

        {tracks.length === 0 && (
          <p className="ion-padding">Aún no hay recorridos guardados.</p>
        )}

        <IonList>
          {Object.entries(groups).map(([day, list]) => (
            <div key={day}>
              <IonListHeader>
                <IonLabel>{day}</IonLabel>
              </IonListHeader>
              {list.map((t) => (
                <IonItem
                  key={t.id}
                  button
                  detail={false}
                  color={selected?.id === t.id ? "light" : undefined}
                  onClick={() => setSelected(t)}
                >
                  <IonLabel>
                    {timeLabel(t.startedAt)} - {timeLabel(t.endedAt)}
                    <p>
                      {distLabel(t.distanceMeters)} · {minutes(t)} min ·{" "}
                      {t.points.length} puntos
                    </p>
                  </IonLabel>
                  <IonNote slot="end">Ver</IonNote>
                </IonItem>
              ))}
            </div>
          ))}
        </IonList>

        {tracks.length > 0 && (
          <div className="ion-padding">
            <IonButton
              expand="block"
              fill="outline"
              color="medium"
              onClick={handleClear}
            >
              Borrar historial
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default History;
