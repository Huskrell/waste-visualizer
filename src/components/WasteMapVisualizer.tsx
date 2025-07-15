import {
  useEffect,
  useState,
  type FormEvent,
  type FormEventHandler,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeLocation } from "../utils/geocoding";
import { wasteMassToRadius, formatNumber } from "../utils/wasteCalculations";

const DEFAULT_LOCATION = { lat: 45.734955, lon: 7.313076 }; // e.g. Rome
const GLOBAL_PLASTIC_WASTE_TONS = 360_000_000;

export default function PlasticWasteVisualizer() {
  const params = new URLSearchParams(window.location.search);
  const [param, setParam] = useState(params.get("location") || "");

  const [map, setMap] = useState<L.Map | null>(null);
  const [circle, setCircle] = useState<L.ImageOverlay | null>(null);
  const [wasteRadius, setWasteRadius] = useState(
    wasteMassToRadius(GLOBAL_PLASTIC_WASTE_TONS)
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  const radiusKm = wasteRadius / 1000;
  const areaKm2 = (Math.PI * Math.pow(wasteRadius, 2)) / 1000000;
  const area = formatNumber(Math.round(areaKm2));

  // Initialize map once
  useEffect(() => {
    const mapInstance = L.map("map").setView(
      [currentLocation.lat + 1, currentLocation.lon],
      8
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    setMap(mapInstance);

    // Cleanup on unmount
    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update circle whenever location or radius changes
  useEffect(() => {
    if (!map) return;

    // Remove existing circle
    if (circle) {
      map.removeLayer(circle);
    }

    const bounds: L.LatLngBoundsExpression = [
      [
        currentLocation.lat - wasteRadius / 111320,
        currentLocation.lon -
          wasteRadius /
            ((40075000 * Math.cos((currentLocation.lat * Math.PI) / 180)) /
              360),
      ],
      [
        currentLocation.lat + wasteRadius / 111320,
        currentLocation.lon +
          wasteRadius /
            ((40075000 * Math.cos((currentLocation.lat * Math.PI) / 180)) /
              360),
      ],
    ];

    const overlay = L.imageOverlay("/plastic-texture.png", bounds, {
      opacity: 0.8,
    }).addTo(map);

    overlay.bindPopup(`
      <div style="text-align: center;">
        <h3>Global Plastic Waste</h3>
        <p><strong>360 million tons per year</strong></p>
        <p>Radius: ${(wasteRadius / 1000).toFixed(1)} km</p>
        <p>Area: ${formatNumber(
          (Math.PI * Math.pow(wasteRadius, 2)) / 1000000
        )} km²</p>
        <p><em>Visualized at 10cm depth</em></p>
      </div>
    `);

    map.fitBounds(overlay.getBounds(), { padding: [20, 20] });
    setCircle(overlay);
  }, [map, currentLocation, wasteRadius]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const locationQuery = input.trim();
    if (!locationQuery || !map) return;

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeLocation(locationQuery);
      if (result) {
        setCurrentLocation(result);
        map.setView([result.lat, result.lon], 8);
      } else {
        setError("Location not found. Please try a different city or address.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to search for location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-1">
      <form id="searchForm" onSubmit={handleSearch} className="flex-row gap-2">
        <input
          id="locationInput"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a city or address"
        />
        <button id="searchButton">
          {loading ? "Searching..." : "Search Location"}
        </button>
        {error && <div id="errorMessage">{error}</div>}
      </form>

      <div className="paper">
        <div id="map" style={{ height: "500px", width: "100%" }} />
      </div>

      <div className="paper">
        <p>Radius: {radiusKm.toFixed(1)} km</p>
        <p>Area: {area} km²</p>
      </div>
    </div>
  );
}
