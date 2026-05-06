import { ShieldCheck, Lock, FileCheck2, ServerCrash, Globe2, BadgeCheck } from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: 'Proteção de Dados',
    description: 'Dados dos participantes armazenados com segurança e sem compartilhamento com terceiros.',
  },
  {
    icon: Lock,
    title: 'Conexão Segura',
    description: 'Toda comunicação é criptografada via HTTPS, garantindo privacidade nas transmissões.',
  },
  {
    icon: FileCheck2,
    title: 'Conformidade LGPD',
    description: 'Plataforma desenvolvida seguindo as diretrizes da Lei Geral de Proteção de Dados.',
  },
  {
    icon: ServerCrash,
    title: 'Alta Disponibilidade',
    description: 'Infraestrutura estável para que seu evento esteja acessível sempre que precisar.',
  },
  {
    icon: Globe2,
    title: 'Acesso Universal',
    description: 'Funciona em qualquer dispositivo com navegador, sem instalação ou conta para participantes.',
  },
  {
    icon: BadgeCheck,
    title: 'Plataforma Confiável',
    description: 'Desenvolvida especialmente para o contexto de eventos cristãos e comunitários.',
  },
]

export function TrustBadges() {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Segurança & Confiança</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Seus dados e os dos seus participantes estão seguros</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm">
            Levamos a privacidade a sério. Construímos a plataforma com as melhores práticas de segurança desde o início.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-purple-200 transition-colors shadow-sm">
                <Icon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{title}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
