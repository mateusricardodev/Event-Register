import { X, Check, ArrowRight } from 'lucide-react'

const before = [
  'Formulário no Google Forms desconexo do evento',
  'Planilha Excel para controlar inscritos manualmente',
  'Link de inscrição confuso e sem identidade visual',
  'Participante liga perguntando se foi inscrito',
  'Dificuldade de saber quantas vagas restam',
  'Sem controle de capacidade — evento superlota',
]

const after = [
  'Formulário integrado, personalizado e com sua marca',
  'Painel em tempo real com todos os inscritos',
  'Página pública profissional com banner e detalhes',
  'Confirmação automática ao completar inscrição',
  'Contador de vagas atualizado instantaneamente',
  'Inscrições encerram automaticamente ao atingir limite',
]

export function BeforeAfter() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Comparativo</span>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">A diferença na prática</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Chega de improvisar com ferramentas que não foram feitas para isso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-white rounded-3xl p-6 border-2 border-red-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                <X className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-bold text-slate-700 text-base">Sem a plataforma</span>
            </div>
            <ul className="flex flex-col gap-3">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-500">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-white rounded-3xl p-6 border-2 border-teal-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              inscrições.app
            </div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-teal-600" />
              </div>
              <span className="font-bold text-slate-700 text-base">Com inscrições.app</span>
            </div>
            <ul className="flex flex-col gap-3">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="#como-funciona"
            className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-600 transition-colors"
          >
            Ver como funciona <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
