import { Metadata } from 'next'
import RegisterForm from '@/components/forms/register-form'

export const metadata: Metadata = {
  title: "Inscription | MDD - Monde de Dév",
  description: "Créez votre compte sur le réseau social MDD pour l'entreprise ORION.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
