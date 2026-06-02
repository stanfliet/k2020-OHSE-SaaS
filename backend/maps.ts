import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api";

/**
 * Get geolocation details for an address
 */
export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId: string;
}> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error("Address not found");
    }

    const result = response.data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

/**
 * Reverse geocode to get address from coordinates
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error("Location not found");
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
}

/**
 * Calculate distance between two locations
 */
export async function calculateDistance(
  origin: { lat: number; lng: number } | string,
  destination: { lat: number; lng: number } | string
): Promise<{
  distance: number; // in meters
  duration: number; // in seconds
  routes: any[];
}> {
  try {
    const originStr =
      typeof origin === "string"
        ? origin
        : `${origin.lat},${origin.lng}`;
    const destStr =
      typeof destination === "string"
        ? destination
        : `${destination.lat},${destination.lng}`;

    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/distancematrix/json?origins=${encodeURIComponent(originStr)}&destinations=${encodeURIComponent(destStr)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.rows[0].elements[0].status !== "OK") {
      throw new Error("Distance calculation failed");
    }

    const element = response.data.rows[0].elements[0];
    return {
      distance: element.distance.value,
      duration: element.duration.value,
      routes: response.data.rows,
    };
  } catch (error) {
    console.error("Distance calculation error:", error);
    throw error;
  }
}

/**
 * Get nearby places (hospitals, fire stations, etc.)
 */
export async function findNearbyPlaces(
  lat: number,
  lng: number,
  placeType: string,
  radius: number = 5000
): Promise<
  Array<{
    name: string;
    lat: number;
    lng: number;
    address: string;
    distance?: number;
  }>
> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((place: any) => ({
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity,
    }));
  } catch (error) {
    console.error("Nearby places search error:", error);
    throw error;
  }
}

/**
 * Get emergency services near a location
 */
export async function findEmergencyServices(
  lat: number,
  lng: number
): Promise<{
  hospitals: any[];
  fireStations: any[];
  policeStations: any[];
}> {
  try {
    const [hospitals, fireStations, policeStations] = await Promise.all([
      findNearbyPlaces(lat, lng, "hospital", 10000),
      findNearbyPlaces(lat, lng, "fire_station", 10000),
      findNearbyPlaces(lat, lng, "police", 10000),
    ]);

    return {
      hospitals,
      fireStations,
      policeStations,
    };
  } catch (error) {
    console.error("Emergency services search error:", error);
    throw error;
  }
}

/**
 * Get static map image URL
 */
export function getStaticMapUrl(
  lat: number,
  lng: number,
  zoom: number = 15,
  width: number = 400,
  height: number = 300
): string {
  return `${GOOGLE_MAPS_BASE_URL}/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
}

/**
 * Get directions between two points
 */
export async function getDirections(
  origin: string,
  destination: string,
  mode: "driving" | "walking" | "transit" = "driving"
): Promise<{
  distance: number;
  duration: number;
  steps: Array<{
    instruction: string;
    distance: number;
    duration: number;
  }>;
  polyline: string;
}> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      distance: leg.distance.value,
      duration: leg.duration.value,
      steps: leg.steps.map((step: any) => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ""),
        distance: step.distance.value,
        duration: step.duration.value,
      })),
      polyline: route.overview_polyline.points,
    };
  } catch (error) {
    console.error("Directions error:", error);
    throw error;
  }
}

/**
 * Get timezone for a location
 */
export async function getTimezoneForLocation(
  lat: number,
  lng: number,
  timestamp: number = Date.now()
): Promise<{
  timeZoneId: string;
  timeZoneName: string;
  dstOffset: number;
  rawOffset: number;
}> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(timestamp / 1000)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    return {
      timeZoneId: response.data.timeZoneId,
      timeZoneName: response.data.timeZoneName,
      dstOffset: response.data.dstOffset,
      rawOffset: response.data.rawOffset,
    };
  } catch (error) {
    console.error("Timezone lookup error:", error);
    throw error;
  }
}

/**
 * Get elevation data for location
 */
export async function getElevation(
  lat: number,
  lng: number
): Promise<{
  elevation: number;
  resolution: number;
}> {
  try {
    const response = await axios.get(
      `${GOOGLE_MAPS_BASE_URL}/elevation/json?locations=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results.length === 0) {
      throw new Error("Elevation data not found");
    }

    const result = response.data.results[0];
    return {
      elevation: result.elevation,
      resolution: result.resolution,
    };
  } catch (error) {
    console.error("Elevation lookup error:", error);
    throw error;
  }
}

/**
 * Create a geofence/location boundary
 */
export function createGeofence(
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): {
  center: { lat: number; lng: number };
  radius: number;
  isPointInside: (lat: number, lng: number) => boolean;
} {
  return {
    center: { lat: centerLat, lng: centerLng },
    radius: radiusMeters,
    isPointInside: (lat: number, lng: number): boolean => {
      const R = 6371000; // Earth's radius in meters
      const dLat = ((lat - centerLat) * Math.PI) / 180;
      const dLng = ((lng - centerLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((centerLat * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= radiusMeters;
    },
  };
}
