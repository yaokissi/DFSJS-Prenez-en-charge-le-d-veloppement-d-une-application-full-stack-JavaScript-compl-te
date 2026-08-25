'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { CreateCommentSchema, CreateCommentInput } from '@/lib/validators/comment.validator'
import { createCommentAction } from '@/actions/comment.actions'
import sendIcon from '@/public/icon_send_.svg'

/**
 * Interface d'un commentaire affiché dans la liste
 */
export interface CommentItem {
  id: string
  content: string
  createdAt: Date | string
  author: {
    username: string
  }
}

/**
 * Interface des props du composant `CommentSection`
 */
export interface CommentSectionProps {
  /** L'identifiant unique (UUID) de l'article */
  postId: string
  /** Liste des commentaires existants sur l'article */
  comments: CommentItem[]
}

/**
 * Composant Client : Section Commentaires d'un Article (CommentSection) - Figma
 * -----------------------------------------------------------------------------
 * Affiche la liste des commentaires et le formulaire de saisie avec le bouton d'envoi
 * sous forme d'icône violette `icon_send_.svg`, conforme à la maquette Figma.
 * 
 * @param props Propriétés typées `CommentSectionProps`
 */
export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      postId: postId,
      content: '',
    },
  })

  const onSubmit = (data: CreateCommentInput) => {
    setServerError(null)

    startTransition(async () => {
      const result = await createCommentAction({
        ...data,
        postId: postId,
      })

      if (!result.success) {
        setServerError(result.message || 'Erreur lors de la publication du commentaire.')
        return
      }

      // Reinitialisation du champ de texte
      reset({ postId: postId, content: '' })
    })
  }

  return (
    <div className="space-y-8 pt-4">
      {/* 1. Titre Commentaires */}
      <h3 className="text-xl font-bold text-black">Commentaires</h3>

      {/* 2. Liste des Commentaires Existants (Conforme Maquette Figma) */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            Aucun commentaire pour le moment. Soyez le premier à réagir !
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
              {/* Nom d'utilisateur à gauche */}
              <div className="sm:w-32 pt-2 text-left sm:text-right font-semibold text-sm text-black shrink-0">
                {comment.author.username}
              </div>

              {/* Bulle de commentaire gris clair à droite */}
              <div className="flex-1 bg-[#F3F3F3] rounded-2xl p-4 sm:p-5 text-sm text-black leading-relaxed">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message d'erreur serveur si présent */}
      {serverError && (
        <p className="text-xs text-red-600 font-medium text-center">{serverError}</p>
      )}

      {/* 3. Formulaire de saisie d'un nouveau commentaire avec icône d'envoi */}
      <form onSubmit={handleSubmit(onSubmit)} className="pt-4" noValidate>
        <div className="flex items-center gap-4">
          {/* Champ Textarea */}
          <div className="flex-1">
            <textarea
              {...register('content')}
              rows={3}
              placeholder="Écrivez ici votre commentaire"
              className={`w-full p-4 rounded-2xl border border-black text-black placeholder:text-slate-400 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#7763C5] resize-none ${
                errors.content ? 'border-red-500' : ''
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.content.message}</p>
            )}
          </div>

          {/* Bouton d'envoi avec l'icône SVG violette icon_send_.svg (Conforme Figma) */}
          <button
            type="submit"
            disabled={isPending}
            title="Envoyer le commentaire"
            className="p-2 hover:opacity-75 transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Image
              src={sendIcon}
              alt="Envoyer le commentaire"
              width={40}
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </button>
        </div>
      </form>
    </div>
  )
}
