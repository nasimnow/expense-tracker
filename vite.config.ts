import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-macros", "babel-plugin-styled-components"],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        display: "fullscreen",
        start_url: ".",
        name: "Albanan Expense",
        short_name: "Albanan",
        icons: [
          {
            src: "icon_192.png", // <== don't add slash, for testing
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon_512.png", // <== don't remove slash, for testing
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
