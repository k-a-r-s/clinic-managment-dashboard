import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    proxy: {
      "/api": {
        target: "https://04587382da26.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
