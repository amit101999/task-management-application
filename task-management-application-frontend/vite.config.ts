import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: false }), tailwindcss()],
  preview: {
    allowedHosts: ["promanage.duckdns.org"],
    host: "0.0.0.0",
    port: 4173,
  },
});
