import React from 'react'
import Navbar from '@/components/layout/navbar'

/**
 * Layout global de l'espace protégé (Dashboard)
 * ---------------------------------------------
 * S'applique à toutes les sous-routes du Route Group (dashboard) :
 * /feed, /topics, /posts, /profile.
 * Inclus la barre de navigation Navbar supérieure conforme à la maquette Figma.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col text-black">
      {/* Navbar supérieure Figma */}
      <Navbar />

      {/* Zone de contenu principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
