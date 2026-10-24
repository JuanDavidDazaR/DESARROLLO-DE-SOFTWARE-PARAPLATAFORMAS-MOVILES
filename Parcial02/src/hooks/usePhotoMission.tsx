import { useState, useCallback } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";

export function usePhotoMission() {
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Devuelve true solo si la foto se tomó Y se guardó
  const takeAndSave = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      const photo = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      if (!photo.base64String) throw new Error("No se obtuvo la imagen");

      setSaving(true);
      await Filesystem.writeFile({
        path: `mision_${Date.now()}.jpeg`,
        data: photo.base64String,
        directory: Directory.Data,
      });
      setPreview(`data:image/${photo.format};base64,${photo.base64String}`);
      setSaving(false);
      return true;
    } catch (e) {
      setSaving(false);
      setError((e as Error).message || "No se pudo tomar la foto");
      return false;
    }
  }, []);

  return { preview, saving, error, takeAndSave };
}
