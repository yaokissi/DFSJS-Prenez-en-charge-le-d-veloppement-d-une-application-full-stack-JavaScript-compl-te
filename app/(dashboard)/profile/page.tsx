import { Metadata } from 'next'
import { getCurrentSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserSubscribedTopicsAction } from '@/actions/user.actions'
import ProfileForm from '@/components/forms/profile-form'

export const metadata: Metadata = {
  title: 'Profil utilisateur | MDD - Monde de Dév',
  description: "Gérez vos identifiants utilisateur et vos abonnements aux thèmes de programmation.",
}

/**
 * Page de Profil Utilisateur (/profile)
 * -------------------------------------
 * Server Component Next.js : Récupère la session active et la liste des thèmes abonnés,
 * puis affiche le formulaire interactif `ProfileForm`.
 */
export default async function ProfilePage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  // Récupération des thèmes auxquels l'utilisateur est abonné
  const subscribedTopics = await getUserSubscribedTopicsAction()

  return (
    <div className="py-4 px-4 sm:px-6">
      <ProfileForm
        initialUsername={session.username}
        initialEmail={session.email}
        subscribedTopics={subscribedTopics}
      />
    </div>
  )
}
