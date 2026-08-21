import { z } from 'zod'

/**
 * Lead Dev Note - Centralisation des schémas de validation :
 * Placer les schémas Zod dans `lib/validators/` permet une réutilisation directe :
 * 1. Côté Client : pour la validation en temps réel dans les formulaires (React Hook Form + zodResolver).
 * 2. Côté Serveur : pour re-valider impérativement les données dans les Server Actions (défense en profondeur).
 */

// Expression régulière pour exiger au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "L'adresse email est requise." })
      .email({ message: "Le format de l'adresse email est invalide." }),

    username: z
      .string()
      .trim()
      .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères." })
      .max(30, { message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères." })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.",
      }),

    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
      .regex(passwordRegex, {
        message:
          "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).",
      }),

    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: "Veuillez saisir votre email ou votre nom d'utilisateur." }),

  password: z
    .string()
    .min(1, { message: "Le mot de passe est requis." }),
})

export type LoginInput = z.infer<typeof LoginSchema>
