import { z } from 'zod'

/**
 * Schéma Zod de validation pour la mise à jour du profil utilisateur.
 * Le nom d'utilisateur et l'email sont requis.
 * Le mot de passe est optionnel (s'il est renseigné, il doit respecter la complexité sécurité).
 */
export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères." })
    .max(10, { message: "Le nom d'utilisateur ne peut pas dépasser 10 caractères." }),

  email: z
    .string()
    .trim()
    .min(1, { message: "L'adresse e-mail est requise." })
    .email({ message: "Format d'adresse e-mail invalide." }),

  password: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true
        return (
          val.length >= 8 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^A-Za-z0-9]/.test(val)
        )
      },
      {
        message:
          'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
      }
    ),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
