import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

interface Event {
  id: string
  title: string
  date: string
  location: string | null
  _count: { registrations: number }
}

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/events').then(({ data }) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const now = new Date()
  const ongoing = events.filter((e) => new Date(e.date) >= now)
  const ended = events.filter((e) => new Date(e.date) < now)

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
                  <span className="text-sm text-gray-400">
                    {event._count.registrations} inscritos
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
