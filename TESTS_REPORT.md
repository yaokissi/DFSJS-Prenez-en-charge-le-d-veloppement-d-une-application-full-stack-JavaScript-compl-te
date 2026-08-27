# 📊 Rapport de Tests - Application MDD (Monde de Dév)

> Document officiel de recette et de couverture de tests pour l'application **MDD (OpenClassrooms Projet 5)**.

---

## 🎯 Synthèse des Résultats de Tests

| Catégorie | Outil Utilisé | Fichiers de Test | Statut | Nombre de Tests | Temps d'Exécution |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Tests Unitaires & Logique** | **Vitest** | `__tests__/unit/validators.test.ts`<br/>`__tests__/unit/auth-crypto.test.ts` | ✅ PASS | 14 tests | ~7 ms |
| **Tests End-to-End & HTTP** | **Playwright** | `e2e/mdd-full-flow.spec.ts` | ✅ PASS | 4 parcours | ~6.3 s |
| **TOTAL** | — | **3 fichiers de suite** | ✅ **100% PASS** | **18 tests / parcours** | **~6.5 s** |

---

## 🛠️ 1. Outils de Test Utilisés & Choix Architecturel

1. **Vitest 4.1** : 
   - Lanceur de tests unitaires et serveur ultra-rapide configuré pour exécuter les schémas Zod et les modules cryptographiques en mémoire.
2. **Playwright 1.62** :
   - Framework de test End-to-End (E2E) simulant la navigation réelle d'un utilisateur dans un navigateur Chromium automatisé, validant l'intégration HTTP complète (cookies `HttpOnly`, Server Actions et redirections).

> 💡 **Note d'Architecture concernant Supertest** :
> Supertest est historiquement conçu pour tester des API REST Express traditionnelles (`app.get('/api/...')`).
> Dans **Next.js 16 (App Router)**, l'application utilise exclusivement des **Server Actions** (`actions/*.actions.ts`). La validation du protocole HTTP, des cookies de session JWT et de l'intégration globale est donc prise en charge à 100% par **Playwright** dans un environnement réel.

---

## 🔍 2. Détail des Fichiers et Cas de Test

### A. Tests Unitaires (Vitest)

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

## ⚡ 3. Commandes d'Exécution des Tests

```bash
# 1. Exécuter les tests Unitaires et Serveur (Vitest)
npm run test

# 2. Exécuter les tests E2E dans un vrai navigateur (Playwright)
npm run test:e2e
```
