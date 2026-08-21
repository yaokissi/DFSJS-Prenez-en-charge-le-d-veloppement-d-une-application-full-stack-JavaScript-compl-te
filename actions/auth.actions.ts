'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { RegisterSchema, RegisterInput, LoginSchema, LoginInput } from '@/lib/validators/auth.validator'
import { createSessionCookie, destroySessionCookie } from '@/lib/auth'

/**
 * Lead Dev Note - Server Actions Type-Safe & Robustes :
 * Les Server Actions s'exécutent EXCLUSIVEMENT sur le serveur.
 * Nous ne faisons JAMAIS confiance aux validations du client (le navigateur).
 * Chaque Server Action ré-exécute le schéma Zod pour parer à tout contournement (ex: appel via Postman/cURL).
 */

export interface ActionState<T = unknown> {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: T
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function registerUserAction(input: RegisterInput): Promise<ActionState> {
  // 1. Validation stricte du schéma Zod côté serveur
  const validation = RegisterSchema.safeParse(input)

  if (!validation.success) {
    return {
      success: false,
      message: 'Données de formulaire invalides.',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { email, username, password } = validation.data

  try {
    // 2. Vérification d'unicité de l'email et du nom d'utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return {
          success: false,
          message: 'Cet email est déjà associé à un compte utilisateur.',
          errors: { email: ['Un utilisateur avec cet email existe déjà.'] },
        }
      }
      if (existingUser.username === username) {
        return {
          success: false,
          message: "Ce nom d'utilisateur est déjà pris.",
          errors: { username: ["Ce nom d'utilisateur n'est pas disponible."] },
        }
      }
    }

    // 3. Hachage sécurisé du mot de passe avec bcryptjs (Cost Factor: 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Persistence dans la base de données PostgreSQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
      },
    })

    // 5. Création immédiate de la session utilisateur (Connexion automatique après inscription)
    await createSessionCookie({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    return {
      success: true,
      message: 'Votre compte a été créé avec succès !',
    }
  } catch (error) {
    console.error('[REGISTER_ACTION_ERROR]', error)
    return {
      success: false,
      message: "Une erreur serveur est survenue lors de l'inscription.",
    }
  }
}

/**
 * Authentification d'un utilisateur (Connexion)
 */
export async function loginUserAction(input: LoginInput): Promise<ActionState> {
  // 1. Validation Zod du format
  const validation = LoginSchema.safeParse(input)

  if (!validation.success) {
    return {
      success: false,
      message: 'Veuillez vérifier vos identifiants.',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { identifier, password } = validation.data

  try {
    // 2. Recherche de l'utilisateur par Email OU Username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    })

    // Message générique pour éviter de révéler si l'utilisateur existe ou non (Sécurité Owasp)
    const invalidCredentialsResponse: ActionState = {
      success: false,
      message: 'Identifiant ou mot de passe incorrect.',
    }

    if (!user) {
      return invalidCredentialsResponse
    }

    // 3. Comparaison du hash du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return invalidCredentialsResponse
    }

    // 4. Génération de la session dans le cookie HTTP-Only
    await createSessionCookie({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    return {
      success: true,
      message: 'Connexion réussie !',
    }
  } catch (error) {
    console.error('[LOGIN_ACTION_ERROR]', error)
    return {
      success: false,
      message: 'Une erreur est survenue lors de la connexion.',
    }
  }
}

/**
 * Déconnexion de l'utilisateur
 */
export async function logoutUserAction(): Promise<ActionState> {
  try {
    await destroySessionCookie()
    return {
      success: true,
      message: 'Vous avez été déconnecté.',
    }
  } catch (error) {
    console.error('[LOGOUT_ACTION_ERROR]', error)
    return {
      success: false,
      message: 'Erreur lors de la déconnexion.',
    }
  }
}
