import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Plus, MapPin, Users, Pencil, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import api from '../api/axios'

interface EventItem {
  id: string
  title: string
  date: string
  endDate: string | null
  location: string | null
  isPublished: boolean
  _count: { registrations: number }
}

export function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    let active = true
    api
      .get<EventItem[]>('/events')
      .then(({ data }) => {
        if (active) setEvents(data)
      })
      .catch(() => {
        if (active) setEvents([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function handleDelete() {
    if (!confirmId) return
    setDeleting(true)
    setDeleteError('')
    try {
      await api.delete(`/events/${confirmId}`)
      setEvents((prev) => prev.filter((e) => e.id !== confirmId))
      setConfirmId(null)
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Erro ao excluir evento')
    } finally {
      setDeleting(false)
    }
  }

  const now = new Date()
  const ongoing = events.filter((e) => new Date(e.endDate ?? e.date) >= now)
  const ended = events.filter((e) => new Date(e.endDate ?? e.date) < now)

  return (
    <DashboardLayout active="eventos">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Eventos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todos os seus eventos em um só lugar.
          </p>
        </div>
        <Link
          to="/events/new"
          className="shrink-0 inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Novo evento
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center max-w-xl mx-auto">
          <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Calendar size={22} className="text-gray-400" />
          </span>
          <h2 className="font-bold text-gray-800 mb-1">Nenhum evento ainda</h2>
          <p className="text-sm text-gray-500 mb-5">
            Crie seu primeiro evento e comece a receber inscrições.
          </p>
          <Link
            to="/events/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Criar evento
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {ongoing.length > 0 && (
            <Section title="Em andamento" count={ongoing.length}>
              {ongoing.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  onDelete={() => setConfirmId(e.id)}
                />
              ))}
            </Section>
          )}

          {ended.length > 0 && (
            <Section title="Encerrados" count={ended.length} muted>
              {ended.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  muted
                  onDelete={() => setConfirmId(e.id)}
                />
              ))}
            </Section>
          )}
        </div>
      )}

      {/* Modal de confirmação */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Excluir evento</h3>
            <p className="text-sm text-gray-500 mb-4">
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </p>
            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmId(null)
                  setDeleteError('')
                }}
                disabled={deleting}
                className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-60"
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

function Section({
  title,
  count,
  muted,
  children,
}: {
  title: string
  count: number
  muted?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <h2
        className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
          muted ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        {title} ({count})
      </h2>
      <div className="grid gap-4">{children}</div>
    </div>
  )
}

function EventCard({
  event,
  muted,
  onDelete,
}: {
  event: EventItem
  muted?: boolean
  onDelete: () => void
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center gap-4 ${
        muted ? 'opacity-70' : ''
      }`}
    >
      <span className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
        <Calendar size={22} className="text-violet-600" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 truncate">{event.title}</h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
              event.isPublished
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {event.isPublished ? 'Publicado' : 'Rascunho'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} />
            {new Date(event.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} />
              {event.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users size={13} />
            {event._count.registrations} inscritos
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/events/${event.id}`}
          className="text-sm text-teal-600 border border-teal-300 hover:bg-teal-50 font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Ver
        </Link>
        <Link
          to={`/events/${event.id}/edit`}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Editar"
        >
          <Pencil size={16} />
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1">
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-64 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
