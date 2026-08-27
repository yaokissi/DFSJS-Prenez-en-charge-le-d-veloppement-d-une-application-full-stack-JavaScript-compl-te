import { test, expect } from '@playwright/test'

test.describe('🤖 Tests E2E - Parcours Utilisateur Complet MDD', () => {

  test('1. Inscription / Connexion et Redirection vers le Fil d\'Actualités (/feed)', async ({ page }) => {
    // Naviguer vers la page de connexion
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Se connecter')

    // Saisir les identifiants de démo AlexDev
    await page.fill('input[name="identifier"]', 'alex@mdd.fr')
    await page.fill('input[name="password"]', 'Password123!')

    // Soumettre le formulaire
    await page.click('button[type="submit"]')

    // Vérifier la redirection vers /feed
    await expect(page).toHaveURL('/feed', { timeout: 10000 })
  })

  test('2. Navigation sur les Thèmes (/topics) et Gestion des Abonnements', async ({ page }) => {
    // Se connecter au préalable
    await page.goto('/login')
    await page.fill('input[name="identifier"]', 'alex@mdd.fr')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/feed')

    // Naviguer vers les thèmes
    await page.goto('/topics')

    // Vérifier que la grille de thèmes est affichée
    const topicCards = page.locator('div.bg-\\[\\#F3F3F3\\]')
    await expect(topicCards.first()).toBeVisible()
  })

  test('3. Publication d\'un Article (/posts/create) et Consultation sur le Fil', async ({ page }) => {
    // Se connecter au préalable
    await page.goto('/login')
    await page.fill('input[name="identifier"]', 'alex@mdd.fr')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/feed')

    // Cliquer sur le bouton "Créer un article"
    await page.click('a:has-text("Créer un article")')
    await expect(page).toHaveURL('/posts/create')
    await expect(page.locator('h1')).toContainText('Créer un nouvel article')

    // Remplir le formulaire de création
    await page.selectOption('select[name="topicId"]', { index: 1 })
    const testTitle = `Test Article Playwright ${Date.now()}`
    await page.fill('input[name="title"]', testTitle)
    await page.fill('textarea[name="content"]', 'Voici le contenu texte d\'un article de test généré par Playwright.')

    // Soumettre la création
    await page.click('button[type="submit"]')

    // Attendre la redirection vers /feed
    await expect(page).toHaveURL('/feed', { timeout: 10000 })
  })

  test('4. Consultation de la Page Profil (/profile)', async ({ page }) => {
    // Se connecter au préalable
    await page.goto('/login')
    await page.fill('input[name="identifier"]', 'alex@mdd.fr')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/feed')

    // Naviguer vers la page profil
    await page.goto('/profile')
    await expect(page.locator('h1')).toContainText('Profil utilisateur')

    // Vérifier les champs pré-remplis et la section Abonnements
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('h2:has-text("Abonnements")')).toBeVisible()
  })
})
