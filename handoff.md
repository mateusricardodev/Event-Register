# Handoff — Ecclesio (inscrições.app)

> Documento para quem vai continuar o desenvolvimento. Leia antes de tocar em qualquer código.

---

## 1. Visão geral

Plataforma SaaS de gestão de eventos religiosos/institucionais chamada **Ecclesio**. O organizador cria eventos, configura formas de pagamento e campos de formulário, e divulga um link público. O participante acessa o link, preenche o formulário e paga via PIX (ou outra forma configurada). Voluntários no evento fazem credenciamento via QR code ou busca por nome usando um app mobile-first em `/app`.

Não há marketplace público — cada organizador gerencia apenas seus próprios eventos.

---

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11 · TypeScript · ESM (`"type": "module"`) |
| ORM | Prisma 7 (client gerado em `backend/generated/prisma`, **não** `@prisma/client`) |
| Banco | PostgreSQL (adapter `@prisma/adapter-pg`) |
| Autenticação | JWT via `@nestjs/passport` + `passport-jwt` |
| Pagamentos | Mercado Pago (PIX) · provider mock para dev/testes |
| E-mail | Nodemailer + Brevo (SMTP) · fire-and-forget |
| Upload | Multer (disk, `backend/uploads/`) · validação por magic bytes com `file-type` |
| Frontend | React 19 · Vite 8 · Tailwind 4 · React Router 7 |
| Estado global | Zustand (auth) |
| HTTP client | Axios — `baseURL` hardcoded como `http://localhost:3000` em `src/api/axios.ts` |
| Node mínimo | 22.0.0 |

---

## 3. Estrutura do monorepo

```
/
├── backend/          # API NestJS (porta 3000)
│   ├── src/
│   │   ├── auth/         # login, registro, JWT, guards
│   │   ├── events/       # CRUD de eventos, banner upload
│   │   ├── registrations/# inscrições (organizer + público)
│   │   ├── payments/     # PIX, polling, webhook MP, mock
│   │   ├── checkin/      # credenciamento, QR code, logs
│   │   ├── public/       # rotas sem auth (evento por slug, inscrição pública)
│   │   ├── mail/         # template e envio de e-mail de confirmação
│   │   ├── tickets/      # ingressos por lote (feature incompleta)
│   │   └── prisma/       # PrismaService (expõe .db, não estende PrismaClient)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts       # admin + eventos de exemplo
│   │   └── backfill-checkin-codes.ts  # script pontual já executado
│   └── generated/prisma/ # client gerado — nunca editar manualmente
│
└── frontend/         # SPA React (porta 5173)
    ├── src/
    │   ├── pages/        # telas do painel do organizador + públicas
    │   ├── app/          # app mobile de credenciamento (/app/*)
    │   ├── components/   # DashboardLayout, WizardShared, landing components
    │   ├── store/        # auth.store.ts (Zustand)
    │   └── api/axios.ts  # cliente HTTP único
    └── public/           # assets estáticos (logos, imagens, PDFs)
```

---

## 4. Modelos de dados (Prisma)

```
User            — organizadores e usuários "sombra" de inscritos
Event           — evento com slug único, banner, formFields (JSON em String)
EventPaymentMethod — formas de pagamento configuradas por evento
EventVolunteer  — voluntários com acesso ao app de credenciamento
Ticket          — lotes de ingressos (parcialmente implementado)
Registration    — inscrição com status, CPF, extraFields (JSON em String), código de credenciamento
Payment         — pagamento PIX vinculado 1:1 a uma inscrição
CheckinLog      — log de cada check-in/undo com quem realizou
```

**Detalhe crítico:** `formFields` e `extraFields` são `String?` armazenando JSON serializado. Sempre `JSON.parse` ao ler e `JSON.stringify` ao gravar.

---

## 5. Rotas da API (principais)

| Método | Path | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | — | Cria organizador |
| POST | `/auth/login` | — | Retorna JWT |
| GET | `/auth/me` | JWT | Perfil do usuário logado |
| GET | `/events` | JWT | Lista eventos do organizador |
| POST | `/events` | JWT | Cria evento |
| PUT | `/events/:id` | JWT | Edita evento (verifica `createdBy`) |
| DELETE | `/events/:id` | JWT | Exclui evento |
| POST | `/events/:id/banner` | JWT | Upload do banner (valida magic bytes) |
| GET | `/events/:id/registrations` | JWT | Lista inscrições do evento |
| POST | `/events/:id/registrations` | JWT | Nova inscrição (organizer) |
| PUT | `/registrations/:id` | JWT | Edita inscrição |
| GET | `/public/events/:slug` | — | Dados públicos do evento |
| POST | `/public/events/:slug/register` | — | Inscrição pública |
| GET | `/public/payments/status/:regId` | — | Polling do status do PIX |
| POST | `/payments/mock/:providerPaymentId/approve` | — | Aprovar pagamento mock (só em dev) |
| GET | `/checkin/events` | JWT | Eventos do voluntário para o app |
| GET | `/checkin/events/:id/stats` | JWT | Contadores do credenciamento |
| GET | `/checkin/events/:id/participants` | JWT | Lista de inscritos |
| POST | `/checkin/events/:id/check-in` | JWT | Realizar check-in |

