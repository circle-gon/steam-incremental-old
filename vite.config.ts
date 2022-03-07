import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      ...checker({
        typescript: true,
        eslint: {
          lintCommand: "eslint . --ext .vue,.cjs,.ts --fix",
        },
      }),
      apply: "serve",
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "",
});
