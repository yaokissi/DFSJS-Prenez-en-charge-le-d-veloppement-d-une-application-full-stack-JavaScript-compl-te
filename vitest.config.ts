import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Configuration Vitest pour les tests unitaires et d'intégration
 * Configuré avec le rapporteur de couverture v8 (Rapports text, html, json).
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'actions/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
