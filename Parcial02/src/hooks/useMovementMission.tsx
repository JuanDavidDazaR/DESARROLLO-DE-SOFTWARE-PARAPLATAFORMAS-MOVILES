import { useState, useRef, useCallback, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";

// Distancia en metros entre dos coordenadas (fórmula de Haversine)
function distanceMeters(
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

export function useMovementMission(
  targetMeters: number,
  onReached: () => void,
) {
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const originRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchRef = useRef<string | null>(null);
  const activeRef = useRef(false);
  const onReachedRef = useRef(onReached);
  onReachedRef.current = onReached;

  const clear = useCallback(async () => {
    if (watchRef.current) {
      const id = watchRef.current;
      watchRef.current = null;
      await Geolocation.clearWatch({ id });
    }
  }, []);

  const stop = useCallback(async () => {
    activeRef.current = false;
    setTracking(false);
    await clear();
  }, [clear]);

  const start = useCallback(async () => {
    if (activeRef.current) return;
    setError(null);
    try {
      try {
        await Geolocation.requestPermissions();
      } catch {
        /* en web no existe: el navegador pregunta al leer la ubicación */
      }

      // Posición original
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      originRef.current = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };
      setDistance(0);
      activeRef.current = true;
      setTracking(true);

      // Seguimiento de la posición
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 15000 },
        (position, err) => {
          if (err || !position || !originRef.current || !activeRef.current)
            return;

          const d = distanceMeters(
            originRef.current.lat,
            originRef.current.lon,
            position.coords.latitude,
            position.coords.longitude,
          );
          setDistance(d);

          if (d > targetMeters) {
            activeRef.current = false;
            setTracking(false);
            clear();
            onReachedRef.current();
          }
        },
      );

      if (!activeRef.current) {
        Geolocation.clearWatch({ id });
        return;
      }
      watchRef.current = id;
    } catch (e) {
      setError((e as Error).message || "No se pudo obtener la ubicación");
      setTracking(false);
      activeRef.current = false;
    }
  }, [targetMeters, clear]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      clear();
    };
  }, [clear]);

  return { tracking, distance, error, start, stop };
}
