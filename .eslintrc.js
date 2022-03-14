module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["standard-react", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint"
  ],
  env: {
    es6: true,
    node: true
  },
  rules: {
    "no-var": "error",
    semi: "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "no-multiple-empty-lines": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-floating-promises": ["error"],
  }
};
