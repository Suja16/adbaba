import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@typings/gql": path.resolve(__dirname, "types/gql/index.js"),
    },
  },
});
