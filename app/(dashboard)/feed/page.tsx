import { getCurrentSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function FeedPage() {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Fil d'actualité MDD</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Bienvenue, <span className="font-bold text-indigo-600 dark:text-indigo-400">{session.username}</span> ({session.email}) !
        </p>
        <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-sm">
           Votre session est active et sécurisée via Cookie HTTP-Only ! Le backend vous authentifie correctement.
        </div>
      </div>
    </div>
  )
}
