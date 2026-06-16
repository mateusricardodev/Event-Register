import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import api from '../api/axios'

export function NewRegistration() {
  const { id: eventId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
  })

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
    setLoading(true)

    try {
      await api.post(`/events/${eventId}/registrations`, {
        name: form.name,
        email: form.email,
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, '') || undefined,
        birthDate: form.birthDate || undefined,
      })

      setSuccess(true)
      setTimeout(() => {
        navigate(`/events/${eventId}`)
      }, 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar inscrição.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout active="eventos">
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-green-200 rounded-xl shadow-sm p-10 text-center max-w-md w-full">
            <span className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </span>
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Inscrição realizada com sucesso!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecionando para a lista de inscrições...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout active="eventos">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft size={15} />
            Voltar ao evento
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Nova inscrição</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cadastre um participante manualmente neste evento.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100"
        >
          {/* Dados básicos */}
          <div className="px-6 py-5">
            <h2 className="font-bold text-gray-800 mb-4">Dados básicos do participante</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ex: João Pedro Almeida"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cpf: formatCpf(e.target.value) }))
                    }
                    required
                    placeholder="000.000.000-00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="exemplo@email.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados complementares */}
          <div className="px-6 py-5">
            <h2 className="font-bold text-gray-800 mb-4">Dados complementares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Celular
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Erro e botão */}
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            {error ? <p className="text-red-500 text-sm">{error}</p> : <span />}
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 bg-[#14B8A6] hover:bg-teal-600 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Salvando...' : 'Confirmar inscrição'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
