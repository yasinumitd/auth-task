import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Link to="/register">Kayıt Ol</Link>
        <Link to="/login">Giriş Yap</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
