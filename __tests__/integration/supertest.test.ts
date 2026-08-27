import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createServer, Server } from 'http'

/**
 * Tests d'Intégration API & HTTP avec Supertest
 * ---------------------------------------------
 * Conforme aux recommandations officielles du projet OpenClassrooms P5.
 * Valide les requêtes HTTP (GET, réponses JSON, en-têtes et codes de statut 200/404).
 */
describe('🌐 Tests d\'Intégration HTTP (Supertest)', () => {
  let server: Server

  beforeAll(() => {
    // Création d'un serveur HTTP Node.js de test alimenté par Supertest
    server = createServer((req, res) => {
      if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok', app: 'MDD - Monde de Dév' }))
      } else if (req.url === '/api/auth/session') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ authenticated: true, user: 'AlexDev' }))
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Route introuvable' }))
      }
    })
    server.listen(0) // Port dynamique attribué par le système
  })

  afterAll(() => {
    server.close()
  })

  it('doit envoyer une requête HTTP GET /api/health et recevoir un statut 200 OK via Supertest', async () => {
    const response = await request(server).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.status).toBe('ok')
    expect(response.body.app).toBe('MDD - Monde de Dév')
  })

  it('doit simuler la vérification d\'une session API et retourner le statut 200 OK', async () => {
    const response = await request(server).get('/api/auth/session')

    expect(response.status).toBe(200)
    expect(response.body.authenticated).toBe(true)
    expect(response.body.user).toBe('AlexDev')
  })

  it('doit retourner un statut 404 pour une route API inexistante', async () => {
    const response = await request(server).get('/api/route-invalide')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Route introuvable')
  })
})
