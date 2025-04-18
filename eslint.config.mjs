// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt(prettierRecommended, {
  files: ["**/*.js", "**/*.ts", "**/*.vue"],
  plugins: {
    vue,
    prettier,
  },
  rules: {
    "no-use-before-define": [
      2,
      {
        functions: false,
      },
    ],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "brace-style": 2,
    "no-mixed-spaces-and-tabs": 2,
    "key-spacing": 2,
    "comma-spacing": 2,
    "array-bracket-spacing": 2,
    "space-in-parens": 2,
    "no-trailing-spaces": 2,
    "comma-style": 2,
    "space-infix-ops": 2,
    "keyword-spacing": 2,
    "space-before-blocks": 2,
    "spaced-comment": 2,
    "no-multiple-empty-lines": [
      2,
      {
        max: 1,
      },
    ],
    complexity: 2,
    "max-depth": [
      2,
      {
        max: 4,
      },
    ],
    "default-case": 0,
    "dot-notation": 2,
    "no-alert": 2,
    "no-empty-function": 0,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-implicit-coercion": 2,
    "no-multi-spaces": 2,
    "no-useless-return": 2,
    "no-console": 2,
    "global-require": 1,
    "computed-property-spacing": 2,
    "consistent-this": 2,
    "func-call-spacing": 2,
    "func-names": 2,
    "func-name-matching": 2,
    "func-style": [
      2,
      "declaration",
      {
        allowArrowFunctions: true,
      },
    ],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    "line-comment-position": 2,
    "linebreak-style": 2,
    "lines-around-comment": 0,
    "max-statements-per-line": 2,
    "no-lonely-if": 2,
    "prefer-const": 2,
    "no-mixed-operators": 2,
    "no-multi-assign": 2,
    "no-unneeded-ternary": 2,
    "max-len": [
      2,
      {
        code: 120,
      },
    ],
    "object-property-newline": [
      2,
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
    "operator-linebreak": 2,
    "quote-props": [2, "as-needed"],
    quotes: [
      2,
      "single",
      {
        allowTemplateLiterals: true,
      },
    ],
    semi: [2, "never"],
    "semi-spacing": 2,
    "one-var": [2, "never"],
    "eol-last": 2,
    "newline-after-var": 0,
    "no-var": 2,
    "no-case-declarations": 0,
    "sort-imports": [
      2,
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],

    "vue/multi-word-component-names": 0,

    "prettier/prettier": [
      1,
      {
        semi: false,
        singleQuote: true,
      },
    ],
  },
});
