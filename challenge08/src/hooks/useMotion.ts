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
