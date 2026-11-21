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
