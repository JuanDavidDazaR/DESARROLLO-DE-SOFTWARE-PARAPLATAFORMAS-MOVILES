export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Distancia total de un recorrido [[lat, lng], ...]
export function totalDistance(points: [number, number][]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distanceMeters(
      points[i - 1][0],
      points[i - 1][1],
      points[i][0],
      points[i][1],
    );
  }
  return total;
}

// Velocidad en km/h entre dos puntos (timestamps en milisegundos)
export function speedKmh(
  lat1: number,
  lon1: number,
  t1: number,
  lat2: number,
  lon2: number,
  t2: number,
): number {
  const seconds = (t2 - t1) / 1000;
  if (seconds <= 0) return 0;
  return (distanceMeters(lat1, lon1, lat2, lon2) / seconds) * 3.6;
}
