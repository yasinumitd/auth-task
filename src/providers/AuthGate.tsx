import { useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { Navigate, useLocation } from 'react-router-dom'
import { auth } from '../firebase'

const PUBLIC_PATHS = new Set<string>(['/login', '/register'])

export default function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  if (user === undefined) {
    return <div style={{ maxWidth: 540, margin: '40px auto', padding: 24 }}>Yükleniyor…</div>
  }

  const isPublic = PUBLIC_PATHS.has(location.pathname)

  if (!user && !isPublic) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user && isPublic) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
} 