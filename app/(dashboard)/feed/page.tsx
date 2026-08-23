import { Metadata } from 'next'
import { getCurrentSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getFeedPostsAction } from '@/actions/post.actions'
import FeedContent from '@/components/features/posts/feed-content'

export const metadata: Metadata = {
  title: "Fil d'actualité | MDD - Monde de Dév",
  description: "Consultez les articles publiés sur les thèmes de programmation auxquels vous êtes abonné.",
}

/**
 * Page du Fil d'Actualités (/feed)
 * --------------------------------
 * Server Component Next.js : Contrôle la session active de l'utilisateur,
 * charge ses articles filtrés par abonnement depuis PostgreSQL, et affiche `FeedContent`.
 */
export default async function FeedPage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  // Récupération des articles filtrés pour l'utilisateur connecté
  const initialPosts = await getFeedPostsAction('desc')

  return (
    <div className="py-4">
      <FeedContent initialPosts={initialPosts} />
    </div>
  )
}
