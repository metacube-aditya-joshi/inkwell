// .eslintrc.js
module.exports = {
    ignores: ["node_modules", "dist", "build"],

    parser: '@typescript-eslint/parser', // Use TypeScript parser
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    env: {
      node: true,
      es2021: true,
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended', // TypeScript rules
      'prettier' // Optional: if you're using Prettier
    ],
    rules: {
      // Add custom rules as needed
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      }
    },
  };
  