import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti 'palm-oil-dashboard' sesuai nama repositori kamu
export default defineConfig({
  plugins: [react()],
  base: '/palm-oil-dashboard/', // 👈 penting agar GitHub Pages bisa memuat asset-nya
})
