# Challenge 08 — App de Mapas con sensores (Ionic + React + Capacitor, TSX)

Implementa los 8 puntos (a–h) del reto. Cada bloque dice la **ruta exacta** del archivo.
Sigue los pasos **en orden** y prueba al terminar cada uno.

| Paso | Qué haces | Puntos del reto |
| ---- | --------- | --------------- |
| 0 | Proyecto e instalación | — |
| 1 | Base: mapa, GPS, tracking y dirección (código de la clase) | — |
| 2 | Vibrar al iniciar y revisar la conexión | **e**, **a** |
| 3 | Batería baja y notificaciones inteligentes | **f**, **g** |
| 4 | Detectar movimiento con el acelerómetro | **b** (y notificación "sin moverte" de **g**) |
| 5 | Guardar el recorrido en JSON y página de historial | **c** |
| 6 | Lugares cercanos con OpenCage | **h** |
| 7 | Foto con la ubicación como marca de agua | **d** |

Al final hay un **MapView.tsx completo** (con los 8 puntos) por si prefieres pegarlo de una vez, y la sección de permisos para el celular.

---

## Paso 0. Proyecto e instalación

```bash
ionic start maps-app tabs --type=react
cd maps-app

npm install leaflet react-leaflet
npm install -D @types/leaflet

npm install @capacitor/geolocation @capacitor/network @capacitor/device @capacitor/haptics @capacitor/motion @capacitor/local-notifications @capacitor/camera @capacitor/filesystem @ionic/pwa-elements
```

Si hay conflicto de dependencias, repite con `--legacy-peer-deps`.

Necesitas una API key gratis de OpenCage: https://opencagedata.com

Para el celular Android (cada vez que cambies código: `ionic build && npx cap sync`):

```bash
ionic build
npx cap add android
npx cap sync
npx cap open android
```

### Estructura de archivos

```
src/
├── App.tsx                          (reemplazar)
├── main.tsx                         (agregar 2 líneas)
├── utils/
│   ├── leafletIcon.ts               (Paso 1)
│   └── geo.ts                       (Paso 3)
├── services/
│   ├── opencage.ts                  (Paso 1, se amplía en Paso 6)
│   └── trackingStorage.ts           (Paso 5)
├── hooks/
│   ├── useGeolocation.ts            (Paso 1)
│   ├── useNetwork.ts                (Paso 2)
│   ├── useBattery.ts                (Paso 3)
│   ├── useNotifications.ts          (Paso 3)
│   ├── useMotion.ts                 (Paso 4)
│   └── usePhotoWatermark.ts         (Paso 7)
├── components/
│   ├── MapComponent.css             (Paso 1)
│   └── MapView.tsx                  (Paso 1, se modifica en cada paso)
└── pages/
    ├── MapPage.tsx                  (Paso 1)
    └── History.tsx                  (placeholder en Paso 1, real en Paso 5)
```

Puedes borrar `Tab1.tsx`, `Tab2.tsx`, `Tab3.tsx`, sus `.css` y `components/ExploreContainer*` de la plantilla.

### `src/main.tsx` (agrega estas 2 líneas)

Junto a los otros imports y antes de `createRoot`. Sirven para que la cámara funcione en el navegador.

```tsx
import { defineCustomElements } from "@ionic/pwa-elements/loader";

defineCustomElements(window);
```

---

## Paso 1. Base: mapa, GPS, tracking y dirección

### `src/utils/leafletIcon.ts`

Arregla el ícono del marcador, que con Vite sale roto si no se configura.

