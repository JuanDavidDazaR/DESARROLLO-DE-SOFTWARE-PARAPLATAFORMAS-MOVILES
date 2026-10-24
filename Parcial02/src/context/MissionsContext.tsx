import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthContext } from "./AuthContext";
import { useNotifications } from "../hooks/useNotifications";

export interface MissionDef {
  id: number;
  title: string;
  description: string;
  points: number;
}

export interface MissionProgress {
  id: number;
  completed: boolean;
}

// Mismo formato del enunciado: { points, missions: [{ id, completed }] }
export interface Progress {
  points: number;
  missions: MissionProgress[];
}

// Para probar más fácil puedes bajar esta distancia a 30
export const MOVE_DISTANCE_METERS = 50;
export const STILL_SECONDS = 10;

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    title: "Evidencia",
    description:
      "Toma una foto con la cámara. Se completa al guardar la imagen.",
    points: 30,
  },
  {
    id: 2,
    title: "Movimiento real",
    description: `Muévete más de ${MOVE_DISTANCE_METERS} metros desde tu posición original.`,
    points: 50,
  },
  {
    id: 3,
    title: "Permanencia activa",
    description: `Quédate quieto ${STILL_SECONDS} segundos. Al terminar, el celular vibra. Se habilita al completar la misión 2.`,
    points: 40,
  },
];

export const emptyProgress = (): Progress => ({
  points: 0,
  missions: MISSIONS.map((m) => ({ id: m.id, completed: false })),
});

interface MissionsContextType {
  progress: Progress;
  completedCount: number;
  total: number;
  percent: number;
  syncing: boolean;
  isCompleted: (id: number) => boolean;
  completeMission: (id: number) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const MissionsContext = createContext<MissionsContextType | undefined>(
  undefined,
);

const localKey = (uid: string) => `progress_${uid}`;

function readLocal(uid: string): Progress | null {
  try {
    const raw = localStorage.getItem(localKey(uid));
    return raw ? (JSON.parse(raw) as Progress) : null;
  } catch {
    return null;
  }
}

export function MissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { notify } = useNotifications();
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [syncing, setSyncing] = useState(false);

  // Siempre apunta al progreso más reciente (evita datos viejos en callbacks de sensores)
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Enviar puntos a Firebase. No se espera con await: sin internet la
  // escritura queda en cola y no debe frenar la app.
  const saveRemote = useCallback(
    async (p: Progress) => {
      if (!user) return;
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            email: user.email,
            points: p.points,
            missions: p.missions,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      } catch (e) {
        console.log("No se pudo sincronizar con Firebase", e);
      }
    },
    [user],
  );

  // Al iniciar sesión: carga local, luego Firebase (si hay conexión)
  useEffect(() => {
    if (!user) {
      setProgress(emptyProgress());
      return;
    }

    const local = readLocal(user.uid);
    setProgress(local ?? emptyProgress());

    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (cancelled) return;
        if (snap.exists()) {
          const data = snap.data();
          const remote: Progress = {
            points: data.points ?? 0,
            missions: data.missions ?? emptyProgress().missions,
          };
          setProgress(remote);
          localStorage.setItem(localKey(user.uid), JSON.stringify(remote));
        } else {
          // Crea el documento para que el usuario aparezca en el ranking
          void saveRemote(local ?? emptyProgress());
        }
      } catch (e) {
        console.log("Sin conexión: se usa el progreso local", e);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const completeMission = useCallback(
    async (id: number) => {
      if (!user) return;
      const mission = MISSIONS.find((m) => m.id === id);
      if (!mission) return;

      const current = progressRef.current;
      if (current.missions.find((m) => m.id === id)?.completed) return;

      const next: Progress = {
        points: current.points + mission.points,
        missions: current.missions.map((m) =>
          m.id === id ? { ...m, completed: true } : m,
        ),
      };

      progressRef.current = next;
      setProgress(next);
      localStorage.setItem(localKey(user.uid), JSON.stringify(next));
      void saveRemote(next);

      // Notificaciones locales
      await notify("Misiones", "Has completado una misión");
      const left = next.missions.filter((m) => !m.completed).length;
      if (left === 1) {
        await notify("Misiones", "Te falta 1 misión para completar");
      }
    },
    [user, saveRemote, notify],
  );

  const resetProgress = useCallback(async () => {
    if (!user) return;
    const empty = emptyProgress();
    progressRef.current = empty;
    setProgress(empty);
    localStorage.setItem(localKey(user.uid), JSON.stringify(empty));
    void saveRemote(empty);
  }, [user, saveRemote]);

  const total = MISSIONS.length;
  const completedCount = progress.missions.filter((m) => m.completed).length;
  const percent = Math.round((completedCount / total) * 100);
  const isCompleted = (id: number) =>
    progress.missions.some((m) => m.id === id && m.completed);

  return (
    <MissionsContext.Provider
      value={{
        progress,
        completedCount,
        total,
        percent,
        syncing,
        isCompleted,
        completeMission,
        resetProgress,
      }}
    >
      {children}
    </MissionsContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionsContext);
  if (!context) {
    throw new Error("useMissions debe usarse dentro de MissionsProvider");
  }
  return context;
}
