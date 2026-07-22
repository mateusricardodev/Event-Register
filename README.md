# inscrições.app

Plataforma de gestão de eventos — criação de eventos, formulários personalizados, inscrições públicas com pagamento via PIX, painel do organizador e app de credenciamento por QR code.

Monorepo com duas aplicações independentes:

```
Event-Register/
├── backend/      # API NestJS         → porta 3000
└── frontend/     # SPA React + Vite   → porta 5173
```

> Não existe workspace na raiz. Cada pasta tem seu próprio `package.json` — rode sempre os comandos a partir de `backend/` ou `frontend/`.

---

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Rodando localmente](#rodando-localmente)
- [Scripts](#scripts)
- [Detalhes de arquitetura](#detalhes-de-arquitetura)
- [Endpoints da API](#endpoints-da-api)
- [Modelo de dados](#modelo-de-dados)
- [Rotas do frontend](#rotas-do-frontend)
- [Deploy no servidor](#deploy-no-servidor)
- [O que ainda não está implementado](#o-que-ainda-não-está-implementado)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS 11 · TypeScript (ESM) · Prisma 7 · PostgreSQL |
| Frontend | React 19 · Vite · TypeScript · Tailwind CSS 4 · Zustand · React Router 7 |
| Autenticação | JWT (passport-jwt) |
| Pagamento | Mercado Pago (PIX) — com provider `mock` para desenvolvimento |
| E-mail | Brevo SMTP (nodemailer) |
| Upload | Multer (disk storage) + validação de magic bytes com `file-type` |
| Infra | Nginx · PM2 · Ubuntu |

---

## Funcionalidades

**Organizador**
- Cadastro e login com JWT
- Criação de eventos via wizard de 4 etapas (info → pagamento → formulário → página pública)
- Upload de banner (JPG/PNG/GIF/WebP, máx. 5 MB) com validação do tipo real do arquivo
- Campos de formulário configuráveis por evento (endereço, data de nascimento, medicamentos, etc.)
- Formas de pagamento configuráveis por evento (PIX, cartão, dinheiro) com valor e parcelas
- Painel de inscrições: listagem paginada, busca global, edição e cancelamento
- Inscrição manual de participantes
- Confirmação manual de pagamento (para valores recebidos fora do sistema)
- Controle de capacidade por `maxParticipants`

**Participante**
- Página pública do evento (`/evento/:slug`) e inscrição sem login
- Pagamento por PIX com QR code, copia-e-cola e confirmação automática via webhook
- Inscrição gratuita ou em dinheiro é confirmada na hora, sem passar pela tela de pagamento
- E-mail de confirmação automático + ingresso em PDF com QR code

**Credenciamento (app mobile em `/app`)**
- Check-in por leitura de QR code ou busca por nome/CPF
- Estatísticas de presença por evento e histórico de check-in

**Segurança**
- Rate limiting global (60 req/min) e headers de segurança via Helmet
- Autorização por dono do recurso em todas as rotas de evento

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Conta Brevo (e-mail) — opcional em desenvolvimento
- Conta Mercado Pago — opcional em desenvolvimento (use `PAYMENT_PROVIDER=mock`)

---

## Configuração

### Backend (`backend/.env`)

```env
# Banco
DATABASE_URL="postgresql://usuario:senha@localhost:5432/inscricoes"

# App
JWT_SECRET="troque-por-valor-seguro"
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV=development

# Pagamento — "mock" (padrão) ou "mercadopago"
PAYMENT_PROVIDER=mock
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_WEBHOOK_SECRET=""

# Brevo SMTP
MAIL_HOST="smtp-relay.brevo.com"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER="seu@email.com"
MAIL_PASS="sua-chave-brevo"
MAIL_FROM="inscrições.app <noreply@inscricoes.app>"
```

| Variável | Obrigatória | Observação |
|----------|-------------|------------|
| `DATABASE_URL` | sim | Lida pelo `prisma.config.ts` (CLI) e pelo adapter em runtime |
| `JWT_SECRET` | sim | Assinatura dos tokens |
| `FRONTEND_URL` | sim | Usado no CORS e nos links dos e-mails |
| `PAYMENT_PROVIDER` | não | `mock` gera PIX falso e libera `POST /payments/mock/:id/approve` |
| `MERCADOPAGO_WEBHOOK_SECRET` | não | Se definido, a assinatura do webhook passa a ser validada |
| `MAIL_*` | não | Sem elas o envio falha silenciosamente (fire-and-forget) e a inscrição continua funcionando |

### Frontend (`frontend/.env`)

```env
VITE_API_URL="http://localhost:3000"
```

---

## Rodando localmente

### Backend

```bash
cd backend
npm install
npx prisma generate      # gera o client em generated/prisma
npx prisma migrate dev   # aplica as migrations
npm run seed             # usuário admin + eventos de exemplo
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Testando o pagamento sem Mercado Pago

Com `PAYMENT_PROVIDER=mock`, faça a inscrição normalmente. A tela de PIX exibe o `providerPaymentId`; aprove com:

```bash
curl -X POST http://localhost:3000/payments/mock/<providerPaymentId>/approve
```

O polling da tela detecta a confirmação em até 4 segundos.

---

## Scripts

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | API em watch mode |
| `npm run build` | `nest build` → `dist/` |
| `npm run lint` | ESLint com `--fix` |
| `npm test` | Jest (unit — `*.spec.ts` em `src/`) |
| `npm test -- auth.service` | Roda um único arquivo por nome parcial |
| `npm run test:cov` | Cobertura |
| `npm run test:e2e` | Jest com `test/jest-e2e.json` |
| `npm run seed` | `tsx prisma/seed.ts` |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint |

---

## Detalhes de arquitetura

Pontos que fogem do padrão e valem ler antes de mexer no código.

**Prisma client gerado fora de `node_modules`**
O client vai para `backend/generated/prisma`, não para `@prisma/client`. Após qualquer mudança no schema, rode `npx prisma generate`. Os imports usam `../../generated/prisma/client.js`.

**Acesso ao banco é via `PrismaService.db`**
`PrismaService` não estende `PrismaClient` — ele expõe o client na propriedade `.db`. Sempre `this.prisma.db.user.findUnique(...)`, nunca `this.prisma.user...`. A conexão usa o driver adapter `@prisma/adapter-pg`.

**Prisma 7 — configuração fora do schema**
A `datasource` do `schema.prisma` não tem `url`. Ela vem do `prisma.config.ts` (CLI) e do adapter em runtime. Não adicione `url`/`env(...)` ao schema.

**ESM com extensões `.js` explícitas**
O backend é `"type": "module"`. Todos os imports relativos terminam em `.js`, mesmo apontando para arquivos `.ts`. Mantenha o padrão em arquivos novos.

**Testes mockam o Prisma client**
O `moduleNameMapper` do Jest redireciona `generated/prisma/client` para `src/__mocks__/prisma-client.ts`. Testes unitários não dependem de banco real.

**Participantes não são usuários autenticados**
`Registration` exige `userId`, mas inscritos não têm conta. Ao inscrever, o service procura um `User` pelo e-mail e, se não existir, cria um **user "sombra"** com senha aleatória. Editar o nome de uma inscrição atualiza o `User` vinculado.

**Regras de negócio das inscrições**
- Capacidade (`maxParticipants`) e dedup de CPF rodam dentro de `$transaction` com `isolationLevel: 'Serializable'`.
- Dedup de CPF é por evento e ignora inscrições `canceled`.
- Cancelamento é soft (status `canceled`), nunca delete.
- Inscrições gratuitas e em dinheiro nascem `confirmed`, sem gerar cobrança online.
- O e-mail de confirmação é disparado com `void this.mail.send...` (não bloqueia a resposta).

**Campos dinâmicos são JSON em coluna `String`**
`Event.formFields` e `Registration.extraFields` são `String?` guardando JSON serializado. Faça `JSON.parse` ao ler e `JSON.stringify` ao gravar.

**Upload de banner valida magic bytes**
Após salvar o arquivo, o service relê o buffer e valida o tipo real com `file-type`, apagando o arquivo se não for imagem. O mimetype do Multer sozinho não é confiável. Os arquivos são servidos em `/uploads` com CORP `cross-origin`.

**Autorização por dono do recurso**
Não há guards de permissão além do `JwtGuard`. A autorização é manual nos services, comparando `event.createdBy === userId` e lançando `ForbiddenException`. Replique esse padrão em rotas novas.

**Rotas de inscrições não têm prefixo de controller**
`RegistrationsController` usa `@Controller()` sem prefixo; cada rota declara o path completo.

---

## Endpoints da API

### Auth

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público — retorna JWT |
| GET | `/auth/me` | Autenticado |

### Eventos

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/events` | Autenticado — eventos do organizador |
| POST | `/events` | Autenticado |
| GET | `/events/:id` | Autenticado — somente dono |
| PUT | `/events/:id` | Autenticado — somente dono |
| DELETE | `/events/:id` | Autenticado — somente dono |
| POST | `/events/:id/banner` | Autenticado — multipart, campo `file` |
| GET | `/events/:id/payment-methods` | Autenticado |
| POST | `/events/:id/payment-methods` | Autenticado |
| DELETE | `/events/:id/payment-methods/:methodId` | Autenticado |
| GET | `/events/public/:slug` | Público |

### Rotas públicas (participante)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/public/events/:slug` | Dados do evento + formas de pagamento |
| POST | `/public/events/:slug/register` | Inscrição sem login (gera PIX quando há cobrança) |
| GET | `/public/payments/status/:registrationId` | Polling do status, com reconciliação no provider |
| POST | `/events/public/:slug/register` | Rota legada de inscrição pública |

### Inscrições

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/events/:eventId/registrations` | Autenticado — lista paginada |
| POST | `/events/:eventId/registrations` | Autenticado — inscrição manual |
| POST | `/registrations` | Autenticado |
| GET | `/registrations/search?q=` | Autenticado — busca global |
| PUT | `/registrations/:id` | Autenticado |
| PATCH | `/registrations/:id/cancel` | Autenticado — soft delete |
| GET | `/my-registrations` | Autenticado |

### Pagamentos

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/payments/pix/:registrationId` | Autenticado — gera cobrança PIX |
| GET | `/payments/status/:registrationId` | Autenticado |
| PATCH | `/payments/registrations/:registrationId/confirm-manual` | Autenticado — dono do evento |
| POST | `/payments/webhook/mercadopago` | Público — assinado |
| POST | `/payments/mock/:providerPaymentId/approve` | Só com `PAYMENT_PROVIDER=mock` |

### Credenciamento

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/events/:eventId/checkin/list` | Autenticado |
| GET | `/events/:eventId/checkin/stats` | Autenticado |
| GET | `/events/:eventId/checkin/by-code/:code` | Autenticado — leitura de QR |
| POST | `/events/:eventId/checkin/:registrationId` | Autenticado — check-in |
| DELETE | `/events/:eventId/checkin/:registrationId` | Autenticado — desfazer |
| GET | `/me/checkin/events` | Autenticado — eventos do voluntário |

### Ingressos

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/events/:eventId/tickets` | Autenticado |
| POST | `/events/:eventId/tickets` | Autenticado |

---

## Modelo de dados

```
User            — id, name, email, password, role (admin|organizer|user)
Event           — título, slug, categoria, datas, local, banner, maxParticipants,
                  formFields (JSON em String), isPublished, organizerPhone
EventVolunteer  — vincula um User a um Event como voluntário de credenciamento
EventPaymentMethod
                — type (pix|credit_card|debit_card|cash), value, installments,
                  description, janela de vigência
Ticket          — nome, preço, quantidade, vendidos
Registration    — userId, eventId, status (pending|confirmed|canceled|overbooked),
                  cpf, phone, birthDate, extraFields (JSON em String), code,
                  checkedIn/checkedInAt/checkedInBy, confirmationEmailSentAt
Payment         — 1:1 com Registration — amount, status (pending|paid|failed),
                  provider, providerPaymentId, qrCodeBase64, qrCodeCopiaECola, expiresAt
CheckinLog      — histórico de check_in / undo por inscrição
```

`status = overbooked` significa que o pagamento foi recebido mas a vaga esgotou no meio do caminho — aguarda reembolso manual.

---

## Rotas do frontend

### Público

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Autenticação (`/register` redireciona para cá) |
| `/evento/:slug` | Página pública do evento |
| `/evento/:slug/inscricao` | Formulário de inscrição |
| `/evento/:slug/pagamento-pix` | Pagamento PIX e confirmação da inscrição |

### Organizador (autenticado)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Visão geral |
| `/eventos` | Lista de eventos |
| `/events/new` | Wizard passo 1 — dados do evento |
| `/events/:id/setup/payment` | Wizard passo 2 — formas de pagamento |
| `/events/:id/setup/form` | Wizard passo 3 — campos do formulário |
| `/events/:id/setup/page` | Wizard passo 4 — banner e publicação |
| `/events/:id` | Painel de inscrições |
| `/events/:id/edit` | Editar evento |
| `/events/:id/registrations/new` | Inscrição manual |
| `/events/:id/registrations/:regId/edit` | Editar inscrição |
| `/buscar-inscricoes` | Busca global de inscritos |

### App de credenciamento (autenticado)

| Rota | Descrição |
|------|-----------|
| `/app/eventos` | Eventos disponíveis para credenciar |
| `/app/evento/:id` | Painel de check-in do evento |
| `/app/evento/:id/pesquisar` | Busca por nome/CPF |
| `/app/evento/:id/qrcode` | Leitor de QR code |

---

## Deploy no servidor

Produção roda em `/var/www/Event-Register`, com o backend sob PM2 e o frontend servido como build estático pelo Nginx.

### Acessar

```bash
ssh root@187.77.226.111
```

### Deploy completo

O script `/var/www/deploy.sh` faz o ciclo inteiro (pull, install, migrations, build do frontend, restart do PM2):

```bash
/var/www/deploy.sh
```

Na maioria dos casos é só isso. Os comandos abaixo servem para ajustes pontuais.

### Variáveis de ambiente

```bash
nano /var/www/Event-Register/backend/.env
nano /var/www/Event-Register/frontend/.env
```

Alterar o `.env` do backend exige `pm2 restart backend`. Alterar o do frontend exige **rebuild**, porque o Vite embute as variáveis no bundle em tempo de build.

### Backend (PM2)

```bash
pm2 status              # estado dos processos
pm2 restart backend     # reiniciar após mudar .env ou código
pm2 logs backend        # acompanhar logs em tempo real
```

### Frontend

```bash
cd /var/www/Event-Register/frontend && npm run build
```

O Nginx serve o conteúdo de `dist/` — não é preciso reiniciar nada depois do build.

### Nginx

```bash
nginx -t && systemctl restart nginx
```

Rode sempre o `nginx -t` antes: ele valida a configuração e evita derrubar o site com um restart em cima de um arquivo inválido.

### Migrations

Se o deploy incluir mudança de schema:

```bash
cd /var/www/Event-Register/backend
npx prisma migrate deploy
npx prisma generate
pm2 restart backend
```

Use `migrate deploy` em produção — nunca `migrate dev`, que pode resetar dados.

### Checklist rápido de troubleshooting

| Sintoma | O que verificar |
|---------|-----------------|
| Site fora do ar | `pm2 status` e `nginx -t` |
| Erro 502 | Backend caiu — `pm2 logs backend` |
| Frontend não reflete mudança | Faltou o `npm run build` |
| Erro de conexão com banco | `DATABASE_URL` no `.env` do backend |
| PIX não confirma | Webhook do Mercado Pago e `MERCADOPAGO_WEBHOOK_SECRET` |
| E-mail não chega | Variáveis `MAIL_*` — as falhas são silenciosas por design |

> Os arquivos `.env` vivem apenas no servidor e não são versionados. Não copie credenciais de produção para o repositório.

---

## O que ainda não está implementado

- Exportação em lote / relatórios de inscrições
- Sistema de roles e permissões (a autorização é feita manualmente por dono do recurso)
- Reembolso automático para inscrições `overbooked`
- Recuperação de senha
