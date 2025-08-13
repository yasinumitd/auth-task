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
  if (password.length < 8) issues.push('8 karakter')
  if (!/[0-9]/.test(password)) issues.push('rakam')
  if (!/[A-Z]/.test(password)) issues.push('büyük harf')
  if (!/[a-z]/.test(password)) issues.push('küçük harf')
  return issues
}

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {isVisible ? (
      <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" fill="currentColor"/>
    ) : (
      <path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21m-6.122-6.122A10.05 10.05 0 0 0 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-1.132 2.271" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )}
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, isSubmitting, error: authError, clearError } = useAuth()

  const [touched, setTouched] = useState({ email: false, password: false, confirm: false })

  const emailError =
    (touched.email || email.trim() !== '') && !isValidEmail(email) ? 'Geçerli bir e-posta girin.' : ''

  const passwordIssues = getPasswordIssues(password)
  const passwordError =
    (touched.password || password !== '') && passwordIssues.length > 0
      ? ` ${passwordIssues.join(', ')}`
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Kayıt Ol</h1>
          <p className="auth-subtitle">Yeni bir hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input
              className={`form-input${emailError ? ' error' : ''}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (authError) clearError() }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="ornek@mail.com"
              aria-invalid={!!emailError}
            />
            {emailError && <span className="form-error">{emailError}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <div className="input-wrapper">
              <input
                className={`form-input${passwordError ? ' error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (authError) clearError() }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="En az 8 karakter, rakam, büyük ve küçük harf"
                aria-invalid={!!passwordError}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <EyeIcon isVisible={showPassword} />
              </button>
            </div>
            {passwordError && <span className="form-error">{passwordError}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Şifre (Tekrar)</label>
            <div className="input-wrapper">
              <input
                className={`form-input${confirmError ? ' error' : ''}`}
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (authError) clearError() }}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                placeholder="Şifrenizi tekrar girin"
                aria-invalid={!!confirmError}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <EyeIcon isVisible={showConfirmPassword} />
              </button>
            </div>
            {confirmError && <span className="form-error">{confirmError}</span>}
          </div>

          {authError && (
            <div role="alert" className="auth-alert">{authError}</div>
          )}

          <button type="submit" disabled={!canSubmit || isSubmitting} className="form-button">
            {isSubmitting ? 'Kayıt Oluyor…' : 'Kayıt Ol'}
          </button>

          <div className="auth-footer">
            <span>Zaten hesabın var mı? </span>
            <Link to="/login" className="auth-link">Girişe geç</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
