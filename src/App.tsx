import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Protected from './pages/Protected'
import './App.css'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Protected />} />
      </Routes>
    </div>
  )
}

export default App
