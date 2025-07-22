# Plastic Waste Visualizer

This project visualizes the global plastic waste footprint on an interactive map using [Leaflet](https://leafletjs.com/) and React. Users can search for any city or address to see how much area would be covered by 360 million tons of plastic waste.

## 🚀 Features

- Search for any location and visualize the plastic waste footprint.
- Interactive map with adjustable waste radius and area display.
- Uses OpenStreetMap tiles and a custom plastic texture overlay.

## 🧑‍💻 Getting Started

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Start the development server:**
   ```sh
   pnpm dev
   ```
3. Open [http://localhost:4321](http://localhost:4321) in your browser.

## 🗂️ Project Structure

- `src/components/WasteMapVisualizer.tsx` — Main map visualization component.
- `src/utils/` — Utility functions for geocoding and waste calculations.
- `public/plastic-texture.png` — Overlay texture for plastic waste.

## 📦 Build & Preview

- Build for production:
  ```sh
  pnpm build
  ```
- Preview the build:
  ```sh
  pnpm preview
  ```

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Leaflet Documentation](https://leafletjs.com/)

---

Made with Astro & React.