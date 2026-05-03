import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-lg tracking-tight">
          e·inscrição
        </Link>

        {user && (
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="hover:text-teal-300 transition-colors">
              meus eventos
            </Link>
            <Link to="/dashboard" className="hover:text-teal-300 transition-colors">
              minha conta
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-teal-300 transition-colors"
            >
              sair
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
