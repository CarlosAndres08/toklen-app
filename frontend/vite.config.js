import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    __APP_ENV__: JSON.stringify(process.env)
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});

