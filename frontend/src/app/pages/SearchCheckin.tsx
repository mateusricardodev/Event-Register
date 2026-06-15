import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { AppHeader } from '../components/AppHeader'
import { ParticipantCard } from '../components/ParticipantCard'
import { useCheckinActions } from '../useCheckinActions'
import { groupByLetter } from '../grouping'
import { fetchCheckinList, type CheckinParticipant } from '../api'

export function SearchCheckin() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<CheckinParticipant[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { checkIn, undo, busyIds, errorMsg, clearError } = useCheckinActions(
    id,
    setItems,
  )

  const trimmed = query.trim()
  const showInitial = trimmed.length === 0

  // busca com debounce (em tempo real). setState ocorre dentro do timeout/promise.
  useEffect(() => {
    if (trimmed.length === 0) return
    const handle = setTimeout(() => {
      setSearching(true)
      setError(null)
      fetchCheckinList(id, 'all', trimmed)
        .then((data) => setItems(data))
        .catch(() => setError('Falha na busca. Tente novamente.'))
        .finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(handle)
  }, [id, trimmed])

  const groups = groupByLetter(items)

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-[#0A0A12] text-white">
      <AppHeader title="Pesquisar" onBack={() => navigate(`/app/evento/${id}`)} />

      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#11131F] px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-[#6B7280]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome, documento ou inscrição"
            className="w-full bg-transparent text-[15px] text-white placeholder:text-[#6B7280] outline-none"
          />
        </div>
      </div>

      {errorMsg && (
        <button
          onClick={clearError}
          className="bg-red-500/15 px-5 py-2 text-left text-sm text-red-300"
        >
          {errorMsg} (toque para dispensar)
        </button>
      )}

      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
        {showInitial ? (
          <InitialState />
        ) : error ? (
          <Centered>
            <span className="text-red-400">{error}</span>
          </Centered>
        ) : searching && items.length === 0 ? (
          <Centered>Buscando…</Centered>
        ) : items.length === 0 ? (
          <Centered>Nenhum participante encontrado para “{trimmed}”.</Centered>
        ) : (
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
          ))
        )}
      </main>
    </div>
  )
}

function InitialState() {
  return (
    <div className="flex flex-col items-center px-6 pt-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1D2B]">
        <Search className="h-8 w-8 text-[#9CA3AF]" />
      </div>
      <h3 className="mt-6 text-lg font-bold">
        Pesquise para encontrar participantes
      </h3>
      <p className="mt-2 text-[#9CA3AF]">
        É possível realizar check-ins por aqui
      </p>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 pt-24 text-center text-[#9CA3AF]">
      {children}
    </div>
  )
}
