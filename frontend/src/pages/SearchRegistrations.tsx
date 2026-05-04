import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

interface Result {
  id: string
  status: 'pending' | 'confirmed' | 'canceled'
  createdAt: string
  cpf: string | null
  user: { name: string; email: string }
  ticket: { name: string; price: string }
  event: { id: string; title: string }
  payment: { amount: string } | null
}

const statusLabel = { confirmed: 'Confirmado', pending: 'Pendente', canceled: 'Cancelado' }
const statusColor = { confirmed: 'bg-green-500', pending: 'bg-yellow-400', canceled: 'bg-red-500' }

export function SearchRegistrations() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get(`/registrations/search?q=${encodeURIComponent(query)}`)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Buscar inscrições</h1>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, email, CPF ou código da inscrição"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-400 text-sm py-12">Buscando...</p>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">
            Nenhuma inscrição encontrada para "{query}".
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-3 border-b border-gray-100 text-xs text-gray-400">
              {results.length} resultado(s) para "{query}"
            </div>
            <div className="divide-y divide-gray-100">
              {results.map((reg) => (
                <div key={reg.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColor[reg.status]}`} />

                  <span className="w-40 font-medium text-gray-800 text-sm truncate">
                    {reg.user.name}
                  </span>

                  <span className="flex-1 text-gray-500 text-sm truncate hidden sm:block">
                    {reg.user.email}
                  </span>

                  <span className="text-gray-400 text-xs hidden lg:block w-28 truncate">
                    {reg.cpf
                      ? reg.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      : '—'}
                  </span>

                  <span className="text-teal-600 text-sm hidden md:block w-36 truncate">
                    {reg.event.title}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full w-24 text-center flex-shrink-0 ${
                      reg.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : reg.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {statusLabel[reg.status]}
                  </span>

                  <span className="text-gray-600 text-sm w-20 text-right flex-shrink-0">
                    {reg.payment ? `R$ ${Number(reg.payment.amount).toFixed(2)}` : 'R$ 0,00'}
                  </span>

                  <Link
                    to={`/events/${reg.event.id}/registrations/${reg.id}/edit`}
                    className="text-xs text-teal-600 border border-teal-300 px-2 py-1 rounded hover:bg-teal-50 flex-shrink-0"
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
