import { LogOut, Shield, Sun, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { APP_VERSION } from '../api'
import { formatSyncStamp } from '../format'

interface AppDrawerProps {
  open: boolean
  onClose: () => void
}

const items = [
  { icon: Users, label: 'Contas' },
  { icon: Shield, label: 'Política de privacidade' },
  { icon: Sun, label: 'Mudar tema' },
]

export function AppDrawer({ open, onClose }: AppDrawerProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={
          'fixed inset-0 z-30 bg-black/60 transition-opacity duration-200 ' +
          (open ? 'opacity-100' : 'pointer-events-none opacity-0')
        }
      />
      {/* painel */}
      <aside
        className={
          'fixed inset-y-0 left-0 z-40 flex w-[84%] max-w-[330px] flex-col ' +
          'bg-[#0A0A12] text-white shadow-2xl transition-transform duration-200 ease-out ' +
          'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <div className="px-5 pt-6">
          <p className="text-lg font-bold leading-tight">
            {user?.name ?? 'Voluntário'}
          </p>
          <p className="mt-1 text-sm text-[#9CA3AF] break-all">
            {user?.email ?? ''}
          </p>
        </div>

        <nav className="mt-6 flex flex-col">
          {items.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-4 px-5 py-4 text-left active:bg-white/5"
            >
              <Icon className="w-6 h-6 text-[#D1D5DB]" />
              <span className="text-[15px]">{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-5 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-4 text-left active:opacity-70"
          >
            <LogOut className="w-6 h-6 text-[#D1D5DB]" />
            <span className="text-[15px]">Sair</span>
          </button>
          <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
              Sincronizado em {formatSyncStamp(new Date())}
            </span>
            <span>Versão: {APP_VERSION}</span>
          </div>
        </div>
      </aside>
    </>
  )
}
