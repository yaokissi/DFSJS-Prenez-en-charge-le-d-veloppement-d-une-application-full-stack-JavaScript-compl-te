import { describe, it, expect } from 'vitest'
import { encryptJWT, decryptJWT } from '@/lib/auth'

describe(' Tests Unitaires - Cryptographie & Jetons JWT (lib/auth.ts)', () => {
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
})
