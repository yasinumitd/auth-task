import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/register">Kayıt Ol</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
