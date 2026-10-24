import { useState, useRef, useCallback, useEffect } from "react";
import { Motion } from "@capacitor/motion";
import type { PluginListenerHandle } from "@capacitor/core";
import { Haptics } from "@capacitor/haptics";

// Cambio mínimo entre dos lecturas del acelerómetro para considerar "movimiento"
const MOVEMENT_THRESHOLD = 0.5;

export function useStillness(seconds: number, onDone: () => void) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const [error, setError] = useState<string | null>(null);

  const activeRef = useRef(false);
  const handleRef = useRef<PluginListenerHandle | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastMoveRef = useRef(0);
  const lastVecRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const cleanup = useCallback(() => {
    activeRef.current = false;
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (handleRef.current) {
      handleRef.current.remove();
      handleRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setRunning(false);
    setRemaining(seconds);
  }, [cleanup, seconds]);

  const start = useCallback(async () => {
    if (activeRef.current) return;
    setError(null);
    activeRef.current = true;
    lastVecRef.current = null;
    lastMoveRef.current = Date.now();
    setRemaining(seconds);
    setRunning(true);

    try {
      const handle = await Motion.addListener("accel", (event) => {
        const a = event.accelerationIncludingGravity;
        if (!a) return;
        const prev = lastVecRef.current;
        if (prev) {
          const delta = Math.sqrt(
            (a.x - prev.x) ** 2 + (a.y - prev.y) ** 2 + (a.z - prev.z) ** 2,
          );
          // Si se mueve, se reinicia la cuenta de "quieto"
          if (delta > MOVEMENT_THRESHOLD) lastMoveRef.current = Date.now();
        }
        lastVecRef.current = { x: a.x, y: a.y, z: a.z };
      });

      if (!activeRef.current) {
        handle.remove();
        return;
      }
      handleRef.current = handle;
    } catch (e) {
      cleanup();
      setRunning(false);
      setError(
        "No se pudo acceder al acelerómetro: " + ((e as Error).message ?? ""),
      );
      return;
    }

    // Revisa cada 200 ms cuánto tiempo lleva quieto (no bloquea la pantalla)
    intervalRef.current = window.setInterval(async () => {
      const elapsed = (Date.now() - lastMoveRef.current) / 1000;
      setRemaining(Math.max(0, Math.ceil(seconds - elapsed)));

      if (elapsed >= seconds) {
        cleanup();
        setRunning(false);
        try {
          await Haptics.vibrate({ duration: 800 });
        } catch {
          /* dispositivo sin vibrador */
        }
        onDoneRef.current();
      }
    }, 200);
  }, [seconds, cleanup]);

  useEffect(() => cleanup, [cleanup]);

  return { running, remaining, error, start, stop };
}
