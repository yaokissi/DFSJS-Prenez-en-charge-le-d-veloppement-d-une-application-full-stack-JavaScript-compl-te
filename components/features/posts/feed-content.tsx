'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { FeedPost, getFeedPostsAction } from '@/actions/post.actions'
import PostCard from '@/components/features/posts/post-card'

/**
 * Interface des props du composant `FeedContent`
 */
export interface FeedContentProps {
  /** Liste initiale des articles du fil d'actualités */
  initialPosts: FeedPost[]
}

/**
 * Composant Client : Gestion dynamique du Fil d'Actualités (FeedContent) - Maquette Figma
 * ----------------------------------------------------------------------------------------
 * Affiche la grille d'articles sur 2 colonnes (Desktop) ou 1 colonne (Mobile),
 * le bouton violet "Créer un article" et le tri par date "Trier par ↓".
 * 
 * @param props Propriétés typées `FeedContentProps`
 */
export default function FeedContent({ initialPosts }: FeedContentProps) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [isPending, startTransition] = useTransition()

  /**
   * Inverse l'ordre de tri chronologique (plus récent / plus ancien)
   * et récupère la liste mise à jour via la Server Action `getFeedPostsAction`.
   */
  const handleToggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc'
    setSortOrder(newOrder)

    startTransition(async () => {
      const updatedPosts = await getFeedPostsAction(newOrder)
      setPosts(updatedPosts)
    })
  }

  return (
    <div className="space-y-8 py-2">
      {/* Barre supérieure : Bouton Créer un article + Tri par date (Conforme Figma Desktop & Mobile) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Bouton Violet Créer un article */}
        <Link
          href="/posts/create"
          className="w-[160px] sm:w-[170px] h-[44px] bg-[#7763C5] hover:bg-[#6853b5] text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer"
        >
          Créer un article
        </Link>

        {/* Bouton de Tri par date */}
        <button
          onClick={handleToggleSort}
          disabled={isPending}
          className="text-black font-semibold text-sm flex items-center gap-1.5 hover:opacity-75 transition cursor-pointer"
        >
          <span>Trier par</span>
          <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
          {isPending && <span className="text-xs text-slate-500 font-normal">(Tri...)</span>}
        </button>
      </div>

      {/* Grille des articles sur 2 colonnes (Conforme Figma Desktop md:grid-cols-2) */}
      {posts.length === 0 ? (
        <div className="bg-[#F3F3F3] rounded-2xl p-8 text-center text-slate-700 space-y-4">
          <p className="text-base font-semibold">Votre fil d'actualités est vide.</p>
          <p className="text-sm text-slate-600">
            Abonnez-vous à des thèmes de programmation pour voir apparaître les articles publiés par la communauté !
          </p>
          <div className="pt-2">
            <Link
              href="/topics"
              className="inline-block px-6 py-2.5 bg-[#7763C5] text-white text-sm font-medium rounded-xl hover:bg-[#6853b5] transition"
            >
              Découvrir les thèmes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
              authorName={post.author.username}
            />
          ))}
        </div>
      )}
    </div>
  )
}
