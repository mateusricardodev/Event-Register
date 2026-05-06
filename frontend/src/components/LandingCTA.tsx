import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export function LandingCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Gratuito para começar
        </div>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
          Seu próximo evento merece
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-teal-500">
            a melhor experiência.
          </span>
        </h2>
        <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
          Junte-se a organizadores que simplificaram a gestão de eventos na sua comunidade.
          Comece agora, sem cartão de crédito.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="flex items-center gap-2 font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-teal-200 hover:shadow-xl active:scale-95"
          >
            Criar minha conta grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors px-8 py-3.5 rounded-2xl"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </section>
  )
}
