import { CalendarHeart, MapPin, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

export function PublicFormPreview() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Experiência do participante</span>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">O que o inscrito vê</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            Uma página limpa, profissional e fácil de usar — sem cadastro, sem complicação.
            O participante recebe o link e já está no formulário.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">
          {/* Phone mockup — event page */}
          <div className="relative w-[300px] shrink-0">
            <div className="bg-slate-800 rounded-[2.5rem] p-2.5 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden h-[580px] flex flex-col">
                {/* Banner */}
                <div className="h-36 bg-gradient-to-br from-purple-700 to-violet-600 relative flex items-end p-4">
                  <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    Vagas disponíveis
                  </div>
                  <div>
                    <p className="text-white/70 text-xs mb-1">Igreja Renovada — SP</p>
                    <h3 className="text-white font-bold text-base leading-tight">Retiro de Jovens 2025</h3>
                  </div>
                </div>

                {/* Event info */}
                <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2">
                  {[
                    { Icon: CalendarHeart, text: '14 a 16 de junho de 2025' },
                    { Icon: MapPin, text: 'Chácara Serra Verde, Atibaia' },
                    { Icon: Clock, text: 'Saída às 18h de sexta-feira' },
                    { Icon: Users, text: '13 vagas restantes de 60' },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                      <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="flex-1 px-4 py-3 overflow-hidden flex flex-col gap-2.5">
                  <p className="text-xs font-semibold text-slate-700">Preencha para se inscrever</p>
                  {['Nome completo', 'E-mail', 'CPF', 'Celular'].map((label) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                      <div className="h-7 bg-slate-100 rounded-lg w-full" />
                    </div>
                  ))}
                  <button className="mt-1 w-full bg-teal-500 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5">
                    Confirmar inscrição <ArrowRight className="w-3 h-3" />
                  </button>
                  <p className="text-center text-xs text-slate-400">Não é necessário criar conta</p>
                </div>
              </div>
            </div>
            {/* Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full" />
          </div>

          {/* Success state */}
          <div className="relative w-[300px] shrink-0">
            <div className="bg-slate-800 rounded-[2.5rem] p-2.5 shadow-2xl">
              <div className="bg-white rounded-[2rem] overflow-hidden h-[580px] flex flex-col items-center justify-center px-6 gap-5">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-teal-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-extrabold text-slate-800 text-xl mb-1">Inscrição confirmada!</h3>
                  <p className="text-slate-500 text-sm">Sua inscrição no evento foi realizada com sucesso.</p>
                </div>
                <div className="w-full bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 text-sm border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evento</span>
                    <span className="font-semibold text-slate-700 text-right max-w-[140px]">Retiro de Jovens 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nome</span>
                    <span className="font-semibold text-slate-700">Maria Silva</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-teal-600 font-semibold">Confirmado</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Um e-mail de confirmação foi enviado para você.
                </p>
              </div>
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-800 rounded-full" />
          </div>

          {/* Description */}
          <div className="max-w-sm flex flex-col gap-5">
            <h3 className="text-2xl font-bold text-slate-800">Simples para quem se inscreve, poderoso para quem organiza.</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              O participante recebe um link, abre no celular e preenche o formulário em menos de 1 minuto.
              Sem downloads, sem cadastros, sem complicação.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Página com identidade visual do seu evento',
                'Formulário com campos que você define',
                'Confirmação imediata ao se inscrever',
                'Funciona em qualquer celular ou computador',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