```ts
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

### `src/hooks/useGeolocation.ts`

```ts
import { useState, useRef, useCallback, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";
import type { Position } from "@capacitor/geolocation";

export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const toPoint = (pos: Position): GeoPoint => ({
  latitude: pos.coords.latitude,
  longitude: pos.coords.longitude,
  accuracy: pos.coords.accuracy,
  timestamp: pos.timestamp,
});

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const watchRef = useRef<string | null>(null);
  const startingRef = useRef(false);

  const getCurrentLocation = useCallback(async () => {
    try {
      try {
        await Geolocation.requestPermissions();
      } catch {
        /* en web no existe: el navegador pregunta al leer la ubicación */
      }
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      setPosition(toPoint(pos));
      setError(null);
    } catch (e) {
      setError((e as Error).message || "No se pudo obtener la ubicación");
    }
  }, []);

  const startTracking = useCallback(async () => {
    if (watchRef.current || startingRef.current) return;
    startingRef.current = true;
    try {
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 15000 },
        (pos, err) => {
          if (err) {
            setError(err.message || "Error de GPS");
            return;
          }
          if (pos) setPosition(toPoint(pos));
        },
      );
      watchRef.current = id;
      setTracking(true);
    } catch (e) {
      setError((e as Error).message || "No se pudo iniciar el seguimiento");
    } finally {
      startingRef.current = false;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    if (watchRef.current) {
      const id = watchRef.current;
      watchRef.current = null;
      await Geolocation.clearWatch({ id });
    }
    setTracking(false);
  }, []);

  // Al salir de la pantalla se libera el GPS
  useEffect(() => {
    return () => {
      if (watchRef.current) {
        Geolocation.clearWatch({ id: watchRef.current });
        watchRef.current = null;
      }
    };
  }, []);

  return {
    position,
    tracking,
    error,
    getCurrentLocation,
    startTracking,
    stopTracking,
  };
};
```

### `src/services/opencage.ts`

```ts
const API_KEY = "TU_API_KEY_OPENCAGE"; // no la subas a Git
const BASE_URL = "https://api.opencagedata.com/geocode/v1/json";

export const getAddress = async (lat: number, lng: number) => {
  const response = await fetch(
    `${BASE_URL}?q=${lat}+${lng}&key=${API_KEY}&language=es`,
  );
  if (!response.ok) throw new Error("Error consultando OpenCage");
  const data = await response.json();
  return data;
};
```

### `src/components/MapComponent.css`

```css
@import "leaflet/dist/leaflet.css";

.map-container {
  height: 45vh;
  width: 100%;
}

