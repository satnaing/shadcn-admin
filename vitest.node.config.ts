import path from 'path'
import { defineConfig } from 'vitest/config'

// Pure-logic tests (no DOM): `pnpm vitest run -c vitest.node.config.ts`
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: { environment: 'node', include: ['src/**/*.node.test.ts'] },
})
