import { describe, it, expect, vi } from 'vitest'

// Stockage en mémoire pour le mock du cookie store Next.js
const mockCookieMap = new Map<string, string>()

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (mockCookieMap.has(name) ? { value: mockCookieMap.get(name)! } : undefined),
    set: (name: string, value: string) => mockCookieMap.set(name, value),
    delete: (name: string) => mockCookieMap.delete(name),
  }),
}))

import {
  encryptJWT,
  decryptJWT,
  createSessionCookie,
  destroySessionCookie,
  getCurrentSession,
} from '@/lib/auth'

describe('🔐 Tests Unitaires - Cryptographie & Jetons JWT (lib/auth.ts)', () => {
  it('doit chiffrer et déchiffrer un jeton JWT avec succès', async () => {
    const payload = {
      userId: 'user-uuid-123',
      email: 'test@mdd.fr',
      username: 'TestUser',
    }

    // 1. Chiffrement JWT via jose
    const token = await encryptJWT(payload)
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    // 2. Déchiffrement et vérification du contenu
    const decryptedPayload = await decryptJWT(token)
    expect(decryptedPayload).toBeDefined()
    expect(decryptedPayload?.userId).toBe('user-uuid-123')
    expect(decryptedPayload?.email).toBe('test@mdd.fr')
    expect(decryptedPayload?.username).toBe('TestUser')
  })

  it('doit retourner null si le jeton JWT est invalide ou corrompu', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature'
    const result = await decryptJWT(invalidToken)
    expect(result).toBeNull()
  })

  it('doit créer un cookie de session et récupérer la session active', async () => {
    const payload = {
      userId: 'session-user-123',
      email: 'session@mdd.fr',
      username: 'SessionUser',
    }

    // Création du cookie de session
    await createSessionCookie(payload)
    expect(mockCookieMap.has('mdd_session')).toBe(true)

    // Récupération de la session actuelle
    const session = await getCurrentSession()
    expect(session).toBeDefined()
    expect(session?.userId).toBe('session-user-123')
    expect(session?.email).toBe('session@mdd.fr')
  })

  it('doit supprimer le cookie de session lors de la déconnexion', async () => {
    // S'assurer qu'un cookie existe
    mockCookieMap.set('mdd_session', 'dummy-token')

    // Suppression de la session
    await destroySessionCookie()
    expect(mockCookieMap.has('mdd_session')).toBe(false)

    // Vérification que getCurrentSession retourne null après suppression
    const session = await getCurrentSession()
    expect(session).toBeNull()
  })
})
