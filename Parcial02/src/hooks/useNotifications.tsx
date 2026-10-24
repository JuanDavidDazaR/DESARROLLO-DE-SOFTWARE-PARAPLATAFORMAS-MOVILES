import { useEffect, useCallback } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

export function useNotifications() {
  useEffect(() => {
    LocalNotifications.requestPermissions().catch(() => {});
  }, []);

  const notify = useCallback(async (title: string, body: string) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          { id: Math.floor(Math.random() * 2000000000), title, body },
        ],
      });
    } catch (e) {
      console.log("Notificación no disponible", e);
    }
  }, []);

  return { notify };
}
