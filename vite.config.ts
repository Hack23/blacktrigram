import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { glslPlugin } from "./vite-plugins/glsl-plugin.ts";

// Read version from package.json
interface PackageJson {
  version: string;
  name: string;
  [key: string]: unknown;
}

const packageJson: PackageJson = JSON.parse(
  readFileSync(path.resolve("./package.json"), "utf8"),
);

// Custom plugin to inject version into service worker
function injectVersionPlugin(): Plugin {
  return {
    name: "inject-version-to-sw",
    apply: "build",
    writeBundle() {
      // Copy service worker from public to dist and inject version
      const publicSwPath = path.resolve("./public/sw.js");
      const distSwPath = path.resolve("./dist/sw.js");

      try {
        // Ensure public/sw.js exists
        if (!existsSync(publicSwPath)) {
          console.warn("⚠ Service worker not found in public directory");
          return;
        }

        // Copy and inject version
        const swContent = readFileSync(publicSwPath, "utf8");
        const updatedContent = swContent.replace(
          /__APP_VERSION__/g,
          packageJson.version,
        );
        writeFileSync(distSwPath, updatedContent, "utf8");
        console.log(
          `✓ Service worker updated with version: ${packageJson.version}`,
        );
      } catch (error) {
        console.warn("⚠ Could not update service worker version:", error);
      }
    },
  };
}

export default defineConfig(({ command, mode: _mode }) => ({
  plugins: [
    // Enable React features
    react(),
    // Load GLSL shader files
    glslPlugin(),
    // Inject version into service worker during build
    injectVersionPlugin(),
  ],
  define: {
    APP_VERSION: JSON.stringify(packageJson.version),
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
  },

  // Use relative paths for production builds (GitHub Pages)
  base: command === "build" ? "./" : "/",
  resolve: {
    // Support for TypeScript paths natively in Vite 8
    tsconfigPaths: true,
    alias: {
      // Add path aliases for better tree shaking and import convenience
      "@": "/src",
      "@/components": "/src/components",
      "@/systems": "/src/systems",
      "@/types": "/src/types",
      "@/audio": "/src/audio",
      "@/utils": "/src/utils",
      "@/hooks": "/src/hooks",
      "@/data": "/src/data",
      "@/assets": "/src/assets",
    },
    // Deduplicate React to prevent multiple instances in the bundle,
    // which can cause "Cannot read properties of undefined (reading 'createContext')"
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
    // Exclude heavy modules from dev pre-bundling to reduce TBT
    exclude: [
      "src/types/constants/techniques.ts",
      "src/types/constants/combat.ts",
      "src/audio/placeholder-sounds.ts",
    ],
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1500,
    // Enable CSS minification
    cssMinify: true,
    // Create a single CSS file
    cssCodeSplit: false,
    // Inline smaller assets for fewer requests
    assetsInlineLimit: 1024,
    // Disable sourcemaps in production
    sourcemap: false,

    rolldownOptions: {
      output: {
        // Inline all dynamic imports to create a single JS file
        codeSplitting: false,

        // Optimize asset naming for better caching
        entryFileNames: "assets/[name]-[hash:6].js",
        chunkFileNames: "assets/[name]-[hash:6].js",

        assetFileNames: (assetInfo): string => {
          // Organize assets by type
          if (/\.css$/i.test(assetInfo.name ?? "")) {
            return "assets/game-[hash:6][extname]";
          }
          if (/\.(mp3|wav|ogg)$/i.test(assetInfo.name ?? "")) {
            return "assets/audio/[name]-[hash:6][extname]";
          }
          if (/\.(png|jpg|jpeg|svg|webp)$/i.test(assetInfo.name ?? "")) {
            return "assets/images/[name]-[hash:6][extname]";
          }
          return "assets/[name]-[hash:6][extname]";
        },
      },

      // Tree shaking optimization for Three.js
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },

    // Aggressive asset optimization
    reportCompressedSize: false, // Skip for faster builds
  },

  // Enhanced server configuration for Korean martial arts development
  server: {
    host: true,
    port: 5173,
    hmr: { overlay: false },
    middlewareMode: false,
  },

  // Preview server optimizations
  preview: {
    port: 4173,
    host: true,
    // Production preview optimizations
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
}));
