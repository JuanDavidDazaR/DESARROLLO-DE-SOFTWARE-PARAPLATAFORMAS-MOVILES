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
