import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Загруженные фото отдаёт бэкенд — в dev проксируем, чтобы пути /uploads/... работали
  server: {
    proxy: {
      '/uploads': 'http://localhost:5000',
    },
  },
})
