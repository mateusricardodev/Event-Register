import { Link } from 'react-router-dom'

const steps = [
  { label: 'Informações\nbásicas', icon: 'ℹ️', key: 'info' },
  { label: 'Forma de\nPagamento', icon: '💳', key: 'payment' },
  { label: 'Formulário\nde inscrição', icon: '📋', key: 'form' },
  { label: 'Página do\nevento', icon: '🗓️', key: 'page' },
]

interface Props {
  active: 'info' | 'payment' | 'form' | 'page'
  eventId?: string
}

export function EventWizardHeader({ active, eventId }: Props) {
  const stepIndex = steps.findIndex((s) => s.key === active)

  function linkFor(key: string) {
    if (!eventId) return '#'
    if (key === 'info') return `/events/new`
    if (key === 'payment') return `/events/${eventId}/setup/payment`
    if (key === 'form') return `/events/${eventId}/setup/form`
    if (key === 'page') return `/events/${eventId}/setup/page`
    return '#'
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto flex">
        {steps.map((step, i) => {
          const isActive = step.key === active
          const isDone = i < stepIndex

          return (
            <Link
              key={step.key}
              to={eventId ? linkFor(step.key) : '#'}
              className={`flex-1 flex flex-col items-center py-4 gap-1 border-b-2 transition-colors text-center ${
                isActive
                  ? 'border-teal-500 text-teal-600'
                  : isDone
                  ? 'border-teal-300 text-teal-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span className="text-xs font-medium leading-tight whitespace-pre-line">
                {step.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