`RegistrationsController` usa `@Controller()` sem prefixo — cada rota declara o path completo.

---

## 6. Rotas do frontend

| Path | Componente | Descrição |
|---|---|---|
| `/` | `LandingPage` | Página institucional |
| `/login` | `Login` | Login + cadastro de organizador |
| `/dashboard` | `Dashboard` | Painel inicial (protegido) |
| `/eventos` | `Events` | Lista de eventos (protegido) |
| `/events/new` | `CreateEvent` | Wizard passo 1 — dados básicos |
| `/events/:id/setup/payment` | `EventSetupPayment` | Wizard passo 2 — pagamento |
| `/events/:id/setup/form` | `EventSetupForm` | Wizard passo 3 — campos do form |
| `/events/:id/setup/page` | `EventSetupPage` | Wizard passo 4 — publicação/slug |
| `/events/:id` | `EventDetail` | Detalhes + lista de inscrições |
| `/events/:id/edit` | `EditEvent` | Editar evento |
| `/events/:id/registrations/new` | `NewRegistration` | Nova inscrição (organizer) |
| `/events/:id/registrations/:regId/edit` | `EditRegistration` | Editar inscrição |
| `/buscar-inscricoes` | `SearchRegistrations` | Busca global de inscrições |
| `/evento/:slug` | `EventPublic` | Página pública do evento |
| `/evento/:slug/inscricao` | `PublicRegistration` | Formulário público de inscrição |
| `/evento/:slug/pagamento-pix` | `PixPayment` | Tela de pagamento PIX + polling |
| `/app/eventos` | `EventsList` | App credenciamento — lista eventos |
| `/app/evento/:id` | `EventCheckin` | App credenciamento — lista inscritos |
| `/app/evento/:id/pesquisar` | `SearchCheckin` | App credenciamento — busca |
| `/app/evento/:id/qrcode` | `QrScanner` | App credenciamento — leitor QR |

---

## 7. Estado atual

### Funciona
- Cadastro e login de organizadores
- CRUD completo de eventos com upload de banner
- Wizard de criação/edição em 4 etapas
- Inscrição pública com formulário dinâmico (campos configuráveis por evento)
- Pagamento PIX via Mercado Pago com polling de status
- Geração e download de ingresso em PDF (jsPDF)
- E-mail de confirmação com QR code embutido (Nodemailer + Brevo)
- Cancelamento suave de inscrições (soft delete com status `canceled`)
- Dedup de CPF por evento (transação `Serializable`)
- Controle de capacidade (`maxParticipants`)
- Usuários "sombra" — inscritos sem conta ganham um User com senha aleatória
- App de credenciamento mobile: lista, busca, check-in por toque, leitor QR
- Log de check-ins com rastreabilidade de quem realizou
- Voluntários por evento (`EventVolunteer`) com acesso só ao app
- Identidade visual Ecclesio aplicada em todas as telas do painel e do fluxo público

### Em andamento / incompleto
- **Tickets/lotes**: model `Ticket` existe no schema e a tabela é criada na migration, mas a UI de criação de lotes não foi implementada. A coluna `ticketId` em `Registration` está nullable e nunca preenchida pelo fluxo atual.
- **Webhook do Mercado Pago**: endpoint existe (`POST /payments/webhook`) mas a validação da assinatura (`MERCADOPAGO_WEBHOOK_SECRET`) precisa ser testada em produção com HTTPS real.
- **App de credenciamento — identidade visual**: as telas em `/app/*` usam tema escuro próprio. O `QrScanner` usa roxo (`#7C3AED`) no header — ainda não foi migrado para o azul Ecclesio.

---

## 8. Problemas conhecidos / limitações

- `baseURL` do Axios está hardcoded como `http://localhost:3000` em `frontend/src/api/axios.ts`. Em produção, isso precisa ser trocado para a URL real da API (ou usar variável de ambiente `VITE_API_URL` já documentada no README, mas não conectada no código).
- O link do grupo do WhatsApp na tela de confirmação (`PixPayment.tsx`) está hardcoded: `https://chat.whatsapp.com/LnQvtR0hTwuJFW8kkZrzdy`. Deveria ser um campo configurável por evento.
- O path `/autorizacao-responsavel.pdf` referenciado em `PublicRegistration.tsx` precisa de um arquivo real em `frontend/public/`.
- Upload de banner: os arquivos ficam em `backend/uploads/` no sistema de arquivos local. Em deploy em servidor sem persistência (containers efêmeros), os banners são perdidos a cada restart. Considerar migrar para S3/R2.
- Sem paginação na listagem de inscrições (`EventDetail`) — pode ficar lento com muitos inscritos.
- Sem rate limiting por IP no endpoint de inscrição pública (só `@nestjs/throttler` global).

