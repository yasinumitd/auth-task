import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login, isSubmitting, error: authError, clearError } = useAuth()
  const navigate = useNavigate()

  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = (touched.email || email.trim() !== '') && !isValidEmail(email) ? 'Geçerli bir e-posta girin.' : ''
  const passwordError = (touched.password || password !== '') && password.trim() === '' ? 'Şifre gerekli.' : ''

  const canSubmit = isValidEmail(email) && password.trim() !== ''

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    const userCredential = await login(email, password)
    if (userCredential) {
      setEmail('')
      setPassword('')
      setTouched({ email: false, password: false })
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Giriş Yap</h1>
          <p className="auth-subtitle">Hesabınıza giriş yapın</p>
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
                placeholder="Şifrenizi girin"
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

          {authError && (
            <div role="alert" className="auth-alert">{authError}</div>
          )}

          <button type="submit" disabled={!canSubmit || isSubmitting} className="form-button">
            {isSubmitting ? 'Giriş Yapılıyor…' : 'Giriş Yap'}
          </button>

          <div className="auth-footer">
            <span>Hesabın yok mu? </span>
            <Link to="/register" className="auth-link">Kayıt ol</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
