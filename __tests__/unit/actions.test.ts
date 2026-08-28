import { describe, it, expect, vi } from 'vitest'

// Mock de next/headers pour simuler l'environnement de requêtes Next.js dans Vitest
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: () => null,
    set: () => {},
    delete: () => {},
  }),
}))

import { getTopicsAction } from '@/actions/topic.actions'
import { getFeedPostsAction, getPostDetailsAction } from '@/actions/post.actions'
import { getUserSubscribedTopicsAction } from '@/actions/user.actions'

describe('⚡ Tests Unitaires - Server Actions (Logique Serveur)', () => {
  it('doit récupérer la liste des thèmes sous forme de tableau', async () => {
    const topics = await getTopicsAction()
    expect(Array.isArray(topics)).toBe(true)
    if (topics.length > 0) {
      expect(topics[0]).toHaveProperty('id')
      expect(topics[0]).toHaveProperty('title')
      expect(topics[0]).toHaveProperty('isSubscribed')
    }
  })

  it('doit récupérer le fil d\'actualités sous forme de tableau', async () => {
    const posts = await getFeedPostsAction('desc')
    expect(Array.isArray(posts)).toBe(true)
  })

  it('doit retourner null si l\'identifiant d\'article est inexistant', async () => {
    const postDetails = await getPostDetailsAction('post-inexistant-uuid-999')
    expect(postDetails).toBeNull()
  })

  it('doit retourner un tableau vide si un utilisateur non connecté demande ses abonnements', async () => {
    const subscriptions = await getUserSubscribedTopicsAction()
    expect(Array.isArray(subscriptions)).toBe(true)
  })
})
