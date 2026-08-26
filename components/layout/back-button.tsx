'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import backArrow from '@/public/BackArrow.svg'

/**
 * Bouton Flèche Retour ultra simple : appelle directement router.back()
 */
export default function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      title="Retour"
      className="hover:opacity-75 transition cursor-pointer"
    >
      <Image
        src={backArrow}
        alt="Flèche retour"
        width={40}
        height={40}
        className="w-8 h-8 sm:w-10 sm:h-10"
      />
    </button>
  )
}
