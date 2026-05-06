import { Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Pr. André Lima',
    role: 'Coordenador de Jovens — Igreja Renovada, SP',
    text: 'Usamos o inscrições.app para o nosso retiro anual. O processo foi absurdamente simples — em 15 minutos o evento estava online e as inscrições começaram a chegar.',
    avatar: 'AL',
    color: 'bg-purple-700',
  },
  {
    name: 'Simone Ferreira',
    role: 'Secretária administrativa — Comunidade Graça, RJ',
    text: 'O melhor é que os participantes não precisam criar conta. Isso eliminou metade das dúvidas que recebia antes. Recomendo demais para qualquer ministério.',
    avatar: 'SF',
    color: 'bg-teal-600',
  },
  {
    name: 'Josué Carvalho',
    role: 'Pastor Assistente — Igreja da Paz, BH',
    text: 'O painel de gestão é muito prático. Consigo ver quem se inscreveu, quantas vagas restam e editar informações tudo em um lugar só. Perfeito!',
    avatar: 'JC',
    color: 'bg-violet-700',
  },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Depoimentos</span>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">Quem já usa, aprova</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Organizadores de todo o Brasil confiam na plataforma para eventos que importam.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, text, avatar, color }) => (
            <div
              key={name}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              <Quote className="w-8 h-8 text-purple-100" />
              <p className="text-slate-600 text-sm leading-relaxed flex-1">"{text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-50">
                <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
