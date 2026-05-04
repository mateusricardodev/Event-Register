import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { EventWizardHeader } from '../components/EventWizardHeader'
import api from '../api/axios'

const OPTIONAL_FIELDS = [
  'CEP', 'Celular', 'Cidade', 'Data de Nascimento',
  'Endereço: bairro', 'Endereço: complemento', 'Endereço: logradouro', 'Endereço: número',
  'Estado', 'Estado Civil', 'Sexo', 'Telefone Fixo', 'País',
]

export function EventSetupForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [enabled, setEnabled] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/events/${id}`).then(({ data }) => {
      if (data.formFields) {
        try {
          const parsed: string[] = JSON.parse(data.formFields)
          setEnabled(new Set(parsed))
        } catch {}
      }
    })
  }, [id])

  function toggle(field: string) {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(field)) next.delete(field)
      else next.add(field)
      return next
    })
  }

  async function handleNext() {
    if (!id) return
    setSaving(true)
    try {
      await api.put(`/events/${id}`, {
        formFields: JSON.stringify([...enabled]),
      })
      navigate(`/events/${id}/setup/page`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EventWizardHeader active="form" eventId={id} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header da tabela */}
          <div className="grid grid-cols-3 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Campo</span>
            <span className="text-center">Obrigatório</span>
            <span className="text-right">Ativado/Desativado</span>
          </div>

          {/* Campos fixos */}
          {['Nome completo', 'Documento (CPF)', 'E-mail'].map((field) => (
            <div key={field} className="grid grid-cols-3 items-center px-6 py-4 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-800">{field}</span>
              <div className="flex justify-center">
                <span className="w-4 h-4 rounded bg-teal-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-gray-400">Obrigatório em todos os eventos</span>
              </div>
            </div>
          ))}

          {/* Campos opcionais */}
          {OPTIONAL_FIELDS.map((field) => (
            <div key={field} className="grid grid-cols-3 items-center px-6 py-4 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{field}</span>
              <span />
              <div className="flex items-center justify-end gap-3">
                <span className="text-xs text-gray-400">{enabled.has(field) ? 'Ativado' : 'Desativado'}</span>
                <button
                  onClick={() => toggle(field)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    enabled.has(field) ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      enabled.has(field) ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(`/events/${id}/setup/payment`)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &lt; PASSO ANTERIOR
          </button>
          <button
            onClick={handleNext}
            disabled={saving}
            className="bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded-full text-sm transition-colors"
          >
            {saving ? 'SALVANDO...' : 'PRÓXIMO PASSO'}
          </button>
        </div>
      </main>
    </div>
  )
}
