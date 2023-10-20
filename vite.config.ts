import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://stackoverflow.com/questions/70938763/build-problem-with-react-vitejs-and-was-amplify
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
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
