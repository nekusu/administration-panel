import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import env from 'vite-plugin-env-compatible';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/administration-panel/',
  plugins: [
    react(),
    env({ prefix: 'REACT_APP', mountedPath: 'import.meta.env' }),
    tsConfigPaths(),
    checker({ typescript: true }),
  ],
  build: { outDir: 'build' },
});
