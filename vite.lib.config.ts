/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Read version from package.json
interface PackageJson {
  version: string;
  name: string;
  [key: string]: unknown;
}

const packageJson: PackageJson = JSON.parse(
  readFileSync(path.resolve("./package.json"), "utf8"),
);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },
  build: {
    target: "es2024",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    outDir: "lib",
    // Do not minify library output - consumers will bundle
    minify: false,
    sourcemap: true,
    // Do not empty outDir since tsc declarations are already there
    emptyOutDir: false,
    // Do not copy public assets for library build
    copyPublicDir: false,
    // Inline no assets - library consumers handle their own assets
    assetsInlineLimit: 0,
    rollupOptions: {
      // Externalize all dependencies - consumers provide their own
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "three",
        // Externalize three/* subpath imports (e.g. three/examples/jsm/...)
        /^three\//,
        "@react-three/fiber",
        "@react-three/drei",
        "@react-three/postprocessing",
        "postprocessing",
        // Externalize asset imports (mp3, png, etc.) - not part of the library
        /\.(mp3|wav|ogg|png|jpg|jpeg|svg|webp|webm|gif|glsl|vert|frag|csv|mp4)$/,
      ],
      output: {
        // Preserve module structure for tree-shaking
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        // Do not emit asset files in library mode
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
