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
