import packageJson from 'eslint-plugin-package-json';

export default [
  packageJson.configs.recommended,
  {
    ignores: ['*', '!package.json']
  }
];
