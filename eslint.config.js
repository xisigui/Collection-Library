import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "dist-react", "dist-electron", "release", "node_modules"] },
  {
    files: ["**/*.{ts,tsx,cts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
  {
    files: ["src/renderer/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", {
        allowConstantExport: true,
        allowExportNames: ["buttonVariants"],
      }],
      "no-restricted-imports": ["error", {
        paths: ["electron", "sqlite3"],
        patterns: ["node:*", "**/electron/**"],
      }],
    },
  },
  {
    files: ["src/electron/**/*.{ts,cts}", "vite.config.ts"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/*", "**/renderer/**"] }],
    },
  },
  {
    files: ["src/shared/**/*.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: ["electron", "sqlite3", "react", "react-dom"],
        patterns: ["node:*", "@/*", "**/renderer/**", "**/electron/**"],
      }],
    },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.{mjs,cjs}", "*.config.js"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
);
