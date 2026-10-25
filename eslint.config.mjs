import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    // three.js is imperative by nature: scene objects are built once and then
    // mutated every frame. That is exactly what this rule exists to catch in UI
    // components, and exactly what a render loop is for.
    files: ['src/components/exhibition/scene/**/*.{ts,tsx}'],
    rules: { 'react-hooks/immutability': 'off' },
  },
  // `.claude/` holds other sessions' worktrees, each with its own build output.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.claude/**']),
]);

export default eslintConfig;
