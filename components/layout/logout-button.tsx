'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logoutUserAction } from '@/actions/auth.actions'

/**
 * Interface des props du composant LogoutButton
 */
export interface LogoutButtonProps {
  /** Classes CSS optionnelles */
  className?: string
}

/**
 * Composant Client : Bouton de déconnexion (LogoutButton)
 * --------------------------------------------------------
 * Exécute la Server Action `logoutUserAction` pour détruire le cookie de session,
 * puis redirige l'utilisateur vers la page de connexion.
 * 
 * @param props Propriétés du composant typées `LogoutButtonProps`
 */
export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutUserAction()
      if (result.success) {
        router.push('/login')
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title="Se déconnecter"
      className={
        className ||
        'text-sm font-normal text-[#B22222] hover:underline cursor-pointer disabled:opacity-50 transition'
      }
    >
      {isPending ? 'Déconnexion...' : 'Se déconnecter'}
    </button>
  )
}
