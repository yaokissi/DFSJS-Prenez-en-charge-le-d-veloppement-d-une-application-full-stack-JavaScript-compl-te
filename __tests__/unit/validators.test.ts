import { describe, it, expect } from 'vitest'
import { RegisterSchema, LoginSchema } from '@/lib/validators/auth.validator'
import { CreatePostSchema } from '@/lib/validators/post.validator'
import { CreateCommentSchema } from '@/lib/validators/comment.validator'
import { UpdateProfileSchema } from '@/lib/validators/user.validator'

describe(' Tests Unitaires - Schémas de Validation Zod', () => {
  describe('1. Authentification (RegisterSchema & LoginSchema)', () => {
    it('doit valider une inscription valide', () => {
      const validData = {
        email: 'dev@mdd.fr',
        username: 'AlexDev',
        password: 'Password123!',
      }
      const result = RegisterSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('doit refuser une adresse email invalide', () => {
      const invalidData = {
        email: 'email-invalide',
        username: 'AlexDev',
        password: 'Password123!',
      }
      const result = RegisterSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toBeDefined()
      }
    })

    it('doit refuser un mot de passe faible (sans caractère spécial)', () => {
      const invalidData = {
        email: 'dev@mdd.fr',
        username: 'AlexDev',
        password: 'password123',
      }
      const result = RegisterSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('doit valider une connexion avec des identifiants valides', () => {
      const validLogin = {
        identifier: 'alex@mdd.fr',
        password: 'Password123!',
      }
      const result = LoginSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('doit refuser une connexion avec des identifiants vides', () => {
      const invalidLogin = {
        identifier: '',
        password: '',
      }
      const result = LoginSchema.safeParse(invalidLogin)
      expect(result.success).toBe(false)
    })
  })

  describe('2. Création d\'Article (CreatePostSchema)', () => {
    it('doit valider la création d\'un article valide', () => {
      const validPost = {
        topicId: 'topic-uuid-123',
        title: 'Nouveautés TypeScript 5.5',
        content: 'Voici un article détaillé sur les dernières fonctionnalités de TypeScript.',
      }
      const result = CreatePostSchema.safeParse(validPost)
      expect(result.success).toBe(true)
    })

    it('doit refuser un titre trop court (moins de 3 caractères)', () => {
      const invalidPost = {
        topicId: 'topic-uuid-123',
        title: 'Hi',
        content: 'Voici un article détaillé sur les dernières fonctionnalités.',
      }
      const result = CreatePostSchema.safeParse(invalidPost)
      expect(result.success).toBe(false)
    })

    it('doit refuser un contenu trop court (moins de 10 caractères)', () => {
      const invalidPost = {
        topicId: 'topic-uuid-123',
        title: 'Titre Valide',
        content: 'Court',
      }
      const result = CreatePostSchema.safeParse(invalidPost)
      expect(result.success).toBe(false)
    })
  })

  describe('3. Commentaires (CreateCommentSchema)', () => {
    it('doit valider un commentaire valide', () => {
      const validComment = {
        postId: 'post-uuid-456',
        content: 'Super article, merci pour le partage !',
      }
      const result = CreateCommentSchema.safeParse(validComment)
      expect(result.success).toBe(true)
    })

    it('doit refuser un commentaire vide ou de moins de 2 caractères', () => {
      const invalidComment = {
        postId: 'post-uuid-456',
        content: 'a',
      }
      const result = CreateCommentSchema.safeParse(invalidComment)
      expect(result.success).toBe(false)
    })
  })

  describe('4. Profil Utilisateur (UpdateProfileSchema)', () => {
    it('doit valider la mise à jour du profil sans mot de passe', () => {
      const validUpdate = {
        username: 'NewAlex',
        email: 'newalex@mdd.fr',
      }
      const result = UpdateProfileSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })

    it('doit valider la mise à jour du profil avec un nouveau mot de passe fort', () => {
      const validUpdate = {
        username: 'NewAlex',
        email: 'newalex@mdd.fr',
        password: 'NewPassword123!',
      }
      const result = UpdateProfileSchema.safeParse(validUpdate)
      expect(result.success).toBe(true)
    })
  })
})
