import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: false,
    },
    environment: 'node',
    include: ['tools/matrix-client/**/*.test.js'],
  },
})
