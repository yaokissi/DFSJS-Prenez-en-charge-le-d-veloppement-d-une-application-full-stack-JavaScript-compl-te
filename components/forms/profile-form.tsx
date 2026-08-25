'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema, UpdateProfileInput } from '@/lib/validators/user.validator'
import { updateProfileAction, SubscribedTopicItem } from '@/actions/user.actions'
import { toggleSubscriptionAction } from '@/actions/topic.actions'

/**
 * Interface des props du composant `ProfileForm`
 */
export interface ProfileFormProps {
  /** Nom d'utilisateur actuel de la session */
  initialUsername: string
  /** Adresse e-mail actuelle de la session */
  initialEmail: string
  /** Liste des thèmes auxquels l'utilisateur est actuellement abonné */
  subscribedTopics: SubscribedTopicItem[]
}

/**
 * Composant Client : Profil Utilisateur & Abonnements (ProfileForm) - Figma
 * -------------------------------------------------------------------------
 * Gère la modification du profil (username, email, password) et la liste
 * réactive des thèmes abonnés avec possibilité de se désabonner en 1 clic.
 * 
 * @param props Propriétés typées `ProfileFormProps`
 */
export default function ProfileForm({
  initialUsername,
  initialEmail,
  subscribedTopics: initialSubscribedTopics,
}: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  // État local de la liste des thèmes abonnés pour réactivité instantanée
  const [topics, setTopics] = useState<SubscribedTopicItem[]>(initialSubscribedTopics)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      username: initialUsername,
      email: initialEmail,
      password: '',
    },
  })

  /**
   * Soumission du formulaire de mise à jour du profil
   */
  const onSubmit = (data: UpdateProfileInput) => {
    setServerError(null)
    setServerSuccess(null)

    startTransition(async () => {
      const result = await updateProfileAction(data)

      if (!result.success) {
        setServerError(result.message || 'Erreur lors de la mise à jour du profil.')

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof UpdateProfileInput, {
                type: 'server',
                message: messages[0],
              })
            }
          })
        }
        return
      }

      setServerSuccess('Profil mis à jour avec succès !')
    })
  }

  /**
   * Désabonnement d'un thème depuis la page profil
   */
  const handleUnsubscribe = (topicId: string) => {
    startTransition(async () => {
      const result = await toggleSubscriptionAction(topicId)

      if (result.success) {
        // Retrait dynamique du thème de la liste affichée
        setTopics((prev) => prev.filter((t) => t.id !== topicId))
      }
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-2 text-black space-y-8 flex flex-col items-center">
      {/* 1. Titre Profil utilisateur */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black text-center">
        Profil utilisateur
      </h1>

      {/* Messages de notification */}
      {serverError && (
        <div className="w-full max-w-[420px] p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="w-full max-w-[420px] p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">
          {serverSuccess}
        </div>
      )}

      {/* 2. Formulaire Profil sans labels externes (Conforme Figma) */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[420px] space-y-5 flex flex-col items-center" noValidate>
        {/* Username */}
        <div className="w-full flex flex-col items-center">
          <input
            {...register('username')}
            type="text"
            placeholder="Username"
            className={`w-[280px] sm:w-[320px] h-[48px] px-4 py-2.5 rounded-xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] ${
              errors.username ? 'border-red-500' : ''
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="w-full flex flex-col items-center">
          <input
            {...register('email')}
            type="email"
            placeholder="email@email.fr"
            className={`w-[280px] sm:w-[320px] h-[48px] px-4 py-2.5 rounded-xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="w-full flex flex-col items-center">
          <input
            {...register('password')}
            type="password"
            placeholder="Mot de passe"
            className={`w-[280px] sm:w-[320px] h-[48px] px-4 py-2.5 rounded-xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Bouton Sauvegarder Violet Figma */}
        <div className="pt-2 flex justify-center w-full">
          <button
            type="submit"
            disabled={isPending}
            className="w-[140px] h-[44px] bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 mx-auto block shadow-sm"
          >
            {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>

      {/* 3. Ligne de Séparation Horizontale Figma */}
      <hr className="w-full border-black opacity-30 my-8" />

      {/* 4. Section Abonnements */}
      <div className="w-full space-y-6">
        <h2 className="text-2xl font-bold text-black text-center">
          Abonnements
        </h2>

        {topics.length === 0 ? (
          <div className="p-8 text-center bg-[#F3F3F3] rounded-2xl text-slate-600">
            Vous n'êtes abonné à aucun thème pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#F3F3F3] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">{topic.title}</h3>
                  <p className="text-sm text-black line-clamp-3 leading-relaxed mb-6">
                    <span className="font-medium">Description: </span>
                    {topic.description || "Aucune description disponible."}
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => handleUnsubscribe(topic.id)}
                    disabled={isPending}
                    className="w-[180px] h-[44px] bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center shadow-sm"
                  >
                    Se désabonner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
