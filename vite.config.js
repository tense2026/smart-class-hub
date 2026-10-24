import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const root = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      // One HTML entry per page; each is served at its folder path (e.g. /gym/).
      input: {
        main: resolve(root, 'index.html'),
        seats: resolve(root, 'seats/index.html'),
        gym: resolve(root, 'gym/index.html'),
        door: resolve(root, 'door/index.html'),
        lost: resolve(root, 'lost/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
