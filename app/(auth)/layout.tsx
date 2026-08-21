import React from 'react'
import Navigation from '@/components/forms/navigation/navigation'

/**
 *Route Group (auth) Layout :
 *s'applique automatiquement sur les routes `/login` et `/register`.
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Barre de navigation supérieure partagée pour /login et /register */}
      <Navigation />

      {/* Zone principale centrée pour le formulaire */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
