import Link from 'next/link'
import Image from 'next/image'
import logo from "@/public/logo_p6 1.svg"

export default function HomePage() {
  return (
    <main className="w-full max-w-[835px] min-h-[400px] md:h-[584px] bg-[#FFFFFF] text-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-center mt-6 sm:mt-16 mx-auto px-4">
      <div className="w-full max-w-2xl space-y-6 flex flex-col items-center">
        <Image
          src={logo}
          alt="Logo MDD"
          width={835}
          height={584}
          priority
          className="w-full h-auto max-w-[500px] md:max-w-[835px] object-contain"
        />

        <div className="flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-0 w-full max-w-[377px] mx-auto">
          <Link
            href="/login"
            className="w-[45%] sm:w-[45%] py-3.5 text-black font-semibold rounded-xl border border-[#000000] text-center"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="w-[45%] sm:w-[45%] py-3.5 text-black font-semibold rounded-xl border border-[#000000] text-center"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </main>
  )
}

