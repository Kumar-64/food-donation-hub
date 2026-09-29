function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(start, end) {
  if (!start || !end) {
    return null;
  }

  const [startLat, startLng] = [Number(start.latitude), Number(start.longitude)];
  const [endLat, endLng] = [Number(end.latitude), Number(end.longitude)];

  if ([startLat, startLng, endLat, endLng].some((value) => Number.isNaN(value))) {
    return null;
  }

  const earthRadius = 6371;
  const deltaLat = toRadians(endLat - startLat);
  const deltaLng = toRadians(endLng - startLng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) *
      Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadius * c).toFixed(2));
}

module.exports = {
  haversineDistanceKm
};
