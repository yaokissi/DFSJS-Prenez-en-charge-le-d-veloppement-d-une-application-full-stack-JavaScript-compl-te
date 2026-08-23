import Link from 'next/link'

/**
 * Interface des propriétés du composant `PostCard`
 */
export interface PostCardProps {
  /** L'identifiant unique (UUID) de l'article */
  id: string
  /** Le titre de l'article */
  title: string
  /** Le contenu texte de l'article */
  content: string
  /** La date de création de l'article */
  createdAt: Date | string
  /** Le nom de l'auteur de l'article */
  authorName: string
}

/**
 * Composant Carte d'Article (PostCard) - Maquette Figma
 * -----------------------------------------------------
 * Affiche un article du fil d'actualités dans un conteneur gris clair (`bg-[#F3F3F3]`)
 * avec son titre cliquable vers `/posts/[id]`, la Date et l'Auteur conformément à la maquette.
 * 
 * @param props Propriétés de l'article typées `PostCardProps`
 */
export default function PostCard({
  id,
  title,
  content,
  createdAt,
  authorName,
}: PostCardProps) {
  // Formatage de la date (ex: 23/08/2026)
  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="bg-[#F3F3F3] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all duration-200 min-h-[220px]">
      <div>
        {/* Titre de l'article cliquable */}
        <Link href={`/posts/${id}`} className="hover:underline">
          <h2 className="text-xl font-bold text-black mb-3 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Ligne d'infos : Date & Auteur (Conforme Maquette Figma) */}
        <div className="flex items-center gap-10 sm:gap-14 text-sm text-black mb-4 font-normal">
          <div>
            <span className="font-medium">Date: </span>
            {formattedDate}
          </div>
          <div>
            <span className="font-medium">Auteur: </span>
            {authorName}
          </div>
        </div>

        {/* Aperçu du contenu texte */}
        <p className="text-sm text-black leading-relaxed line-clamp-4">
          <span className="font-medium">Content: </span>
          {content}
        </p>
      </div>
    </div>
  )
}
