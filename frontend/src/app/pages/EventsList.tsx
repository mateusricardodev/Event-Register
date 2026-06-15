import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { AppHeader } from '../components/AppHeader'
import { AppDrawer } from '../components/AppDrawer'
import { useAppUser } from '../useAppUser'
import { fetchMyEvents, type CheckinEvent } from '../api'
import { formatPeriod } from '../format'

type Tab = 'ongoing' | 'ended'

export function EventsList() {
  useAppUser()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('ongoing')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [events, setEvents] = useState<CheckinEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchMyEvents()
      .then((data) => active && setEvents(data))
      .catch(() => active && setError('Não foi possível carregar os eventos.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const ongoing = events.filter((e) => e.status === 'ongoing')
  const ended = events.filter((e) => e.status === 'ended')
  const list = tab === 'ongoing' ? ongoing : ended
  const organization = events[0]?.organization ?? 'Credenciamento'

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-[#0A0A12] text-white">
      <AppHeader title={organization} onMenu={() => setDrawerOpen(true)}>
        <div className="flex">
          <TabButton
            label="Em andamento"
            active={tab === 'ongoing'}
            onClick={() => setTab('ongoing')}
          />
          <TabButton
            label="Encerrados"
            active={tab === 'ended'}
            onClick={() => setTab('ended')}
          />
        </div>
      </AppHeader>

      <main className="flex-1 px-5 pb-[env(safe-area-inset-bottom)]">
        {loading && <StateMessage>Carregando eventos…</StateMessage>}

        {!loading && error && (
          <StateMessage>
            <span className="text-red-400">{error}</span>
          </StateMessage>
        )}

        {!loading && !error && (
          <>
            {tab === 'ended' && list.length > 0 && (
              <div className="pt-6">
                <h2 className="text-2xl font-bold">Eventos</h2>
                <p className="mt-1 text-[#9CA3AF]">Veja seus eventos encerrados</p>
              </div>
            )}

            {list.length === 0 ? (
              <EmptyState
                tab={tab}
                onSeeEnded={() => setTab('ended')}
              />
            ) : (
              <ul className="mt-6 space-y-7">
                {list.map((ev) => (
                  <li key={ev.id}>
                    <button
                      onClick={() => navigate(`/app/evento/${ev.id}`)}
                      className="block w-full text-left active:opacity-80"
                    >
                      <p className="text-lg font-semibold">{ev.title}</p>
                      <p className="mt-1 text-white/90">
                        {formatPeriod(ev.startDate, ev.endDate)}
                      </p>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        Participantes credenciados {ev.credentialed} de {ev.total}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={
        'flex-1 pb-3 pt-2 text-center text-[15px] transition-colors ' +
        (active
          ? 'border-b-2 border-white font-medium text-white'
          : 'border-b-2 border-transparent text-white/60')
      }
    >
      {label}
    </button>
  )
}

function EmptyState({
  tab,
  onSeeEnded,
}: {
  tab: Tab
  onSeeEnded: () => void
}) {
  if (tab === 'ended') {
    return (
      <StateMessage>Você não possui eventos encerrados.</StateMessage>
    )
  }
  return (
    <div className="flex flex-col items-center px-2 pt-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1D2B]">
        <Search className="h-8 w-8 text-[#9CA3AF]" />
      </div>
      <h3 className="mt-6 text-lg font-bold">Nenhum evento encontrado</h3>
      <p className="mt-2 text-[#9CA3AF]">
        Você não possui nenhum evento em andamento no momento.
      </p>
      <button
        onClick={onSeeEnded}
        className="mt-6 w-full rounded-xl border border-white/15 py-4 text-[#9CA3AF] active:bg-white/5"
      >
        Ver eventos encerrados
      </button>
    </div>
  )
}

function StateMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center pt-24 text-center text-[#9CA3AF]">
      {children}
    </div>
  )
}
