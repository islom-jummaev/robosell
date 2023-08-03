import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
    cssCodeSplit: true
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@core": resolve(__dirname, "src/core"),
      "@stores": resolve(__dirname, "src/stores"),
      "@ui": resolve(__dirname, "src/shared/ui"),
      "@customTypes": resolve(__dirname, "src/shared/customTypes"),
      "@utils": resolve(__dirname, "src/shared/utils"),
      "@assets": resolve(__dirname, "src/assets")
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/assets/styles/_mixins.scss" as *;
        @use "@/assets/styles/_variables.scss" as *;
        `,
      },
    },
  },
});
