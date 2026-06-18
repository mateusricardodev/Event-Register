import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EventWizardHeader } from '../components/EventWizardHeader'
import { DashboardLayout } from '../components/DashboardLayout'
import api from '../api/axios'

export function EventSetupPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [aboutEnabled, setAboutEnabled] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [slug, setSlug] = useState('')
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/events/${id}`).then(({ data }) => {
      setTitle(data.title ?? '')
      setAbout(data.about ?? '')
      setAboutEnabled(!!data.about)
      setIsPublished(data.isPublished ?? false)
      setSlug(data.slug ?? '')
      setBannerUrl(data.bannerUrl ?? null)
    })
  }, [id])

  async function handleSave() {
    if (!id) return
    setSaving(true)
    setSaved(false)
    try {
      await api.put(`/events/${id}`, {
        title,
        about: aboutEnabled ? about : '',
        isPublished,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!id) return
    setPublishing(true)
    try {
      await api.put(`/events/${id}`, {
        title,
        about: aboutEnabled ? about : '',
        isPublished: true,
      })
      setIsPublished(true)
      setDone(true)
      setTimeout(() => navigate('/dashboard'), 2500)
    } finally {
      setPublishing(false)
    }
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !id) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post(`/events/${id}/banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setBannerUrl(data.bannerUrl)
    } finally {
      setUploading(false)
    }
  }

  const publicUrl = `${window.location.origin}/evento/${slug}`

  if (done) {
    return (
      <DashboardLayout active="eventos">
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Evento publicado com sucesso!</h2>
          <p className="text-sm text-gray-500">Redirecionando para Meus Eventos...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout active="eventos">
      <EventWizardHeader active="page" eventId={id} />

      <div className="max-w-4xl mx-auto py-8 flex gap-6">
        {/* Sidebar - seções */}
        <aside className="w-56 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Seções da página
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-700">Descrição</span>
              <button
                onClick={() => setAboutEnabled((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  aboutEnabled ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    aboutEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Title */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do evento</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Cover image */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem de capa</label>
            {bannerUrl ? (
              <div className="relative w-full aspect-[660/650] rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:3000${bannerUrl}`}
                  alt="Capa do evento"
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer hover:bg-black/50 transition-colors">
                  <span className="text-white text-sm font-medium">
                    {uploading ? 'Enviando...' : 'Alterar imagem'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[660/650] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors bg-gray-50">
                {uploading ? (
                  <span className="text-sm text-gray-400">Enviando...</span>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">Clique para anexar uma imagem</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Descrição */}
          {aboutEnabled && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={5}
                placeholder="Descreva o evento para os participantes..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              />
            </div>
          )}

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col gap-3">
            {saved && (
              <p className="text-xs text-teal-600 font-medium">Alterações salvas com sucesso!</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="border border-teal-500 text-teal-600 hover:bg-teal-50 text-sm font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-60"
              >
                {saving ? 'SALVANDO...' : 'SALVAR'}
              </button>

              {slug && (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-6 py-2 rounded-full transition-colors"
                >
                  PRÉ-VISUALIZAR
                </a>
              )}

              {slug && (
                <div className="relative">
                  {copied && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Link copiado com sucesso!
                    </div>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1000)
                    }}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-6 py-2 rounded-full transition-colors"
                  >
                    COPIAR LINK
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Publicar evento</span>
              <button
                onClick={() => setIsPublished((v) => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isPublished ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isPublished ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-400">{isPublished ? 'Publicado' : 'Não publicado'}</span>
            </div>

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-semibold px-8 py-2 rounded-full text-sm transition-colors"
            >
              {publishing ? 'PUBLICANDO...' : 'PUBLICAR'}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate(`/events/${id}/setup/form`)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              &lt; PASSO ANTERIOR
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
