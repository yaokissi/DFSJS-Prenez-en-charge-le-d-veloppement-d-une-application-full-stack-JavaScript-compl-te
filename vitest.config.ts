import { defineConfig } from 'vitest/config'
import path from 'path'

/**
 * Configuration Vitest pour les tests unitaires et d'intégration
 * Configuré avec l'alias `@/` vers la racine du projet Next.js.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
