const config = {
  endOfLine: 'lf',
  importOrder: [
    '^react$',
    '<THIRD_PARTY_MODULES>',
    '^@pcit/(.*)$',
    '^~/(.*)$',
    '',
    '^.*\\.(css|scss|sass)$',
  ],
  jsxBracketSameLine: false,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindFunctions: ['cn', 'cva'],
  proseWrap: 'always',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};

export default config;
