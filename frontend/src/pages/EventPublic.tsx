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
      <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carregando evento...</p>
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-[#1B2B5E]">Evento não encontrado</p>
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
    <div className="min-h-screen bg-[#F2EDE4]">
      {/* Hero — não alterar */}
      <div className="relative bg-teal-600 text-white overflow-hidden min-h-[650px] md:min-h-[700px]">
        {event.bannerUrl ? (
          <img
            src={`http://localhost:3000${event.bannerUrl}`}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-20 h-20 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Seção de inscrição */}
      <div className="max-w-lg mx-auto px-5 py-10 flex flex-col gap-6">

        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-cinzel text-2xl font-bold tracking-[0.3em] text-[#1B2B5E] uppercase">
            Inscrição
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-px w-14 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-base leading-none">✝</span>
            <div className="h-px w-14 bg-[#C9A84C]" />
          </div>
          <p className="font-inter text-sm text-gray-500 max-w-xs leading-relaxed">
            Garanta sua participação neste momento único.
          </p>
        </div>

        {/* Card de data e local */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1B2B5E] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-inter font-bold text-[#1B2B5E] capitalize">{formatDate(startDate)}</p>
              <p className="font-inter text-sm text-gray-400">
                {formatTime(startDate)}{endDate && ` até ${formatTime(endDate)}`}
              </p>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#1B2B5E] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-inter font-bold text-[#1B2B5E]">{event.location}</p>
            </div>
          )}
        </div>

        {/* Card de valor + botão */}
        {hasPaymentMethods ? (
          <PaymentMethodSelector
            methods={event.paymentMethods}
            selectedId={selectedMethodId}
            onSelect={setSelectedMethodId}
            onRegister={handleRegister}
            description={event.about}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <p className="font-inter text-sm text-gray-400">Inscrições em breve</p>
          </div>
        )}

      </div>
    </div>
  )
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRegister: () => void
  description?: string | null
}

function PaymentMethodSelector({ methods, selectedId, onSelect, onRegister, description }: PaymentMethodSelectorProps) {
  const single = methods.length === 1
  const selectedMethod = methods.find(m => m.id === selectedId)
  const amount = selectedMethod ? Number(selectedMethod.value) : null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-5">

      {/* Seletor de método (somente quando há mais de um) */}
      {!single && (
        <div className="flex flex-col gap-2">
          <p className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-widest">
            Forma de pagamento
          </p>
          {methods.map(method => {
            const selected = method.id === selectedId
            const value = Number(method.value)
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelect(method.id)}
                className={[
                  'font-inter w-full text-left rounded-xl border px-4 py-3 transition-all text-sm',
                  selected
                    ? 'border-[#1B2B5E] bg-[#1B2B5E]/5 ring-2 ring-[#1B2B5E]'
                    : 'border-gray-200 hover:border-[#1B2B5E]/40 cursor-pointer',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${selected ? 'text-[#1B2B5E]' : 'text-gray-800'}`}>
                    {TYPE_LABELS[method.type] ?? method.type}
                  </span>
                  <span className={`font-bold ${selected ? 'text-[#1B2B5E]' : 'text-gray-700'}`}>
                    {value === 0 ? 'Grátis' : `R$ ${value.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Preço em destaque */}
      {amount !== null && (
        <div>
          <p className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-widest">Valor</p>
          <p className="font-cormorant text-4xl font-bold text-[#1B2B5E] mt-1">
            {amount === 0 ? 'Gratuito' : `R$ ${amount.toFixed(2).replace('.', ',')}`}
          </p>
          {selectedMethod && (
            <p className="font-inter text-sm text-gray-500 mt-1">
              Pagamento via{' '}
              <span className="font-bold text-gray-700">
                {TYPE_LABELS[selectedMethod.type] ?? selectedMethod.type}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Botão CTA */}
      <button
        onClick={onRegister}
        disabled={!selectedId}
        className="font-bebas w-full bg-[#1B2B5E] hover:bg-[#152348] disabled:opacity-50 disabled:cursor-not-allowed text-[#F2EDE4] py-4 rounded-full text-xl tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
      >
        Inscreva-se já! <span>→</span>
      </button>

      {/* Descrição */}
      {description && (
        <p className="font-inter text-xs text-gray-400 leading-relaxed text-center whitespace-pre-line">
          {description}
        </p>
      )}

    </div>
  )
}