.map-loading {
  height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### `src/components/MapView.tsx` (versión base)

```tsx
import { useEffect, useState } from "react";
import { IonButton, IonText } from "@ionic/react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import "../utils/leafletIcon";
import "./MapComponent.css";
import { useGeolocation } from "../hooks/useGeolocation";
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
        <IonButton onClick={handleStart} disabled={tracking}>
          Iniciar
        </IonButton>
        <IonButton onClick={handleStop} disabled={!tracking}>
          Detener
        </IonButton>
        <IonButton onClick={() => getCurrentLocation()}>
          Obtener ubicación
        </IonButton>
        <IonButton onClick={handleGetAddress} disabled={!position}>
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
```

### `src/pages/MapPage.tsx`

```tsx
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import MapView from "../components/MapView";

function MapPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MapView />
      </IonContent>
    </IonPage>
  );
}

export default MapPage;
```

### `src/pages/History.tsx` (placeholder, se reemplaza en el Paso 5)

```tsx
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";

function History() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Próximamente</IonContent>
    </IonPage>
  );
}

export default History;
```

### `src/App.tsx` (reemplazar completo)

Misma estructura de rutas del parcial.

```tsx
import { Navigate, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { mapOutline, timeOutline } from "ionicons/icons";
import MapPage from "./pages/MapPage";
import History from "./pages/History";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/map" element={<MapPage />} />
        <Route path="/tabs/history" element={<History />} />
        <Route path="/tabs" element={<Navigate to="/tabs/map" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="map" href="/tabs/map">
          <IonIcon aria-hidden="true" icon={mapOutline} />
          <IonLabel>Mapa</IonLabel>
        </IonTabButton>
        <IonTabButton tab="history" href="/tabs/history">
          <IonIcon aria-hidden="true" icon={timeOutline} />
          <IonLabel>Historial</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/tabs/*" element={<Tabs />} />
        <Route path="/" element={<Navigate to="/tabs/map" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
```

**Prueba del Paso 1** (`ionic serve`): el navegador pide permiso de ubicación, aparece el mapa con el marcador. "Iniciar" dibuja la línea al moverte (en PC usa F12 → ⋮ → More tools → **Sensors** → Location y cambia la latitud). "Obtener dirección" muestra la dirección.

---

## Paso 2. Vibrar al iniciar (e) y revisar la conexión (a)

### `src/hooks/useNetwork.ts` (nuevo)

```ts
import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";
import type { PluginListenerHandle } from "@capacitor/core";

export const useNetwork = () => {
  const [online, setOnline] = useState(true);
  const [connectionType, setConnectionType] = useState("desconocida");

  useEffect(() => {
    let cancelled = false;
    const ref: { current: PluginListenerHandle | null } = { current: null };

    Network.getStatus().then((s) => {
      if (cancelled) return;
      setOnline(s.connected);
      setConnectionType(s.connectionType);
    });

    Network.addListener("networkStatusChange", (s) => {
      setOnline(s.connected);
      setConnectionType(s.connectionType);
    }).then((h) => {
      if (cancelled) h.remove();
      else ref.current = h;
    });

    return () => {
      cancelled = true;
      ref.current?.remove();
    };
  }, []);

  return { online, connectionType }; // connectionType: "wifi" | "cellular" | "none" | "unknown"
};
```

### Cambios en `src/components/MapView.tsx`

**1. Imports nuevos** (arriba):

```tsx
import { IonChip, IonLabel } from "@ionic/react"; // únelo al import de @ionic/react que ya tienes
import { Haptics } from "@capacitor/haptics";
import { useNetwork } from "../hooks/useNetwork";
```

**2. Dentro de `MapView`**, junto a los otros hooks:

```tsx
const { online, connectionType } = useNetwork();
```

**3. Reemplaza `handleStart`** (e: vibra al iniciar):

```tsx
const handleStart = async () => {
  setPath([]);
  try {
    await Haptics.vibrate({ duration: 300 });
  } catch {
    /* dispositivo sin vibrador */
  }
  await startTracking();
};
```

**4. En el JSX**, dentro del `<div className="ion-padding">`, antes de los botones:

```tsx
<IonChip color={online ? "success" : "danger"}>
  <IonLabel>
    {online ? `Conectado (${connectionType})` : "Sin conexión"}
  </IonLabel>
</IonChip>
```

**5. El botón de dirección** ahora depende de la conexión (a):

```tsx
<IonButton onClick={handleGetAddress} disabled={!online || !position}>
  Obtener dirección
</IonButton>
```

**Prueba del Paso 2:** en el celular, "Iniciar" vibra. Activa modo avión: el chip se pone rojo y "Obtener dirección" se deshabilita. En PC puedes simular offline en DevTools → Network → Offline.

---

## Paso 3. Batería baja (f) y notificaciones inteligentes (g)

### `src/utils/geo.ts` (nuevo)

Fórmula de Haversine, la misma del parcial.

```ts
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Distancia total de un recorrido [[lat, lng], ...]
export function totalDistance(points: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distanceMeters(
      points[i - 1][0],
      points[i - 1][1],
      points[i][0],
      points[i][1],
    );
  }
  return total;
}

// Velocidad en km/h entre dos puntos (timestamps en milisegundos)
export function speedKmh(
  lat1: number,
  lon1: number,
  t1: number,
  lat2: number,
  lon2: number,
  t2: number,
): number {
  const seconds = (t2 - t1) / 1000;
  if (seconds <= 0) return 0;
  return (distanceMeters(lat1, lon1, lat2, lon2) / seconds) * 3.6;
}
```

### `src/hooks/useBattery.ts` (nuevo)

```ts
import { useEffect, useState } from "react";
import { Device } from "@capacitor/device";

export const useBattery = (intervalMs = 30000) => {
  const [level, setLevel] = useState<number | null>(null); // 0 a 1
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const read = async () => {
      try {
        const info = await Device.getBatteryInfo();
        if (cancelled) return;
        setLevel(info.batteryLevel ?? null);
        setIsCharging(!!info.isCharging);
      } catch {
        /* sin información de batería (algunos navegadores) */
      }
    };

    read();
    const id = window.setInterval(read, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return { level, isCharging };
};
```

### `src/hooks/useNotifications.ts` (nuevo)

`key` + `cooldownMs` evitan que la misma alerta se repita sin parar.

```ts
import { useCallback, useRef } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

export const useNotifications = () => {
  const lastRef = useRef<Record<string, number>>({});

  const notify = useCallback(
    async (title: string, body: string, key?: string, cooldownMs = 60000) => {
      if (key) {
        const now = Date.now();
        if (now - (lastRef.current[key] ?? 0) < cooldownMs) return;
        lastRef.current[key] = now;
      }

      try {
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display !== "granted") {
          const req = await LocalNotifications.requestPermissions();
          if (req.display !== "granted") return;
        }
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Date.now() % 2147483647),
              title,
              body,
              schedule: { at: new Date(Date.now() + 300) },
            },
          ],
        });
      } catch (e) {
        console.log("No se pudo enviar la notificación", e);
      }
    },
    [],
  );

  return { notify };
};
```

### Cambios en `src/components/MapView.tsx`

**1. Imports nuevos:**

```tsx
import { useEffect, useRef, useState } from "react"; // agrega useRef
import { useBattery } from "../hooks/useBattery";
import { useNotifications } from "../hooks/useNotifications";
import { speedKmh } from "../utils/geo";
```

**2. Constantes** (debajo de los imports, fuera del componente):

```tsx
const LOW_BATTERY = 0.15; // 15 %
const FAST_KMH = 25; // "movimiento rápido"
```

**3. Dentro de `MapView`**, junto a los hooks:

```tsx
const { level, isCharging } = useBattery();
const { notify } = useNotifications();

const pathRef = useRef<[number, number][]>([]);
const lastPointRef = useRef<{ lat: number; lng: number; ts: number } | null>(
  null,
);
```

**4. Reemplaza el efecto de `position`** (ahora también calcula la velocidad):

```tsx
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
```

**5. Reemplaza `handleStart` y `handleStop`** (reinician las refs):

```tsx
const handleStart = async () => {
  if (tracking) return;
  pathRef.current = [];
  lastPointRef.current = null;
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
```

**5b. Cambia los `onClick` de los botones** para que llamen a las funciones nuevas: `onClick={() => handleStart()}` y `onClick={() => handleStop()}`.

**6. Dos efectos nuevos** (batería y sin conexión):

```tsx
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
```

**7. Chip de batería** en el JSX, junto al chip de conexión:

```tsx
{level !== null && level >= 0 && (
  <IonChip color={level <= LOW_BATTERY ? "danger" : "medium"}>
    <IonLabel>
      Batería {Math.round(level * 100)} %{isCharging ? " (cargando)" : ""}
    </IonLabel>
  </IonChip>
)}
```

**Prueba del Paso 3:** al activar modo avión llega la notificación "Sin conexión". Para probar la batería, cambia `LOW_BATTERY` a `0.99` temporalmente (con el cargador desconectado): al iniciar el tracking se detiene y avisa. Para el movimiento rápido, sube a un carro o baja `FAST_KMH` a `3` para probar caminando.

---

## Paso 4. Detectar movimiento con el acelerómetro (b)

### `src/hooks/useMotion.ts` (nuevo)

Misma lógica del acelerómetro del parcial (`useStillness`), pero devuelve `moving` y cuántos segundos lleva quieto.

```ts
import { useEffect, useState } from "react";
import { Motion } from "@capacitor/motion";
import type { PluginListenerHandle } from "@capacitor/core";

// Cambio mínimo entre dos lecturas para considerar "movimiento"
const MOVEMENT_THRESHOLD = 0.5;
// Segundos después del último movimiento en los que aún se considera "moviéndose"
const MOVING_GRACE_SECONDS = 3;

export const useMotion = (enabled: boolean) => {
  const [moving, setMoving] = useState(false);
  const [stillSeconds, setStillSeconds] = useState(0);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setMoving(false);
      setStillSeconds(0);
      return;
    }

    let cancelled = false;
    const ref: { current: PluginListenerHandle | null } = { current: null };
    let lastVec: { x: number; y: number; z: number } | null = null;
    let lastMove = Date.now();
    let moved = false;

    Motion.addListener("accel", (event) => {
      const a = event.accelerationIncludingGravity;
      if (!a) return;
      setSupported(true);
      if (lastVec) {
        const delta = Math.sqrt(
          (a.x - lastVec.x) ** 2 +
            (a.y - lastVec.y) ** 2 +
            (a.z - lastVec.z) ** 2,
        );
        if (delta > MOVEMENT_THRESHOLD) {
          lastMove = Date.now();
          moved = true;
        }
      }
      lastVec = { x: a.x, y: a.y, z: a.z };
    })
      .then((h) => {
        if (cancelled) h.remove();
        else ref.current = h;
      })
      .catch(() => {
        /* sin acelerómetro */
      });

    const id = window.setInterval(() => {
      const secs = (Date.now() - lastMove) / 1000;
      setMoving(moved && secs < MOVING_GRACE_SECONDS);
      setStillSeconds(Math.floor(secs));
    }, 500);

    return () => {
      cancelled = true;
      ref.current?.remove();
      window.clearInterval(id);
    };
  }, [enabled]);

  return { moving, stillSeconds, supported };
};
```

### Cambios en `src/components/MapView.tsx`

**1. Imports nuevos:**

```tsx
import { IonChip, IonLabel, IonNote, IonToggle, IonItem } from "@ionic/react"; // únelos al import de @ionic/react
import { useMotion } from "../hooks/useMotion";
```

**2. Constantes nuevas:**

```tsx
const STILL_ALERT_SECONDS = 30; // aviso "llevas tiempo sin moverte"
const AUTO_STOP_SECONDS = 60; // el modo automático detiene el tracking
```

**3. Dentro de `MapView`:**

```tsx
const [autoMode, setAutoMode] = useState(false);
const { moving, stillSeconds, supported } = useMotion(autoMode || tracking);
```

**4. Efectos nuevos:**

```tsx
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
```

**5. JSX:** agrega el interruptor antes de los botones y deshabilita los botones manuales cuando el modo automático está activo:

```tsx
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
    Esperando datos del acelerómetro (en PC no funciona, pruébalo en el celular)
  </IonNote>
)}

<IonButton onClick={() => handleStart()} disabled={tracking || autoMode}>
  Iniciar
</IonButton>
<IonButton onClick={() => handleStop()} disabled={!tracking || autoMode}>
  Detener
</IonButton>
```

**Prueba del Paso 4 (solo en celular):** activa el modo automático y camina: el tracking arranca y vibra. Déjalo quieto 30 s: notificación "Sin movimiento"; a los 60 s se detiene solo.

---

## Paso 5. Guardar el recorrido en JSON y página de historial (c)

### `src/services/trackingStorage.ts` (nuevo)

Guarda todos los recorridos en un solo archivo `tracking_history.json` usando Filesystem (el mismo plugin que usa `usePhotoMission` en el parcial).

```ts
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FILE = "tracking_history.json";

export interface TrackSession {
  id: string;
  startedAt: string; // ISO
  endedAt: string; // ISO
  distanceMeters: number;
  points: [number, number][]; // [lat, lng]
}

export const loadTracks = async (): Promise<TrackSession[]> => {
  try {
    const res = await Filesystem.readFile({
      path: FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    const text =
      typeof res.data === "string" ? res.data : await (res.data as Blob).text();
    return JSON.parse(text) as TrackSession[];
  } catch {
    return []; // el archivo aún no existe
  }
};

export const saveTrack = async (track: TrackSession): Promise<void> => {
  const all = await loadTracks();
  all.push(track);
  await Filesystem.writeFile({
    path: FILE,
    directory: Directory.Data,
    data: JSON.stringify(all),
    encoding: Encoding.UTF8,
  });
};

export const clearTracks = async (): Promise<void> => {
  await Filesystem.writeFile({
    path: FILE,
    directory: Directory.Data,
    data: "[]",
    encoding: Encoding.UTF8,
  });
};
```

### `src/pages/History.tsx` (reemplaza el placeholder)

```tsx
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
```

### Cambios en `src/components/MapView.tsx`

**1. Imports nuevos:**

```tsx
import { saveTrack } from "../services/trackingStorage";
import { totalDistance } from "../utils/geo"; // agrégalo al import de geo.ts que ya tienes
```

**2. Una ref más** (junto a `pathRef`):

```tsx
const startedAtRef = useRef<string>("");
```

**3. Reemplaza `handleStart` y `handleStop`** (ahora guardan el recorrido al detener):

```tsx
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
```

**4. Muestra la distancia** en el JSX (debajo de los botones):

```tsx
<p>Distancia: {Math.round(totalDistance(path))} m</p>
```

**Prueba del Paso 5:** inicia, muévete (o simula coordenadas en PC), detén. Ve a la pestaña **Historial**: aparece el recorrido agrupado por día; al tocarlo se dibuja la ruta en el mapa.

---

## Paso 6. Lugares cercanos con OpenCage (h)

### `src/services/opencage.ts` (agrega al final)

```ts
import { distanceMeters } from "../utils/geo"; // ponlo arriba del archivo con los demás imports

export interface Place {
  name: string;
  formatted: string;
  lat: number;
  lng: number;
  distance: number; // metros
}

// Busca una categoría ("restaurante", "farmacia"...) cerca de la posición
export const getNearbyPlaces = async (
  lat: number,
  lng: number,
  category: string,
): Promise<Place[]> => {
  const url =
    `${BASE_URL}?q=${encodeURIComponent(category)}` +
    `&proximity=${lat},${lng}&limit=10&language=es&no_annotations=1&key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Error consultando OpenCage");
  const data = await response.json();

  const places: Place[] = (data.results ?? []).map((r: any) => ({
    name: String(r.formatted).split(",")[0],
    formatted: r.formatted,
    lat: r.geometry.lat,
    lng: r.geometry.lng,
    distance: distanceMeters(lat, lng, r.geometry.lat, r.geometry.lng),
  }));

  return places.sort((a, b) => a.distance - b.distance);
};
```

> OpenCage es un servicio de geocodificación, no un buscador de negocios: `proximity` sesga los resultados hacia tu posición, pero no siempre devuelve negocios reales. Para el reto es válido.

### Cambios en `src/components/MapView.tsx`

**1. Imports nuevos:**

```tsx
import {
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from "@ionic/react"; // únelos al import de @ionic/react
import { Popup } from "react-leaflet"; // únelo al import de react-leaflet
import { getAddress, getNearbyPlaces } from "../services/opencage";
import type { Place } from "../services/opencage";
```

**2. Estado nuevo:**

```tsx
const [places, setPlaces] = useState<Place[]>([]);
const [category, setCategory] = useState("restaurante");
const [loadingApi, setLoadingApi] = useState(false);
```

**3. Handler nuevo:**

```tsx
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
```

**4. JSX**, debajo de los botones:

```tsx
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
```

Dentro del `<MapContainer>`, después del `<Polyline>`:

```tsx
{places.map((p, i) => (
  <Marker key={i} position={[p.lat, p.lng]}>
    <Popup>
      {p.name}
      <br />
      {Math.round(p.distance)} m
    </Popup>
  </Marker>
))}
```

Y debajo del mapa, la lista:

```tsx
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
```

---

## Paso 7. Foto con la ubicación como marca de agua (d)

### `src/hooks/usePhotoWatermark.ts` (nuevo)

Toma la foto (Camera), le dibuja un texto con un `<canvas>` y la guarda con Filesystem, igual que `usePhotoMission` del parcial.

```ts
import { useState, useCallback } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";

// Dibuja líneas de texto en una franja oscura en la parte inferior
const drawWatermark = (dataUrl: string, lines: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo crear el canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(16, Math.round(img.width / 28));
      const pad = fontSize / 2;
      const lineH = fontSize * 1.3;
      const boxH = lineH * lines.length + pad * 2;

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, img.height - boxH, img.width, boxH);

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = "top";
      lines.forEach((line, i) => {
        ctx.fillText(line, pad, img.height - boxH + pad + i * lineH);
      });

      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = dataUrl;
  });

