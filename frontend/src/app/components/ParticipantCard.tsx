import { Check, RotateCcw } from 'lucide-react'
import type { CheckinParticipant } from '../api'

interface ParticipantCardProps {
  participant: CheckinParticipant
  busy?: boolean
  onCheckIn: () => void
  onUndo: () => void
  onViewData?: () => void
}

export function ParticipantCard({
  participant: p,
  busy,
  onCheckIn,
  onUndo,
  onViewData,
}: ParticipantCardProps) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      {p.checkedIn && (
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{p.name}</p>
        <p className="mt-1 text-[15px] text-white/90">CPF: {p.cpf ?? '—'}</p>
        <p className="mt-0.5 text-[15px] text-[#6B7280]">
          Inscrição: {p.code ?? '—'}
        </p>
        <p className="mt-0.5 text-[15px] text-white/90">
          Categoria: {p.category ?? '—'}
        </p>
        <button
          onClick={onViewData}
          className="mt-1 text-[15px] font-medium text-[#A78BFA] active:opacity-70"
        >
          Ver dados
        </button>
      </div>

      <div className="shrink-0 pt-1">
        {p.checkedIn ? (
          <button
            onClick={onUndo}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg border border-[#7C3AED] px-3 py-2.5 text-[13px] font-semibold text-[#A78BFA] active:bg-[#7C3AED]/10 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Desfazer Check-in
          </button>
        ) : (
          <button
            onClick={onCheckIn}
            disabled={busy}
            className="flex items-center gap-2 rounded-lg bg-[#7C3AED] px-3 py-2.5 text-[13px] font-semibold text-white active:bg-[#6D28D9] disabled:opacity-50"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            Fazer Check-in
          </button>
        )}
      </div>
    </div>
  )
}
