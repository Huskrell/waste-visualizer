/**
 * Utility functions for converting plastic waste volume to map visualization
 */

/**
 * Convert plastic waste volume to circle radius in meters
 * Assumes waste is spread uniformly with 10cm (0.1m) height
 *
 * @param {number} volumeInTons - Volume of plastic waste in metric tons
 * @param {number} densityKgPerM3 - Density of plastic waste in kg/m³ (default: 920 kg/m³ for typical plastic)
 * @param {number} heightInMeters - Height of waste layer in meters (default: 0.1m = 10cm)
 * @returns {number} Radius in meters for the circle
 */
export function wasteMassToRadius(
  volumeInTons: number,
  densityKgPerM3 = 920,
  heightInMeters = 0.1
) {
  // Convert tons to kg
  const volumeInKg = volumeInTons * 1000;

  // Convert kg to m³ using density
  const volumeInM3 = volumeInKg / densityKgPerM3;

  // Calculate area needed (volume / height)
  const areaInM2 = volumeInM3 / heightInMeters;

  // Calculate radius from area (area = π * r²)
  const radiusInMeters = Math.sqrt(areaInM2 / Math.PI);

  return radiusInMeters;
}

/**
 * Format large numbers for display
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num: number) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return num.toString();
}

// Global plastic waste data - approximately 300 million tons per year
export const GLOBAL_PLASTIC_WASTE_TONS = 300_000_000;
