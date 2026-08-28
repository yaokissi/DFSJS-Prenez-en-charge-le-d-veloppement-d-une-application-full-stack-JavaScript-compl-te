# MDD - Monde de Dév (OpenClassrooms Projet 5)

> Plateforme de réseau social full-stack pour développeurs développée avec **Next.js 16 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL** et **Tailwind CSS**.

---

## Présentation du Projet

**MDD (Monde de Dév)** est une application web conçue pour l'entreprise **ORION**. Elle permet aux développeurs de s'abonner à des thèmes de programmation spécifiques, de publier des articles, de consulter un fil d'actualités personnalisé et d'échanger avec la communauté à travers des commentaires.

---

## Fonctionnalités Clés

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
- Rafraichir les données en cache Next.js via `revalidatePath('/feed')` lors de la publication.

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

### 7. UI / UX Responsive & Maquettes Figma
- Navigation desktop avec logo MDD, liens actifs et profil utilisateur.
- Navigation mobile avec **menu Hamburger SVG** 


## Stack Technique

- **Framework Web** : [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Langage** : [TypeScript 5](https://www.typescriptlang.org/) (Typage strict 100% avec commentaires TSDoc)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de données** : [PostgreSQL 17](https://www.postgresql.org/)
- **ORM** : [Prisma 6](https://www.prisma.io/)
- **Authentification & Chiffrement** : `jose` (JWT), `bcryptjs`, Cookies HTTP-Only
- **Validation de Données** : [Zod 3](https://zod.dev/) & [@hookform/resolvers](https://react-hook-form.com/)


## Architecture du Projet

```text
projet5/
├── actions/                  # Server Actions Next.js (Auth, Topic, Post, Comment, User)
│   ├── auth.actions.ts
│   ├── comment.actions.ts
│   ├── post.actions.ts
│   ├── topic.actions.ts
│   └── user.actions.ts
├── app/                      # Next.js App Router
│   ├── (auth)/               # Routes publiques (login, register)
│   ├── (dashboard)/          # Routes protégées (feed, topics, posts/create, posts/[id], profile)
│   ├── api/auth/             # Endpoints API d'authentification
│   ├── layout.tsx            # Layout racine
│   └── page.tsx              # Page d'accueil / Redirection
├── components/               # Composants React
│   ├── features/             # Composants métiers (posts, topics)
│   ├── forms/                # Formulaires clients (login-form, register-form, create-post-form, profile-form)
│   └── layout/               # Éléments de mise en page (navbar, navigation, back-button, logout-button)
├── lib/                      # Utilitaires & Schémas
│   ├── validators/           # Schémas Zod (auth, post, comment, user)
│   ├── auth.ts               # Cryptographie JWT, cookies HTTP-Only & helpers de session
│   └── prisma.ts             # Client Prisma Singleton
├── prisma/                   # Base de données PostgreSQL
│   ├── schema.prisma         # Modèles de données (User, Topic, Post, Comment, Subscription)
│   └── seed.ts               # Script d'initialisation des thèmes et données de test
├── public/                   # Assets statiques & icônes SVG Figma
└── package.json
```

---

## Démarrage Rapide

### 1. Prérequis
- Node.js `20.x` ou supérieur
- Docker / Docker Desktop (pour PostgreSQL)
- npm ou yarn

### 2. Installation
```bash
# Lancer le projet
git clone https://github.com/yaokissi/DFSJS-Prenez-en-charge-le-d-veloppement-d-une-application-full-stack-JavaScript-compl-te.git
cd projet5
npm install
```

### 3. Base de Données (Docker & PostgreSQL)
Lancer l'instance PostgreSQL avec Docker :
```bash
docker run --name mdd-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mdd_db -p 5432:5432 -d postgres:17
```

### 4. Configuration d'Environnement
Créer le fichier `.env` à la racine :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mdd_db?schema=public"
AUTH_SECRET="votre-cle-secrete-jwt-super-securisee-32-caracteres"
AUTH_URL="http://localhost:3000"
```

### 5. Migration Prisma & Seeding
```bash
# Appliquer le schéma de BDD
npx prisma db push

# Exécuter le script de remplissage des thèmes (Seeding)
npx prisma db seed
```

### 6. Lancement du Serveur de Développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Bonnes Pratiques & Qualité de Code

- **Double sécurité des données entrantes** : Validation des schémas Zod côté client (React Hook Form) et ré-validation systématique dans chaque Server Action.
- **Documentation TSDoc** : Toutes les fonctions, Server Actions et composants sont documentés avec des commentaires TSDoc standardisés.
- **Zéro Erreur TypeScript** : Projet strictement typé et validé via `npx tsc --noEmit`.


