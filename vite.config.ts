import path from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

const BUILD_VERSION = Date.now().toString()

function generateVersionPlugin(): Plugin {
  return {
    name: 'generate-version-json',
    buildStart() {
      // Create a version.json snippet in the public folder so it gets served
      const p = path.resolve(__dirname, 'public', 'version.json')
      const dir = path.dirname(p)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(p, JSON.stringify({ version: BUILD_VERSION }))
      // eslint-disable-next-line no-console
      console.log(
        `[build] generated version.json with version ${BUILD_VERSION}`
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.caf'],
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    generateVersionPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        short_name: 'bYok Admin',
        name: 'bYok Admin Dashboard',
        icons: [
          {
            src: '/images/favicon.png',
            type: 'image/png',
            sizes: '192x192 512x512',
            purpose: 'any maskable',
          },
        ],
        start_url: '/',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        theme_color: '#ffffff',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(BUILD_VERSION),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['comely-asha-prolix.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
