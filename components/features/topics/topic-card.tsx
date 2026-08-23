'use client'

import { useState, useTransition } from 'react'
import { toggleSubscriptionAction } from '@/actions/topic.actions'

/**
 * Interface des propriétés reçues par le composant `TopicCard`.
 */
export interface TopicCardProps {
  /** L'identifiant unique (UUID) du thème */
  id: string
  /** Le nom/titre du thème (ex: JavaScript, Python) */
  title: string
  /** La description du thème */
  description: string | null
  /** L'état d'abonnement initial de l'utilisateur */
  initialSubscribed: boolean
}

/**
 * Composant Carte de Thème (TopicCard) - Maquette Figma
 * -----------------------------------------------------
 * Affiche un thème dans un conteneur gris clair (`bg-[#F3F3F3]`) avec un bouton
 * violet `#7763C5` "S'abonner" ou un bouton gris `#9E9E9E` "Déjà abonné".
 * 
 * @param props Propriétés du thème typées `TopicCardProps`
 */
export default function TopicCard({
  id,
  title,
  description,
  initialSubscribed,
}: TopicCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /**
   * Bascule l'état d'abonnement du thème via la Server Action `toggleSubscriptionAction`.
   */
  const handleToggleSubscription = () => {
    setErrorMessage(null)

    startTransition(async () => {
      const result = await toggleSubscriptionAction(id)

      if (!result.success) {
        setErrorMessage(result.message || 'Erreur lors de la modification.')
        return
      }

      if (typeof result.isSubscribed === 'boolean') {
        setIsSubscribed(result.isSubscribed)
      }
    })
  }

  return (
    <div className="bg-[#F3F3F3] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] transition-all duration-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-3">{title}</h2>
        <p className="text-sm text-black line-clamp-4 leading-relaxed mb-6">
          <span className="font-medium">Description: </span>
          {description || "Aucune description disponible pour ce thème."}
        </p>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 font-medium mb-3 text-center">{errorMessage}</p>
      )}

      <div className="flex justify-center pt-2">
        <button
          onClick={handleToggleSubscription}
          disabled={isPending}
          className={`w-[160px] h-[44px] sm:w-[180px] sm:h-[48px] rounded-xl text-white font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center ${
            isSubscribed
              ? 'bg-[#9E9E9E] hover:bg-[#8E8E8E]'
              : 'bg-[#7763C5] hover:bg-[#6853b5]'
          }`}
        >
          {isPending
            ? 'Patientez...'
            : isSubscribed
            ? 'Déjà abonné'
            : "S'abonner"}
        </button>
      </div>
    </div>
  )
}
