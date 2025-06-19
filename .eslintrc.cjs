module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
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
    // Import plugin configuration for Korean martial arts project
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      },
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/external-module-folders": ["node_modules", "@types"],
    "import/internal-regex": "^(@/|src/)",
    "import/ignore": ["\\.(scss|less|css)$", "\\.json$", "node_modules"],
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
    "no-console": ["warn", { allow: ["warn", "error", "log"] }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "prefer-const": "warn",
    "no-var": "error",
    "@typescript-eslint/prefer-readonly": "warn",

    // Import/Export rules for Korean martial arts codebase
    "import/no-unresolved": [
      "error",
      {
        commonjs: true,
        amd: true,
        caseSensitive: true,
      },
    ],
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error", // Prevents duplicate exports

    // Helpful warnings
    "import/no-deprecated": "warn",
    "import/no-empty-named-blocks": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.{ts,tsx,js,jsx}",
          "**/*.spec.{ts,tsx,js,jsx}",
          "**/test/**/*",
          "**/tests/**/*",
          "**/__tests__/**/*",
          "**/vitest.config.ts",
          "**/vite.config.ts",
          "**/jest.config.{js,ts}",
          "**/.eslintrc.{js,cjs,ts}",
          "**/cypress/**/*",
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    "import/no-unused-modules": [
      "warn",
      {
        unusedExports: true,
        missingExports: true,
      },
    ],

    // Static analysis
    "import/no-absolute-path": "error",
    "import/no-cycle": [
      "error",
      {
        maxDepth: 10,
        ignoreExternal: true,
      },
    ],
    "import/no-dynamic-require": "warn",
    "import/no-self-import": "error",
    "import/no-useless-path-segments": [
      "error",
      {
        commonjs: true,
      },
    ],
    "import/no-webpack-loader-syntax": "error",

    // Style guide rules
    "import/first": "error",
    "import/newline-after-import": [
      "error",
      {
        count: 1,
      },
    ],
    "import/no-duplicates": [
      "error",
      {
        "prefer-inline": false,
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "@pixi/**",
            group: "external",
            position: "after",
          },
          {
            pattern: "../../../**",
            group: "parent",
            position: "before",
          },
          {
            pattern: "../../**",
            group: "parent",
            position: "before",
          },
          {
            pattern: "../**",
            group: "parent",
            position: "before",
          },
          {
            pattern: "./**",
            group: "sibling",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],

    // Korean martial arts specific rules
    "import/prefer-default-export": "off", // Allow named exports for Korean techniques
    "import/no-default-export": "off", // Allow default exports for components
    "import/max-dependencies": ["warn", { max: 15 }],
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
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off",
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
        "import/no-extraneous-dependencies": "off",
        "import/prefer-default-export": "off",
        "import/export": "off",
      },
    },

    // Type definition files - Korean martial arts types
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "import/no-duplicates": "off",
        "import/export": "off",
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
        "import/max-dependencies": ["warn", { max: 20 }],
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
        "import/no-cycle": "off", // Audio modules may have circular dependencies
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
        "import/prefer-default-export": "off", // Components may export multiple things
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
        "no-console": ["warn", { allow: ["warn", "error", "log"] }],
        "import/no-cycle": ["error", { maxDepth: 5 }], // Stricter for game engine
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
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "error",
        "no-var": "error",
        "import/prefer-default-export": "off",
        "import/no-unused-modules": "off", // Type files may have selective imports
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

    // Main App component
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
        "import/max-dependencies": ["warn", { max: 25 }], // App may import many modules
      },
    },

    // Index files - Allow re-exports
    {
      files: ["**/index.ts", "**/index.tsx"],
      rules: {
        "import/prefer-default-export": "off",
        "import/no-unused-modules": "off",
        "import/export": "warn", // Still check for duplicate exports in index files
      },
    },

    // Configuration files
    {
      files: [
        "*.config.{js,ts,cjs,mjs}",
        ".eslintrc.{js,cjs}",
        "vite.config.ts",
        "vitest.config.ts",
      ],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "import/no-default-export": "off",
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
    "public/**",
    "src/assets/**",
  ],
};
