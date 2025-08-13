import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from '../pages/Register'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: vi.fn(async () => ({ user: { uid: '123' } })),
    isSubmitting: false,
    error: '',
    clearError: vi.fn(),
  }),
}))

describe('Register form validation', () => {
  it('disables submit until email and passwords are valid and matching', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    const email = screen.getByLabelText(/e-posta/i)
    const pass1 = screen.getByPlaceholderText('En az 8 karakter, rakam, büyük ve küçük harf')
    const pass2 = screen.getByPlaceholderText('Şifrenizi tekrar girin')
    const submit = screen.getByRole('button', { name: /kayıt ol/i })

    expect(submit).toBeDisabled()

    fireEvent.change(email, { target: { value: 'wrong' } })
    fireEvent.change(pass1, { target: { value: 'short' } })
    fireEvent.change(pass2, { target: { value: 'short' } })
    expect(submit).toBeDisabled()

    fireEvent.change(email, { target: { value: 'user@example.com' } })
    fireEvent.change(pass1, { target: { value: 'Aa123456' } })
    fireEvent.change(pass2, { target: { value: 'Aa12345' } })
    expect(submit).toBeDisabled()

    fireEvent.change(pass2, { target: { value: 'Aa123456' } })
    expect(submit).not.toBeDisabled()
  })
}) 