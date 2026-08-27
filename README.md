# MDD - Monde de Dév (OpenClassrooms Projet 5)

> Plateforme de réseau social full-stack pour développeurs développée avec **Next.js 16 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL** et **Tailwind CSS**.

---

## 📌 Présentation du Projet

**MDD (Monde de Dév)** est une application web conçue pour l'entreprise **ORION**. Elle permet aux développeurs de s'abonner à des thèmes de programmation spécifiques, de publier des articles, de consulter un fil d'actualités personnalisé et d'échanger avec la communauté à travers des commentaires.

---

## ⚡ Fonctionnalités Clés

### 1. Authentification & Sécurité (`/login` & `/register`)
- **Inscription & Connexion** avec validation en temps réel via **React Hook Form** et **Zod**.
- **Sécurité renforcée** : Hachage des mots de passe avec **`bcryptjs`**.
- **Gestion de Session** : Session utilisateur stockée dans un cookie **HTTP-Only** sécurisé via des jetons **JWT** signés avec la bibliothèque **`jose`**.
- **Protection des Routes** : Middleware et Server Components contrôlant l'accès aux espaces réservés aux utilisateurs authentifiés.

### 2. Thèmes de Programmation & Abonnements (`/topics`)
- Catalogue interactif présentant divers thèmes de développement (JavaScript, TypeScript, React, Python, DevOps, etc.).
- **Abonnement / Désabonnement en 1 clic** avec réactivité instantanée via `useTransition` React 19 et Server Actions.

### 3. Création & Publication d'Articles (`/posts/create`)
- Formulaire conforme au design Figma (flèche retour, sélection du thème, titre et contenu texte).
- **Sécurité** : Validation Zod côté client et ré-exécution de la validation sur le serveur.
- Invalidation dynamique du cache Next.js via `revalidatePath('/feed')` lors de la publication.

### 4. Fil d'Actualités Personnalisé & Tri (`/feed`)
- **Filtrage Métier** : Seuls les articles appartenant aux thèmes auxquels l'utilisateur connecté est abonné s'affichent (`WHERE topicId IN (...)`).
- **Tri Chronologique** : Bouton de tri réactif *"Trier par ↓"* (du plus récent au plus ancien ou vice-versa).
- Disposition de la grille en **2 colonnes sur desktop** (`md:grid-cols-2`) et **1 colonne sur mobile**.

### 5. Détail d'un Article & Commentaires (`/posts/[id]`)
- Page dynamique affichant le titre, la date, l'auteur, le thème et le contenu intégral de l'article.
- Section commentaires avec bulles gris clair (`#F3F3F3`) et formulaire de saisie intégrant l'icône d'envoi violette Figma.
- Bouton flèche retour déclenchant la navigation d'historique du navigateur (`router.back()`).

### 6. Profil Utilisateur & Gestion des Abonnements (`/profile`)
- Consultation et modification du nom d'utilisateur, de l'adresse e-mail et du mot de passe (optionnel).
- Mise à jour en direct du cookie de session lors du changement d'identifiants.
- Gestion directe des abonnements avec suppression instantanée depuis la page profil.

---

## 🛠️ Documentation des Server Actions

Toutes les Server Actions sont regroupées dans le dossier `actions/` et appliquent une validation stricte par schémas Zod :

- `registerUserAction(data)` (`actions/auth.actions.ts`) : Valide les identifiants, hache le mot de passe via `bcryptjs`, crée l'utilisateur en BDD et génère la session HTTP-Only.
- `loginUserAction(data)` (`actions/auth.actions.ts`) : Authentifie un utilisateur par email ou pseudo, contrôle le mot de passe et initialise le cookie JWT `jose`.
- `logoutUserAction()` (`actions/auth.actions.ts`) : Réinitialise et supprime le cookie de session HTTP-Only.
- `getTopicsAction()` (`actions/topic.actions.ts`) : Récupère la liste des thèmes et associe la propriété `isSubscribed: true/false`.
- `toggleSubscriptionAction(topicId)` (`actions/topic.actions.ts`) : Bascule l'état d'abonnement (ajout/suppression dans PostgreSQL) et invalide le cache Next.js.
- `getFeedPostsAction(sortOrder)` (`actions/post.actions.ts`) : Charge les articles des thèmes abonnés triés par date asc/desc.
- `createPostAction(data)` (`actions/post.actions.ts`) : Valide et crée un article puis déclenche `revalidatePath('/feed')`.
- `getPostDetailsAction(postId)` (`actions/post.actions.ts`) : Charge un article avec son auteur, son thème et ses commentaires triés.
- `createCommentAction(data)` (`actions/comment.actions.ts`) : Ajoute un commentaire et rafraîchit la page de l'article.
- `updateProfileAction(data)` (`actions/user.actions.ts`) : Met à jour les infos du profil et régénère immédiatement le cookie JWT.

---

## 🧪 Tests Automatisés

Le projet intègre une suite de tests automatisés (**Vitest** et **Playwright**) :

```bash
# Exécuter les 14 tests Unitaires et d'Intégration Serveur (Vitest)
npm run test

# Exécuter les 4 tests End-to-End en navigateur Chrome automatisé (Playwright)
npm run test:e2e
```

Voir le fichier **[`TESTS_REPORT.md`](file:///Users/yaokissi/Hard_Disc/Open-Classroom/projet5/TESTS_REPORT.md)** pour le rapport détaillé des résultats.

---

## ❓ FAQ Utilisateur

### Q1. Pourquoi mon fil d'actualités (`/feed`) est-il vide ?
> **Réponse** : Le fil d'actualités s'adapte à vos préférences ! Il affiche uniquement les articles correspondant aux thèmes auxquels vous êtes abonné. Rendez-vous sur la page **Thèmes** (`/topics`) et cliquez sur *"S'abonner"* à un ou plusieurs thèmes.

### Q2. Puis-je modifier mon nom d'utilisateur ou e-mail sans changer mon mot de passe ?
> **Réponse** : Oui ! Dans la page **Profil** (`/profile`), modifiez votre nom d'utilisateur ou votre e-mail et laissez le champ mot de passe vide. Cliquez sur *"Sauvegarder"* pour valider.

### Q3. Comment fonctionne le bouton de tri sur le fil d'actualités ?
> **Réponse** : Le bouton *"Trier par ↓"* permet de basculer instantanément l'affichage des articles du plus récent au plus ancien ou inversement.

### Q4. Que faire si une erreur de connexion à la base de données apparaît lors des tests ?
> **Réponse** : Assurez-vous que l'instance Docker PostgreSQL est active (`docker ps`) et lancez `npx prisma db push` puis `npx prisma db seed`.

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js `20.x` ou supérieur
- Docker / Docker Desktop (pour PostgreSQL)
- npm ou yarn

### 2. Installation
```bash
git clone https://github.com/yaokissi/DFSJS-Prenez-en-charge-le-d-veloppement-d-une-application-full-stack-JavaScript-compl-te.git
cd projet5
npm install --legacy-peer-deps
```

### 3. Base de Données (Docker & PostgreSQL)
```bash
docker run --name mdd-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mdd_db -p 5432:5432 -d postgres:17
```

### 4. Configuration d'Environnement (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mdd_db?schema=public"
AUTH_SECRET="votre-cle-secrete-jwt-super-securisee-32-caracteres"
AUTH_URL="http://localhost:3000"
```

### 5. Migration Prisma & Seeding
```bash
npx prisma db push
npx prisma db seed
```

### 6. Lancement du Serveur de Développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).
