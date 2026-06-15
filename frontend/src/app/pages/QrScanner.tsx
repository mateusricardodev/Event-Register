import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Zap, ZapOff, Check, AlertTriangle, X } from 'lucide-react'
import { startQrScanner, type QrController } from '../qr'
import { doCheckIn, findByCode } from '../api'

type Feedback = {
  type: 'success' | 'warning' | 'error'
  title: string
  subtitle?: string
}

const FEEDBACK_MS = 2500

export function QrScanner() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const controllerRef = useRef<QrController | null>(null)
  const processingRef = useRef(false)

  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  async function handleScan(text: string) {
    if (navigator.vibrate) navigator.vibrate(60)
    try {
      const participant = await findByCode(id, text)
      const res = await doCheckIn(id, participant.id)
      if (res.status === 'checked_in') {
        setFeedback({ type: 'success', title: participant.name, subtitle: 'Check-in realizado' })
      } else {
        setFeedback({
          type: 'warning',
          title: participant.name,
          subtitle: res.checkedInByName
            ? `Já credenciado por ${res.checkedInByName}`
            : 'Já estava credenciado',
        })
      }
    } catch {
      setFeedback({
        type: 'error',
        title: 'QR Code inválido',
        subtitle: 'Inscrição não encontrada neste evento',
      })
    } finally {
      setTimeout(() => {
        setFeedback(null)
        processingRef.current = false
      }, FEEDBACK_MS)
    }
  }

  useEffect(() => {
    let cancelled = false
    const video = videoRef.current
    if (!video) return

    startQrScanner(video, (text) => {
      if (processingRef.current) return
      processingRef.current = true
      void handleScan(text)
    })
      .then((ctrl) => {
        if (cancelled) {
          ctrl.stop()
          return
        }
        controllerRef.current = ctrl
        setTorchSupported(ctrl.torchSupported)
      })
      .catch(() => {
        if (!cancelled)
          setCameraError(
            'Não foi possível acessar a câmera. Conceda a permissão e use HTTPS ou localhost.',
          )
      })

    return () => {
      cancelled = true
      controllerRef.current?.stop()
      controllerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function toggleTorch() {
    const next = !torchOn
    setTorchOn(next)
    void controllerRef.current?.setTorch(next)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
      />
      {/* escurecimento */}
      <div className="absolute inset-0 bg-black/45" />

      {/* header */}
      <div className="absolute inset-x-0 top-0 z-10 bg-[#7C3AED] pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center px-4">
          <button
            onClick={() => navigate(`/app/evento/${id}`)}
            aria-label="Voltar"
            className="-ml-1 p-1 text-white active:bg-white/15 rounded-lg"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* conteúdo central */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
        {cameraError ? (
          <p className="max-w-xs text-center text-white">{cameraError}</p>
        ) : (
          <>
            <p className="mb-8 max-w-xs text-center text-[15px] leading-relaxed text-white">
              Posicione o QR Code abaixo e aguarde.
              <br />A leitura é automática
            </p>

            <div className="relative h-64 w-64 rounded-2xl border-2 border-white/80" />

            {torchSupported && (
              <button
                onClick={toggleTorch}
                aria-label="Lanterna"
                className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
              >
                {torchOn ? <Zap className="h-6 w-6" /> : <ZapOff className="h-6 w-6" />}
              </button>
            )}
          </>
        )}
      </div>

      {/* feedback */}
      {feedback && (
        <div className="absolute inset-x-0 bottom-0 z-20 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          <div
            className={
              'flex items-center gap-3 rounded-2xl px-4 py-4 text-white shadow-lg ' +
              (feedback.type === 'success'
                ? 'bg-[#22C55E]'
                : feedback.type === 'warning'
                  ? 'bg-[#D97706]'
                  : 'bg-[#DC2626]')
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25">
              {feedback.type === 'success' ? (
                <Check className="h-5 w-5" strokeWidth={3} />
              ) : feedback.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" strokeWidth={3} />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold">{feedback.title}</p>
              {feedback.subtitle && (
                <p className="truncate text-sm text-white/90">{feedback.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
