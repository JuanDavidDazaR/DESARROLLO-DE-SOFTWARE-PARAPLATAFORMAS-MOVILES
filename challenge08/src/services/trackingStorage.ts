import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const FILE = "tracking_history.json";

export interface TrackSession {
  id: string;
  startedAt: string; // ISO
  endedAt: string; // ISO
  distanceMeters: number;
  points: [number, number][]; // [lat, lng]
}

export const loadTracks = async (): Promise<TrackSession[]> => {
  try {
    const res = await Filesystem.readFile({
      path: FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    const text =
      typeof res.data === "string" ? res.data : await (res.data as Blob).text();
    return JSON.parse(text) as TrackSession[];
  } catch {
    return []; // el archivo aún no existe
  }
};

export const saveTrack = async (track: TrackSession): Promise<void> => {
  const all = await loadTracks();
  all.push(track);
  await Filesystem.writeFile({
    path: FILE,
    directory: Directory.Data,
    data: JSON.stringify(all),
    encoding: Encoding.UTF8,
  });
};

export const clearTracks = async (): Promise<void> => {
  await Filesystem.writeFile({
    path: FILE,
    directory: Directory.Data,
    data: "[]",
    encoding: Encoding.UTF8,
  });
};
