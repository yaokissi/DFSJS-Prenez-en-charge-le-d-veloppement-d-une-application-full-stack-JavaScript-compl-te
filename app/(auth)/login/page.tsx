import { Metadata } from 'next'
import LoginForm from '@/components/forms/login-form'

export const metadata: Metadata = {
  title: "Connexion | MDD - Monde de Dév",
  description: "Connectez-vous à votre espace utilisateur sur MDD.",
}

export default function LoginPage() {
  return <LoginForm />
}
