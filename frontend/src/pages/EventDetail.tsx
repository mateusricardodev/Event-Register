import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Search, Plus, Pencil, ArrowLeft, Calendar, MapPin,
} from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import { useAuthStore } from '../store/auth.store'
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
  createdBy: string
  _count: { registrations: number }
}

const STATUS_BADGE: Record<Registration['status'], { label: string; cls: string }> = {
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

export function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
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
        prev.map((r) => (r.id === regId ? { ...r, status: 'canceled' } : r)),
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

  const statCards = [
    { label: 'Confirmados', value: counts.confirmed, color: 'text-green-600' },
    { label: 'Pendentes', value: counts.pending, color: 'text-yellow-500' },
    { label: 'Cancelados', value: counts.canceled, color: 'text-red-500' },
  ]

  return (
    <DashboardLayout active="eventos">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <Link
            to="/eventos"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft size={15} />
            Voltar aos eventos
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            {event?.title ?? '...'}
          </h1>
          {event && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} />
                {new Date(event.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {event.location}
                </span>
              )}
            </div>
          )}
        </div>
        {event && user?.id === event.createdBy && (
          <Link
            to={`/events/${id}/edit`}
            className="shrink-0 inline-flex items-center gap-2 border border-violet-500 text-violet-600 hover:bg-violet-50 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <Pencil size={16} />
            Editar evento
          </Link>
        )}
      </div>

      {/* Totalizadores */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center"
          >
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Inscrições */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Inscrições</h2>
          <Link
            to={`/events/${id}/registrations/new`}
            className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Nova inscrição
          </Link>
        </div>

        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Nome, CPF, e-mail ou código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          >
            <option value="">Todos os status</option>
            <option value="confirmed">Confirmado</option>
            <option value="pending">Pendente</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>

        {/* Cabeçalho das colunas */}
        {!loading && filtered.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
            <span className="w-10 shrink-0" />
            <span className="flex-1">Participante</span>
            <span className="hidden lg:block w-32 shrink-0">CPF</span>
            <span className="hidden md:block w-28 shrink-0">Tipo</span>
            <span className="w-24 text-center shrink-0">Status</span>
            <span className="w-24 text-right shrink-0">Valor</span>
            <span className="w-[120px] shrink-0" />
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-12">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">
            Nenhuma inscrição encontrada.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((reg) => {
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

                  <span className="hidden lg:block text-xs text-gray-400 w-32 shrink-0 truncate">
                    {reg.cpf
                      ? reg.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                      : '—'}
                  </span>

                  <span className="hidden md:block text-sm text-gray-400 w-28 shrink-0 truncate">
                    {reg.ticket?.name ?? '—'}
                  </span>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full w-24 text-center shrink-0 ${badge.cls}`}
                  >
                    {badge.label}
                  </span>

                  <span className="text-gray-600 text-sm w-24 text-right shrink-0">
                    {reg.payment ? brl(Number(reg.payment.amount)) : brl(0)}
                  </span>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0 w-[120px] justify-end">
                    <Link
                      to={`/events/${id}/registrations/${reg.id}/edit`}
                      className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar inscrição"
                    >
                      <Pencil size={15} />
                    </Link>
                    {reg.status !== 'canceled' ? (
                      <button
                        onClick={() => setCancelConfirm(reg.id)}
                        className="text-xs text-red-500 border border-red-300 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <span className="w-[68px]" />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} inscrição(ões) exibida(s)
        </div>
      </div>

      {/* Modal de confirmação de cancelamento */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Cancelar inscrição</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja cancelar esta inscrição? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => handleCancel(cancelConfirm)}
                disabled={canceling}
                className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-60"
              >
                {canceling ? 'Cancelando...' : 'Confirmar cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
