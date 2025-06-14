import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage", "docs", "cypress/results", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
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
      // Relaxed rules for Korean martial arts game development
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off", // Too noisy
      "@typescript-eslint/no-explicit-any": "warn", // Allow any for PixiJS integration
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-extraneous-class": "off", // Allow utility classes
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty interfaces
      "@typescript-eslint/triple-slash-reference": "off", // Allow for PixiJS
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
