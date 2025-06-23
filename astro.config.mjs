import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  site: "https://fortnite.alexpiral.com/",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  experimental: {
    optimizeHoistedScript: true,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
          },
        },
      },
    },
    ssr: {
      noExternal: ["react", "react-dom"],
    },
  },
});
