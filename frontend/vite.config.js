import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        // Use 'backend' for Docker, 'localhost' for local development
        target: process.env.DOCKER_ENV ? 'http://backend:3001' : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})