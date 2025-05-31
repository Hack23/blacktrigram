/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Enhanced coverage for Korean martial arts game systems
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov", "clover"],
      include: [
        "src/systems/**/*.ts",
        "src/components/**/*.{ts,tsx}",
        "src/audio/**/*.ts",
        "src/hooks/**/*.ts",
        "src/types/**/*.ts",
      ],
      exclude: [
        "node_modules/",
        "src/test/setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "coverage/",
        "cypress/",
        "**/placeholder-sounds.ts",
        "**/DefaultSoundGenerator.ts",
        "**/__tests__/**",
        "**/mocks/**",
        "src/assets/**",
        "src/vite-env.d.ts",
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        // Critical Korean martial arts systems - highest standards
        "src/systems/": {
          branches: 90,
          functions: 92,
          lines: 90,
          statements: 90,
        },
        "src/systems/CombatSystem.ts": {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
        "src/systems/VitalPointSystem.ts": {
          branches: 92,
          functions: 94,
          lines: 92,
          statements: 92,
        },
        "src/systems/trigram/": {
          branches: 88,
          functions: 90,
          lines: 88,
          statements: 88,
        },
        "src/systems/vitalpoint/": {
          branches: 88,
          functions: 90,
          lines: 88,
          statements: 88,
        },
        // Audio system - Korean martial arts authenticity
        "src/audio/": {
          branches: 85,
          functions: 88,
          lines: 85,
          statements: 85,
        },
        // Game components - user experience critical
        "src/components/game/": {
          branches: 80,
          functions: 82,
          lines: 80,
          statements: 80,
        },
        // UI components - moderate coverage
        "src/components/ui/": {
          branches: 75,
          functions: 78,
          lines: 75,
          statements: 75,
        },
      },
    },
    // Test timeout for Korean martial arts audio loading
    testTimeout: 10000,
    // Enhanced test patterns
    include: [
      "src/**/*.{test,spec}.{js,ts,tsx}",
      "src/**/__tests__/**/*.{js,ts,tsx}",
    ],
    // Mock Korean font loading
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    // Performance testing for Korean martial arts game
    pool: "threads",
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
      },
    },
  },
});
