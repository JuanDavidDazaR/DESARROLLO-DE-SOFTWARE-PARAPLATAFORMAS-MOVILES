import { useState } from "react";
import { rtdb } from "../firebase/Config";
import {
  ref,
  get,
  push,
  update as updateRef,
  remove as removeRef,
} from "firebase/database";

export function useRealTimeCollection(table: string) {
  const [results, setResults] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setIsPending(true);
    setError(null);
    try {
      const snapshot = await get(ref(rtdb, table));
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, value]) => ({
          id,
          ...(value as Record<string, unknown>),
        }));
        setResults(data);
      } else {
        setResults([]);
      }
      setIsPending(false);
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
    }
  };

  const add = async (data: Record<string, unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      const newRef = await push(ref(rtdb, table), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      setIsPending(false);
      return newRef;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return null;
    }
  };

  const update = async (id: string, data: Record<string, unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      await updateRef(ref(rtdb, `${table}/${id}`), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setIsPending(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return false;
    }
  };
  const remove = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await removeRef(ref(rtdb, `${table}/${id}`));
      setIsPending(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsPending(false);
      return false;
    }
  };

  return { results, isPending, error, getAll, add, update, remove };
}
