import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { FlatCompat } from '@eslint/eslintrc';
import packageJson from 'eslint-plugin-package-json';

const compat = new FlatCompat();

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  compat.extends('eslint-config-expo'),
  packageJson.configs.recommended,
  { ignores: ['dist', 'expo-env.d.ts'] }
);
