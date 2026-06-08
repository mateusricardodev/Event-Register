# inscrições.app

Plataforma de gerenciamento de eventos religiosos — criação de eventos, formulários personalizados, inscrições públicas e painel do organizador.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | NestJS · TypeScript · Prisma ORM · PostgreSQL |
| Frontend | React 19 · Vite · TypeScript · Tailwind CSS 4 · Zustand · React Router DOM 7 |
| Autenticação | JWT (passport-jwt) |
| E-mail | Brevo SMTP (nodemailer) |
| Upload | Multer · disk storage local |

---

## Funcionalidades

- Cadastro e login com JWT
- Criação de eventos via wizard de 4 etapas (info → pagamento → formulário → página pública)
- Upload de banner (JPG/PNG/GIF/WebP, máx. 5 MB) com validação de magic bytes
- Formulário público de inscrição sem autenticação (`/evento/:slug/inscricao`)
- Campos de formulário configuráveis por evento (CPF, celular, endereço, etc.)
- Envio automático de e-mail de confirmação ao inscrito
- Painel do organizador: listagem, busca global, edição e cancelamento de inscrições
- Inscrição manual pelo organizador
- Controle de capacidade por `maxParticipants`
- Rate limiting e headers de segurança (Helmet)
- Métodos de pagamento configuráveis (fluxo mock — sem gateway real)

---

## Estrutura do projeto

```
projeto/
├── backend/      # API NestJS (porta 3000)
└── frontend/     # App React/Vite (porta 5173)
```

### Módulos do backend

```
src/
├── auth/           # JWT, login, register, /me
├── events/         # CRUD de eventos + upload de banner + métodos de pagamento
├── registrations/  # Inscrições públicas e do organizador
├── payments/       # Pagamentos (mock)
├── tickets/        # Ingressos
├── mail/           # Envio de e-mail via Brevo
└── prisma/         # PrismaService compartilhado
```

---

## Pré-requisitos

- Node.js 20+
- PostgreSQL 15+
- Conta Brevo (para e-mail) — opcional em desenvolvimento

---

## Configuração

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/inscricoes"

JWT_SECRET="troque-por-valor-seguro"

FRONTEND_URL="http://localhost:5173"

# Brevo SMTP
MAIL_HOST="smtp-relay.brevo.com"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER="seu@email.com"
MAIL_PASS="sua-chave-brevo"
MAIL_FROM="noreply@inscricoes.app"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL="http://localhost:3000"
```

---

## Como rodar

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed          # cria usuário admin + 2 eventos de exemplo
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse em `http://localhost:5173`.

---

## Endpoints da API

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Criar conta |
| POST | `/auth/login` | Login (retorna JWT) |
| GET | `/auth/me` | Dados do usuário autenticado |

### Eventos

| Método | Rota | Acesso |
|--------|------|--------|
| GET | `/events` | Autenticado — lista do organizador |
| POST | `/events` | Autenticado — criar evento |
| GET | `/events/:id` | Autenticado |
| PUT | `/events/:id` | Autenticado — somente criador |
| DELETE | `/events/:id` | Autenticado — somente criador |
| POST | `/events/:id/banner` | Autenticado — upload multipart `file` |
| GET/POST/DELETE | `/events/:id/payment-methods` | Autenticado |
| GET | `/events/public/:slug` | Público — info do evento |

### Inscrições

| Método | Rota | Acesso |
|--------|------|--------|
| POST | `/events/public/:slug/register` | Público — inscrição sem login |
| GET | `/events/:eventId/registrations` | Autenticado — lista paginada |
| POST | `/events/:eventId/registrations` | Autenticado — inscrição manual |
| GET | `/registrations/search?q=` | Autenticado — busca global |
| PUT | `/registrations/:id` | Autenticado — editar |
| PATCH | `/registrations/:id/cancel` | Autenticado — cancelar |
| GET | `/my-registrations` | Autenticado — inscrições do usuário |

### Pagamentos

| Método | Rota |
|--------|------|
| POST | `/payments` |

---

## Modelo de dados (resumo)

```
User          — id, name, email, password, role (admin|organizer|user)
Event         — id, title, slug, category, date(s), location, bannerUrl,
                maxParticipants, formFields (JSON), isPublished, paymentMethods
Registration  — id, eventId, name, email, cpf, phone?, birthDate?,
                extraFields (JSON), status (pending|confirmed|canceled)
Payment       — id, registrationId, amount, status, provider
Ticket        — id, eventId, name, price, quantity
```

---

## Rotas do frontend

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública |
| `/login` · `/register` | Autenticação |
| `/evento/:slug` | Página pública do evento |
| `/evento/:slug/inscricao` | Formulário de inscrição público |
| `/dashboard` | Lista de eventos do organizador |
| `/events/new` | Criar evento (wizard step 1) |
| `/events/:id/setup/payment` | Wizard step 2 — formas de pagamento |
| `/events/:id/setup/form` | Wizard step 3 — campos do formulário |
| `/events/:id/setup/page` | Wizard step 4 — publicar + banner |
| `/events/:id` | Painel de inscrições |
| `/events/:id/registrations/new` | Inscrição manual |
| `/events/:id/registrations/:regId/edit` | Editar inscrição |
| `/buscar-inscricoes` | Busca global de inscritos |

---

## O que ainda não está implementado

- Processamento real de pagamento (fluxo de UI existe, sem gateway)
- Exportação em lote / relatórios de inscrições
