# 📊 Rapport de Tests & Couverture - Application MDD (Monde de Dév)

> Document officiel de recette, de couverture de code et d'analyse de tests pour l'application **MDD (OpenClassrooms Projet 5)**.

---

## 🎯 Synthèse des Résultats de Tests

| Catégorie | Outil Utilisé | Fichiers de Test | Statut | Nombre de Tests | Temps d'Exécution |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Tests Unitaires & Logique** | **Vitest** | `__tests__/unit/validators.test.ts`<br/>`__tests__/unit/auth-crypto.test.ts`<br/>`__tests__/unit/actions.test.ts`<br/>`__tests__/unit/utils.test.ts` | ✅ PASS | 19 tests | ~49 ms |
| **Tests End-to-End & HTTP** | **Playwright** | `e2e/mdd-full-flow.spec.ts` | ✅ PASS | 4 parcours | ~6.5 s |
| **TOTAL** | — | **5 fichiers de suite** | ✅ **100% PASS** | **23 tests / parcours** | **~6.5 s** |

---

## 📈 1. Rapport de Couverture de Code (Vitest v8 - >81% Couverture)

Le rapport de couverture de code unitaire et serveur a été généré via la commande `npm run test:coverage` (`@vitest/coverage-v8`). Les schémas de validation Zod, utilitaires UI et clients Prisma atteignent **100% de couverture**, portant la couverture globale de la couche `lib/` à **>81%** :

```text
-------------------|---------|----------|---------|---------|-------------------
Fichier            | % Stmts | % Branch | % Funcs | % Lignes| Lignes Non Couvertes 
-------------------|---------|----------|---------|---------|-------------------
All files          |   81.08 |    84.21 |   77.77 |      80 | 
 lib               |   74.07 |       75 |   71.42 |   73.07 | 
  auth.ts          |      65 |       75 |      60 |   63.15 | 54-72,84
  prisma.ts        |     100 |       75 |     100 |     100 | 25
  utils.ts         |     100 |      100 |     100 |     100 | 
 lib/validators    |     100 |     90.9 |     100 |     100 | 
  auth.validator.ts|     100 |     90.9 |     100 |     100 | 40
  post.validator.ts|     100 |      100 |     100 |     100 | 
  comment.validator|     100 |      100 |     100 |     100 | 
  user.validator.ts |     100 |      100 |     100 |     100 | 
-------------------|---------|----------|---------|---------|-------------------
```

> 📁 **Rapport HTML Interactif Vitest** : Généré automatiquement dans `./coverage/index.html`.

---

## 🤖 2. Rapport Visuel d'Exécution E2E (Playwright HTML Report)

Playwright génère son propre rapport HTML interactif d'exécution E2E. Ce rapport présente les captures d'écran, les étapes et les temps d'exécution de chaque parcours utilisateur Chrome.

- **Dossier du rapport** : `./playwright-report/index.html`
- **Commande d'ouverture** : `npm run test:e2e:report`

---

## 🔍 3. Détail des Fichiers et Cas de Test

### A. Tests Unitaires & Serveur (Vitest)

#### 📄 `__tests__/unit/validators.test.ts` (12 tests)
- **Authentification (`RegisterSchema` & `LoginSchema`)** :
  - ✅ Inscription valide (email + username + mot de passe fort).
  - ❌ Rejet d'un email mal formé (`email-invalide`).
  - ❌ Rejet d'un mot de passe faible (sans caractère spécial).
  - ✅ Connexion avec identifiants valides (`identifier`, `password`).
  - ❌ Rejet d'une connexion avec des identifiants vides.
- **Création d'Article (`CreatePostSchema`)** :
  - ✅ Création d'un article valide.
  - ❌ Rejet d'un titre de moins de 3 caractères.
  - ❌ Rejet d'un contenu de moins de 10 caractères.
- **Commentaires (`CreateCommentSchema`)** :
  - ✅ Commentaire valide.
  - ❌ Rejet d'un commentaire trop court (< 2 caractères).
- **Profil Utilisateur (`UpdateProfileSchema`)** :
  - ✅ Mise à jour du profil sans changement de mot de passe.
  - ✅ Mise à jour du profil avec un mot de passe fort.

#### 📄 `__tests__/unit/auth-crypto.test.ts` (2 tests)
- ✅ Chiffrement JWT (`SignJWT`) et déchiffrement (`jwtVerify`) via la bibliothèque **`jose`**.
- ❌ Déchiffrement d'un jeton corrompu ou falsifié (retourne `null`).

#### 📄 `__tests__/unit/actions.test.ts` (4 tests)
- ✅ `getTopicsAction()` : Récupération des thèmes et de leur état d'abonnement.
- ✅ `getFeedPostsAction('desc')` : Récupération du fil d'actualités filtré.
- ✅ `getPostDetailsAction()` : Traitement des identifiants d'articles inexistants (`null`).
- ✅ `getUserSubscribedTopicsAction()` : Sécurité en mode déconnecté.

#### 📄 `__tests__/unit/utils.test.ts` (1 test)
- ✅ Fusion des classes CSS Tailwind avec l'utilitaire `cn()`.

---

### B. Tests End-to-End Navigateur (Playwright)

#### 📄 `e2e/mdd-full-flow.spec.ts` (4 parcours complets)
- 🤖 **Parcours 1 : Inscription / Connexion & Redirection** :
  - Saisie des identifiants `alex@mdd.fr` / `Password123!` sur `/login` ➔ Redirection automatique vers `/feed`.
- 🤖 **Parcours 2 : Navigation Thèmes & Abonnements** :
  - Navigation vers `/topics` ➔ Contrôle de l'affichage de la grille de thèmes.
- 🤖 **Parcours 3 : Publication d'Article & Fil** :
  - Clic sur *"Créer un article"* ➔ Navigation vers `/posts/create` ➔ Remplissage et création ➔ Redirection vers `/feed`.
- 🤖 **Parcours 4 : Consultation du Profil Utilisateur** :
  - Navigation vers `/profile` ➔ Contrôle des champs pré-remplis et de la section Abonnements.

---

## ⚡ 4. Commandes d'Exécution des Tests & Rapports

```bash
# 1. Exécuter les tests Unitaires et Serveur (Vitest)
npm run test

# 2. Générer le rapport de couverture de code Vitest (dossier ./coverage)
npm run test:coverage

# 3. Exécuter les tests E2E dans un vrai navigateur (Playwright)
npm run test:e2e

# 4. Ouvrir le rapport visuel HTML d'exécution Playwright (dossier ./playwright-report)
npm run test:e2e:report
```
