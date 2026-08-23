import { Metadata } from 'next'
import { getTopicsAction } from '@/actions/topic.actions'
import CreatePostForm from '@/components/forms/create-post-form'

export const metadata: Metadata = {
  title: 'Créer un article | MDD - Monde de Dév',
  description: 'Rédigez et publiez un nouvel article sur le réseau social MDD.',
}

/**
 * Page de création d'un article (/posts/create)
 * -----------------------------------------------
 * Server Component Next.js : Récupère les thèmes disponibles depuis PostgreSQL
 * et affiche le formulaire interactif `CreatePostForm`.
 */
export default async function CreatePostPage() {
  // Récupération de la liste des thèmes de programmation
  const topics = await getTopicsAction()

  // Formatage simplifié pour le composant formulaire
  const topicOptions = topics.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  return (
    <div className="py-4">
      <CreatePostForm topics={topicOptions} />
    </div>
  )
}
