import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    // Target modern browsers for smaller bundles
    target: "es2020",

    // Increase warning limit slightly
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting → eliminates unused-JS warnings
        manualChunks: {
          // React core — always needed
          "vendor-react": ["react", "react-dom"],

          // Router — separate so it doesn't block initial render
          "vendor-router": ["react-router-dom"],

          // Supabase — only loaded when auth is needed
          "vendor-supabase": ["@supabase/supabase-js"],

          // State + forms — lightweight
          "vendor-state": [
            "zustand",
            "react-hook-form",
            "zod",
            "@hookform/resolvers",
          ],

          // UI helpers
          "vendor-ui": [
            "lucide-react",
            "react-hot-toast",
            "clsx",
            "tailwind-merge",
          ],

          // Swiper — only used in Testimonials (lazy boundary)
          "vendor-swiper": ["swiper"],
        },
      },
    },
  },

  // Dev server
  server: {
    port: 5173,
    open: true,
  },

  // Optimize deps — pre-bundle these so Vite doesn't re-transform them on every HMR
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "lucide-react",
    ],
  },
});
