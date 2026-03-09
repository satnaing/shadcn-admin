import path from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from 'fs'

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
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    generateVersionPlugin(),
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
