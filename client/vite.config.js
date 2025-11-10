import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hostel Management System',
        short_name: 'HostelApp',
        start_url: '/',
        display: 'standalone',
        background_color: '#fafafa',
        theme_color: '#0af698ff',
        icons: [
          {
            src: 'logo.webp',
            sizes: '192x192 512×512',
            type: 'image/webp',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
