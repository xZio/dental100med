import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // По умолчанию Vite 8 собирает под Safari 16+ и переписывает @media (max-width: 900px)
  // в (width<=900px) — iOS 15 такие правила не понимает и показывает десктопную вёрстку
  build: {
    target: ['chrome87', 'edge88', 'firefox78', 'safari15'],
  },
  // Загруженные фото отдаёт бэкенд — в dev проксируем, чтобы пути /uploads/... работали
  server: {
    proxy: {
      '/uploads': 'http://localhost:5000',
    },
  },
})
