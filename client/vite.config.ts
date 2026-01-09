/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/BoumbApp/' : '/', // Conditional base: Root for dev, subpath for Prod (GH Pages)
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Auto-open browser
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
  },
}))
