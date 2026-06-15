import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

interface PaymentMethod {
  id: string
  type: string
  value: string
  installments: number
}

interface EventData {
  id: string
  title: string
  slug: string
  date: string
  endDate: string | null
  location: string | null
  about: string | null
  isPublished: boolean
  category: string | null
  bannerUrl: string | null
  paymentMethods: PaymentMethod[]
}

const TYPE_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
}

export function EventPublic() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    api.get(`/public/events/${slug}`)
      .then(({ data }) => {
        setEvent(data)
        const methods: PaymentMethod[] = data.paymentMethods ?? []
        if (methods.length === 1) setSelectedMethodId(methods[0].id)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carregando evento...</p>
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-700">Evento não encontrado</p>
        <p className="text-sm text-gray-400">O endereço pode estar incorreto ou o evento não está publicado.</p>
      </div>
    )
  }

  const startDate = new Date(event.date)
  const endDate = event.endDate ? new Date(event.endDate) : null

  const formatDate = (d: Date) =>
    d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const selectedMethod = event.paymentMethods.find(m => m.id === selectedMethodId) ?? null
  const hasPaymentMethods = event.paymentMethods.length > 0

  function handleRegister() {
    if (!selectedMethod) return
    navigate(`/evento/${slug}/inscricao`, {
      state: {
        paymentMethodId: selectedMethod.id,
        paymentMethodType: selectedMethod.type,
        amount: Number(selectedMethod.value),
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
          <div className="w-full max-w-2xl h-56 bg-teal-500 rounded-xl overflow-hidden flex items-center justify-center mb-4">
            {event.bannerUrl ? (
              <img
                src={`http://localhost:3000${event.bannerUrl}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-16 h-16 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          {event.category && (
            <span className="text-sm bg-teal-500 px-3 py-1 rounded-full">{event.category}</span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left — details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Date & location */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-800 capitalize">{formatDate(startDate)}</p>
                <p className="text-sm text-gray-500">
                  {formatTime(startDate)}{endDate && ` até ${formatTime(endDate)}`}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-800">{event.location}</p>
              </div>
            )}
          </div>

          {/* About */}
          {event.about && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Sobre o evento</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line">{event.about}</p>
            </div>
          )}

          {/* Payment selector (mobile) */}
          {hasPaymentMethods && (
            <div className="md:hidden">
              <PaymentMethodSelector
                methods={event.paymentMethods}
                selectedId={selectedMethodId}
                onSelect={setSelectedMethodId}
                onRegister={handleRegister}
              />
            </div>
          )}
        </div>

        {/* Right — registration card (desktop) */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="sticky top-6">
            {hasPaymentMethods ? (
              <PaymentMethodSelector
                methods={event.paymentMethods}
                selectedId={selectedMethodId}
                onSelect={setSelectedMethodId}
                onRegister={handleRegister}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 text-center">
                <p className="text-sm text-gray-400">Inscrições em breve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRegister: () => void
}

function PaymentMethodSelector({ methods, selectedId, onSelect, onRegister }: PaymentMethodSelectorProps) {
  const single = methods.length === 1
  const selectedMethod = methods.find(m => m.id === selectedId)
  const amount = selectedMethod ? Number(selectedMethod.value) : null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-4">
      {/* Preço em destaque */}
      {amount !== null && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Valor</p>
          <p className="text-2xl font-bold text-gray-800">
            {amount === 0 ? 'Gratuito' : `R$ ${amount.toFixed(2).replace('.', ',')}`}
          </p>
        </div>
      )}

      {/* Seletor só aparece quando tem mais de uma opção */}
      {!single && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Forma de pagamento</p>
          {methods.map(method => {
            const selected = method.id === selectedId
            const value = Number(method.value)
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelect(method.id)}
                className={[
                  'w-full text-left rounded-lg border px-4 py-3 transition-all text-sm',
                  selected
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-400'
                    : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50 cursor-pointer',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${selected ? 'text-teal-700' : 'text-gray-800'}`}>
                    {TYPE_LABELS[method.type] ?? method.type}
                  </span>
                  <span className={`font-bold ${selected ? 'text-teal-600' : 'text-gray-700'}`}>
                    {value === 0 ? 'Grátis' : `R$ ${value.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Quando é única, mostra o tipo selecionado */}
      {single && (
        <p className="text-sm text-gray-500">
          Pagamento via <span className="font-semibold text-gray-700">{TYPE_LABELS[methods[0].type] ?? methods[0].type}</span>
        </p>
      )}

      <button
        onClick={onRegister}
        disabled={!selectedId}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full text-sm transition-colors"
      >
        INSCREVA-SE JÁ!
      </button>
    </div>
  )
}