export function usePhotoWatermark() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const takeWithWatermark = useCallback(
    async (lat: number, lng: number, address?: string): Promise<boolean> => {
      setPhotoError(null);
      try {
        const shot = await Camera.getPhoto({
          quality: 80,
          width: 1280,
          correctOrientation: true,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
        });
        if (!shot.base64String) throw new Error("No se obtuvo la imagen");

        setSaving(true);
        const lines = [
          `Lat: ${lat.toFixed(6)}  Lng: ${lng.toFixed(6)}`,
          new Date().toLocaleString("es-CO"),
        ];
        if (address) lines.push(address);

        const original = `data:image/${shot.format};base64,${shot.base64String}`;
        const marked = await drawWatermark(original, lines);

        await Filesystem.writeFile({
          path: `foto_ubicacion_${Date.now()}.jpeg`,
          data: marked.split(",")[1], // base64 sin el encabezado
          directory: Directory.Data,
        });

        setPhoto(marked);
        setSaving(false);
        return true;
      } catch (e) {
        setSaving(false);
        setPhotoError((e as Error).message || "No se pudo tomar la foto");
        return false;
      }
    },
    [],
  );

  return { photo, saving, photoError, takeWithWatermark };
}
```

### Cambios en `src/components/MapView.tsx`

```tsx
import { usePhotoWatermark } from "../hooks/usePhotoWatermark";
```

Dentro de `MapView`:

```tsx
const { photo, saving, photoError, takeWithWatermark } = usePhotoWatermark();

