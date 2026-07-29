import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        // Cache static assets (JS, CSS, fonts, images) with stale-while-revalidate
        globPatterns: ["**/*.{js,css,woff2,webp,png,svg}"],
        // Don't pre-cache the large GLB — it's fetched on demand
        globIgnores: ["**/*.{glb,mp4,wasm}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:glb|mp4)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "large-assets",
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: "Kedr Tomsk — Строительство домов и бань",
        short_name: "Kedr Tomsk",
        description: "Строительство деревянных домов и бань из профилированного бруса",
        theme_color: "#1c1a17",
        background_color: "#1c1a17",
        display: "standalone",
        icons: [
          { src: "/logo-icon.png", sizes: "192x192", type: "image/png" },
          { src: "/logo-icon.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom", "three"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Increase chunk warning threshold for three.js which is intentionally large
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — always needed
          "vendor-react": ["react", "react-dom"],
          // Three.js ecosystem — lazy-loaded with 3D pages
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // Animation library
          "vendor-motion": ["framer-motion"],
          // UI / icon libraries
          "vendor-ui": ["lucide-react"],
          // Routing + data fetching
          "vendor-routing": ["wouter", "@tanstack/react-query"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "three"],
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    headers(ctx) {
      // Never cache HTML — always serve fresh
      if (ctx.filename?.endsWith(".html")) {
        return { "Cache-Control": "no-store" };
      }
      // Hashed assets can be cached forever
      return { "Cache-Control": "public, max-age=31536000, immutable" };
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
