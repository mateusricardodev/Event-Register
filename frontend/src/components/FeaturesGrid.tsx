import { UserPlus, Settings2, Share2, LayoutDashboard, Zap, ShieldCheck, Smartphone, Users } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Crie sua conta',
    description: 'Cadastro rápido para o organizador. Em menos de 2 minutos você já está pronto para criar seu primeiro evento.',
    color: 'bg-purple-100 text-purple-700',
    border: 'border-purple-100',
  },
  {
    step: '02',
    icon: Settings2,
    title: 'Configure o evento',
    description: 'Use nosso wizard intuitivo para definir informações, formulário de inscrição, banner e página pública.',
    color: 'bg-violet-100 text-violet-700',
    border: 'border-violet-100',
  },
  {
    step: '03',
    icon: Share2,
    title: 'Compartilhe o link',
    description: 'Publique o evento e compartilhe o link com sua comunidade. Participantes se inscrevem sem criar conta.',
    color: 'bg-teal-100 text-teal-700',
    border: 'border-teal-100',
  },
  {
    step: '04',
    icon: LayoutDashboard,
    title: 'Gerencie os inscritos',
    description: 'Acompanhe inscrições em tempo real, filtre por status, edite dados e controle as vagas disponíveis.',
    color: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-100',
  },
]

const differentials = [
  {
    icon: Zap,
    title: 'Sem burocracia para o participante',
    description: 'Nenhuma conta necessária. O participante abre o link e já está no formulário — zero fricção.',
  },
  {
    icon: ShieldCheck,
    title: 'Controle total de vagas',
    description: 'Defina o número máximo de inscritos e o sistema fecha automaticamente quando a capacidade é atingida.',
  },
  {
    icon: Smartphone,
    title: 'Responsivo para celular',
    description: 'Página de inscrição totalmente otimizada para mobile. Seu público se inscreve de qualquer dispositivo.',
  },
  {
    icon: Users,
    title: 'Painel completo de gestão',
    description: 'Visualize, filtre e edite cada inscrição. Busca global para encontrar qualquer participante em segundos.',
  },
]

export function FeaturesGrid() {
  return (
    <>
      {/* How it works */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Simples assim</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">Como funciona</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Do cadastro ao primeiro inscrito em menos de 10 minutos. Sem configurações complexas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, icon: Icon, title, description, color, border }) => (
              <div
                key={step}
                className={`relative bg-white rounded-3xl p-6 border-2 ${border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none">
                    {step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section id="diferenciais" className="py-24 bg-gradient-to-br from-purple-700 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-widest">Por que escolher</span>
            <h2 className="mt-2 text-4xl font-extrabold text-white">Pensado para ministérios</h2>
            <p className="mt-3 text-purple-200 max-w-xl mx-auto">
              Cada funcionalidade foi desenhada para resolver a realidade de quem organiza eventos em igrejas e comunidades cristãs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {differentials.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-400/20 flex items-center justify-center mb-4 group-hover:bg-teal-400/30 transition-colors">
                  <Icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
