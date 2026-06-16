import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EventWizardHeader } from '../components/EventWizardHeader'
import { DashboardLayout } from '../components/DashboardLayout'
import api from '../api/axios'

const CATEGORIES = [
  'Acampamentos', 'Ação Social', 'Conferências', 'Congressos', 'Cultos',
  'Encontros', 'Eventos esportivos', 'Feiras e exposições', 'Humor',
  'Legendários', 'Missa', 'Retiros', 'Shows e Festas', 'Workshops e Cursos',
]

function toDateInput(iso: string | null | undefined) {
  if (!iso) return ''
  return iso.split('T')[0]
}

export function EditEvent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    maxParticipants: '',
    date: '',
    endDate: '',
    location: '',
    organizerPhone: '',
  })

  useEffect(() => {
    if (!id) return
    api.get(`/events/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          category: data.category ?? '',
          maxParticipants: data.maxParticipants != null ? String(data.maxParticipants) : '',
          date: toDateInput(data.date),
          endDate: toDateInput(data.endDate),
          location: data.location ?? '',
          organizerPhone: data.organizerPhone ?? '',
        })
      })
      .catch(() => setError('Não foi possível carregar os dados do evento.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'slug') {
      setForm((f) => ({ ...f, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  async function save(): Promise<boolean> {
    if (!id || !form.title.trim()) { setError('Nome do evento é obrigatório'); return false }
    if (!form.date) { setError('Data de início é obrigatória'); return false }
    setError('')
    setSaving(true)
    setSaved(false)
    try {
      await api.put(`/events/${id}`, {
        title: form.title,
        slug: form.slug || undefined,
        category: form.category || undefined,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        date: new Date(form.date + 'T00:00').toISOString(),
        endDate: form.endDate ? new Date(form.endDate + 'T00:00').toISOString() : undefined,
        location: form.location || undefined,
        organizerPhone: form.organizerPhone || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar evento')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveAndNext() {
    const ok = await save()
    if (ok) navigate(`/events/${id}/setup/payment`)
  }

  if (loading) {
    return (
      <DashboardLayout active="eventos">
        <EventWizardHeader active="info" eventId={id} />
        <p className="text-center text-gray-400 text-sm py-20">Carregando...</p>
      </DashboardLayout>
    )
  }

  const baseUrl = `${window.location.origin}/evento/`

  return (
    <DashboardLayout active="eventos">
      <EventWizardHeader active="info" eventId={id} />

      <div className="max-w-2xl mx-auto py-8">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded px-3 py-2">
            Alterações salvas com sucesso!
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); save() }}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* URL do evento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Endereço da página do evento
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
              placeholder="Nome será destacado na página do evento"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
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
              <input
                name="date"
                type="date"
                lang="pt-BR"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data do fim
              </label>
              <input
                name="endDate"
                type="date"
                lang="pt-BR"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
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

          {/* Telefone do organizador */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Telefone do organizador
            </label>
            <input
              name="organizerPhone"
              value={form.organizerPhone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Navegação */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Voltar ao evento
            </button>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="border border-teal-500 text-teal-600 hover:bg-teal-50 disabled:opacity-60 font-semibold px-6 py-2 rounded-full text-sm transition-colors"
              >
                {saving ? 'SALVANDO...' : 'SALVAR'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveAndNext}
                className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded-full text-sm transition-colors"
              >
                PRÓXIMO PASSO
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
