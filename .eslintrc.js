const path = require('path')

module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'eslint:recommended',
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'plugins': [
    'react-hooks',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'impliedStrict': true,
      'jsx': true
    }
  },
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'linebreak-style': 'off',
    'quotes': ['error', 'single'],
    'indent': ['error', 2, {
      'SwitchCase': 1,
    }],
    'no-console': 'off',
    'semi': ['error', 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'max-len': 'off',
  },
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': {
          'resolve': {
            'extensions': ['.ts', '.tsx', '.js', '.json', ''],
            'alias': {
              'react-dom': '@hot-loader/react-dom',
              '@Src': path.resolve('./src'),
            },
          }
        }
      }
    },
    'react': {
      'version': 'detect',
    }
  },
}