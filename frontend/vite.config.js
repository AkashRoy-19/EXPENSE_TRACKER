// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // Proxy all requests starting with '/js' to your Express server
      '/js': {
        target: 'http://localhost:5500',
        changeOrigin: true,
        secure: false
      },
      // Proxy all API requests
      '/api': {
        target: 'http://localhost:5500',
        changeOrigin: true
      }
    }
  }
})