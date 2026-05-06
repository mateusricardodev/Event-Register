import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const items = [
  {
    q: 'A plataforma é gratuita?',
    a: 'Sim. Você pode criar sua conta e gerenciar seus eventos sem nenhum custo. Nossa missão é tornar a gestão de eventos acessível para qualquer ministério ou comunidade cristã.',
  },
  {
    q: 'O participante precisa criar uma conta para se inscrever?',
    a: 'Não. Esse é um dos principais diferenciais da plataforma. O participante recebe o link do evento, preenche o formulário e confirma a inscrição — tudo sem criar conta ou senha.',
  },
  {
    q: 'Posso personalizar os campos do formulário de inscrição?',
    a: 'Sim. Durante a criação do evento, você escolhe quais informações deseja coletar: nome, e-mail, CPF, celular, data de nascimento, endereço, entre outros campos opcionais.',
  },
  {
    q: 'Como funciona o controle de vagas?',
    a: 'Você define o número máximo de participantes ao criar o evento. O sistema conta automaticamente as inscrições e encerra novas inscrições ao atingir a capacidade máxima.',
  },
  {
    q: 'Consigo ver e gerenciar todos os inscritos?',
    a: 'Sim. O painel do organizador exibe todos os inscritos em tempo real, com filtros por status, busca por nome ou CPF e a possibilidade de editar ou cancelar inscrições individualmente.',
  },
  {
    q: 'A plataforma funciona bem no celular?',
    a: 'Totalmente. Tanto o painel do organizador quanto a página de inscrição do participante são responsivos e otimizados para dispositivos móveis.',
  },
  {
    q: 'Meus dados e os dos participantes estão seguros?',
    a: 'Sim. A plataforma foi desenvolvida seguindo boas práticas de segurança e conformidade com a LGPD (Lei Geral de Proteção de Dados). Nenhum dado é compartilhado com terceiros.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-purple-600' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}
      >
        <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </p>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-widest">Dúvidas frequentes</span>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">Perguntas e respostas</h2>
          <p className="mt-3 text-slate-500">
            Não encontrou sua dúvida? Entre em contato com nossa equipe.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
