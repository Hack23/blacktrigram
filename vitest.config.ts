import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/test-setup.ts"],
    css: true,
    // Korean martial arts specific test configuration
    testTimeout: 10000, // Allow longer tests for complex combat calculations
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    // Mock specific modules for Korean martial arts testing
    deps: {
      inline: ["pixi.js", "@pixi/react"],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        // top-level helpers
        "cypress.reporter.config.js",
        "docs/assets/**",
        // built bundles
        "*.js",
        "blacktrigram/*.js",
        "blacktrigram/docs/assets/**",
        "blacktrigram/**/*.js",
        // skip Pixi & other generated files
        "**/pixi-*.js",
        "**/webworkerAll-*.js",
        "*config.ts",
        ".*.cjs",
        "**/*.cy.ts",
        "cypress/**",
        "dist/assets/**",
        "scripts/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Alias for Korean text components
      "@/korean-text": path.resolve(
        __dirname,
        "./src/components/ui/base/korean-text"
      ),
      // Alias for types
      "@/types": path.resolve(__dirname, "./src/types"),
      // Alias for systems
      "@/systems": path.resolve(__dirname, "./src/systems"),
      // Alias for constants
      "@/constants": path.resolve(__dirname, "./src/types/constants"),
    },
  },
  // Optimize deps for Korean martial arts components
  optimizeDeps: {
    include: ["react", "react-dom", "pixi.js", "@pixi/react"],
    exclude: ["vitest", "@vitest/ui"],
  },
});
