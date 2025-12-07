/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import path from "path";
import { defineConfig, Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Read version from package.json
interface PackageJson {
  version: string;
  name: string;
  [key: string]: unknown;
}

const packageJson: PackageJson = JSON.parse(
  readFileSync(path.resolve("./package.json"), "utf8")
);

// Custom plugin to inject version into service worker
function injectVersionPlugin(): Plugin {
  return {
    name: 'inject-version-to-sw',
    apply: 'build',
    closeBundle() {
      // Copy service worker from public to dist and inject version
      const publicSwPath = path.resolve('./public/sw.js');
      const distSwPath = path.resolve('./dist/sw.js');
      
      try {
        // Ensure public/sw.js exists
        if (!existsSync(publicSwPath)) {
          console.warn('⚠ Service worker not found in public directory');
          return;
        }

        // Copy and inject version
        const swContent = readFileSync(publicSwPath, 'utf8');
        const updatedContent = swContent.replace(
          /__APP_VERSION__/g,
          packageJson.version
        );
        writeFileSync(distSwPath, updatedContent, 'utf8');
        console.log(`✓ Service worker updated with version: ${packageJson.version}`);
      } catch (error) {
        console.warn('⚠ Could not update service worker version:', error);
      }
    }
  };
}

export default defineConfig(({ command, mode: _mode }) => ({
  plugins: [
    // Enable React features
    react(),
    // Support for TypeScript paths
    tsconfigPaths(),
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
    alias: {
      // Add path aliases for better tree shaking
      "@": "/src",
      "@/components": "/src/components",
      "@/systems": "/src/systems",
      "@/types": "/src/types",
      "@/audio": "/src/audio",
      "@/utils": "/src/utils",
    },
    // Deduplicate React to prevent multiple instances in the bundle,
    // which can cause "Cannot read properties of undefined (reading 'createContext')"
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "react-reconciler",
      "howler",
      // Three.js dependencies for optimized dev performance
      "three",
      "@react-three/fiber",
      "@react-three/drei",
    ],
    // Exclude heavy modules from dev pre-bundling to reduce TBT
    exclude: [
      "src/types/constants/techniques.ts",
      "src/types/constants/combat.ts",
      "src/audio/placeholder-sounds.ts",
    ],
  },
  build: {
    target: "es2022",
    // Increased chunk size warning limit for single bundle
    chunkSizeWarningLimit: 1500,
    // Force minification
    minify: "esbuild",
    // Enable CSS minification
    cssMinify: true,
    // Create a single CSS file
    cssCodeSplit: false,
    // Enable Brotli size reporting
    brotliSize: true,
    // Inline smaller assets for fewer requests
    assetsInlineLimit: 1024,
    // Disable sourcemaps in production
    sourcemap: false,

    rollupOptions: {
      output: {
        // Inline all dynamic imports to create a single JS file
        inlineDynamicImports: true,

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

        // Three.js tree shaking optimization
        manualChunks: undefined, // Disable manual chunking for single bundle
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

  esbuild: {
    target: "es2022",
    jsx: "automatic",
    // Remove console logs in production and development to align with production behavior
    drop: ["console", "debugger"],
    // Optimize for smaller bundle
    legalComments: "none",
    minifyIdentifiers: true,
    minifyWhitespace: true,
    minifySyntax: true,
    // Remove the minify property - individual minify options are already set
    // minify: true, // Enable minification in dev for better perf testing
    // Optimize for Korean text rendering
    charset: "utf8",
  },

  // Enhanced server configuration for Korean martial arts development
  server: {
    host: true,
    port: 5173,
    hmr: { overlay: false },
    middlewareMode: false,
    compress: true, // Enable gzip compression in dev
  },

  // Preview server optimizations
  preview: {
    port: 4173,
    host: true,
    // Production preview optimizations
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Encoding": "br", // Prefer Brotli if available
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Enhanced test reporters for Korean martial arts testing
    reporters: [
      [
        "verbose",
        {
          showSummary: true,
          showSuccesses: true,
          showSkipped: true,
          showFailed: true,
          renderSuccesses: true,
        },
      ],
      "html",
    ],
    outputFile: {
      html: "./build/test-results/index.html",
    },
    // Configure types to ensure testing library matchers are recognized
    typecheck: {
      include: ["**/*.{test,spec}.{ts,tsx}"],
      tsconfig: "./tsconfig.json",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: [
        "src/systems/**/*.ts",
        "src/components/**/*.{ts,tsx}",
        "src/audio/**/*.ts",
        "src/hooks/**/*.ts",
        "src/utils/**/*.ts",
        "src/types/**/*.ts",
      ],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "**/docs/**",
        "coverage/",
        "cypress/",
        "**/placeholder-sounds.ts",
        "**/DefaultSoundGenerator.ts",
        "**/__tests__/**",
        "**/mocks/**",
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        "src/systems/": {
          branches: 90,
          functions: 92,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
}));