---

## 9. Como rodar localmente

### Pré-requisitos
- Node 22+
- PostgreSQL rodando
- (Opcional) Conta Brevo para e-mails

### Backend

```bash
cd backend
cp .env.example .env   # edite com suas credenciais
npm install
npx prisma migrate dev
npm run seed           # cria admin + eventos de exemplo
npm run start:dev      # porta 3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # porta 5173
```

### Credenciais do seed

Após `npm run seed`:
- **E-mail:** `admin@ecclesio.com`
- **Senha:** `admin123`

---

## 10. Variáveis de ambiente (backend/.env)

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=development
PORT=3000
JWT_SECRET=<string aleatória longa>

# Pagamentos
PAYMENT_PROVIDER=mock          # "mock" para dev, "mercadopago" para produção
MERCADOPAGO_ACCESS_TOKEN=<token>
MERCADOPAGO_WEBHOOK_SECRET=<secret>

# CORS
FRONTEND_URL=http://localhost:5173

# E-mail (Brevo SMTP) — sem isso o envio falha silenciosamente
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=<usuario brevo>
MAIL_PASS=<chave SMTP brevo>
MAIL_FROM="Ecclesio <noreply@ecclesio.com>"
```

---

## 11. Deploy

O script `start:prod` no `backend/package.json` roda `prisma migrate deploy` antes de subir o servidor — migrations são aplicadas automaticamente no boot.

```bash
# Backend (em produção)
npm run build
npm run start:prod

# Frontend (gera dist/ para servir como estático)
npm run build
```

**Antes de subir em produção, obrigatoriamente:**
1. Trocar `baseURL` em `frontend/src/api/axios.ts` para a URL real da API
2. Setar `PAYMENT_PROVIDER=mercadopago` e as variáveis do MP
3. Configurar HTTPS (o webhook do MP exige)
4. Decidir onde guardar os uploads de banner (local não persiste em containers)

---

## 12. Decisões de arquitetura

**Prisma client fora de `node_modules`** — gerado em `backend/generated/prisma` para compatibilidade com Prisma 7. A `datasource` no schema não tem `url`; ela vem de `prisma.config.ts` (CLI) e do adapter em runtime. Não adicione `url` ao schema.

**`PrismaService.db`** — o service não estende `PrismaClient`; expõe o client na propriedade `.db`. Sempre `this.prisma.db.user.findUnique(...)`.

**ESM com extensões `.js`** — todos os imports relativos do backend terminam em `.js` mesmo apontando para `.ts`. Manter esse padrão em arquivos novos.

**Usuários "sombra"** — participantes de eventos não têm conta. Na inscrição pública, o service busca um `User` por e-mail e cria um com senha aleatória se não existir. Editar o nome de uma inscrição atualiza o `User` vinculado.

**Autorização por `createdBy`** — não há RBAC. A autorização é feita nos services comparando `event.createdBy === userId` e lançando `ForbiddenException`. Replicar esse padrão em novas rotas.

**Pagamento é abstraído em provider** — `src/payments/providers/` tem `mock.payment-provider.ts` e `mercadopago.payment-provider.ts`. A variável `PAYMENT_PROVIDER` escolhe qual injetar. Para adicionar outro gateway, implementar `IPaymentProvider`.

**Dedup de CPF em transação Serializable** — evita race condition em picos de inscrição. Não remover sem alternativa equivalente.

**Testes mockam o Prisma** — `moduleNameMapper` no `package.json` do backend redireciona qualquer import de `generated/prisma/client` para `src/__mocks__/prisma-client.ts`. Testes unitários nunca batem no banco real.

---

## 13. Acessos e credenciais

As credenciais reais não ficam neste arquivo. Consultar:
- `.env` no servidor de produção (variáveis listadas na seção 10)
- Conta Mercado Pago do cliente para `MERCADOPAGO_ACCESS_TOKEN`
- Conta Brevo para credenciais SMTP
- Acesso ao banco PostgreSQL de produção via painel do provedor de hospedagem

---

## 14. Próximos passos sugeridos

- [ ] Tornar a `baseURL` do Axios configurável via `VITE_API_URL` (uma linha em `axios.ts`)
- [ ] Tornar o link do WhatsApp configurável por evento (campo no painel)
- [ ] Migrar uploads de banner para armazenamento externo (S3, Cloudflare R2)
- [ ] Implementar UI de criação de lotes/tickets (model já existe no backend)
- [ ] Paginação na listagem de inscrições
- [ ] Ajustar identidade visual do app de credenciamento (`/app/*`) para usar azul Ecclesio em vez do tema escuro atual
- [ ] Testar webhook do Mercado Pago em produção com HTTPS
- [ ] Adicionar campo `whatsappGroupUrl` ao modelo `Event` e exibir na tela de confirmação
