module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  env: {
    node: true
  },
  extends: [
    'standard',
    'prttier',
    'prettier/standard',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    'promise/catch-or-return': 'error',
    'no-return-wrap': 'error',
    'param-names': 'error',
    'always-return': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ]
  }
};
