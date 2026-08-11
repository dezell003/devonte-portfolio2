import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  publicDir: 'public',
  // React + Tailwind only touch the prototype entry; the main portfolio
  // stays vanilla JS/CSS.
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'czepeku-vault': resolve(__dirname, 'czepeku-vault.html'),
        'czepeku-vault-alt': resolve(__dirname, 'czepeku-vault-alt.html'),
      },
    },
  },
});
