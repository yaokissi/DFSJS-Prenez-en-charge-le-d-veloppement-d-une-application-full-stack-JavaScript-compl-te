'use server'

import prisma from '@/lib/prisma'
import { getCurrentSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

/**
 * Interface représentant l'état retourné par les Server Actions de gestion des thèmes.
 */
export interface TopicActionState {
  success: boolean
  message?: string
  isSubscribed?: boolean
}

/**
 * Interface représentant un thème avec l'état d'abonnement pour l'utilisateur connecté.
 */
export interface TopicWithSubscription {
  id: string
  title: string
  description: string | null
  createdAt: Date
  isSubscribed: boolean
}

/**
 * Récupère l'ensemble des thèmes de programmation et indique pour chacun 
 * si l'utilisateur actuellement connecté y est abonné.
 * 
 * @returns La liste des thèmes typés `TopicWithSubscription[]`
 * 
 * @example
 * ```ts
 * const topics = await getTopicsAction()
 * console.log(topics[0].isSubscribed) // true ou false
 * ```
 */
export async function getTopicsAction(): Promise<TopicWithSubscription[]> {
  try {
    const session = await getCurrentSession()
    const topics = await prisma.topic.findMany({ orderBy: { title: 'asc' } })

    if (!session) return topics.map((topic) => ({ ...topic, isSubscribed: false }))

    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId: session.userId },
      select: { topicId: true },
    })

    const subscribedTopicIds = new Set(userSubscriptions.map((sub) => sub.topicId))

    return topics.map((topic) => ({
      ...topic,
      isSubscribed: subscribedTopicIds.has(topic.id),
    }))
  } catch (error) {
    console.error('[GET_TOPICS_ACTION_ERROR]', error)
    return []
  }
}

/**
 * Bascule l'état d'abonnement de l'utilisateur connecté à un thème donné.
 * Si l'utilisateur est déjà abonné, il est désabonné (Suppression de la ligne `Subscription`).
 * S'il n'est pas abonné, un nouvel abonnement est créé dans PostgreSQL.
 * 
 * @param topicId - L'identifiant unique (UUID) du thème
 * @returns Un objet `TopicActionState` contenant le statut `success` et le nouvel état `isSubscribed`
 */
export async function toggleSubscriptionAction(topicId: string): Promise<TopicActionState> {
  try {
    const session = await getCurrentSession()
    if (!session) return { success: false, message: 'Vous devez être connecté.' }

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_topicId: { userId: session.userId, topicId },
      },
    })

    if (existingSubscription) {
      // Désabonnement (Suppression PostgreSQL)
      await prisma.subscription.delete({ where: { id: existingSubscription.id } })
      revalidatePath('/topics')
      revalidatePath('/feed')
      return { success: true, isSubscribed: false, message: 'Désabonné avec succès.' }
    } else {
      // Abonnement (Insertion PostgreSQL)
      await prisma.subscription.create({ data: { userId: session.userId, topicId } })
      revalidatePath('/topics')
      revalidatePath('/feed')
      return { success: true, isSubscribed: true, message: 'Abonné avec succès.' }
    }
  } catch (error) {
    console.error('[TOGGLE_SUBSCRIPTION_ACTION_ERROR]', error)
    return { success: false, message: "Erreur lors de la modification de l'abonnement." }
  }
}
