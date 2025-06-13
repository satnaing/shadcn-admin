import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { DiffnoteVitePlugin } from 'diffnote/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    DiffnoteVitePlugin({
      projectKey: process.env.DIFFNOTE_PROJECT_KEY ?? 'akYk5S-QHt0HCaMWU4rIK',
      branch:
        process.env.NODE_ENV === 'development'
          ? 'dev'
          : process.env.CF_PAGES_BRANCH,
      productionBranch: 'main',
    }),
  ],
  define: {
    __DIFFNOTE_PREVIEW_BRANCH__:
      process.env.CF_PAGES_BRANCH !== 'main'
        ? JSON.stringify(process.env.CF_PAGES_BRANCH)
        : '""',
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
