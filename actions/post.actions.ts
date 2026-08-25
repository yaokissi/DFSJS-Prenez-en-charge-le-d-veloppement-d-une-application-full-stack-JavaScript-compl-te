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
/**
 * Interface d'un article affiché dans le fil d'actualités avec son auteur et son thème.
 */
export interface FeedPost {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    username: string
  }
  topic: {
    title: string
  }
}

/**
 * Récupère le fil d'actualités personnalisé de l'utilisateur actuellement connecté.
 * Filtre les articles pour n'afficher QUE ceux des thèmes auxquels l'utilisateur est abonné.
 * 
 * @param sortOrder - Ordre de tri chronologique : 'desc' (du plus récent au plus ancien) ou 'asc'
 * @returns La liste des articles filtrés et typés `FeedPost[]`
 * 
 * @example
 * ```ts
 * const posts = await getFeedPostsAction('desc')
 * ```
 */
export async function getFeedPostsAction(
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<FeedPost[]> {
  try {
    const session = await getCurrentSession()
    if (!session) return []

    // 1. Récupération des IDs des thèmes suivis par l'utilisateur connecté
    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId: session.userId },
      select: { topicId: true },
    })

    const subscribedTopicIds = userSubscriptions.map((sub) => sub.topicId)

    // S'il n'est abonné à aucun thème, le fil d'actualités retourne un tableau vide
    if (subscribedTopicIds.length === 0) {
      return []
    }

    // 2. Récupération des articles appartenant uniquement aux thèmes suivis
    const posts = await prisma.post.findMany({
      where: {
        topicId: {
          in: subscribedTopicIds,
        },
      },
      orderBy: {
        createdAt: sortOrder,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: { username: true },
        },
        topic: {
          select: { title: true },
        },
      },
    })

    return posts
  } catch (error) {
    console.error('[GET_FEED_POSTS_ACTION_ERROR]', error)
    return []
  }
}

/**
 * Interface détaillée d'un article avec son auteur, son thème et ses commentaires.
 */
export interface PostDetails {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    username: string
  }
  topic: {
    title: string
  }
  comments: {
    id: string
    content: string
    createdAt: Date
    author: {
      username: string
    }
  }[]
}

/**
 * Récupère les détails complets d'un article et la liste de ses commentaires.
 * 
 * @param postId - L'identifiant unique (UUID) de l'article
 * @returns L'article avec ses commentaires ou `null` si introuvable
 */
export async function getPostDetailsAction(postId: string): Promise<PostDetails | null> {
  try {
    const session = await getCurrentSession()
    if (!session) return null

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: { username: true },
        },
        topic: {
          select: { title: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: { username: true },
            },
          },
        },
      },
    })

    return post
  } catch (error) {
    console.error('[GET_POST_DETAILS_ACTION_ERROR]', error)
    return null
  }
}
