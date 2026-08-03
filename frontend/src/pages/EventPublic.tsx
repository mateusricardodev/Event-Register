import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import api, { API_BASE_URL } from '../api/axios'

interface PaymentMethod {
  id: string
  type: string
  value: string
  installments: number
  description: string | null
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

export function EventPublic() {
  const { slug }   = useParams<{ slug: string }>()
  const navigate   = useNavigate()
  const [event, setEvent]           = useState<EventData | null>(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)

  useEffect(() => {
    if (!slug) return
    api.get(`/public/events/${slug}`)
      .then(({ data }) => setEvent(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F2E8' }}>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Carregando evento...</p>
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#F5F2E8' }}>
        <p className="text-lg font-semibold" style={{ color: '#00186D', fontFamily: 'Cinzel, serif' }}>
          Evento não encontrado
        </p>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          O endereço pode estar incorreto ou o evento não está publicado.
        </p>
      </div>
    )
  }

  const startDate = new Date(event.date)
  const endDate   = event.endDate ? new Date(event.endDate) : null
  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const hasPaymentMethods = event.paymentMethods.length > 0

  function handleRegister() {
    navigate(`/evento/${slug}/inscricao`)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F2E8' }}>
      {/* Topbar mínima */}
      <div
        className="w-full py-3 px-6 flex items-center justify-between"
        style={{ background: '#00186D' }}
      >
        <img src="/logo-ecclesio.png" alt="Ecclesio" className="h-6 brightness-0 invert" />
      </div>

      {/* Banner / Hero */}
      <div className="w-full" style={{ maxHeight: '380px', overflow: 'hidden' }}>
        {event.bannerUrl ? (
          <img
            src={`${API_BASE_URL}${event.bannerUrl}`}
            alt={event.title}
            className="w-full object-cover"
            style={{ maxHeight: '380px' }}
          />
        ) : (
          <div
            className="w-full flex flex-col items-center justify-center gap-3 py-20 px-6"
            style={{ background: '#00186D', minHeight: '220px' }}
          >
            <h1
              className="text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}
            >
              {event.title}
            </h1>
            <div className="flex items-center gap-3">
              <div style={{ height: '1px', width: '48px', background: '#D4B16A' }} />
              <span style={{ color: '#D4B16A', fontSize: '1rem' }}>✦</span>
              <div style={{ height: '1px', width: '48px', background: '#D4B16A' }} />
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="max-w-lg mx-auto px-5 py-10 flex flex-col gap-5">

        {/* Título e ornamento */}
        <div className="flex flex-col items-center gap-3 text-center">
          {event.bannerUrl && (
            <h1
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 600, color: '#00186D', lineHeight: 1.2 }}
            >
              {event.title}
            </h1>
          )}
          <div className="flex items-center gap-3">
            <div style={{ height: '1px', width: '40px', background: '#D4B16A' }} />
            <span style={{ color: '#D4B16A', fontSize: '0.875rem' }}>✦</span>
            <div style={{ height: '1px', width: '40px', background: '#D4B16A' }} />
          </div>
          <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Garanta sua participação neste momento único.
          </p>
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(0,24,109,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,24,109,0.08)' }}
            >
              <Calendar size={18} style={{ color: '#00186D' }} />
            </div>
            <p className="text-sm font-semibold capitalize" style={{ color: '#0A0A09', fontFamily: 'Inter, sans-serif' }}>
              {formatDate(startDate)}{endDate && ` — ${formatDate(endDate)}`}
            </p>
          </div>
          {event.location && (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0,24,109,0.08)' }}
              >
                <MapPin size={18} style={{ color: '#00186D' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: '#0A0A09', fontFamily: 'Inter, sans-serif' }}>{event.location}</p>
            </div>
          )}
        </div>

        {/* Sobre */}
        {event.about && (
          <div
            className="rounded-2xl p-5"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,24,109,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: '#D4B16A', fontFamily: 'Cinzel, serif' }}>
              Sobre o evento
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#33425C', fontFamily: 'Inter, sans-serif' }}>
              {event.about}
            </p>
          </div>
        )}

        {/* CTA */}
        {hasPaymentMethods ? (
          <button
            onClick={handleRegister}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: '#00186D',
              color:      '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              cursor:     'pointer',
              boxShadow:  '0 4px 14px rgba(0,24,109,0.25)',
            }}
          >
            Inscreva-se agora →
          </button>
        ) : (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,24,109,0.08)' }}
          >
            <p className="text-sm" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>Inscrições em breve</p>
          </div>
        )}

      </div>
    </div>
  )
}
