import { defineConfig } from 'vite'

// Minimal Vite config for development. Plugins (PWA, React plugin) can be added
// in production build or when the environment supports ESM properly.
export default defineConfig({
  server: {
    port: 5173
  }
})
