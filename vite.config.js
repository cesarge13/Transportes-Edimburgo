import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: []
  }
});
