import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home, Calendar, Users, Settings, Bell, Search, Menu, X,
} from 'lucide-react'
import { useAuthStore } from '../store/auth.store'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, to: '/dashboard', key: 'dashboard' },
  { label: 'Eventos', icon: Calendar, to: '/eventos', key: 'eventos' },
  { label: 'Inscrições', icon: Users, to: '/buscar-inscricoes', key: 'inscricoes' },
  { label: 'Configurações', icon: Settings, to: '/dashboard', key: 'config' },
]

type NavKey = 'dashboard' | 'eventos' | 'inscricoes' | 'config'

export function DashboardLayout({
  active,
  children,
}: {
  active: NavKey
  children: React.ReactNode
}) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fullName = user?.name ?? 'Organizador'
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
          <SidebarNav active={active} />
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
              <SidebarNav active={active} onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* ── CONTEÚDO PRINCIPAL ────────────────────────────────────────── */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 min-w-0">{children}</main>
      </div>
    </div>
  )
}

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
