import { PrismaClient } from '@prisma/client'

/**
 * Lead Dev Note - Pattern Singleton pour PrismaClient :
 * En mode développement, Next.js recharge fréquemment les modules (HMR - Hot Module Replacement).
 * Sans cette précaution, chaque rechargement créerait une nouvelle instance de PrismaClient,
 * ce qui épuiserait rapidement le pool de connexions à PostgreSQL ("Too many clients").
 * 
 * En production, le processus Node.js ne redémarre pas à chaque requête, 
 * l'instance globale n'est créée qu'une seule fois.
 */

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // Déclaration TypeScript globale pour éviter le re-typage explicite sur globalThis
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Récupère l'instance existante ou en instancie une nouvelle
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
