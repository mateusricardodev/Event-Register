import { Link } from 'react-router-dom'
import { CalendarHeart, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-7 h-7 rounded-lg bg-purple-700 flex items-center justify-center">
                <CalendarHeart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                inscrições<span className="text-teal-400">.app</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Plataforma de gestão de eventos para igrejas e comunidades cristãs. Simples, eficiente e gratuita para começar.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Plataforma</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Criar conta</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Entrar</Link></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
            </ul>
          </div>

          {/* Projeto */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Projeto</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><span className="text-slate-500 select-none">Sobre</span></li>
              <li><span className="text-slate-500 select-none">Privacidade</span></li>
              <li><span className="text-slate-500 select-none">Termos de uso</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2025 inscrições.app. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-teal-400 fill-teal-400" /> para a comunidade cristã
          </p>
        </div>
      </div>
    </footer>
  )
}
