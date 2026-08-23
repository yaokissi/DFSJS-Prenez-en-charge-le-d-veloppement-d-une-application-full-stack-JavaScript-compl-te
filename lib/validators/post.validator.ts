import { z } from 'zod'

/**
 * Schéma Zod de validation pour la création d'un article.
 * Valide la sélection obligatoire du thème, un titre entre 3 et 120 caractères,
 * et un contenu texte d'au moins 10 caractères.
 */
export const CreatePostSchema = z.object({
  topicId: z
    .string()
    .min(1, { message: 'Veuillez sélectionner un thème de programmation.' }),

  title: z
    .string()
    .trim()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères.' })
    .max(120, { message: 'Le titre ne peut pas dépasser 120 caractères.' }),

  content: z
    .string()
    .trim()
    .min(10, { message: "Le contenu de l'article doit contenir au moins 10 caractères." }),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
