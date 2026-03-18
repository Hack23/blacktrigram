module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // Core TypeScript rules for Korean martial arts game
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_|^props$|^e$|^event$|^g$|^graphics$",
        varsIgnorePattern: "^_|^React$|^PIXI$|^Howler$",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { allow: ["warn", "error", "log"] }], // Allow console.log for game debugging
    "react/react-in-jsx-scope": "off", // React 17+
    "react/prop-types": "off", // TypeScript handles validation
    "react/display-name": "off",

    // Game-specific rules
    "prefer-const": "warn",
    "no-var": "error",
    "@typescript-eslint/prefer-readonly": "warn",
  },
  overrides: [
    // Test files - Korean martial arts testing patterns
    {
      files: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/**/*.spec.tsx",
        "src/test/**/*.ts",
        "src/test/**/*.tsx",
        "**/__tests__/**/*.ts",
        "**/__tests__/**/*.tsx",
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-console": "off",
      },
    },

    // Mock files - Audio and PixiJS mocks
    {
      files: [
        "**/__mocks__/**",
        "**/mocks/**",
        "**/*.mock.ts",
        "**/*.mock.tsx",
        "**/test-utils.ts",
        "**/test-setup.ts",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off",
      },
    },

    // Type definition files - Korean martial arts types
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },

    // Game systems - Combat, Trigram, VitalPoint systems
    {
      files: ["src/systems/**/*.ts", "src/systems/**/*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern:
              "^_|^player.*|^stance.*|^technique.*|^vitalPoint.*",
            varsIgnorePattern: "^_|^TRIGRAM_.*|^VITAL_.*|^KOREAN_.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Audio system - Howler.js integration
    {
      files: ["src/audio/**/*.ts", "src/audio/**/*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^audio.*|^sound.*|^howl.*",
            varsIgnorePattern: "^_|^Howler$|^audio.*|^DEFAULT_.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Component files - Korean text and PixiJS components
    {
      files: ["src/components/**/*.tsx", "src/components/**/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern:
              "^_|^props$|^e$|^event$|^korean$|^english$|^stance$|^player.*",
            varsIgnorePattern:
              "^_|^React$|^Container$|^Graphics$|^Text$|^Stage$|^korean.*|^english.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Game engine and PixiJS files
    {
      files: ["src/components/game/**/*.tsx", "src/components/game/**/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^g$|^graphics$|^app$|^stage$|^renderer$",
            varsIgnorePattern:
              "^_|^PIXI$|^Container$|^Graphics$|^Application$|^game.*",
            ignoreRestSiblings: true,
          },
        ],
        "no-console": ["warn", { allow: ["warn", "error", "log"] }], // Game debugging
      },
    },

    // Korean text components - Bilingual handling
    {
      files: [
        "src/components/ui/base/korean-text/**/*.tsx",
        "src/components/ui/base/korean-text/**/*.ts",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^korean$|^english$|^romanization$",
            varsIgnorePattern: "^_|^Korean.*|^KOREAN_.*|^font.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Training and intro screens
    {
      files: [
        "src/components/training/**/*.tsx",
        "src/components/intro/**/*.tsx",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^stance$|^trigram$|^selected.*",
            varsIgnorePattern: "^_|^TRIGRAM_.*|^trigramData$|^technique.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Type constants and data files
    {
      files: ["src/types/**/*.ts", "src/types/constants/**/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off", // Constants may be imported selectively
        "prefer-const": "error",
        "no-var": "error",
      },
    },

    // Utility functions - Player, game utilities
    {
      files: ["src/utils/**/*.ts", "src/utils/**/*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^player.*|^archetype$|^stance$",
            varsIgnorePattern: "^_|^initial.*|^default.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },

    // Main App.tsx - Game phase management
    {
      files: ["src/App.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_|^phase$|^winner$|^updates$",
            varsIgnorePattern: "^_|^INITIAL_.*|^app.*|^header.*",
            ignoreRestSiblings: true,
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    "node_modules/**/*.*",
    "dist/**",
    "build/",
    "coverage/",
    "**/*.js.map",
    "**/*.d.ts.map",
    "docs/**",
    "public/**", // Static assets
    "src/assets/**", // Game assets (images, sounds)
  ],
};
