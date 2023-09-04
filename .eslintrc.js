module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        printWidth: 96,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        arrowParens: 'avoid',
        semi: false,
        endOfLine: 'auto',
        parser: 'typescript',
        objectShortHand: true,
        semicolons: false
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ]
  }
}
