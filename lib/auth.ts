import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

/**
 * Lead Dev Note - Sécurité des Sessions avec JWT et Cookies HTTP-Only :
 * 1. Le secret JWT est encodé en UInt8Array pour la librairie `jose` (standard Web Crypto API léger et ultra-rapide).
 * 2. Le cookie est configuré avec `httpOnly: true` (inaccessible via JavaScript document.cookie, immunisé contre les attaques XSS).
 * 3. `sameSite: 'lax'` protège contre les attaques CSRF.
 * 4. `secure: process.env.NODE_ENV === 'production'` garantit l'envoi uniquement via HTTPS en production.
 */

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-mdd-orion-dev-only-key-32chars'
const encodedKey = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  userId: string
  email: string
  username: string
  [key: string]: unknown
}

const COOKIE_NAME = 'mdd_session'
const DURATION_7_DAYS = 7 * 24 * 60 * 60 * 1000 // 7 jours en ms

/**
 * Chiffre et signe le payload de l'utilisateur dans un jeton JWT
 */
export async function encryptJWT(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

/**
 * Déchiffre et vérifie l'intégrité d'un jeton JWT
 */
export async function decryptJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Crée le cookie de session sécurisé dans la réponse du serveur
 */
export async function createSessionCookie(payload: JWTPayload) {
  const expiresAt = new Date(Date.now() + DURATION_7_DAYS)
  const token = await encryptJWT(payload)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Supprime le cookie de session (Déconnexion)
 */
export async function destroySessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Récupère et vérifie la session actuelle à partir des cookies du navigateur
 */
export async function getCurrentSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  return await decryptJWT(token)
}
