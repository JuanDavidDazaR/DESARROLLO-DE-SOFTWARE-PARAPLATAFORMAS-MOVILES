import { useState, useCallback } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";

// Dibuja líneas de texto en una franja oscura en la parte inferior
const drawWatermark = (dataUrl: string, lines: string[]): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo crear el canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const fontSize = Math.max(16, Math.round(img.width / 28));
      const pad = fontSize / 2;
      const lineH = fontSize * 1.3;
      const boxH = lineH * lines.length + pad * 2;

      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, img.height - boxH, img.width, boxH);

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textBaseline = "top";
      lines.forEach((line, i) => {
        ctx.fillText(line, pad, img.height - boxH + pad + i * lineH);
      });

      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = dataUrl;
  });

export function usePhotoWatermark() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const takeWithWatermark = useCallback(
    async (lat: number, lng: number, address?: string): Promise<boolean> => {
      setPhotoError(null);
      try {
        const shot = await Camera.getPhoto({
          quality: 80,
          width: 1280,
          correctOrientation: true,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
        });
        if (!shot.base64String) throw new Error("No se obtuvo la imagen");

        setSaving(true);
        const lines = [
          `Lat: ${lat.toFixed(6)}  Lng: ${lng.toFixed(6)}`,
          new Date().toLocaleString("es-CO"),
        ];
        if (address) lines.push(address);

        const original = `data:image/${shot.format};base64,${shot.base64String}`;
        const marked = await drawWatermark(original, lines);

        await Filesystem.writeFile({
          path: `foto_ubicacion_${Date.now()}.jpeg`,
          data: marked.split(",")[1], // base64 sin el encabezado
          directory: Directory.Data,
        });

        setPhoto(marked);
        setSaving(false);
        return true;
      } catch (e) {
        setSaving(false);
        setPhotoError((e as Error).message || "No se pudo tomar la foto");
        return false;
      }
    },
    [],
  );

  return { photo, saving, photoError, takeWithWatermark };
}
