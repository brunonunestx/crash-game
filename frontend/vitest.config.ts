import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    env: {
      VITE_API_URL: 'http://localhost:8000',
      VITE_KEYCLOAK_URL: 'http://localhost:8080',
      VITE_KEYCLOAK_REALM: 'crash-game',
      VITE_KEYCLOAK_CLIENT_ID: 'crash-game-client',
    },
  },
})
