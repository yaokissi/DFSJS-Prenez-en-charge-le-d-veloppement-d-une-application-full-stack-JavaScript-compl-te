import { Metadata } from 'next'
import { getTopicsAction } from '@/actions/topic.actions'
import TopicCard from '@/components/features/topics/topic-card'

export const metadata: Metadata = {
  title: "Thèmes de programmation | MDD - Monde de Dév",
  description: "Découvrez la liste des thèmes et abonnez-vous pour personnaliser votre fil d'actualité.",
}

/**
 * Page d'affichage de la liste des Thèmes de programmation (/topics)
 * -------------------------------------------------------------------
 * Server Component Next.js : Affiche les thèmes sur 2 colonnes conformément
 * à la maquette Figma.
 */
export default async function TopicsPage() {
  const topics = await getTopicsAction()

  return (
    <div className="space-y-8 py-4">
      {/* Grille sur 2 colonnes conformément à la Maquette Figma */}
      {topics.length === 0 ? (
        <div className="p-8 text-center bg-[#F3F3F3] rounded-2xl text-slate-600">
          Aucun thème disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
              initialSubscribed={topic.isSubscribed}
            />
          ))}
        </div>
      )}
    </div>
  )
}
