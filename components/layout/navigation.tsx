import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo_p6 1.svg'

/**

 * Barre de navigation supérieure affichée sur écran large (sm:flex),
 * masquée sur mobile (hidden) conformément à la maquette mobile Figma.
 * Emplacement conforme à l'architecture : components/layout/navigation.tsx
 */

export default function Navigation() {
  return (
    <header className="hidden sm:flex w-full bg-white border-b border-black py-3 px-6 sm:px-12 items-center justify-between">
      <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
        <Image
          src={logo}
          alt="Logo MDD Monde de Dév"
          width={835}
          height={584}
          priority
          className="w-full h-auto max-w-[200px] object-contain"
        />
      </Link>
    </header>
  )
}
