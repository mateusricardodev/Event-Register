import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

interface Ticket {
  id: string
  name: string
  price: string
}

interface EventInfo {
  title: string
  date: string
  location: string | null
  tickets: Ticket[]
  formFields: string | null
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
  'Celular':                { label: 'Celular',              placeholder: '(00) 00000-0000', format: formatPhone },
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

const CONTACT_FIELDS = ['Celular', 'Telefone Fixo']
const PERSONAL_FIELDS = ['Data de Nascimento', 'Sexo', 'Estado Civil']
const ADDRESS_FIELDS  = ['CEP', 'Endereço: logradouro', 'Endereço: número', 'Endereço: bairro', 'Endereço: complemento', 'Cidade', 'Estado', 'País']

export function PublicRegistration() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '', email: '', cpf: '',
    phone: '', birthDate: '',
    extra: {} as Record<string, string>,
  })

  useEffect(() => {
    if (!slug) return
    api.get(`/events/public/${slug}`)
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
    setError('')
    setSubmitting(true)
    try {
      const extraFields: Record<string, string> = {}
      for (const key of enabled) {
        if (!CONTACT_FIELDS.includes(key) && key !== 'Data de Nascimento' && form.extra[key]) {
          extraFields[key] = form.extra[key]
        }
      }
      await api.post(`/events/public/${slug}/register`, {
        name: form.name,
        email: form.email,
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, '') || undefined,
        birthDate: form.birthDate || undefined,
        ...(Object.keys(extraFields).length > 0 && { extraFields }),
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao realizar inscrição.')
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


  if (success) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-green-200 rounded-xl shadow p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-700 mb-2">Inscrição realizada!</h2>
        <p className="text-gray-500 text-sm mb-6">Sua inscrição foi registrada com sucesso.</p>
        <Link to={`/evento/${slug}`} className="text-sm text-teal-600 hover:underline">← Voltar para o evento</Link>
      </div>
    </div>
  )

  const startDate = new Date(event.date)
  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

  function renderField(fieldName: string) {
    const config = FIELD_CONFIG[fieldName]
    if (!config || !enabled.has(fieldName)) return null

    const isPhone = fieldName === 'Celular'
    const isBirthDate = fieldName === 'Data de Nascimento'

    if (isPhone) {
      return (
        <div key={fieldName}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
          <input
            type="text" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
            placeholder={config.placeholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )
    }
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

  const hasContact  = CONTACT_FIELDS.some(f => enabled.has(f))
  const hasPersonal = PERSONAL_FIELDS.some(f => enabled.has(f))
  const hasAddress  = ADDRESS_FIELDS.some(f => enabled.has(f))

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

            {/* Dados básicos — sempre visíveis */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dados básicos</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input
                  type="text" value={form.name} required
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
            </div>

            {/* Contato */}
            {hasContact && (
              <div className="px-6 py-5 flex flex-col gap-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contato</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTACT_FIELDS.map(renderField)}
                </div>
              </div>
            )}

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

            <div className="px-6 py-5 flex flex-col gap-3">
              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
              <button
                type="submit" disabled={submitting}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-bold py-3 rounded-full text-sm transition-colors"
              >
                {submitting ? 'ENVIANDO...' : 'CONFIRMAR INSCRIÇÃO'}
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
