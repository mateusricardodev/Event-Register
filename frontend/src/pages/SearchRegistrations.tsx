import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Pencil, Calendar } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
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

const STATUS_BADGE: Record<Result['status'], { label: string; cls: string }> = {
  confirmed: { label: 'Confirmado', cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', cls: 'bg-yellow-100 text-yellow-700' },
  canceled: { label: 'Cancelado', cls: 'bg-red-100 text-red-700' },
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?'
  )
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

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
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout active="inscricoes">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Inscrições</h1>
        <p className="text-sm text-gray-500 mt-1">
          Busque por participantes em todos os seus eventos.
        </p>
      </div>

      {/* Busca */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, e-mail, CPF ou código da inscrição"
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-teal-600 disabled:opacity-60 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors"
        >
          <Search size={16} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Resultados */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : !searched ? (
        <EmptyHint
          title="Comece uma busca"
          subtitle="Digite ao menos 2 caracteres para encontrar inscrições."
        />
      ) : results.length === 0 ? (
        <EmptyHint
          title={`Nenhum resultado para "${query}"`}
          subtitle="Verifique a ortografia ou tente outro termo."
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-400">
            {results.length} resultado(s) para "{query}"
          </div>
          <ul className="divide-y divide-gray-100">
            {results.map((reg) => {
              const badge = STATUS_BADGE[reg.status]
              return (
                <li
                  key={reg.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {initials(reg.user.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {reg.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{reg.user.email}</p>
                  </div>

                  <span className="hidden lg:flex items-center gap-1 text-xs text-gray-400 w-32 shrink-0 truncate">
                    {reg.cpf
                      ? reg.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      : '—'}
                  </span>

                  <span className="hidden md:inline-flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full w-40 shrink-0 truncate">
                    <Calendar size={12} className="shrink-0" />
                    <span className="truncate">{reg.event.title}</span>
                  </span>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full w-24 text-center shrink-0 ${badge.cls}`}
                  >
                    {badge.label}
                  </span>

                  <span className="hidden sm:block text-gray-600 text-sm w-24 text-right shrink-0">
                    {reg.payment ? brl(Number(reg.payment.amount)) : brl(0)}
                  </span>

                  <Link
                    to={`/events/${reg.event.id}/registrations/${reg.id}/edit`}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                    title="Editar inscrição"
                  >
                    <Pencil size={16} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </DashboardLayout>
  )
}

function EmptyHint({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center">
      <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Users size={22} className="text-gray-400" />
      </span>
      <p className="font-semibold text-gray-700 text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1">
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-56 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full shrink-0" />
    </div>
  )
}
