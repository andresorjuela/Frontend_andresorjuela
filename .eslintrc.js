module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: { 'parser': 'babel-eslint' },
  rules: {
    'linebreak-style': [ 'error', 'unix' ],
    'no-unused-vars': [ 'warn',  { 'args': 'none' } ],
    'semi': [ 'warn', 'always' ]
  }
};