import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPassword(password: string): boolean {
  const hasMinLength = password.length >= 8
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  return hasMinLength && hasLower && hasUpper && hasDigit
}

function getPasswordIssues(password: string): string[] {
  const issues: string[] = []
  if (password.length < 8) issues.push('en az 8 karakter')
  if (!/[0-9]/.test(password)) issues.push('rakam')
  if (!/[A-Z]/.test(password)) issues.push('büyük harf')
  if (!/[a-z]/.test(password)) issues.push('küçük harf')
  return issues
}

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { register, isSubmitting, error: authError, clearError } = useAuth()

  const [touched, setTouched] = useState({ email: false, password: false, confirm: false })

  const emailError =
    (touched.email || email.trim() !== '') && !isValidEmail(email) ? 'Geçerli bir e-posta girin.' : ''

  const passwordIssues = getPasswordIssues(password)
  const passwordError =
    (touched.password || password !== '') && passwordIssues.length > 0
      ? `Eksik: ${passwordIssues.join(', ')}`
      : ''

  const confirmError =
    (touched.confirm || confirmPassword !== '') && confirmPassword !== password ? 'Şifreler eşleşmiyor.' : ''

  const canSubmit =
    isValidEmail(email) && isValidPassword(password) && confirmPassword === password

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    const userCredential = await register(email, password)
    if (userCredential) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setTouched({ email: false, password: false, confirm: false })
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <h1 style={{ marginBottom: 16 }}>Kayıt Ol</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>E-posta</span>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (authError) clearError() }}
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
            onChange={(e) => { setPassword(e.target.value); if (authError) clearError() }}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="En az 8 karakter, rakam, büyük ve küçük harf"
            aria-invalid={!!passwordError}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          {passwordError && (
            <span style={{ color: '#b91c1c', fontSize: 13, display: 'block', maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{passwordError}</span>
          )}
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Şifre (Tekrar)</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); if (authError) clearError() }}
            onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            placeholder="Şifrenizi tekrar girin"
            aria-invalid={!!confirmError}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }}
          />
          {confirmError && <span style={{ color: '#b91c1c', fontSize: 13 }}>{confirmError}</span>}
        </label>

        {authError && (
          <div role="alert" style={{ color: '#b91c1c', fontSize: 13 }}>{authError}</div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          style={{ padding: '10px 14px', borderRadius: 8, background: !canSubmit || isSubmitting ? '#9ca3af' : '#111827', color: 'white', border: 'none' }}
        >
          {isSubmitting ? 'Kayıt Oluyor…' : 'Kayıt Ol'}
        </button>

        <div style={{ marginTop: 8 }}>
          <span>Zaten hesabın var mı? </span>
          <Link to="/login">Girişe geç</Link>
        </div>
      </form>
    </div>
  )
}
