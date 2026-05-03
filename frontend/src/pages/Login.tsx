import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const me = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      setAuth(me.data, data.access_token)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-700 h-14 flex items-center px-6">
        <span className="text-white font-bold text-lg">e·inscrição</span>
      </header>

      <div className="flex-1 flex items-start justify-center pt-16 px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Entrar</h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            * Email
          </label>
          <input
            type="email"
            placeholder="Ex: joaodasilva@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:border-purple-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            * Senha
          </label>
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-5 focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-60"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>

          <div className="mt-5 flex flex-col gap-1">
            <Link to="/register" className="text-teal-600 text-sm hover:underline">
              Crie sua conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
