import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          zustand: ['zustand'],
          lucide: ['lucide-react'],
          charts: ['recharts'],
          utils: ['date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: true,
    port: 3000
  }
})
