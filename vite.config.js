import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The demo is published to https://laytreynolds.github.io/crm_design/, so the
// production build needs the repo name as its base path. Dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/crm_design/' : '/',
  plugins: [react()],
}));
