import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import api from '../api/axios'

interface Ticket {
  id: string
  name: string
  price: string
}

interface Registration {
  id: string
  status: string
  cpf: string | null
  phone: string | null
  birthDate: string | null
  user: { id: string; name: string; email: string }
  ticket: { id: string; name: string; price: string }
}

export function EditRegistration() {
  const { id: eventId, regId } = useParams<{ id: string; regId: string }>()
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    ticketId: '',
  })

  useEffect(() => {
    if (!eventId || !regId) return
    Promise.all([
      api.get(`/events/${eventId}/tickets`),
      api.get(`/events/${eventId}/registrations`),
    ]).then(([ticketsRes, regsRes]) => {
      setTickets(ticketsRes.data)
      const reg: Registration = regsRes.data.find((r: Registration) => r.id === regId)
      if (reg) {
        setForm({
          name: reg.user.name,
          email: reg.user.email,
          cpf: reg.cpf
            ? reg.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            : '',
          phone: reg.phone
            ? reg.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
            : '',
          birthDate: reg.birthDate ? reg.birthDate.split('T')[0] : '',
          ticketId: reg.ticket.id,
        })
      }
      setLoading(false)
    })
  }, [eventId, regId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function formatCpf(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.put(`/registrations/${regId}`, {
        name: form.name,
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, ''),
        birthDate: form.birthDate || undefined,
        ticketId: form.ticketId,
      })

      setSuccess(true)
      setTimeout(() => navigate(`/events/${eventId}`), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar alterações.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white border border-green-200 rounded-xl shadow p-10 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-2">Inscrição atualizada com sucesso!</h2>
            <p className="text-gray-500 text-sm">Redirecionando para a lista de inscrições...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 py-20">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar Inscrição</h1>
          <button
            onClick={() => navigate(`/events/${eventId}`)}
            className="text-sm text-teal-600 hover:underline"
          >
            ← Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {/* Tipo de ingresso */}
          <div className="px-6 py-5">
            <h2 className="font-semibold text-gray-700 mb-4">Categoria de pagamento</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de ingresso</label>
              <select
                name="ticketId"
                value={form.ticketId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                {tickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {Number(t.price) > 0 ? `— R$ ${Number(t.price).toFixed(2)}` : '— Gratuito'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dados básicos */}
          <div className="px-6 py-5">
            <h2 className="font-semibold text-gray-700 mb-4">Dados básicos do participante</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome completo *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cpf: formatCpf(e.target.value) }))
                    }
                    required
                    placeholder="000.000.000-00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados complementares */}
          <div className="px-6 py-5">
            <h2 className="font-semibold text-gray-700 mb-4">Dados complementares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Celular</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data de nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Erro e botão */}
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : <span />}
            <button
              type="submit"
              disabled={saving}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded-full transition-colors text-sm"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
