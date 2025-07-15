/**
 * Geocoding utilities using OpenStreetMap Nominatim API
 */
export async function geocodeLocation(
  query: string
): Promise<{ lat: number; lon: number; display_name: string } | null> {
  if (!query || query.trim().length === 0) {
    return null;
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&addressdetails=1`,
      {
        headers: {
          "User-Agent": "PlasticWasteVisualizer/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

// Default fallback location (San Francisco, California)
export const DEFAULT_LOCATION = {
  lat: 37.7749,
  lon: -122.4194,
  display_name: "San Francisco, California, United States",
};
