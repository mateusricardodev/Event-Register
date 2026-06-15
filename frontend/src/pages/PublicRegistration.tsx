import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

interface PaymentMethod {
  id: string
  type: string
  value: string
  installments: number
}

interface EventInfo {
  title: string
  date: string
  location: string | null
  paymentMethods: PaymentMethod[]
  formFields: string | null
}

interface LocationState {
  paymentMethodId?: string
  paymentMethodType?: string
  amount?: number
}

const TYPE_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
}

function formatCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function formatCep(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

type FieldInput = { label: string; placeholder?: string; type?: 'text' | 'date'; format?: (v: string) => string }

const FIELD_CONFIG: Record<string, FieldInput> = {
  'CEP':                    { label: 'CEP',                  placeholder: '00000-000', format: formatCep },
  'Cidade':                 { label: 'Cidade',               placeholder: 'Ex: São Paulo' },
  'Data de Nascimento':     { label: 'Data de nascimento',   type: 'date' },
  'Endereço: bairro':       { label: 'Bairro',               placeholder: 'Ex: Centro' },
  'Endereço: complemento':  { label: 'Complemento',          placeholder: 'Ex: Apto 12' },
  'Endereço: logradouro':   { label: 'Logradouro',           placeholder: 'Ex: Rua das Flores' },
  'Endereço: número':       { label: 'Número',               placeholder: 'Ex: 123' },
  'Estado':                 { label: 'Estado',               placeholder: 'Ex: SP' },
  'Estado Civil':           { label: 'Estado civil',         placeholder: 'Ex: Solteiro(a)' },
  'Sexo':                   { label: 'Sexo',                 placeholder: 'Ex: Masculino' },
  'Telefone Fixo':          { label: 'Telefone fixo',        placeholder: '(00) 0000-0000' },
  'País':                   { label: 'País',                 placeholder: 'Ex: Brasil' },
}

const PERSONAL_FIELDS = ['Data de Nascimento', 'Sexo', 'Estado Civil']
const ADDRESS_FIELDS  = ['CEP', 'Endereço: logradouro', 'Endereço: número', 'Endereço: bairro', 'Endereço: complemento', 'Cidade', 'Estado', 'País']
// Celular e Telefone Fixo são capturados no campo phone fixo abaixo — não renderizamos via formFields
const EXTRA_SKIP = new Set(['Celular', 'Telefone Fixo'])

export function PublicRegistration() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const locationState = (useLocation().state ?? {}) as LocationState

  const [event, setEvent] = useState<EventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [paymentMethodId, setPaymentMethodId] = useState(locationState.paymentMethodId ?? '')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    termsAccepted: false,
    extra: {} as Record<string, string>,
  })

  useEffect(() => {
    if (!slug) return
    api.get(`/public/events/${slug}`)
      .then(({ data }) => setEvent(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const enabled: Set<string> = (() => {
    if (!event?.formFields) return new Set()
    try { return new Set<string>(JSON.parse(event.formFields)) } catch { return new Set() }
  })()

  function setExtra(key: string, value: string) {
    setForm(f => ({ ...f, extra: { ...f.extra, [key]: value } }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.termsAccepted) {
      setError('Você deve aceitar os termos para continuar.')
      return
    }
    if (!paymentMethodId) {
      setError('Selecione uma forma de pagamento para continuar.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const extraFields: Record<string, string> = {}
      for (const key of enabled) {
        if (!EXTRA_SKIP.has(key) && key !== 'Data de Nascimento' && form.extra[key]) {
          extraFields[key] = form.extra[key]
        }
      }

      const { data } = await api.post(`/public/events/${slug}/register`, {
        paymentMethodId,
        fullName: form.fullName,
        email: form.email,
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, '') || undefined,
        ...(Object.keys(extraFields).length > 0 && { extraFields }),
        termsAccepted: true,
      })

      // Inscrição gratuita: navega direto para tela de confirmação
      if (data.status === 'confirmed') {
        navigate(`/evento/${slug}/pagamento-pix`, {
          state: {
            registrationId: data.registrationId,
            amount: 0,
            eventTitle: event?.title,
            email: form.email,
            free: true,
          },
        })
        return
      }

      // Inscrição paga: navega para tela de PIX
      navigate(`/evento/${slug}/pagamento-pix`, {
        state: {
          registrationId: data.registrationId,
          providerPaymentId: data.providerPaymentId,
          qrCodeBase64: data.qrCodeBase64,
          qrCodeCopiaECola: data.qrCodeCopiaECola,
          expiresAt: data.expiresAt,
          amount: data.amount,
          eventTitle: event?.title,
          email: form.email,
          reused: data.reused,
        },
      })
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erro ao realizar inscrição.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Carregando...</p>
    </div>
  )

  if (notFound || !event) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
      <p className="text-lg font-semibold text-gray-700">Evento não encontrado</p>
      <p className="text-sm text-gray-400">O endereço pode estar incorreto ou o evento não está publicado.</p>
    </div>
  )

  const startDate = new Date(event.date)
  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  const hasPersonal = PERSONAL_FIELDS.some(f => enabled.has(f))
  const hasAddress  = ADDRESS_FIELDS.some(f => enabled.has(f))

  function renderField(fieldName: string) {
    const config = FIELD_CONFIG[fieldName]
    if (!config || !enabled.has(fieldName) || EXTRA_SKIP.has(fieldName)) return null
    const isBirthDate = fieldName === 'Data de Nascimento'
    if (isBirthDate) {
      return (
        <div key={fieldName}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
          <input
            type="date" value={form.birthDate}
            onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )
    }
    return (
      <div key={fieldName}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
        <input
          type="text"
          value={form.extra[fieldName] ?? ''}
          onChange={e => setExtra(fieldName, config.format ? config.format(e.target.value) : e.target.value)}
          placeholder={config.placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-teal-600 text-white py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-sm text-teal-100 mt-1 capitalize">
            {formatDate(startDate)}{event.location && ` · ${event.location}`}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Formulário de inscrição</h2>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">

            {/* Forma de pagamento — resumo se veio do estado, seletor se não veio */}
            {locationState.paymentMethodId ? (
              <div className="px-6 py-4 bg-teal-50 border-b border-teal-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide">Forma de pagamento</p>
                  <p className="text-sm font-bold text-teal-800">
                    {TYPE_LABELS[locationState.paymentMethodType ?? ''] ?? locationState.paymentMethodType}
                  </p>
                </div>
                {locationState.amount !== undefined && (
                  <p className="text-lg font-bold text-teal-700">
                    {locationState.amount === 0
                      ? 'Gratuito'
                      : `R$ ${Number(locationState.amount).toFixed(2).replace('.', ',')}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-6 py-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Forma de pagamento</p>
                {event.paymentMethods.length === 0 ? (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    Nenhuma forma de pagamento disponível para este evento.
                  </p>
                ) : (
                  event.paymentMethods.map(method => {
                    const selected = method.id === paymentMethodId
                    const value = Number(method.value)
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethodId(method.id)}
                        className={[
                          'w-full text-left rounded-lg border px-4 py-3 transition-all text-sm',
                          selected
                            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-400'
                            : 'border-gray-200 hover:border-teal-400 cursor-pointer',
                        ].join(' ')}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${selected ? 'text-teal-700' : 'text-gray-800'}`}>
                            {TYPE_LABELS[method.type] ?? method.type}
                          </span>
                          <span className={`font-bold ${selected ? 'text-teal-600' : 'text-gray-700'}`}>
                            {value === 0 ? 'Grátis' : `R$ ${value.toFixed(2).replace('.', ',')}`}
                          </span>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {/* Dados básicos */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dados básicos</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input
                  type="text" value={form.fullName} required
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="Ex: João Pedro Silva"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                  <input
                    type="email" value={form.email} required
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                  <input
                    type="text" value={form.cpf} required
                    onChange={e => setForm(f => ({ ...f, cpf: formatCpf(e.target.value) }))}
                    placeholder="000.000.000-00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            {/* Dados pessoais */}
            {hasPersonal && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dados pessoais</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PERSONAL_FIELDS.map(renderField)}
                </div>
              </div>
            )}

            {/* Endereço */}
            {hasAddress && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Endereço</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADDRESS_FIELDS.map(renderField)}
                </div>
              </div>
            )}

            {/* Termos + Submit */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={e => setForm(f => ({ ...f, termsAccepted: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-teal-500 shrink-0"
                />
                <span className="text-sm text-gray-600">
                  Concordo com os termos de participação e autorizo o uso dos meus dados para fins de organização do evento.
                </span>
              </label>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.termsAccepted}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                )}
                {submitting ? 'PROCESSANDO...' : 'CONFIRMAR INSCRIÇÃO'}
              </button>

              <Link to={`/evento/${slug}`} className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← Voltar para o evento
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
