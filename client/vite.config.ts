import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared") // repo-root/shared
    }
  },
  server: { fs: { allow: [".."] } }, // allow ../shared during dev
  build: { outDir: "dist", emptyOutDir: true },
  base: "/"
});
