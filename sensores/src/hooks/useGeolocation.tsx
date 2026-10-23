import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

export const useGeolocation = () => {
  const [position, setPosition] = useState<any>(null);
  const [watchId, setWatchId] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const getCurrentLocation = async () => {
    try {
      const pos = await Geolocation.getCurrentPosition();
      setPosition(pos.coords);
    } catch (err) {
      setError(err);
    }
  };

  const startTracking = async () => {
    const id = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (pos, err) => {
        if (err) {
          setError(err);
          return;
        }
        if (!pos) return;
        setPosition(pos.coords);
      }
    );
    setWatchId(id);
  };

  const stopTracking = async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
    }
  };

  return {
    position, error,
    getCurrentLocation,
    startTracking, stopTracking,
  };
};
