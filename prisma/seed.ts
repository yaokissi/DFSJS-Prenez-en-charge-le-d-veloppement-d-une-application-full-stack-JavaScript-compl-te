import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du remplissage de la BDD...');

  // Nettoyage préalable des tables
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // Création des thèmes
  const topics = await Promise.all([
    prisma.topic.create({ data: { title: 'JavaScript', description: 'Tout sur le langage standard du web.' } }),
    prisma.topic.create({ data: { title: 'TypeScript', description: 'Développement typé et robuste.' } }),
    prisma.topic.create({ data: { title: 'Python', description: 'Data Science, scripts et web.' } }),
  ]);

  // Création d'un utilisateur de test (Mot de passe valide Zod)
  const user = await prisma.user.create({
    data: {
      email: 'alex@mdd.fr',
      username: 'AlexDev',
      password: 'Password123!',
    },
  });

  // Abonnement au premier thème
  await prisma.subscription.create({
    data: { userId: user.id, topicId: topics[0].id },
  });

  // Création d'un article
  const post = await prisma.post.create({
    data: {
      title: 'Bienvenue sur MDD !',
      content: 'Premier article de test créé automatiquement via le script de seed.',
      authorId: user.id,
      topicId: topics[0].id,
    },
  });

  // Création d'un commentaire
  await prisma.comment.create({
    data: {
      content: 'Super réseau social !',
      authorId: user.id,
      postId: post.id,
    },
  });

  console.log('🚀 Seeding effectué avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });