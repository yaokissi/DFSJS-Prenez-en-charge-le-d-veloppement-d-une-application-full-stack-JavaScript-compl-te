'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LoginSchema, LoginInput } from '@/lib/validators/auth.validator'
import { loginUserAction } from '@/actions/auth.actions'
import backArrow from '@/public/BackArrow.svg'
import logo from '@/public/logo_p6 1.svg'

/**
 * Composant Client : Formulaire de connexion Utilisateur (LoginForm)
 * --------------------------------------------------------------------
 * Rôle : Gère l'authentification (par Email ou Username), la validation Zod client,
 * l'appel de la Server Action `loginUserAction`, et la redirection vers `/feed`.
 */
export default function LoginForm() {
  // 1. Hook de navigation Next.js pour rediriger l'utilisateur après la connexion
  const router = useRouter()

  // 2. React 19 useTransition : Gère l'état de chargement (`isPending`) sans bloquer le rendu React
  const [isPending, startTransition] = useTransition()

  // 3. États locaux pour stocker les messages d'erreur ou de succès renvoyés par le serveur
  const [serverError, setServerError] = useState<string | null>(null)
  const [serverSuccess, setServerSuccess] = useState<string | null>(null)

  // 4. React Hook Form + Zod : Initialisation du formulaire typé avec `LoginInput`
  const {
    register,     // Permet de connecter les champs HTML `identifier` et `password` à React Hook Form
    handleSubmit, // Wrapper qui valide les champs avec `LoginSchema` avant d'appeler `onSubmit`
    formState: { errors }, // Contient les erreurs de validation associées aux champs
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema), // Association du schéma Zod de connexion
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  /**
   * Fonction appelée lors de la validation du formulaire de connexion
   * @param data Identifiants saisis (identifier = email ou username, password)
   */
  const onSubmit = (data: LoginInput) => {
    // Réinitialisation des messages d'alerte
    setServerError(null)
    setServerSuccess(null)

    // Exécution de l'action asynchrone dans une transition React 19
    startTransition(async () => {
      // Appel de la Server Action côté serveur (`loginUserAction`)
      const result = await loginUserAction(data)

      // Cas d'échec : Affichage de l'erreur (ex: identifiants incorrects)
      if (!result.success) {
        setServerError(result.message || 'Identifiants invalides.')
        return
      }

      // Cas de succès : Affichage du message puis redirection vers le fil d'actualité (/feed)
      setServerSuccess('Connexion réussie ! Redirection...')
      setTimeout(() => {
        router.push('/feed')
        router.refresh() // Rafraîchit le cache serveur pour charger la session active
      }, 800)
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

      <h1 className="text-2xl sm:text-4xl mb-10 font-normal text-black text-center">Se connecter</h1>

      {/* 7. Alertes de notification d'erreur ou de succès */}
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

      {/* 8. Formulaire principal : `noValidate` désactive la validation HTML native */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center justify-center" noValidate>
        {/* Champ 1 : E-mail ou Nom d'utilisateur */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            E-mail ou nom d'utilisateur
          </label>
          <input
            {...register('identifier')} // Liaison React Hook Form
            type="text"
            className={`w-[250px] h-[50px] px-4 py-2.5 rounded-xl border border-black text-black text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.identifier ? 'border-red-500' : ''
              }`}
          />
          {errors.identifier && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.identifier.message}</p>
          )}
        </div>

        {/* Champ 2 : Mot de passe */}
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

        {/* Bouton de Soumission Se connecter */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isPending}
            className="w-[128px] h-[48px] bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all cursor-pointer disabled:opacity-50 mx-auto block"
          >
            {isPending ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  )
}
