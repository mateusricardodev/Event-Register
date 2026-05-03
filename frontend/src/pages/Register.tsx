import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full max-w-md flex flex-col p-10">
        <span className="text-purple-700 font-bold text-lg mb-8">e·inscrição</span>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Cadastre-se</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-60 self-start"
          >
            {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>

          <p className="text-sm text-gray-500 mt-1">
            Já tem conta?{' '}
            <Link to="/login" className="text-teal-600 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:flex flex-1 bg-purple-800 items-center justify-center p-12">
        <div className="text-white text-center max-w-sm">
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Somos a maior plataforma de eventos cristãos do Brasil!
          </h2>
          <p className="text-purple-200 text-sm">
            Nossa plataforma oferece as ferramentas necessárias para você criar seus eventos de forma fácil e rápida, sem complicações.
          </p>
        </div>
      </div>
    </div>
  )
}
