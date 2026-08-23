'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, User } from 'lucide-react'
import LogoutButton from '@/components/layout/logout-button'
import logo from '@/public/logo_p6 1.svg'
import menuIcon from '@/public/menu.svg'

/**
 * Composant de Barre de Navigation du Dashboard (Navbar)
 * --------------------------------------------------------
 * Gère l'affichage Desktop classique et le tiroir Mobile (Drawer Menu Toggle)
 * en utilisant l'image SVG public/menu.svg pour l'icône hamburger Figma.
 */
export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Détermine si un lien est actif
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/posts')
  const isTopicsActive = pathname === '/topics'
  const isProfileActive = pathname === '/profile'

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="w-full bg-white border-b border-black py-3 px-4 sm:px-8 md:px-12 flex items-center justify-between relative z-30">
      {/* 1. Logo MDD (Gauche) */}
      <Link href="/feed" onClick={closeMenu} className="flex items-center gap-2 hover:opacity-90 transition">
        <Image
          src={logo}
          alt="Logo MDD Monde de Dév"
          width={160}
          height={50}
          priority
          className="w-32 sm:w-40 h-auto object-contain"
        />
      </Link>

      {/* 2. Navigation Desktop (Écrans sm et plus) */}
      <nav className="hidden sm:flex items-center gap-6 md:gap-10">
        {/* Déconnexion Rouge */}
        <LogoutButton className="text-base font-medium text-[#A92929] hover:text-red-700 transition" />

        {/* Lien Articles */}
        <Link
          href="/feed"
          className={`text-base transition ${
            isFeedActive ? 'text-[#7763C5] font-semibold' : 'text-black hover:text-[#7763C5]'
          }`}
        >
          Articles
        </Link>

        {/* Lien Thèmes */}
        <Link
          href="/topics"
          className={`text-base transition ${
            isTopicsActive ? 'text-[#7763C5] font-semibold' : 'text-black hover:text-[#7763C5]'
          }`}
        >
          Thèmes
        </Link>

        {/* Icône Profil Utilisateur */}
        <Link
          href="/profile"
          title="Mon profil"
          className={`p-1 rounded-full transition ${
            isProfileActive
              ? 'ring-2 ring-[#7763C5] text-[#7763C5]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </Link>
      </nav>

      {/* 3. Bouton Hamburger Menu Mobile (Image public/menu.svg) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sm:hidden p-2 text-black hover:opacity-75 transition cursor-pointer"
        aria-label="Ouvrir le menu de navigation"
      >
        {isMobileMenuOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <Image
            src={menuIcon}
            alt="Icône Menu Hamburger"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        )}
      </button>

      {/* 4. Menu Overlay / Tiroir Mobile (Conforme à la maquette Figma Mobile) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop sombre */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/30 z-40 sm:hidden transition-opacity"
          />

          {/* Menu tiroir droit */}
          <div className="fixed top-0 right-0 w-3/4 max-w-[260px] h-full bg-white border-l border-black z-50 sm:hidden flex flex-col justify-between p-6 shadow-2xl transition-transform animate-in slide-in-from-right duration-200">
            {/* Haut du Menu : Bouton fermer & Liens */}
            <div className="space-y-6 pt-4">
              <div className="flex justify-end mb-4">
                <button onClick={closeMenu} className="p-1 text-black hover:opacity-75">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex flex-col items-end space-y-5 text-right font-medium">
                {/* Déconnexion Rouge */}
                <LogoutButton className="text-base font-semibold text-[#A92929] hover:text-red-700 transition" />

                {/* Lien Articles */}
                <Link
                  href="/feed"
                  onClick={closeMenu}
                  className={`text-xl transition ${
                    isFeedActive ? 'text-[#7763C5] font-bold' : 'text-black'
                  }`}
                >
                  Articles
                </Link>

                {/* Lien Thèmes */}
                <Link
                  href="/topics"
                  onClick={closeMenu}
                  className={`text-xl transition ${
                    isTopicsActive ? 'text-[#7763C5] font-bold' : 'text-black'
                  }`}
                >
                  Thèmes
                </Link>
              </div>
            </div>

            {/* Bas du Menu : Icône Profil Utilisateur au bas à droite */}
            <div className="flex justify-end pt-6 pb-2">
              <Link
                href="/profile"
                onClick={closeMenu}
                title="Mon profil"
                className={`p-1 rounded-full transition ${
                  isProfileActive ? 'ring-2 ring-[#7763C5]' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center">
                  <User className="w-7 h-7 text-slate-700" />
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
