import { useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth'
import { auth } from '../firebase'

function mapAuthError(error: unknown): string {
  const code = (error as FirebaseError)?.code
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'E-posta veya şifre hatalı.'
    case 'auth/user-not-found':
      return 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.'
    case 'auth/invalid-email':
      return 'Geçerli bir e-posta girin.'
    case 'auth/too-many-requests':
      return 'Çok fazla başarısız deneme yapıldı. Lütfen daha sonra tekrar deneyin.'
    case 'auth/user-disabled':
      return 'Bu kullanıcı hesabı devre dışı bırakılmış.'
    default:
      return (error as { message?: string }).message ?? 'İşlem başarısız oldu.'
  }
}

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const clearError = () => setError('')

  const register = async (email: string, password: string): Promise<UserCredential | null> => {
    if (isSubmitting) return null
    setError('')
    setIsSubmitting(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (err: unknown) {
      setError(mapAuthError(err))
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const login = async (email: string, password: string): Promise<UserCredential | null> => {
    if (isSubmitting) return null
    setError('')
    setIsSubmitting(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (err: unknown) {
      setError(mapAuthError(err))
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    error,
    clearError,
    register,
    login,
  }
}
