import { useState, type FormEvent } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '../firebase'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [touched, setTouched] = useState({ email: false, password: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  const emailError = (touched.email || email.trim() !== '') && !isValidEmail(email) ? 'Geçerli bir e-posta girin.' : ''
  const passwordError = (touched.password || password !== '') && password.trim() === '' ? 'Şifre gerekli.' : ''

  const canSubmit = isValidEmail(email) && password.trim() !== ''

  const mapAuthError = (error: unknown): string => {
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
        return (error as { message?: string }).message ?? 'Giriş başarısız oldu.'
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setAuthError('')
    setIsSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setEmail('')
      setPassword('')
      setTouched({ email: false, password: false })
    } catch (error: unknown) {
      setAuthError(mapAuthError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h1 style={{ marginBottom: 16 }}>Giriş Yap</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>E-posta</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="ornek@mail.com"
            aria-invalid={!!emailError}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          {emailError && <span style={{ color: '#b91c1c', fontSize: 13 }}>{emailError}</span>}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Şifrenizi girin"
            aria-invalid={!!passwordError}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          {passwordError && <span style={{ color: '#b91c1c', fontSize: 13 }}>{passwordError}</span>}
        </label>

        {authError && (
          <div role="alert" style={{ color: '#b91c1c', fontSize: 13 }}>{authError}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          style={{ padding: '10px 14px', borderRadius: 8, background: !canSubmit || isSubmitting ? '#9ca3af' : '#111827', color: 'white', border: 'none' }}
        >
          {isSubmitting ? 'Giriş Yapılıyor…' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  )
}
