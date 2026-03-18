import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "docs",
      "cypress/results",
      "node_modules",
      "scripts",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "**/shared/base/useKoreanTheme.ts",
      "**/*.test.{ts,tsx}",
      "**/__tests__/**",
    ],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        project: [
          "./tsconfig.app.json",
          "./tsconfig.node.json",
          "./cypress/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Allow setState in effects when syncing with external systems (props, audio, timers)
      "react-hooks/set-state-in-effect": "off",
      // Prevent direct KOREAN_COLORS/FONT_FAMILY imports in screen components
      // Use useKoreanTheme hook instead for centralized theming
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "../../../types/constants",
              importNames: ["KOREAN_COLORS", "FONT_FAMILY"],
              message:
                "Use useKoreanTheme hook instead of direct KOREAN_COLORS/FONT_FAMILY imports. See docs/USEKOREAN_THEME_MIGRATION_GUIDE.md",
            },
            {
              name: "../../types/constants",
              importNames: ["KOREAN_COLORS", "FONT_FAMILY"],
              message:
                "Use useKoreanTheme hook instead of direct KOREAN_COLORS/FONT_FAMILY imports. See docs/USEKOREAN_THEME_MIGRATION_GUIDE.md",
            },
            {
              name: "../types/constants",
              importNames: ["KOREAN_COLORS", "FONT_FAMILY"],
              message:
                "Use useKoreanTheme hook instead of direct KOREAN_COLORS/FONT_FAMILY imports. See docs/USEKOREAN_THEME_MIGRATION_GUIDE.md",
            },
          ],
        },
      ],
      // Relaxed rules for Korean martial arts game development
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Allow any for Three.js integration
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-extraneous-class": "off", // Allow utility classes
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces
      "@typescript-eslint/triple-slash-reference": "off", // Allow for Three.js type definitions
      "prefer-const": "warn",
      "no-case-declarations": "off", // Allow declarations in case blocks
    },
  },
  {
    files: ["cypress/**/*.{ts,tsx}", "**/*.cy.{ts,tsx}", "**/*.test.{ts,tsx}"],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  }
);
