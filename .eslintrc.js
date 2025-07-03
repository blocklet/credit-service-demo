module.exports = {
  root: true,
  extends: '@arcblock/eslint-config',
  globals: {
    logger: true,
  },
  rules: {
    'react/require-default-props': [
      'error',
      {
        functions: 'defaultArguments',
      },
    ],
  },
};
