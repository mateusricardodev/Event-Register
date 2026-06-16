import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

/**
 * MODO MOCK — como testar sem Mercado Pago real:
 * 1. Faça a inscrição normalmente pelo formulário.
 * 2. Copie o `providerPaymentId` que aparece na seção "Teste (modo mock)" abaixo.
 * 3. Execute no terminal:
 *    curl -X POST http://localhost:3000/payments/mock/<providerPaymentId>/approve
 * 4. O polling desta página detectará o status 'confirmed' em até 4 segundos.
 */

interface PixState {
  registrationId: string
  providerPaymentId?: string
  qrCodeBase64?: string | null
  qrCodeCopiaECola?: string | null
  expiresAt?: string
  amount?: number
  eventTitle?: string
  email?: string
  reused?: boolean
  free?: boolean
}

type Stage = 'pending' | 'confirmed' | 'failed' | 'overbooked'

function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
  )
}

export function PixPayment() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as PixState | null

  const [stage, setStage] = useState<Stage>(state?.free ? 'confirmed' : 'pending')
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!state?.expiresAt) return 900
    const diff = Math.floor((new Date(state.expiresAt).getTime() - Date.now()) / 1000)
    return Math.min(900, Math.max(0, diff))
  })
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Redirect if arrived without state (e.g. direct URL access)
  useEffect(() => {
    if (!state?.registrationId) {
      navigate(`/evento/${slug}/inscricao`, { replace: true })
    }
  }, [state, slug, navigate])

  // Countdown timer — decrement by 1/s; set 'failed' when reaches 0
  useEffect(() => {
    if (stage !== 'pending') return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [stage])

  useEffect(() => {
    if (stage === 'pending' && secondsLeft === 0) setStage('failed')
  }, [secondsLeft, stage])

  // Polling for payment confirmation
  useEffect(() => {
    if (!state?.registrationId || stage !== 'pending') return

    const poll = async () => {
      try {
        const { data } = await api.get(`/public/payments/status/${state.registrationId}`)
        if (data.status === 'confirmed') {
          setStage('confirmed')
          if (pollingRef.current) clearInterval(pollingRef.current)
        } else if (data.status === 'overbooked') {
          setStage('overbooked')
          if (pollingRef.current) clearInterval(pollingRef.current)
        } else if (data.paymentStatus === 'failed') {
          setStage('failed')
          if (pollingRef.current) clearInterval(pollingRef.current)
        }
      } catch {
        // silently ignore transient polling errors
      }
    }

    pollingRef.current = setInterval(poll, 4000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [stage, state?.registrationId])

  if (!state?.registrationId) return null

  const amount = state.amount ?? 0
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  async function handleCopy() {
    if (!state?.qrCodeCopiaECola) return
    try {
      await navigator.clipboard.writeText(state.qrCodeCopiaECola)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // fallback: select text
    }
  }

  // ─── Stage B: Confirmed ───────────────────────────────────────────────────
  if (stage === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-green-200 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-2">Inscrição confirmada!</h1>
          <p className="text-gray-500 text-sm mb-6">Seu pagamento foi processado com sucesso.</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left flex flex-col gap-2 mb-6">
            {state.eventTitle && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Evento</span>
                <span className="font-semibold text-gray-800 text-right max-w-[60%]">{state.eventTitle}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Valor pago</span>
              <span className="font-bold text-green-700">
                R$ {Number(amount).toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {state.email && (
            <p className="text-sm text-gray-500 mb-6">
              Um e-mail de confirmação foi enviado para{' '}
              <span className="font-semibold text-gray-700">{state.email}</span>.
            </p>
          )}

          <div className="bg-gray-100 rounded-lg px-4 py-2 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Número da inscrição</p>
            <p className="font-mono text-sm text-gray-700 break-all">{state.registrationId}</p>
          </div>

          <button
            onClick={() => navigate(`/evento/${slug}`)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-full text-sm transition-colors"
          >
            Voltar ao evento
          </button>
        </div>
      </div>
    )
  }

  // ─── Stage C: Failed / Overbooked ────────────────────────────────────────
  if (stage === 'failed' || stage === 'overbooked') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-700 mb-2">Pagamento não realizado</h1>
          {stage === 'overbooked' ? (
            <p className="text-gray-500 text-sm mb-8">
              Seu pagamento foi recebido, porém o ingresso esgotou simultaneamente. Você será reembolsado em breve.
            </p>
          ) : (
            <p className="text-gray-500 text-sm mb-8">
              O pagamento não foi confirmado. Você pode tentar novamente com um novo código PIX.
            </p>
          )}

          <button
            onClick={() => navigate(`/evento/${slug}/inscricao`, { state: location.state })}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-full text-sm transition-colors mb-3"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate(`/evento/${slug}`)}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
          >
            ← Voltar ao evento
          </button>
        </div>
      </div>
    )
  }

  // ─── Stage A: Pending (waiting for payment) ───────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-teal-600 text-white py-6">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Pague com PIX</h1>
          {state.eventTitle && (
            <p className="text-sm text-teal-100 mt-1">{state.eventTitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Amount */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
          <p className="text-4xl font-bold text-gray-800">
            R$ {Number(amount).toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* QR Code + Copia e Cola */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center gap-5">
          {/* QR Code */}
          <div className="w-52 h-52 flex items-center justify-center">
            {state.qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${state.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-2">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-xs text-gray-400 text-center px-4">QR Code indisponível no modo teste</p>
              </div>
            )}
          </div>

          {/* Copy button */}
          {state.qrCodeCopiaECola && (
            <div className="w-full flex flex-col gap-2">
              <p className="text-xs text-gray-500 text-center">Ou use o código Pix Copia e Cola:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs font-mono text-gray-500 break-all line-clamp-2">
                  {state.qrCodeCopiaECola}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className={[
                  'w-full py-3 rounded-full text-sm font-bold transition-colors',
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white',
                ].join(' ')}
              >
                {copied ? '✓ Copiado!' : 'Copiar código PIX'}
              </button>
            </div>
          )}
        </div>

        {/* Expiry + Polling status */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3 text-center">
          <p className="text-sm text-gray-500">
            Este PIX expira em{' '}
            <span className="font-bold text-gray-800 tabular-nums">{mm}:{ss}</span>
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Spinner className="w-4 h-4 text-teal-500" />
            <span>Aguardando confirmação do pagamento...</span>
          </div>
        </div>

        {/* Dev/mock helper */}
        {state.providerPaymentId && !state.qrCodeBase64 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Modo teste (mock)</p>
            <p className="text-xs text-amber-600 mb-2">
              Para simular o pagamento, execute no terminal:
            </p>
            <code className="block bg-amber-100 rounded px-3 py-2 text-xs text-amber-800 break-all">
              curl -X POST http://localhost:3000/payments/mock/{state.providerPaymentId}/approve
            </code>
          </div>
        )}

        <button
          onClick={() => navigate(`/evento/${slug}`)}
          className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          ← Voltar ao evento
        </button>
      </div>
    </div>
  )
}
