'use server'

import prisma from '@/lib/prisma'
import { getCurrentSession } from '@/lib/auth'
import { CreateCommentSchema, CreateCommentInput } from '@/lib/validators/comment.validator'
import { revalidatePath } from 'next/cache'

/**
 * Interface de l'état retourné par la Server Action de création de commentaire.
 */
export interface CommentActionState {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Enregistre un nouveau commentaire pour un article donné dans PostgreSQL.
 * 
 * @param input - Données du formulaire validées par Zod (`CreateCommentInput`)
 * @returns Un objet `CommentActionState` indiquant le succès ou les erreurs rencontrées
 * 
 * @example
 * ```ts
 * const result = await createCommentAction({
 *   postId: "uuid-post-123",
 *   content: "Super article, merci pour le partage !"
 * })
 * ```
 */
export async function createCommentAction(input: CreateCommentInput): Promise<CommentActionState> {
  try {
    // 1. Contrôle d'authentification de la session utilisateur
    const session = await getCurrentSession()
    if (!session) {
      return {
        success: false,
        message: 'Vous devez être connecté pour publier un commentaire.',
      }
    }

    // 2. Défense en profondeur : Validation Zod côté serveur
    const validationResult = CreateCommentSchema.safeParse(input)
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Données du commentaire invalides.',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const { postId, content } = validationResult.data

    // 3. Vérification de l'existence de l'article visé
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return {
        success: false,
        message: "L'article visé n'existe pas.",
      }
    }

    // 4. Insertion du commentaire dans PostgreSQL
    await prisma.comment.create({
      data: {
        content,
        authorId: session.userId,
        postId,
      },
    })

    // 5. Invalidation des caches Next.js pour rafraîchir immédiatement la page de l'article
    revalidatePath(`/posts/${postId}`)

    return {
      success: true,
      message: 'Commentaire publié avec succès !',
    }
  } catch (error) {
    console.error('[CREATE_COMMENT_ACTION_ERROR]', error)
    return {
      success: false,
      message: 'Une erreur est survenue lors de la publication du commentaire.',
    }
  }
}
