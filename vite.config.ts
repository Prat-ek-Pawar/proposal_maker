import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ["path", "stream", "util", "buffer", "process"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Direct base64-js to our robust internal polyfill
      "base64-js": path.resolve(__dirname, "src/polyfills/base64-js.ts"),
    },
  },
  optimizeDeps: {
    include: ["@react-pdf/renderer", "base64-js"],
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
