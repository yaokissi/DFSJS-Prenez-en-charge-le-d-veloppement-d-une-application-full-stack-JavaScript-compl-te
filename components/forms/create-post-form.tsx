'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CreatePostSchema, CreatePostInput } from '@/lib/validators/post.validator'
import { createPostAction } from '@/actions/post.actions'
import backArrow from '@/public/BackArrow.svg'

/**
 * Type d'un thème simplifié transmis au formulaire
 */
export interface TopicOption {
  id: string
  title: string
}

/**
 * Interface des props du composant `CreatePostForm`
 */
export interface CreatePostFormProps {
  /** Liste des thèmes de programmation disponibles */
  topics: TopicOption[]
}

/**
 * Composant Client : Formulaire de création d'article (CreatePostForm) - Figma Mockup
 * -----------------------------------------------------------------------------------
 * Positionnement exact de la flèche retour (en haut à gauche, indépendante du titre)
 * et du titre centré, conforme aux maquettes Desktop & Mobile Figma.
 * 
 * @param props Propriétés typées `CreatePostFormProps`
 */
export default function CreatePostForm({ topics }: CreatePostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      topicId: '',
      title: '',
      content: '',
    },
  })

  const onSubmit = (data: CreatePostInput) => {
    setServerError(null)
    setServerSuccess(null)

    startTransition(async () => {
      const result = await createPostAction(data)

      if (!result.success) {
        setServerError(result.message || "Une erreur est survenue lors de la création de l'article.")

        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof CreatePostInput, {
                type: 'server',
                message: messages[0],
              })
            }
          })
        }
        return
      }

      setServerSuccess('Article publié avec succès ! Redirection vers le fil d\'actualité...')
      setTimeout(() => {
        router.push('/feed')
        router.refresh()
      }, 800)
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-black relative pt-2 pb-8 px-4 flex flex-col items-center">
      {/* 1. Flèche retour directe : exécute router.back() au clic */}
      <div className="w-full flex justify-start mb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="hover:opacity-75 transition cursor-pointer"
        >
          <Image
            src={backArrow}
            alt="Flèche retour"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </button>
      </div>

      {/* 2. Titre Créer un nouvel article */}
      <h1 className="text-xl sm:text-2xl font-bold text-black text-center mb-8">
        Créer un nouvel article
      </h1>

      {/* Messages de notification */}
      {serverError && (
        <div className="w-full max-w-[420px] mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="w-full max-w-[420px] mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">
          {serverSuccess}
        </div>
      )}

      {/* 3. Formulaire de création (Inputs centrés de largeur contrôlée) */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[420px] space-y-5 flex flex-col items-center" noValidate>
        {/* Choix du Thème */}
        <div className="w-full flex flex-col items-center">
          <select
            {...register('topicId')}
            className={`w-[280px] sm:w-[320px] h-[48px] px-4 py-2.5 rounded-xl border border-black text-slate-700 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] ${
              errors.topicId ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled hidden>
              Sélectionner un thème
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
          {errors.topicId && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.topicId.message}
            </p>
          )}
        </div>

        {/* Titre de l'article */}
        <div className="w-full flex flex-col items-center">
          <input
            {...register('title')}
            type="text"
            placeholder="Titre de l'article"
            className={`w-[280px] sm:w-[320px] h-[48px] px-4 py-2.5 rounded-xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Contenu de l'article */}
        <div className="w-full flex flex-col items-center">
          <textarea
            {...register('content')}
            rows={8}
            placeholder="Contenu de l'article"
            className={`w-[280px] sm:w-[320px] p-4 rounded-xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] resize-none ${
              errors.content ? 'border-red-500' : ''
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-600 font-medium text-center w-[280px] sm:w-[320px]">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Bouton Soumettre Violet Figma "Créer" */}
        <div className="pt-4 flex justify-center w-full">
          <button
            type="submit"
            disabled={isPending}
            className="w-[140px] h-[44px] bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 mx-auto block shadow-sm"
          >
            {isPending ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  )
}
