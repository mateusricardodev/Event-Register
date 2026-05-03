import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

export function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    bannerUrl: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/events', {
        ...form,
        date: new Date(form.date).toISOString(),
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Novo Evento</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              * Título do evento
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              * Data e hora
            </label>
            <input
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL do banner
            </label>
            <input
              name="bannerUrl"
              value={form.bannerUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-60"
            >
              {loading ? 'CRIANDO...' : 'CRIAR EVENTO'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
