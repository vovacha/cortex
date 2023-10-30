import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      // https://stackoverflow.com/questions/70938763/build-problem-with-react-vitejs-and-was-amplify
      { find: './runtimeConfig', replacement: './runtimeConfig.browser' }
    ]
  },
  build: {
    target: 'esnext'
  },
  define: {
    global: {}
  },
  server: {
    port: 3000
  }
})
