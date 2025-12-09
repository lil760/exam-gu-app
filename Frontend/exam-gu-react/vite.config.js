import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // ⬇️ AJOUTE CES LIGNES
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔵 Proxy Request:', req.method, req.url);
            console.log('🔵 Authorization:', req.headers.authorization);
          });
        }
      }
    }
  }
});