import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

interface Event {
  id: string
  title: string
  date: string
  endDate: string | null
  location: string | null
  _count: { registrations: number }
}

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    api.get('/events').then(({ data }) => {
      setEvents(data)
      setLoading(false)
    })
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <span className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-600 bg-white">
              EVENTOS EM ANDAMENTO ({ongoing.length})
            </span>
          </div>
          <Link
            to="/events/new"
            className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            + NOVO EVENTO
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-16">Carregando...</p>
        ) : ongoing.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-16">
            Nenhum evento em andamento.
          </p>
        ) : (
          <div className="grid gap-4">
            {ongoing.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {event._count.registrations} inscritos
                  </span>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-teal-600 text-sm hover:underline"
                  >
                    ver
                  </Link>
                  <Link
                    to={`/events/${event.id}/edit`}
                    className="text-gray-500 text-sm hover:underline"
                  >
                    editar
                  </Link>
                  <button
                    onClick={() => setConfirmId(event.id)}
                    className="text-red-400 hover:text-red-600 text-sm transition-colors"
                  >
                    excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {ended.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Eventos Encerrados
            </h2>
            <div className="grid gap-4">
              {ended.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg px-6 py-4 flex items-center justify-between opacity-60"
                >
                  <div>
                    <h3 className="font-semibold text-gray-700">{event.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {event._count.registrations} inscritos
                    </span>
                    <Link
                      to={`/events/${event.id}/edit`}
                      className="text-gray-400 text-sm hover:underline"
                    >
                      editar
                    </Link>
                    <button
                      onClick={() => setConfirmId(event.id)}
                      className="text-red-300 hover:text-red-500 text-sm transition-colors"
                    >
                      excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de confirmação */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
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
                onClick={() => { setConfirmId(null); setDeleteError('') }}
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
    </div>
  )
}
