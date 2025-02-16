import packageJson from 'eslint-plugin-package-json/configs/recommended';

export default [
  packageJson,
  {
    ignores: ['*', '!package.json']
  }
];
