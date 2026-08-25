import { z } from 'zod'

/**
 * Schéma Zod de validation pour l'ajout d'un commentaire.
 * Valide l'ID de l'article et un contenu texte non vide d'au moins 2 caractères.
 */
export const CreateCommentSchema = z.object({
  postId: z
    .string()
    .min(1, { message: "L'identifiant de l'article est requis." }),

  content: z
    .string()
    .trim()
    .min(2, { message: 'Votre commentaire doit contenir au moins 2 caractères.' })
    .max(1000, { message: 'Votre commentaire ne peut pas dépasser 1000 caractères.' }),
})

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
