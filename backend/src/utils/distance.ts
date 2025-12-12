export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusKm = 6371;

  // Convert degrees to radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

  // Haversine formula
  // a = sin²(deltaLat/2) + cos(lat1) · cos(lat2) · sin²(deltaLon/2)
  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
    Math.cos(lat2Rad) *
    Math.sin(deltaLonRad / 2) *
    Math.sin(deltaLonRad / 2);

  // c = 2 · atan2(√a, √(1−a))
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // distance = R · c
  return earthRadiusKm * c;
}