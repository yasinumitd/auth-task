import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../firebase'

export default function Protected() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  if (user === null) {
    return (
      <div className="protected-container">
        <p>Yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="protected-container">
      <h1 className="protected-title">Korumalı Sayfa</h1>
      <div className="protected-content">
        <p>Giriş yapan: <span className="protected-user">{user.email}</span></p>
      </div>
      <button
        onClick={() => signOut(auth)}
        className="logout-button"
      >
        Çıkış Yap
      </button>
    </div>
  )
} 