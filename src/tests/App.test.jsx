import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

vi.mock('../providers/AuthGate', () => ({
  default: ({ children }) => <>{children}</>,
}))

describe('App routing', () => {
  it('redirects root to /register and renders register form', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(await screen.findByRole('heading', { name: /kayıt ol/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/e-posta/i)).toBeInTheDocument()
  })
}) 