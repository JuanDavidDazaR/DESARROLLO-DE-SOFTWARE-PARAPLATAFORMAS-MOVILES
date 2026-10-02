import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../db";

export function useDexie(
  table: string,
  filterFn: ((item: any) => boolean) | null = null,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tiempo real - useLiveQuery
  const liveResults =
    useLiveQuery(() => {
      if (filterFn) {
        return (db as any)[table].filter(filterFn).toArray();
      }
      return (db as any)[table].toArray();
    }, [table, filterFn]) ?? [];

  const add = async (data: Record<string, unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].add({
        ...data,
        createdAt: new Date().toISOString(),
      });
      setIsPending(false);
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
    }
  };

  const update = async (id: number, data: Record<string, unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].update(id, data);
      setIsPending(false);
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
    }
  };

  const deleteItem = async (id: number) => {
    setIsPending(true);
    setError(null);
    try {
      await (db as any)[table].delete(id);
      setIsPending(false);
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
    }
  };

  // newFunction: búsqueda por nombre
  const searchByName = async (texto: string) => {
    try {
      return await (db as any)[table]
        .filter((item: any) =>
          item.nombre?.toLowerCase().includes(texto.toLowerCase()),
        )
        .toArray();
    } catch (err) {
      setError((err as Error).message);
      return [];
    }
  };

  return {
    results: liveResults,
    isPending,
    error,
    add,
    update,
    deleteItem,
    searchByName,
  };
}
