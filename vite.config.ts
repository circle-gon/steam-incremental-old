import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/

// eslint: ran by checker
// pretty: builtin to stackblitz editor
// vue-tsc: supports watch mode but doesn't have checker support yet
export default defineConfig({
  plugins: [
    vue(),
    {
      ...checker({
        typescript: true,
        eslint: {
          lintCommand: "eslint . --ext .vue,.cjs,.ts --fix",
        },
        //vueTsc: true
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
