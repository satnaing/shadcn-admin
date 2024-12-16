import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
  css: { postcss: { plugins: [tailwindcss, autoprefixer] } },
  ssr: { noExternal: command === 'build' ? true : undefined },
  plugins: [reactRouter(), tsconfigPaths()],
}))
