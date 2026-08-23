'use server'

import prisma from '@/lib/prisma'
import { getCurrentSession } from '@/lib/auth'
import { CreatePostSchema, CreatePostInput } from '@/lib/validators/post.validator'
import { revalidatePath } from 'next/cache'

/**
 * Interface de l'état retourné par les Server Actions liées aux articles.
 */
export interface PostActionState {
  success: boolean
  message?: string
  postId?: string
  errors?: Record<string, string[]>
}

/**
 * Crée et enregistre un nouvel article de blog dans PostgreSQL.
 * 
 * @param data - Données du formulaire validées par Zod (`CreatePostInput`)
 * @returns Un objet `PostActionState` indiquant le succès ou les erreurs rencontrées
 * 
 * @example
 * ```ts
 * const result = await createPostAction({
 *   topicId: "uuid-topic-123",
 *   title: "Mon premier article sur TypeScript",
 *   content: "Voici le contenu détaillé de mon article de blog..."
 * })
 * ```
 */
export async function createPostAction(data: CreatePostInput): Promise<PostActionState> {
  try {
    // 1. Contrôle d'authentification de la session utilisateur
    const session = await getCurrentSession()
    if (!session) {
      return {
        success: false,
        message: 'Vous devez être connecté pour publier un article.',
      }
    }

    // 2. Défense en profondeur : Validation Zod des données entrantes côté serveur
    const validationResult = CreatePostSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Données de formulaire invalides.',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const { topicId, title, content } = validationResult.data

    // 3. Vérification de l'existence du thème sélectionné
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    })

    if (!topic) {
      return {
        success: false,
        message: 'Le thème de programmation sélectionné n\'existe pas.',
      }
    }

    // 4. Création de l'article dans la base de données PostgreSQL
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.userId,
        topicId,
      },
    })

    // 5. Invalidation des caches Next.js pour rafraîchir le fil d'actualités (/feed)
    revalidatePath('/feed')
    revalidatePath('/topics')

    return {
      success: true,
      message: 'Votre article a été publié avec succès !',
      postId: newPost.id,
    }
  } catch (error) {
    console.error('[CREATE_POST_ACTION_ERROR]', error)
    return {
      success: false,
      message: "Une erreur est survenue lors de la publication de l'article.",
    }
  }
}
