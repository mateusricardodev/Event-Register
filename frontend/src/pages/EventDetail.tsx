import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

interface Registration {
  id: string
  status: 'pending' | 'confirmed' | 'canceled'
  createdAt: string
  cpf: string | null
  phone: string | null
  birthDate: string | null
  user: { id: string; name: string; email: string }
  ticket: { id: string; name: string; price: string } | null
  payment: { id: string; status: string; amount: string } | null
}

interface Event {
  id: string
  title: string
  date: string
  location: string | null
  description: string | null
  _count: { registrations: number }
}

const statusLabel = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  canceled: 'Cancelado',
}

const statusColor = {
  confirmed: 'bg-green-500',
  pending: 'bg-yellow-400',
  canceled: 'bg-red-500',
}

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/registrations`),
    ])
      .then(([evtRes, regRes]) => {
        setEvent(evtRes.data)
        setRegistrations(regRes.data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel(regId: string) {
    setCanceling(true)
    try {
      await api.patch(`/registrations/${regId}/cancel`)
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: 'canceled' } : r))
      )
    } finally {
      setCanceling(false)
      setCancelConfirm(null)
    }
  }

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      r.user.name.toLowerCase().includes(q) ||
      r.user.email.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.cpf ?? '').includes(q)

    const created = new Date(r.createdAt)
    const matchFrom = !dateFrom || created >= new Date(dateFrom)
    const matchTo = !dateTo || created <= new Date(dateTo + 'T23:59:59')
    const matchStatus = !statusFilter || r.status === statusFilter

    return matchSearch && matchFrom && matchTo && matchStatus
  })

  const counts = {
    confirmed: registrations.filter((r) => r.status === 'confirmed').length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    canceled: registrations.filter((r) => r.status === 'canceled').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Modal de confirmação de cancelamento */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-800 mb-2">Cancelar inscrição</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja cancelar esta inscrição? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={() => handleCancel(cancelConfirm)}
                disabled={canceling}
                className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-60"
              >
                {canceling ? 'Cancelando...' : 'Confirmar cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {event?.title ?? '...'}
            </h1>
            {event && (
              <p className="text-sm text-gray-500 mt-1">
                {new Date(event.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
                {event.location && ` · ${event.location}`}
              </p>
            )}
          </div>
          <Link to="/dashboard" className="text-sm text-teal-600 hover:underline">
            ← Voltar
          </Link>
        </div>

        {/* Totalizadores */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">{counts.confirmed}</p>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">Confirmados</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-yellow-500">{counts.pending}</p>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">Pendentes</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-red-500">{counts.canceled}</p>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">Cancelados</p>
          </div>
        </div>

        {/* Aba Inscrições */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700 text-lg">Inscrições</h2>
            <Link
              to={`/events/${id}/registrations/new`}
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              + Nova inscrição
            </Link>
          </div>

          {/* Filtros */}
          <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Código, nome, CPF ou email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">STATUS</option>
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendente</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          {/* Lista */}
          {loading ? (
            <p className="text-center text-gray-400 text-sm py-12">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">Nenhuma inscrição encontrada.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((reg) => (
                <div
                  key={reg.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                >
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

                  <span className="text-gray-400 text-sm hidden md:block w-28 truncate">
                    {reg.ticket?.name ?? '—'}
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
                    {reg.payment
                      ? `R$ ${Number(reg.payment.amount).toFixed(2)}`
                      : 'R$ 0,00'}
                  </span>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-[120px] justify-end">
                    <Link
                      to={`/events/${id}/registrations/${reg.id}/edit`}
                      className="text-xs text-teal-600 border border-teal-300 px-2 py-1 rounded hover:bg-teal-50 transition-colors"
                    >
                      Editar
                    </Link>
                    {reg.status !== 'canceled' ? (
                      <button
                        onClick={() => setCancelConfirm(reg.id)}
                        className="text-xs text-red-500 border border-red-300 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <span className="w-[57px]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            {filtered.length} inscrição(ões) exibida(s)
          </div>
        </div>
      </main>
    </div>
  )
}
