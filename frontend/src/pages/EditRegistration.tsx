import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '../components/DashboardLayout'
import api from '../api/axios'

interface Registration {
  id: string
  status: string
  cpf: string | null
  phone: string | null
  birthDate: string | null
  extraFields: string | null
  user: { id: string; name: string; email: string }
  ticket: { id: string; name: string; price: string } | null
}

const FIELD_LABELS: Record<string, string> = {
  'CEP':                     'CEP',
  'Cidade':                  'Cidade',
  'Endereço: bairro':        'Bairro',
  'Endereço: complemento':   'Complemento',
  'Endereço: logradouro':    'Logradouro',
  'Endereço: número':        'Número',
  'Estado':                  'Estado',
  'Estado Civil':            'Estado civil',
  'Sexo':                    'Sexo',
  'País':                    'País',
  'Nome do Responsável':     'Nome do responsável',
  'Telefone do Responsável': 'Telefone do responsável',
}

// Campos que já aparecem nos blocos base ou não são armazenados
const BASE_ONLY = new Set([
  'Celular',
  'Data de Nascimento',
  'Autorização de Responsável',
  'Telefone Fixo',
  'Usa Medicamento',
])

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400'

export function EditRegistration() {
  const { id: eventId, regId } = useParams<{ id: string; regId: string }>()
  const navigate = useNavigate()

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
  })

  const [formFieldKeys, setFormFieldKeys] = useState<string[]>([])
  const [extraMap, setExtraMap] = useState<Record<string, string>>({})
  const [usaMedicamento, setUsaMedicamento] = useState<'sim' | 'nao' | ''>('')
  const [qualMedicamento, setQualMedicamento] = useState('')

  useEffect(() => {
    if (!eventId || !regId) return
    Promise.all([
      api.get(`/events/${eventId}`),
      api.get(`/events/${eventId}/registrations`),
    ])
      .then(([evtRes, regRes]) => {
        const eventData = evtRes.data
        const reg: Registration = regRes.data.data.find(
          (r: Registration) => r.id === regId,
        )

        if (eventData.formFields) {
          try {
            setFormFieldKeys(JSON.parse(eventData.formFields) as string[])
          } catch {}
        }

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
          })

          if (reg.extraFields) {
            try {
              const parsed = JSON.parse(reg.extraFields) as Record<string, string>
              const {
                'Usa Medicamento': usaMed,
                'Qual Medicamento': qualMed,
                ...rest
              } = parsed
              setExtraMap(rest)
              if (usaMed) setUsaMedicamento(usaMed as 'sim' | 'nao')
              if (qualMed) setQualMedicamento(qualMed)
            } catch {}
          }
        }

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [eventId, regId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      const updatedExtra: Record<string, string> = { ...extraMap }

      if (formFieldKeys.includes('Usa Medicamento')) {
        if (usaMedicamento) {
          updatedExtra['Usa Medicamento'] = usaMedicamento
          if (usaMedicamento === 'sim' && qualMedicamento.trim()) {
            updatedExtra['Qual Medicamento'] = qualMedicamento.trim()
          } else {
            delete updatedExtra['Qual Medicamento']
          }
        }
      }

      await api.put(`/registrations/${regId}`, {
        name: form.name,
        cpf: form.cpf.replace(/\D/g, ''),
        phone: form.phone.replace(/\D/g, '') || undefined,
        birthDate: form.birthDate || undefined,
        ...(Object.keys(updatedExtra).length > 0 && { extraFields: updatedExtra }),
      })

      setSuccess(true)
      setTimeout(() => navigate(`/events/${eventId}`), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar alterações.')
    } finally {
      setSaving(false)
    }
  }

  // Campos extras do formulário (excluindo os base e Usa Medicamento que tem render próprio)
  const extraFormKeys = formFieldKeys.filter((k) => !BASE_ONLY.has(k))

  // Campos legados que estão em extraFields mas não estão em formFields (ex: inscrição antiga)
  const legacyKeys = Object.keys(extraMap).filter(
    (k) => !formFieldKeys.includes(k) && k !== 'Qual Medicamento',
  )

  const allExtraKeys = [...new Set([...extraFormKeys, ...legacyKeys])]
  const showUsaMedicamento = formFieldKeys.includes('Usa Medicamento')
  const hasExtraSection = allExtraKeys.length > 0 || showUsaMedicamento

  if (success) {
    return (
      <DashboardLayout active="eventos">
        <div className="flex items-center justify-center py-16">
          <div className="bg-white border border-green-200 rounded-xl shadow-sm p-10 text-center max-w-md w-full">
            <span className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </span>
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Inscrição atualizada com sucesso!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecionando para a lista de inscrições...
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout active="eventos">
        <p className="text-center text-gray-400 py-20 text-sm">Carregando...</p>
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
          <h1 className="text-2xl font-bold text-gray-800">Editar inscrição</h1>
          <p className="text-sm text-gray-500 mt-1">
            Atualize os dados deste participante.
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
                  className={inputClass}
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
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Campos do formulário (extras) */}
          {hasExtraSection && (
            <div className="px-6 py-5">
              <h2 className="font-bold text-gray-800 mb-4">Campos do formulário</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allExtraKeys.map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {FIELD_LABELS[key] ?? key}
                    </label>
                    <input
                      type="text"
                      value={extraMap[key] ?? ''}
                      onChange={(e) =>
                        setExtraMap((m) => ({ ...m, [key]: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                ))}

                {showUsaMedicamento && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Faz uso de medicamento?
                    </label>
                    <div className="flex gap-3">
                      {(['sim', 'nao'] as const).map((opcao) => (
                        <button
                          key={opcao}
                          type="button"
                          onClick={() => {
                            setUsaMedicamento(opcao)
                            if (opcao === 'nao') setQualMedicamento('')
                          }}
                          className={[
                            'px-6 py-2 rounded-full text-sm font-semibold border transition-all',
                            usaMedicamento === opcao
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-violet-400',
                          ].join(' ')}
                        >
                          {opcao === 'sim' ? 'Sim' : 'Não'}
                        </button>
                      ))}
                    </div>
                    {usaMedicamento === 'sim' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Qual medicamento?
                        </label>
                        <input
                          type="text"
                          value={qualMedicamento}
                          onChange={(e) => setQualMedicamento(e.target.value)}
                          placeholder="Ex: Ritalina 10mg"
                          className={inputClass}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Erro e botão */}
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            {error ? <p className="text-red-500 text-sm">{error}</p> : <span />}
            <button
              type="submit"
              disabled={saving}
              className="shrink-0 bg-[#14B8A6] hover:bg-teal-600 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-sm"
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
