import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { EventWizardHeader } from '../components/EventWizardHeader'
import api from '../api/axios'

interface PaymentMethod {
  id: string
  type: string
  value: string
  installments: number
  startDate: string | null
  endDate: string | null
}

function maskDate(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function toISODate(v: string): string {
  const parts = v.split('/')
  if (parts.length !== 3 || parts[2].length !== 4) return ''
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

const TYPE_LABELS: Record<string, string> = {
  pix: 'Pix',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  cash: 'Dinheiro',
}

export function EventSetupPayment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    type: 'pix',
    value: '',
    installments: '1',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    if (!id) return
    api.get(`/events/${id}/payment-methods`).then(({ data }) => setMethods(data))
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAdd() {
    if (!id) return
    setSaving(true)
    try {
      const { data } = await api.post(`/events/${id}/payment-methods`, {
        type: form.type,
        value: form.value ? Number(form.value) : 0,
        installments: form.type === 'credit_card' ? Number(form.installments) : 1,
        startDate: toISODate(form.startDate) || undefined,
        endDate: toISODate(form.endDate) || undefined,
      })
      setMethods((m) => [...m, data])
      setForm({ type: 'pix', value: '', installments: '1', startDate: '', endDate: '' })
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(methodId: string) {
    await api.delete(`/events/${id}/payment-methods/${methodId}`)
    setMethods((m) => m.filter((x) => x.id !== methodId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EventWizardHeader active="payment" eventId={id} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Modalidades cadastradas */}
        {methods.length > 0 && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Modalidades Cadastradas</h3>
            <div className="flex flex-col gap-2">
              {methods.map((m) => (
                <div key={m.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">
                      R$ {Number(m.value).toFixed(2)}
                    </span>
                    {m.type === 'credit_card' && (
                      <span className="text-gray-500 text-sm ml-2">{m.installments}x</span>
                    )}
                    <span className="text-gray-500 text-sm ml-2">{TYPE_LABELS[m.type] ?? m.type}</span>
                    {m.startDate && m.endDate && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(m.startDate).toLocaleDateString('pt-BR')} a{' '}
                        {new Date(m.endDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(m.id)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de nova modalidade */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">* Forma de pagamento</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="pix">Pix</option>
              <option value="credit_card">Cartão de crédito</option>
              <option value="debit_card">Cartão de débito</option>
              <option value="cash">Dinheiro</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {form.type === 'credit_card' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Número de parcelas</label>
                <select
                  name="installments"
                  value={form.installments}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
                    <option key={n} value={n}>até {n}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">* Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
                <input
                  name="value"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  placeholder="0,00"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">* Início</label>
              <input
                name="startDate"
                type="text"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: maskDate(e.target.value) }))}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">* Término</label>
              <input
                name="endDate"
                type="text"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: maskDate(e.target.value) }))}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="border border-teal-500 text-teal-600 hover:bg-teal-50 text-sm font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-60"
            >
              CADASTRAR MODALIDADE
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(`/events/new`)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &lt; PASSO ANTERIOR
          </button>
          {methods.length > 0 && (
            <button
              onClick={() => navigate(`/events/${id}/setup/form`)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-2 rounded-full text-sm transition-colors"
            >
              PRÓXIMO PASSO
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
