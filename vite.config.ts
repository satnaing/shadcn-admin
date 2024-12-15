import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cloudflareDevProxy({ getLoadContext }),
    reactRouter(),
    tsconfigPaths(),
  ],
})