const handlePhoto = async () => {
  if (!position) return;
  await takeWithWatermark(
    position.latitude,
    position.longitude,
    address ?? undefined,
  );
};
```

JSX:

```tsx
<IonButton onClick={handlePhoto} disabled={!position || saving}>
  {saving ? <IonSpinner name="crescent" /> : "Foto con ubicación"}
</IonButton>

{photo && (
  <img
    src={photo}
    alt="Foto con ubicación"
    style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
  />
)}
{photoError && (
  <IonText color="danger">
    <p>{photoError}</p>
  </IonText>
)}
```

Tip: si primero pulsas "Obtener dirección", la dirección también queda en la marca de agua.

---

## MapView.tsx FINAL (los 8 puntos juntos)

Si prefieres no ir editando paso a paso, instala todo, crea todos los archivos de los pasos anteriores y pega este `MapView.tsx` completo.

```tsx
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
import { Haptics } from "@capacitor/haptics";
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
import { useGeolocation } from "../hooks/useGeolocation";
import { useNetwork } from "../hooks/useNetwork";
import { useBattery } from "../hooks/useBattery";
import { useNotifications } from "../hooks/useNotifications";
import { useMotion } from "../hooks/useMotion";
import { usePhotoWatermark } from "../hooks/usePhotoWatermark";
import { getAddress, getNearbyPlaces } from "../services/opencage";
import type { Place } from "../services/opencage";
import { saveTrack } from "../services/trackingStorage";
import { totalDistance, speedKmh } from "../utils/geo";

