import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    include: ["react-map-gl", "mapbox-gl"],
  },
  resolve: {
    alias: {
      "mapbox-gl": "mapbox-gl",
    },
  },
});
