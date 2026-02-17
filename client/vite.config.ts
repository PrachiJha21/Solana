// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If you use "@/..." imports, keep this alias so it points to /client/src
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",        // <— Vercel Output Directory must be "dist"
    emptyOutDir: true,
  },
  // If you deploy at a sub-path, set base accordingly. For Vercel root domain, keep "/".
  base: "/",
});
