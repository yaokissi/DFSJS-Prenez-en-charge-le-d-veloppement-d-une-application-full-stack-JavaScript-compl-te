'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { getCurrentSession, createSessionCookie } from '@/lib/auth'
import { UpdateProfileSchema, UpdateProfileInput } from '@/lib/validators/user.validator'
import { revalidatePath } from 'next/cache'

/**
 * Interface de l'état retourné par les Server Actions du profil utilisateur.
 */
export interface UserActionState {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Interface d'un thème auquel l'utilisateur est abonné.
 */
export interface SubscribedTopicItem {
  id: string
  title: string
  description: string | null
}

/**
 * Met à jour les informations du profil de l'utilisateur connecté.
 * Met également à jour le cookie de session HTTP-Only avec les nouveaux identifiants.
 * 
 * @param input - Données du formulaire validées par Zod (`UpdateProfileInput`)
 * @returns Un objet `UserActionState` indiquant le succès ou les erreurs d'unicité
 * 
 * @example
 * ```ts
 * const result = await updateProfileAction({
 *   username: "AlexDev",
 *   email: "alex.new@mdd.fr"
 * })
 * ```
 */
export async function updateProfileAction(input: UpdateProfileInput): Promise<UserActionState> {
  try {
    // 1. Contrôle d'authentification
    const session = await getCurrentSession()
    if (!session) {
      return {
        success: false,
        message: 'Vous devez être connecté pour modifier votre profil.',
      }
    }

    // 2. Défense en profondeur : Validation Zod des données côté serveur
    const validationResult = UpdateProfileSchema.safeParse(input)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Données de formulaire invalides.',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const { username, email, password } = validationResult.data

    // 3. Vérification de l'unicité de l'email (excluant l'utilisateur actuel)
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: session.userId },
      },
    })

    if (existingEmail) {
      return {
        success: false,
        message: 'Cette adresse e-mail est déjà utilisée par un autre compte.',
        errors: { email: ['Adresse e-mail déjà utilisée.'] },
      }
    }

    // 4. Vérification de l'unicité du nom d'utilisateur (excluant l'utilisateur actuel)
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: session.userId },
      },
    })

    if (existingUsername) {
      return {
        success: false,
        message: 'Ce nom d\'utilisateur est déjà pris par un autre compte.',
        errors: { username: ['Nom d\'utilisateur déjà pris.'] },
      }
    }

    // 5. Préparation des données de mise à jour (hachage du mot de passe si fourni)
    const updateData: { username: string; email: string; password?: string } = {
      username,
      email,
    }

    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // 6. Mise à jour dans PostgreSQL via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    })

    // 7. Mise à jour du Cookie de Session JWT HTTP-Only avec les nouveaux identifiants
    await createSessionCookie({
      userId: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    })

    // 8. Invalidation du cache de la page Profil
    revalidatePath('/profile')

    return {
      success: true,
      message: 'Votre profil a été mis à jour avec succès !',
    }
  } catch (error) {
    console.error('[UPDATE_PROFILE_ACTION_ERROR]', error)
    return {
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour de votre profil.',
    }
  }
}

/**
 * Récupère la liste des thèmes auxquels l'utilisateur connecté est actuellement abonné.
 * 
 * @returns La liste des thèmes suivis par l'utilisateur
 */
export async function getUserSubscribedTopicsAction(): Promise<SubscribedTopicItem[]> {
  try {
    const session = await getCurrentSession()
    if (!session) return []

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.userId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    })

    return subscriptions.map((sub) => sub.topic)
  } catch (error) {
    console.error('[GET_USER_SUBSCRIBED_TOPICS_ERROR]', error)
    return []
  }
}
