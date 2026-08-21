'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { RegisterSchema, RegisterInput } from '@/lib/validators/auth.validator'
import { registerUserAction } from '@/actions/auth.actions'
import backArrow from '@/public/BackArrow.svg'
import logo from '@/public/logo_p6 1.svg'

/**
 * Composant Client : Formulaire d'inscription Utilisateur (RegisterForm)
 * ------------------------------------------------------------------------
 * Rôle : Gère la saisie du formulaire, la validation côté client avec Zod,
 * l'envoi sécurisé vers la Server Action `registerUserAction`, et la redirection.
 */
export default function RegisterForm() {
  // 1. Hook de navigation Next.js pour rediriger l'utilisateur après inscription réussie
  const router = useRouter()

  // 2. React 19 useTransition : Gère l'état de chargement (`isPending`) sans bloquer l'UI
  const [isPending, startTransition] = useTransition()

  // 3. États locaux pour afficher les messages globaux d'erreur ou de succès renvoyés par le serveur
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  // 4. React Hook Form + Zod : Initialisation de la gestion du formulaire avec typage strict `RegisterInput`
  const {
    register,     // Fonction pour lier les champs HTML à React Hook Form (email, username, password)
    handleSubmit, // Wrapper qui valide les données avec Zod avant d'exécuter `onSubmit`
    setError,     // Permet d'injecter manuellement une erreur serveur sur un champ spécifique
    formState: { errors }, // Objet contenant les erreurs de validation par champ
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema), // Liaison du schéma de validation Zod
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  })

  /**
   * Fonction exécutée lors de la soumission valide du formulaire
   * @param data Données validées par le schéma Zod (username, email, password)
   */
  const onSubmit = (data: RegisterInput) => {
    // Réinitialisation des messages d'erreur/succès précédents
    setServerError(null)
    setServerSuccess(null)

    // Lancement de l'action asynchrone dans une transition React 19
    startTransition(async () => {
      // Appel de la Server Action Next.js (s'exécute côté serveur)
      const result = await registerUserAction(data)

      // Cas d'échec : Traitement de l'erreur renvoyée par le serveur
      if (!result.success) {
        setServerError(result.message || "Une erreur s'est produite lors de l'inscription.")

        // Si le serveur renvoie des erreurs de champ (ex: email déjà pris), on les assigne aux inputs
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              setError(field as keyof RegisterInput, {
                type: 'server',
                message: messages[0],
              })
            }
          })
        }
        return
      }

      // Cas de succès : Affichage du message puis redirection vers le fil d'actualité (/feed)
      setServerSuccess(result.message || 'Compte créé avec succès ! Redirection...')
      setTimeout(() => {
        router.push('/feed')
        router.refresh() // Rafraîchit le cache serveur pour prendre en compte le nouveau cookie de session
      }, 1000)
    })
  }

  return (
    <div className="w-[80%] h-[50%] mx-auto text-black relative pt-4 pb-8 px-4 flex flex-col items-center">
      {/* 5. Flèche Retour à l'accueil */}
      <div className="w-full relative flex items-center justify-start mb-4">
        <Link
          href="/"
          title="Retour à l'accueil"
          className="hover:opacity-75 transition cursor-pointer"
        >
          <Image
            src={backArrow}
            alt="Flèche retour"
            width={50}
            height={50}
            className="w-10 h-10"
          />
        </Link>
      </div>

      {/* 6. Logo MDD centré (Affiché uniquement sur Mobile - Responsive Maquette Figma) */}
      <div className="flex justify-center mb-6 sm:hidden">
        <Image
          src={logo}
          alt="Logo MDD"
          width={150}
          height={60}
          priority
          className="w-36 h-auto object-contain"
        />
      </div>

      <h1 className="text-2xl sm:text-4xl mb-10 font-normal text-black text-center">Inscription</h1>

      {/* 7. Affichage conditionnel des alerte Erreur ou Succès */}
      {serverError && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {serverError}
        </div>
      )}

      {serverSuccess && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">
          {serverSuccess}
        </div>
      )}

      {/* 8. Formulaire principal : `noValidate` désactive la validation HTML native pour laisser le contrôle à Zod */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center justify-center" noValidate>
        {/* Champ 1 : Nom d'utilisateur */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Nom d'utilisateur
          </label>
          <input
            {...register('username')} // Liaison React Hook Form
            type="text"
            className={`w-[250px] h-[50px] px-4 py-2.5 rounded-xl border border-black text-black text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.username ? 'border-red-500' : ''
              }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.username.message}</p>
          )}
        </div>

        {/* Champ 2 : Adresse e-mail */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Adresse e-mail
          </label>
          <input
            {...register('email')} // Liaison React Hook Form
            type="email"
            className={`w-[250px] h-[50px] px-4 py-2.5 rounded-xl border border-black text-black text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''
              }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Champ 3 : Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Mot de passe
          </label>
          <input
            {...register('password')} // Liaison React Hook Form
            type="password"
            className={`w-[250px] h-[50px] px-4 py-2.5 rounded-xl border border-black text-black text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : ''
              }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Bouton de Soumission S'inscrire */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isPending}
            className="w-[128px] h-[48px] px-8 py-2.5 bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 mx-auto block"
          >
            {isPending ? 'Inscription...' : "S'inscrire"}
          </button>
        </div>
      </form>
    </div>
  )
}
