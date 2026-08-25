import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du remplissage de la BDD avec des thèmes diversifiés...')

  // Liste enrichie des thèmes de programmation et technologie
  const topicsData = [
    {
      title: 'JavaScript',
      description: 'Tout sur le langage standard du Web, les fonctionnalités ES6+ et l\'écosystème moderne.',
    },
    {
      title: 'TypeScript',
      description: 'Développement typé, typage statique, interfaces et architecture d\'applications robustes.',
    },
    {
      title: 'React & Next.js',
      description: 'Création d\'interfaces réactives, Server Components, App Router et rendu haute performance.',
    },
    {
      title: 'Node.js & Express',
      description: 'Développement d\'API RESTful, architecture microservices et programmation asynchrone côté serveur.',
    },
    {
      title: 'Python & IA',
      description: 'Data Science, Machine Learning, scripts d\'automatisation et développement web avec Django & FastApi.',
    },
    {
      title: 'DevOps & Cloud',
      description: 'Containers Docker, orchestration Kubernetes, pipelines CI/CD et hébergement cloud moderne.',
    },
    {
      title: 'UI/UX & Design Systems',
      description: 'Maquettage Figma, intégration Tailwind CSS, accessibilité web (a11y) et ergonomie utilisateur.',
    },
    {
      title: 'Bases de Données & SQL',
      description: 'PostgreSQL, ORM Prisma, modélisation de données relationnelles et optimisation de requêtes.',
    },
  ]

  // Insérer ou mettre à jour chaque thème (upsert)
  const createdTopics = []
  for (const topicData of topicsData) {
    const topic = await prisma.topic.upsert({
      where: { title: topicData.title },
      update: { description: topicData.description },
      create: topicData,
    })
    createdTopics.push(topic)
  }

  console.log(`✅ ${createdTopics.length} thèmes diversifiés insérés avec succès !`)

  // Création/Vérification de l'utilisateur de démonstration (AlexDev)
  const hashedPassword = await bcrypt.hash('Password123!', 10)
  
  let user = await prisma.user.findUnique({
    where: { email: 'alex@mdd.fr' },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'alex@mdd.fr',
        username: 'AlexDev',
        password: hashedPassword,
      },
    })
    console.log('👤 Utilisateur de démo AlexDev créé !')
  }

  // S'assurer que l'utilisateur est abonné aux 3 premiers thèmes pour la démo
  for (let i = 0; i < 3; i++) {
    await prisma.subscription.upsert({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: createdTopics[i].id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        topicId: createdTopics[i].id,
      },
    })
  }

  console.log('🚀 Seeding effectué avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })