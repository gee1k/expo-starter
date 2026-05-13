/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  bracketSameLine: true,
  trailingComma: 'es5',

  plugins: [
    require.resolve('prettier-plugin-organize-imports'),
    require.resolve('prettier-plugin-tailwindcss'),
  ],
  tailwindFunctions: ['tva'],
};

module.exports = config;
