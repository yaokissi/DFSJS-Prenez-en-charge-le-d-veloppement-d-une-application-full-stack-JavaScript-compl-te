import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCurrentSession } from '@/lib/auth'
import { getPostDetailsAction } from '@/actions/post.actions'
import CommentSection from '@/components/features/posts/comment-section'
import BackButton from '@/components/layout/back-button'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = await getPostDetailsAction(id)

  if (!post) {
    return {
      title: 'Article introuvable | MDD',
    }
  }

  return {
    title: `${post.title} | MDD - Monde de Dév`,
    description: post.content.substring(0, 150),
  }
}

/**
 * Page de détail d'un article et de ses commentaires (/posts/[id])
 * ----------------------------------------------------------------
 * Server Component Next.js : Charge les détails de l'article depuis PostgreSQL,
 * affiche les informations de l'auteur et du thème, et intègre la section commentaires.
 */
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getCurrentSession()
  if (!session) {
    redirect('/login')
  }

  const { id } = await params
  const post = await getPostDetailsAction(id)

  if (!post) {
    notFound()
  }

  // Formatage de la date en français (ex: 23 août 2026)
  const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 text-black space-y-6">
      {/* 1. Flèche Retour alignée tout à gauche qui retourne à la page précédente de l'historique */}
      <div className="w-full flex justify-start mb-2">
        <BackButton />
      </div>

      {/* 2. Titre de l'article sélectionné */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
        {post.title}
      </h1>

      {/* 3. Ligne d'informations : Date, Auteur, Thème (Conforme Figma) */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-12 text-sm text-black font-normal">
        <div>
          <span className="font-medium">Date: </span>
          {formattedDate}
        </div>
        <div>
          <span className="font-medium">Auteur: </span>
          {post.author.username}
        </div>
        <div>
          <span className="font-medium">Thème: </span>
          {post.topic.title}
        </div>
      </div>

      {/* 4. Contenu complet de l'article */}
      <div className="pt-2 text-base text-black leading-relaxed whitespace-pre-line">
        <span className="font-medium">Content: </span>
        {post.content}
      </div>

      {/* 5. Ligne de séparation horizontale Figma */}
      <hr className="my-8 border-black opacity-30" />

      {/* 6. Section des Commentaires */}
      <CommentSection postId={post.id} comments={post.comments} />
    </div>
  )
}
