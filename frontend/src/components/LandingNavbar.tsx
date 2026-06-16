import { Link } from 'react-router-dom'
import { CalendarHeart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/auth.store'

export function LandingNavbar() {
  const [open, setOpen] = useState(false)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center shadow-md group-hover:bg-purple-600 transition-colors">
            <CalendarHeart className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            inscrições<span className="text-teal-500">.app</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#como-funciona" className="hover:text-purple-700 transition-colors">Como funciona</a>
          <a href="#diferenciais" className="hover:text-purple-700 transition-colors">Diferenciais</a>
          <a href="#depoimentos" className="hover:text-purple-700 transition-colors">Depoimentos</a>
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-white bg-purple-700 hover:bg-purple-600 transition-all px-5 py-2 rounded-xl shadow-md active:scale-95"
              >
                Meu painel
              </Link>
              <button
                onClick={() => logout()}
                className="text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors px-4 py-2 rounded-xl hover:bg-purple-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors px-4 py-2 rounded-xl hover:bg-purple-50"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all px-5 py-2 rounded-xl shadow-md hover:shadow-teal-200 hover:shadow-lg active:scale-95"
              >
                Criar Evento
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-600 hover:text-purple-700 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate-600">
          <a href="#como-funciona" onClick={() => setOpen(false)} className="hover:text-purple-700 transition-colors">Como funciona</a>
          <a href="#diferenciais" onClick={() => setOpen(false)} className="hover:text-purple-700 transition-colors">Diferenciais</a>
          <a href="#depoimentos" onClick={() => setOpen(false)} className="hover:text-purple-700 transition-colors">Depoimentos</a>
          <hr className="border-slate-100" />
          {token ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-center font-semibold text-white bg-purple-700 hover:bg-purple-600 transition-colors py-2.5 rounded-xl"
              >
                Meu painel
              </Link>
              <button
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="text-left hover:text-purple-700 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="hover:text-purple-700 transition-colors">Entrar</Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="text-center font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-colors py-2.5 rounded-xl"
              >
                Criar Evento
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
