import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

// Optional plugin to rename a CSS file after build
function changeCssFilename() {
  return {
    name: "change-css-filename",
    writeBundle() {
      const cssPath = resolve(__dirname, "dist/static/css/App.css");
      if (fs.existsSync(cssPath)) {
        fs.renameSync(
          cssPath,
          resolve(__dirname, "dist/static/css/App.popup.css")
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), changeCssFilename()],
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: false, // no minification for dev/debug
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.tsx"),
        popup: resolve(__dirname, "src/components/popup/popup.tsx"),
        content: resolve(__dirname, "src/components/content/content.js"),
      },
      output: {
        entryFileNames: "static/js/[name].js",
        chunkFileNames: "static/js/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "static/css/[name]";
          }
          return "static/[name]";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    strictPort: true,
    port: 5173,
  },
  css: {
    devSourcemap: true,
  },
});

// "dev": "webpack --watch",
// "start": "npm run dev & web-ext run --source-dir=build",
// "build": "set INLINE_RUNTIME_CHUNK=false && craco build",
