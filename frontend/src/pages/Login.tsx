import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, Mail, Lock, Users, BarChart2,
  Send, Shield, Headphones, Calendar, UserPlus,
} from 'lucide-react'
import api from '../api/axios'
import { useAuthStore } from '../store/auth.store'

type Mode = 'login' | 'register'

export function Login() {
  const [mode, setMode] = useState<Mode>('login')

  // login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // register extra fields
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setSuccess('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const me = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      })
      setAuth(me.data, data.access_token)
      navigate('/dashboard')
    } catch {
      setError('E-mail ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password })
      setSuccess('Conta criada! Faça login para continuar.')
      setName('')
      setConfirmPassword('')
      setMode('login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Coluna esquerda */}
        <div className="hidden lg:flex w-1/2 flex-col px-12 py-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-[#7C3AED] p-2 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                inscrições<span className="text-[#7C3AED]">.app</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2 mb-8 w-fit">
              <span className="text-[#7C3AED] text-sm">✦</span>
              <span className="text-sm text-[#7C3AED] font-bold">Feito para igrejas e ministérios</span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-4 text-gray-900">
              Gerencie seus<br />
              <span className="text-[#7C3AED]">eventos</span>{' '}
              <span className="text-cyan-500">com</span><br />
              simplicidade.
            </h1>

            <p className="text-gray-500 text-base mb-10 max-w-sm">
              Crie eventos, divulgue, receba inscrições e acompanhe tudo em um só lugar.
              Mais organização, menos trabalho.
            </p>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Formulários personalizados</p>
                  <p className="text-gray-500 text-sm">Crie campos que fazem sentido para seu evento</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                  <BarChart2 className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Controle em tempo real</p>
                  <p className="text-gray-500 text-sm">Acompanhe inscrições e vagas disponíveis</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Comunicação automática</p>
                  <p className="text-gray-500 text-sm">E-mails de confirmação para seus participantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita — card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
          <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">

            {/* Ícone */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {isLogin
                  ? <Lock className="w-7 h-7 text-[#7C3AED]" />
                  : <UserPlus className="w-7 h-7 text-[#7C3AED]" />}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h2>
            <p className="text-gray-500 text-center text-sm mb-7">
              {isLogin
                ? 'Faça login para acessar sua conta'
                : 'Comece a gerenciar seus eventos hoje'}
            </p>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  isLogin
                    ? 'bg-white text-[#7C3AED] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                  !isLogin
                    ? 'bg-white text-[#7C3AED] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                Criar conta
              </button>
            </div>

            {/* Feedback */}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
                {success}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
                {error}
              </p>
            )}

            {/* ── LOGIN ── */}
            {isLogin && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-blue-500"
                    />
                    <span className="text-sm text-gray-700">Lembrar de mim</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-[#7C3AED] hover:underline">
                    Esqueci minha senha
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Entrando...
                    </>
                  ) : 'Entrar →'}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  type="button"
                  className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Entrar com Google
                </button>
              </form>
            )}

            {/* ── CADASTRO ── */}
            {!isLogin && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repita a senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Criando...
                    </>
                  ) : 'Criar conta →'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex justify-center gap-8 lg:gap-16 py-6 px-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-[#EDE9FE] p-2 rounded-full">
            <Shield className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Seguro e confiável</p>
            <p className="text-xs text-gray-500">Seus dados protegidos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#EDE9FE] p-2 rounded-full">
            <Lock className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Privacidade</p>
            <p className="text-xs text-gray-500">Respeitamos sua privacidade</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#EDE9FE] p-2 rounded-full">
            <Headphones className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Suporte humano</p>
            <p className="text-xs text-gray-500">Estamos aqui para ajudar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
