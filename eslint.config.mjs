import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    eslintConfigPrettier,
    { settings: { react: { version: "detect" } } },
    { rules: { "react/react-in-jsx-scope": "off" } },
    {
        ignores: [
            "**/node_modules/",
            "**/build/",
            "**/dist/",
            "**/coverage/",
            "**/*.test.js",
            "**/*.test.jsx",
        ],
    },
];
