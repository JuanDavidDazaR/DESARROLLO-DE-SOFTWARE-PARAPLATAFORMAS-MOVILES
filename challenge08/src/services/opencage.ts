import { distanceMeters } from '../utils/geo';

// La key sale del archivo .env (Vite solo expone las variables con prefijo VITE_)
const API_KEY = import.meta.env.VITE_OPENCAGE_KEY ?? '';
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const getAddress = async (lat: number, lng: number) => {
  const response = await fetch(`${BASE_URL}?q=${lat}+${lng}&key=${API_KEY}&language=es`);
  if (!response.ok) throw new Error('Error consultando OpenCage');
  const data = await response.json();
  return data;
};

export interface Place {
  name: string;
  formatted: string;
  lat: number;
  lng: number;
  distance: number; // metros
}

// Busca una categoría ("restaurante", "farmacia"...) cerca de la posición
export const getNearbyPlaces = async (
  lat: number,
  lng: number,
  category: string,
): Promise<Place[]> => {
  const url =
    `${BASE_URL}?q=${encodeURIComponent(category)}` +
    `&proximity=${lat},${lng}&limit=10&language=es&no_annotations=1&key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Error consultando OpenCage');
  const data = await response.json();

  const places: Place[] = (data.results ?? []).map((r: any) => ({
    name: String(r.formatted).split(',')[0],
    formatted: r.formatted,
    lat: r.geometry.lat,
    lng: r.geometry.lng,
    distance: distanceMeters(lat, lng, r.geometry.lat, r.geometry.lng),
  }));

  return places.sort((a, b) => a.distance - b.distance);
};
