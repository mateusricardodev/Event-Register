import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, QrCode } from 'lucide-react'
import { AppHeader } from '../components/AppHeader'
import { Fab } from '../components/Fab'
import { ParticipantCard } from '../components/ParticipantCard'
import { useCheckinActions } from '../useCheckinActions'
import { groupByLetter } from '../grouping'
import {
  fetchCheckinList,
  fetchCheckinStats,
  type CheckinFilter,
  type CheckinParticipant,
  type CheckinStats,
} from '../api'

type Tab = { key: CheckinFilter; label: string; count: number }

export function EventCheckin() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [stats, setStats] = useState<CheckinStats | null>(null)
  const [items, setItems] = useState<CheckinParticipant[]>([])
  const [filter, setFilter] = useState<CheckinFilter>('all')
  // a qual filtro a lista carregada pertence (null = ainda carregando)
  const [dataFilter, setDataFilter] = useState<CheckinFilter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const loading = dataFilter !== filter

  const { checkIn, undo, busyIds, errorMsg, clearError } = useCheckinActions(
    id,
    setItems,
    setStats,
  )

  // stats (título + contadores) — uma vez
  useEffect(() => {
    let active = true
    fetchCheckinStats(id)
      .then((s) => active && setStats(s))
      .catch(() => active && setError('Não foi possível carregar o evento.'))
    return () => {
      active = false
    }
  }, [id])

  // lista por filtro
  useEffect(() => {
    let active = true
    fetchCheckinList(id, filter)
      .then((data) => {
        if (!active) return
        setItems(data)
        setDataFilter(filter)
      })
      .catch(() => active && setError('Não foi possível carregar os inscritos.'))
    return () => {
      active = false
    }
  }, [id, filter])

  // displayed reflete o filtro mesmo após toggles otimistas
  const displayed = items.filter((p) =>
    filter === 'done' ? p.checkedIn : filter === 'pending' ? !p.checkedIn : true,
  )
  const groups = groupByLetter(displayed)

  const tabs: Tab[] = [
    { key: 'all', label: 'Todos', count: stats?.total ?? 0 },
    { key: 'done', label: 'Realizados', count: stats?.done ?? 0 },
    { key: 'pending', label: 'Restantes', count: stats?.pending ?? 0 },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-[#0A0A12] text-white">
      <AppHeader
        title={stats?.title ?? 'Evento'}
        centerTitle
        onBack={() => navigate('/app/eventos')}
      >
        <p className="pb-1 text-center text-sm text-white/90">Inscritos</p>
        <div className="flex">
          {tabs.map((t) => (
            <FilterTab
              key={t.key}
              label={t.label}
              count={t.count}
              active={filter === t.key}
              onClick={() => setFilter(t.key)}
            />
          ))}
        </div>
      </AppHeader>

      {errorMsg && (
        <button
          onClick={clearError}
          className="bg-red-500/15 px-5 py-2 text-left text-sm text-red-300"
        >
          {errorMsg} (toque para dispensar)
        </button>
      )}

      <main className="relative flex-1 pb-28">
        {loading && <Centered>Carregando inscritos…</Centered>}

        {!loading && error && (
          <Centered>
            <span className="text-red-400">{error}</span>
          </Centered>
        )}

        {!loading && !error && displayed.length === 0 && (
          <Centered>Nenhum inscrito nesta lista.</Centered>
        )}

        {!loading &&
          !error &&
          groups.map((g) => (
            <section key={g.letter}>
              <h2 className="bg-[#161922] px-5 py-2 text-[15px] font-semibold">
                {g.letter}
              </h2>
              <ul className="divide-y divide-white/5">
                {g.items.map((p) => (
                  <li key={p.id}>
                    <ParticipantCard
                      participant={p}
                      busy={busyIds.has(p.id)}
                      onCheckIn={() => checkIn(p)}
                      onUndo={() => undo(p)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </main>

      {/* FABs fixos, alinhados ao container mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px]">
        <div className="pointer-events-auto absolute bottom-6 right-5 flex flex-col gap-4 pb-[env(safe-area-inset-bottom)]">
          <Fab
            icon={Search}
            label="Pesquisar"
            onClick={() => navigate(`/app/evento/${id}/pesquisar`)}
          />
          <Fab
            icon={QrCode}
            label="Ler QR Code"
            onClick={() => navigate(`/app/evento/${id}/qrcode`)}
          />
        </div>
      </div>
    </div>
  )
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 px-2 pb-3 pt-2 text-center"
    >
      <span className="absolute right-2 top-0 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white">
        {count}
      </span>
      <span
        className={
          'text-[15px] ' + (active ? 'font-medium text-white' : 'text-white/60')
        }
      >
        {label}
      </span>
      {active && (
        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-white" />
      )}
    </button>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center pt-24 text-center text-[#9CA3AF]">
      {children}
    </div>
  )
}
