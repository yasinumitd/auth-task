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
      <div style={{ maxWidth: 540, margin: '40px auto', padding: 24 }}>
        <p>Yükleniyor…</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 540, margin: '40px auto', padding: 24 }}>
      <h1>Korumalı Sayfa</h1>
      <p>Giriş yapan: <strong>{user.email}</strong></p>
      <button
        onClick={() => signOut(auth)}
        style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: '#111827', color: 'white', border: 'none' }}
      >
        Çıkış Yap
      </button>
    </div>
  )
} 