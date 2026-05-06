import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Users, Calendar, Link2 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-24 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Feito para igrejas e ministérios
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Gerencie seus
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-teal-500">
              eventos com
            </span>
            simplicidade.
          </h1>

          <p className="text-lg text-slate-500 max-w-md leading-relaxed">
            Crie, divulgue e gerencie inscrições de eventos da sua igreja em minutos.
            Seus participantes se inscrevem pelo link — <strong className="text-slate-700">sem precisar criar conta.</strong>
          </p>

          <ul className="flex flex-col gap-2 text-sm text-slate-600">
            {[
              'Formulário de inscrição personalizável',
              'Controle de vagas em tempo real',
              'Painel completo para o organizador',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/register"
              className="flex items-center gap-2 font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all px-6 py-3 rounded-2xl shadow-lg hover:shadow-teal-200 hover:shadow-xl active:scale-95"
            >
              Começar grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#como-funciona"
              className="flex items-center gap-2 font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors px-6 py-3 rounded-2xl"
            >
              Ver como funciona
            </a>
          </div>
        </div>

        {/* Right — dashboard mockup */}
        <div className="relative hidden lg:block">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Mockup header */}
            <div className="bg-purple-700 px-6 py-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <div className="w-3 h-3 rounded-full bg-purple-400" />
              </div>
              <div className="flex-1 bg-purple-600 rounded-lg h-6 flex items-center px-3">
                <span className="text-purple-200 text-xs">inscrições.app/dashboard</span>
              </div>
            </div>

            {/* Mockup body */}
            <div className="p-6 bg-slate-50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="h-4 w-32 bg-slate-200 rounded-lg mb-2" />
                  <div className="h-3 w-20 bg-slate-100 rounded-lg" />
                </div>
                <div className="bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">+ Novo Evento</div>
              </div>

              {/* Event cards */}
              {[
                { title: 'Retiro de Jovens 2025', date: '14 Jun', count: 47, max: 60, color: 'bg-purple-500' },
                { title: 'Conferência de Mulheres', date: '28 Jun', count: 112, max: 150, color: 'bg-teal-500' },
                { title: 'Acampamento Infantil', date: '5 Jul', count: 23, max: 40, color: 'bg-violet-500' },
              ].map((ev) => (
                <div key={ev.title} className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className={`${ev.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ev.title}</p>
                    <p className="text-xs text-slate-400">{ev.date}</p>
                    <div className="mt-1.5 bg-slate-100 rounded-full h-1.5 w-full">
                      <div
                        className={`${ev.color} h-1.5 rounded-full transition-all`}
                        style={{ width: `${(ev.count / ev.max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{ev.count}</p>
                    <p className="text-xs text-slate-400">inscritos</p>
                  </div>
                </div>
              ))}

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'Eventos ativos', value: '3', Icon: Calendar },
                  { label: 'Total inscritos', value: '182', Icon: Users },
                  { label: 'Links gerados', value: '3', Icon: Link2 },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
                    <Icon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-400 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Nova inscrição</p>
              <p className="text-xs text-slate-400">Maria S. — Retiro de Jovens</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
