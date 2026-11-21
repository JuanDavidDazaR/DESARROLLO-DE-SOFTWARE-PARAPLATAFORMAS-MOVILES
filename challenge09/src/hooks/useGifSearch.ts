import { useEffect, useState } from "react";
import axios from "axios";
import { searchGifs } from "../services/giphy";
import type { Gif } from "../types/giphy";

export function useGifSearch(query: string) {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const text = query.trim();

    // Sin texto: se limpia todo y no se llama a la API
    if (!text) {
      setGifs([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchGifs(text, { signal: controller.signal })
      .then((res) => setGifs(res.data))
      .catch((e) => {
        if (axios.isCancel(e)) return; // cancelada a propósito: se ignora
        setGifs([]);
        setError(e instanceof Error ? e.message : "Error desconocido");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  return { gifs, loading, error };
}
