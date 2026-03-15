import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-192.png", "pwa-512.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "flags-cache", expiration: { maxEntries: 50, maxAgeSeconds: 86400 * 30 } },
          },
          {
            urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "logos-cache", expiration: { maxEntries: 200, maxAgeSeconds: 86400 * 7 } },
          },
        ],
      },
      manifest: {
        name: "PrismaFly - TV ao Vivo",
        short_name: "PrismaFly",
        description: "Assista canais de TV ao vivo do mundo inteiro",
        theme_color: "#4338ca",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
