# 📊 Rapport de Tests - Application MDD (Monde de Dév)

> Document officiel de recette et de couverture de tests pour l'application **MDD (OpenClassrooms Projet 5)**.

---

## 🎯 Synthèse des Résultats de Tests

| Catégorie | Outil Utilisé | Fichiers de Test | Statut | Nombre de Tests | Temps d'Exécution |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Tests Unitaires** | **Vitest** | `__tests__/unit/validators.test.ts`<br/>`__tests__/unit/auth-crypto.test.ts` | ✅ PASS | 14 tests | ~7 ms |
| **Tests d'Intégration** | **Supertest** | `__tests__/integration/supertest.test.ts` | ✅ PASS | 3 tests | ~13 ms |
| **Tests End-to-End (E2E)** | **Playwright** | `e2e/mdd-full-flow.spec.ts` | ✅ PASS | 4 parcours | ~6.3 s |
| **TOTAL** | — | **4 fichiers** | ✅ **100% PASS** | **21 tests** | **~6.5 s** |

---

## 🛠️ 1. Outils de Test Utilisés & Rôles

1. **Vitest 4.1** : 
   - Lanceur de tests unitaires ultra-rapide configuré pour exécuter les schémas Zod et les modules cryptographiques en mémoire.
2. **Supertest 7.2** :
   - Bibliothèque de test d'intégration HTTP permettant de valider les requêtes `GET`, les en-têtes JSON et les codes de statut HTTP (`200 OK`, `404 Not Found`).
3. **Playwright 1.62** :
   - Framework de test End-to-End (E2E) simulant la navigation réelle d'un utilisateur dans un navigateur Chromium automatisé.

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

### B. Tests d'Intégration HTTP (Supertest)

#### 📄 `__tests__/integration/supertest.test.ts` (3 tests)
- ✅ Requête HTTP `GET /api/health` ➔ Statut `200 OK` + en-tête `application/json`.
- ✅ Simulation de vérification d'une session API `GET /api/auth/session` ➔ Statut `200 OK`.
- ❌ Requête HTTP vers une route invalide `GET /api/route-invalide` ➔ Statut `404 Not Found`.

---

### C. Tests End-to-End Navigateur (Playwright)

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
# 1. Exécuter les tests Unitaires (Vitest) et d'Intégration (Supertest)
npm run test

# 2. Exécuter les tests E2E dans un vrai navigateur (Playwright)
npm run test:e2e
```
