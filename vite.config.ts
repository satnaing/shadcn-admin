import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    port: 3000,
    proxy: {
      '/api/live': {
        target: process.env.GRAFANA_URL,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Authorization',
              `Bearer ${process.env.GRAFANA_API_KEY}`
            )
            proxyReq.setHeader('Upgrade', 'websocket')
            proxyReq.setHeader('Connection', 'Upgrade')
            proxyReq.setHeader('Host', process.env.GRAFANA_HOST || 'localhost')
          })
        },
      },
      '/api': {
        target: process.env.GRAFANA_URL,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Authorization',
              `Bearer ${process.env.GRAFANA_API_KEY}`
            )
          })
        },
      },
      '^/public/(build|img|fonts|plugins)/.*': {
        target: process.env.GRAFANA_URL,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Authorization',
              `Bearer ${process.env.GRAFANA_API_KEY}`
            )
          })
        },
      },
      [process.env.GRAFANA_DASHBOARD_PATH as string]: {
        target: process.env.GRAFANA_URL,
        changeOrigin: true,
        ws: true, // WebSocket 지원
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader(
              'Authorization',
              `Bearer ${process.env.GRAFANA_API_KEY}`
            )
          })
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
})
