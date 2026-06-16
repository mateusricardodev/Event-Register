import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home, Calendar, Users, Settings, Bell, Search, Plus, Menu, X,
  CheckCircle, DollarSign, ChevronRight, FileText, Mail, BarChart3, Ticket,
} from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import api from '../api/axios'

interface EventItem {
  id: string
  title: string
  date: string
  endDate: string | null
  location: string | null
  _count: { registrations: number }
}

interface RegItem {
  id: string
  status: 'pending' | 'confirmed' | 'canceled'
  createdAt: string
  user: { id: string; name: string; email: string }
  payment: { id: string; status: string; amount: string } | null
  eventTitle: string
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, to: '/dashboard', key: 'dashboard' },
  { label: 'Eventos', icon: Calendar, to: '/dashboard', key: 'eventos' },
  { label: 'Inscrições', icon: Users, to: '/buscar-inscricoes', key: 'inscricoes' },
  { label: 'Configurações', icon: Settings, to: '/dashboard', key: 'config' },
]

const STATUS_BADGE: Record<RegItem['status'], { label: string; cls: string }> = {
  confirmed: { label: 'Confirmado', cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', cls: 'bg-yellow-100 text-yellow-700' },
  canceled: { label: 'Cancelado', cls: 'bg-red-100 text-red-700' },
}

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [events, setEvents] = useState<EventItem[]>([])
  const [regs, setRegs] = useState<RegItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const { data: evs } = await api.get<EventItem[]>('/events')
        const regLists = await Promise.all(
          evs.map((e) =>
            api
              .get(`/events/${e.id}/registrations`)
              .then((r) =>
                (r.data.data as RegItem[]).map((reg) => ({ ...reg, eventTitle: e.title })),
              )
              .catch(() => [] as RegItem[]),
          ),
        )
        if (!active) return
        setEvents(evs)
        setRegs(regLists.flat())
      } catch {
        if (active) {
          setEvents([])
          setRegs([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // ── Métricas ──────────────────────────────────────────────────────────────
  const totalEvents = events.length
  const totalRegs = regs.length
  const confirmedRegs = regs.filter((r) => r.status === 'confirmed').length
  const revenue = regs.reduce((s, r) => s + (r.payment ? Number(r.payment.amount) : 0), 0)

  const now = new Date()
  const upcoming = [...events]
    .filter((e) => new Date(e.endDate ?? e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 3)
  const latestRegs = [...regs]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3)

  const fullName = user?.name ?? 'Organizador'
  const firstName = fullName.split(' ')[0]
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const metrics = [
    {
      label: 'Total de eventos',
      value: String(totalEvents),
      icon: Calendar,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      to: '/dashboard',
    },
    {
      label: 'Total de inscrições',
      value: String(totalRegs),
      icon: Users,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      to: '/buscar-inscricoes',
    },
    {
      label: 'Inscrições confirmadas',
      value: String(confirmedRegs),
      icon: CheckCircle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      to: '/buscar-inscricoes',
    },
    {
      label: 'Total arrecadado',
      value: brl(revenue),
      icon: DollarSign,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      to: '/dashboard',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <header className="bg-[#1E1057] text-white sticky top-0 z-30">
        <div className="h-16 px-4 flex items-center gap-4">
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
              <Calendar size={18} className="text-violet-300" />
            </span>
            <span className="font-bold text-lg tracking-tight">
              inscrições<span className="text-violet-400">.app</span>
            </span>
          </Link>

          {/* Busca (centro) */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/buscar-inscricoes')
            }}
            className="hidden md:flex flex-1 max-w-xl mx-auto"
          >
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                placeholder="Buscar eventos, inscrições e participantes..."
                className="w-full bg-white/10 placeholder-white/50 text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </form>

          {/* Direita: sino + avatar */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <button
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Notificações"
            >
              <Bell size={20} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2" title="Sair">
              <span className="w-9 h-9 rounded-full bg-teal-400 text-[#1E1057] font-bold text-sm flex items-center justify-center">
                {initials || '?'}
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-semibold">{fullName}</span>
                <span className="text-xs text-white/60">Organizador</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── SIDEBAR (desktop) ─────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-[200px] shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-3">
          <SidebarNav active="dashboard" />
        </aside>

        {/* ── SIDEBAR (mobile drawer) ───────────────────────────────────── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative w-64 bg-white h-full p-3 shadow-xl">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="font-semibold text-gray-700 text-sm">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Fechar menu"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <SidebarNav active="dashboard" onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* ── CONTEÚDO PRINCIPAL ────────────────────────────────────────── */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
          {/* Header do conteúdo */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Bem-vindo de volta, {firstName}
              </p>
              <h1 className="text-2xl font-bold text-gray-800">
                Gerencie seus eventos e inscrições com eficiência
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Acompanhe o desempenho dos seus eventos e inscrições em um só lugar.
              </p>
            </div>
            <Link
              to="/events/new"
              className="shrink-0 inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-teal-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Novo evento
            </Link>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
              : metrics.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => navigate(m.to)}
                    className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-left flex items-start justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col gap-3">
                      <span
                        className={`w-11 h-11 rounded-full ${m.iconBg} flex items-center justify-center`}
                      >
                        <m.icon size={20} className={m.iconColor} />
                      </span>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{m.value}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-gray-500 transition-colors"
                    />
                  </button>
                ))}
          </div>

          {/* Estado vazio OU seções */}
          {loading ? null : totalEvents === 0 ? (
            <EmptyState onCreate={() => navigate('/events/new')} />
          ) : (
            <div className="space-y-6">
              {/* Próximos eventos */}
              <Section
                title="Próximos eventos"
                onSeeAll={() => navigate('/dashboard')}
              >
                {upcoming.length === 0 ? (
                  <EmptyBlock
                    icon={Calendar}
                    title="Você ainda não tem eventos criados."
                    subtitle="Seus próximos eventos aparecerão aqui."
                    action={
                      <Link
                        to="/events/new"
                        className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold text-sm px-4 py-2 rounded-full transition-colors"
                      >
                        <Plus size={16} />
                        Criar evento
                      </Link>
                    }
                  />
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {upcoming.map((e) => (
                      <li key={e.id}>
                        <Link
                          to={`/events/${e.id}`}
                          className="flex items-center gap-4 px-2 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                            <Calendar size={18} className="text-violet-600" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {e.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(e.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                              {e.location && ` · ${e.location}`}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">
                            {e._count.registrations} inscritos
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              {/* Últimas inscrições */}
              <Section
                title="Últimas inscrições"
                onSeeAll={() => navigate('/buscar-inscricoes')}
              >
                {latestRegs.length === 0 ? (
                  <EmptyBlock
                    icon={Users}
                    title="Nenhuma inscrição ainda."
                    subtitle="Assim que receber inscrições, elas aparecerão aqui."
                  />
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {latestRegs.map((r) => {
                      const badge = STATUS_BADGE[r.status]
                      return (
                        <li
                          key={r.id}
                          className="flex items-center gap-4 px-2 py-3"
                        >
                          <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {r.user.name
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase() || '?'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 text-sm truncate">
                              {r.user.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {r.eventTitle}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ── Componentes auxiliares ────────────────────────────────────────────────

function SidebarNav({
  active,
  onNavigate,
}: {
  active: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active
        return (
          <Link
            key={item.key}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-violet-100 text-violet-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function MetricSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
      <div className="w-11 h-11 rounded-full bg-gray-200 mb-3" />
      <div className="h-7 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-24 bg-gray-100 rounded" />
    </div>
  )
}

function Section({
  title,
  onSeeAll,
  children,
}: {
  title: string
  onSeeAll: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <button
          onClick={onSeeAll}
          className="text-sm text-violet-600 hover:underline font-medium"
        >
          Ver todos
        </button>
      </div>
      {children}
    </div>
  )
}

function EmptyBlock({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Calendar
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-2">
      <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon size={22} className="text-gray-400" />
      </span>
      <p className="font-semibold text-gray-700 text-sm">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  const features = [
    { icon: FileText, label: 'Formulários personalizados' },
    { icon: Ticket, label: 'Controle de vagas em tempo real' },
    { icon: Mail, label: 'Confirmação automática por e-mail' },
    { icon: BarChart3, label: 'Relatórios e exportações' },
  ]
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-2xl mx-auto text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Você ainda não possui eventos
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Que tal criar seu primeiro evento? É rápido, fácil e você já pode começar a
        receber inscrições.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-3 border border-gray-100 rounded-lg px-4 py-3"
          >
            <span className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <f.icon size={16} className="text-violet-600" />
            </span>
            <span className="text-sm text-gray-700">{f.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
      >
        <Plus size={18} />
        Criar meu primeiro evento
      </button>
      <div className="mt-3">
        <a href="#" className="text-sm text-violet-600 hover:underline font-medium">
          Saiba como funciona →
        </a>
      </div>
    </div>
  )
}
