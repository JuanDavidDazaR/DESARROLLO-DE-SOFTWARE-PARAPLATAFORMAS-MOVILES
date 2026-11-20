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