const LOW_BATTERY = 0.15; // f: batería baja (15 %)
const FAST_KMH = 25; // g: movimiento rápido
const STILL_ALERT_SECONDS = 30; // g: aviso por estar quieto
const AUTO_STOP_SECONDS = 60; // b: el modo automático detiene el tracking

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
  const { online, connectionType } = useNetwork(); // a
  const { level, isCharging } = useBattery(); // f
  const { notify } = useNotifications(); // g
  const { photo, saving, photoError, takeWithWatermark } = usePhotoWatermark(); // d

  const [path, setPath] = useState<[number, number][]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState("restaurante");
  const [loadingApi, setLoadingApi] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  const pathRef = useRef<[number, number][]>([]);
  const startedAtRef = useRef<string>("");
  const lastPointRef = useRef<{ lat: number; lng: number; ts: number } | null>(
    null,
  );

  // b: acelerómetro (activo en modo automático o mientras se hace tracking)
  const { moving, stillSeconds, supported } = useMotion(autoMode || tracking);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  /* ---------- Iniciar / Detener ---------- */

  const handleStart = async () => {
    if (tracking) return;
    pathRef.current = [];
    lastPointRef.current = null;
    startedAtRef.current = new Date().toISOString();
    setPath([]);
    try {
      await Haptics.vibrate({ duration: 300 }); // e
    } catch {
      /* dispositivo sin vibrador */
    }
    await startTracking();
  };

  const handleStop = async () => {
    await stopTracking();

    const points = pathRef.current;
    pathRef.current = []; // evita guardar dos veces
    if (points.length < 2) return;

    try {
      await saveTrack({
        // c
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

  /* ---------- Efectos de sensores ---------- */

  // Cada posición nueva: se agrega al recorrido y se calcula la velocidad
  useEffect(() => {
    if (!position || !tracking) return;

    const point: [number, number] = [position.latitude, position.longitude];
    const next = [...pathRef.current, point];
    pathRef.current = next;
    setPath(next);

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

  /* ---------- API de OpenCage ---------- */

  const handleGetAddress = async () => {
    if (!position) return;
    setLoadingApi(true);
    try {
      const data = await getAddress(position.latitude, position.longitude);
      setAddress(data.results?.[0]?.formatted ?? "Sin resultados");
    } catch {
      setAddress("No se pudo obtener la dirección");
    }
    setLoadingApi(false);
  };

  // h
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

  // d
  const handlePhoto = async () => {
    if (!position) return;
    await takeWithWatermark(
      position.latitude,
      position.longitude,
      address ?? undefined,
    );
  };

  /* ---------- Interfaz ---------- */

  return (
    <>
      <div className="ion-padding">
        <div>
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
          <IonChip color={tracking ? "success" : "medium"}>
            <IonLabel>{tracking ? "Rastreando" : "Detenido"}</IonLabel>
          </IonChip>
        </div>

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
        <IonButton
          onClick={handleGetAddress}
          disabled={!online || !position || loadingApi}
        >
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
```

---

## Permisos nativos (para probar en el celular)

### Android: `android/app/src/main/AndroidManifest.xml`

Dentro de `<manifest>`, fuera de `<application>`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### iOS: `ios/App/App/Info.plist` (solo si pruebas en iPhone)

```xml
<key>NSCameraUsageDescription</key>
<string>Se usa la cámara para tomar fotos con la ubicación</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Se guardan las fotos tomadas</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Se usa la ubicación para mostrar el mapa y el recorrido</string>
<key>NSMotionUsageDescription</key>
<string>Se usa el acelerómetro para detectar si estás en movimiento</string>
```

---

## Cómo probar cada punto

| Punto | Cómo probarlo |
| ----- | ------------- |
| **a** Conexión | Modo avión: el chip se pone rojo y se deshabilitan dirección y lugares. En PC: DevTools → Network → Offline. |
| **b** Movimiento | Solo en celular: activa "Modo automático" y camina. Quieto 60 s, se detiene. |
| **c** Historial | Inicia, muévete, detén. Pestaña Historial: aparece agrupado por día; toca uno para ver la ruta. |
| **d** Foto | "Foto con ubicación": aparece con lat/lng, fecha y dirección en la franja inferior. |
| **e** Vibración | "Iniciar" vibra (solo en celular). |
| **f** Batería | Cambia `LOW_BATTERY` a `0.99` para probar, con el cargador desconectado. |
| **g** Notificaciones | Sin conexión, movimiento rápido (baja `FAST_KMH` a `3` para probar caminando) y sin moverte (30 s quieto). Acepta el permiso de notificaciones al abrir la app. |
| **h** Lugares | Elige categoría y pulsa "Lugares cercanos": marcadores en el mapa y lista con distancia. |

## Errores comunes

- **El mapa sale gris o cortado:** ya se llama `map.invalidateSize()` en `RecenterMap` y en `FitBounds`. Si persiste, recarga la pestaña.
- **Marcador sin ícono:** falta importar `../utils/leafletIcon`.
- **La cámara no abre en el navegador:** falta `defineCustomElements(window)` en `main.tsx`.
- **Dirección o lugares vacíos:** revisa la API key de OpenCage y la conexión.
- **No llegan notificaciones en Android 13+:** acepta el permiso al abrir la app por primera vez.
- **Un cambio no aparece en el celular:** falta `ionic build && npx cap sync`.
- **GPS impreciso dentro de edificios:** prueba afuera. La velocidad se ignora si la precisión es peor a 50 m.
- **El tracking no sigue con la app cerrada:** `@capacitor/geolocation` solo rastrea con la app abierta. Para el reto basta con probarla abierta.
- **No subas la API key de OpenCage a Git.**
