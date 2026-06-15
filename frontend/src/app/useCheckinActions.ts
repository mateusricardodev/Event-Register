import { useState } from 'react'
import {
  doCheckIn,
  undoCheckIn,
  type CheckinParticipant,
  type CheckinStats,
} from './api'

type SetParticipants = React.Dispatch<
  React.SetStateAction<CheckinParticipant[]>
>
type SetStats = React.Dispatch<React.SetStateAction<CheckinStats | null>>

/**
 * Ações de check-in com atualização otimista e rollback em caso de falha.
 * Mantém os contadores (stats) e a lista em sincronia.
 */
export function useCheckinActions(
  eventId: string,
  setParticipants: SetParticipants,
  setStats: SetStats,
) {
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function setBusy(id: string, busy: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function patchItem(id: string, checkedIn: boolean) {
    setParticipants((list) =>
      list.map((p) => (p.id === id ? { ...p, checkedIn } : p)),
    )
  }

  function patchStats(deltaDone: number) {
    setStats((s) =>
      s
        ? { ...s, done: s.done + deltaDone, pending: s.pending - deltaDone }
        : s,
    )
  }

  async function run(
    p: CheckinParticipant,
    target: boolean,
    apiCall: () => Promise<unknown>,
  ) {
    if (busyIds.has(p.id)) return
    setErrorMsg(null)
    setBusy(p.id, true)
    // otimista
    patchItem(p.id, target)
    patchStats(target ? 1 : -1)
    try {
      await apiCall()
    } catch {
      // rollback
      patchItem(p.id, !target)
      patchStats(target ? -1 : 1)
      setErrorMsg('Falha ao atualizar. Verifique a conexão e tente novamente.')
    } finally {
      setBusy(p.id, false)
    }
  }

  const checkIn = (p: CheckinParticipant) =>
    run(p, true, () => doCheckIn(eventId, p.id))

  const undo = (p: CheckinParticipant) =>
    run(p, false, () => undoCheckIn(eventId, p.id))

  return { checkIn, undo, busyIds, errorMsg, clearError: () => setErrorMsg(null) }
}
