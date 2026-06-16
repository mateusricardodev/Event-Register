import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Users, Plus, CheckCircle, DollarSign, ChevronRight,
  FileText, Mail, BarChart3, Ticket,
} from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { DashboardLayout } from '../components/DashboardLayout'
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
  const { user } = useAuthStore()

  const [events, setEvents] = useState<EventItem[]>([])
  const [regs, setRegs] = useState<RegItem[]>([])
  const [loading, setLoading] = useState(true)

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

  const firstName = (user?.name ?? 'Organizador').split(' ')[0]

  const metrics = [
    {
      label: 'Total de eventos',
      value: String(totalEvents),
      icon: Calendar,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      to: '/eventos',
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
      to: '/eventos',
    },
  ]

  return (
    <DashboardLayout active="dashboard">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Próximos eventos */}
          <Section title="Próximos eventos" onSeeAll={() => navigate('/eventos')}>
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
          <Section title="Últimas inscrições" onSeeAll={() => navigate('/buscar-inscricoes')}>
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
                    <li key={r.id} className="flex items-center gap-4 px-2 py-3">
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
    </DashboardLayout>
  )
}

// ── Componentes auxiliares ────────────────────────────────────────────────

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
