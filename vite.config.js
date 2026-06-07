/*

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  }
})
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 5173,
    // Completely disable HMR to prevent URI malformed error
    hmr: false,
    // Disable middlewareMode
    middlewareMode: false,
    // Increase headers timeout
    httpServer: {
      headersTimeout: 60000
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})