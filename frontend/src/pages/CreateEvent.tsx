import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { EventWizardHeader } from '../components/EventWizardHeader'
import { useAuthStore } from '../store/auth.store'
import api from '../api/axios'

function maskDate(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function toEventISO(date: string, time: string): string {
  const parts = date.split('/')
  if (parts.length !== 3 || parts[2].length !== 4) return ''
  const iso = `${parts[2]}-${parts[1]}-${parts[0]}`
  return new Date(`${iso}T${time || '00:00'}`).toISOString()
}

const CATEGORIES = [
  'Acampamentos', 'Ação Social', 'Conferências', 'Congressos', 'Cultos',
  'Encontros', 'Eventos esportivos', 'Feiras e exposições', 'Humor',
  'Legendários', 'Missa', 'Retiros', 'Shows e Festas', 'Workshops e Cursos',
]

export function CreateEvent() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    slug: '',
    title: '',
    category: '',
    maxParticipants: '',
    date: '',
    dateTime: '',
    endDate: '',
    endDateTime: '',
    location: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'slug') {
      setForm((f) => ({ ...f, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/events', {
        title: form.title,
        slug: form.slug || undefined,
        category: form.category || undefined,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        date: toEventISO(form.date, form.dateTime),
        endDate: form.endDate ? toEventISO(form.endDate, form.endDateTime) : undefined,
        location: form.location || undefined,
      })
      navigate(`/events/${data.id}/setup/payment`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  const baseUrl = `${window.location.origin}/evento/`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EventWizardHeader active="info" />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* URL do evento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Escolha o endereço da página do evento
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-400">
              <span className="bg-gray-50 px-3 py-2 text-sm text-teal-600 border-r border-gray-300 whitespace-nowrap">
                {baseUrl}
              </span>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="nome-do-evento"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Nome do evento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              * Nome do evento
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Nome será destacado na página do evento"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Tipo do evento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              * Tipo do evento
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" checked readOnly className="mt-0.5 accent-teal-500" />
              <div>
                <span className="text-sm font-medium text-gray-800">Presencial</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Use o E-Inscrição para fazer a gestão completa do seu evento presencial
                </p>
              </div>
            </label>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              * Categoria do evento
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="">Selecione...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Limite e datas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Limite máximo de inscritos
              </label>
              <input
                name="maxParticipants"
                type="number"
                min={1}
                value={form.maxParticipants}
                onChange={handleChange}
                placeholder="Sem limite"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                * Data de início
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: maskDate(e.target.value) }))}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="time"
                  value={form.dateTime}
                  onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data do fim
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: maskDate(e.target.value) }))}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="time"
                  value={form.endDateTime}
                  onChange={e => setForm(f => ({ ...f, endDateTime: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Local do evento
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ex: Centro de Convenções - São Paulo, SP"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Email do organizador */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email do organizador
            </label>
            <input
              value={user?.email ?? ''}
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded-full text-sm transition-colors"
            >
              {loading ? 'CRIANDO...' : 'PRÓXIMO PASSO'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
