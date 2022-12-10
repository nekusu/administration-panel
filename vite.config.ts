import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import env from 'vite-plugin-env-compatible';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/administration-panel/',
  plugins: [react(), env({ prefix: 'REACT_APP' }), tsConfigPaths()],
  build: { outDir: 'build' },
});
