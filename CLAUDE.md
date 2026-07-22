# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

`inscrições.app` — plataforma de gestão de eventos. Monorepo com duas apps independentes:

- `backend/` — API NestJS + Prisma + PostgreSQL (porta 3000)
- `frontend/` — SPA React 19 + Vite + Tailwind 4 (porta 5173)

Não há workspace raiz: cada pasta tem seu próprio `package.json`. Sempre rode os comandos a partir de `backend/` ou `frontend/`.

## Comandos

### Backend (`cd backend`)

```bash
npm run start:dev        # API em watch mode (porta 3000)
npm run build            # nest build → dist/
npm run lint             # eslint --fix sobre src/, test/
npm test                 # jest (unit, arquivos *.spec.ts em src/)
npm test -- auth.service # roda um único arquivo de teste por nome parcial
npm run test:watch
npm run test:cov
npm run test:e2e         # jest com test/jest-e2e.json
npm run seed             # tsx prisma/seed.ts — usuário admin + eventos de exemplo

npx prisma migrate dev   # aplica/gera migrations
npx prisma generate      # regenera o client em generated/prisma (ver abaixo)
```

### Frontend (`cd frontend`)

```bash
npm run dev              # Vite dev server (porta 5173)
npm run build            # tsc -b && vite build
npm run lint             # eslint .
```

## Particularidades da arquitetura (leia antes de mexer)

### Prisma client gerado fora de node_modules
O client é gerado em `backend/generated/prisma` (ver `generator client` no schema), **não** em `@prisma/client`. Após qualquer mudança no schema, rode `npx prisma generate`. Imports do client usam `../../generated/prisma/client.js`.

### Acesso ao banco é via `PrismaService.db`, não pelo próprio service
`PrismaService` (`src/prisma/prisma.service.ts`) **não** estende `PrismaClient` — ele expõe o client na propriedade `.db`. Sempre `this.prisma.db.user.findUnique(...)`, nunca `this.prisma.user...`. A conexão usa o driver adapter `@prisma/adapter-pg` com `DATABASE_URL`.

### Prisma 7 — config fora do schema
A `datasource` no `schema.prisma` não tem `url`. A URL vem de `prisma.config.ts` (CLI) e do adapter em runtime, ambos lendo `process.env.DATABASE_URL`. Não adicione `url`/`env(...)` ao schema.

### ESM com extensões `.js` explícitas
O backend é ESM (`"type": "module"`). Todos os imports relativos terminam em `.js` mesmo apontando para arquivos `.ts` (ex.: `import { AppModule } from './app.module.js'`). Mantenha esse padrão em arquivos novos.

### Testes mockam o Prisma client
`jest` mapeia qualquer import de `generated/prisma/client` para `src/__mocks__/prisma-client.ts` (ver `moduleNameMapper` no `package.json`). Os specs usam um `PrismaClient` falso; testes de service tipicamente injetam um mock de `PrismaService`. Não dependa de DB real em testes unitários.

### Participantes não são usuários autenticados
Inscrições (públicas e via organizador) exigem `Registration.userId`, mas inscritos não têm conta. Em `createPublic` / `createByOrganizer`, o service procura um `User` por email e, se não existir, **cria um User "sombra"** com senha aleatória (bcrypt de `randomBytes`). Editar o nome de uma inscrição atualiza o `User` vinculado. Considere isso ao mexer em inscrições ou na tabela `User`.

### Regras de negócio em inscrições
- Checagens de capacidade (`maxParticipants`) e dedup de CPF rodam dentro de `$transaction` com `isolationLevel: 'Serializable'`.
- Dedup de CPF é por evento, ignorando inscrições `canceled`.
- Cancelamento é soft (status `canceled`), nunca delete.
- E-mail de confirmação é disparado com `void this.mail.send...` (fire-and-forget, não bloqueia a resposta).

### Campos dinâmicos são JSON em coluna String
`Event.formFields` e `Registration.extraFields` são `String?` no schema, armazenando JSON serializado com `JSON.stringify`. Faça parse ao ler e stringify ao gravar — não são colunas JSON nativas.

### Upload de banner valida magic bytes
`POST /events/:id/banner` usa Multer (disk storage em `backend/uploads/`, limite 5 MB) e, **após** salvar, relê o arquivo e valida o tipo real com `file-type` (`fileTypeFromBuffer`), apagando o arquivo se não for imagem válida. O mimetype do Multer sozinho não é confiável. Arquivos são servidos estaticamente em `/uploads` com CORP `cross-origin` (Helmet).

### Autorização por dono do recurso
Não há sistema de roles/guards por permissão além do `JwtGuard`. A autorização é feita manualmente nos services comparando `event.createdBy === userId` (lança `ForbiddenException`). Replique esse padrão em novas rotas que tocam dados de um evento.

### Rotas de Registrations não têm prefixo de controller
`RegistrationsController` usa `@Controller()` sem prefixo; cada rota declara o path completo (ex.: `events/:eventId/registrations`, `my-registrations`, `registrations/search`). Rotas públicas (sem `JwtGuard`): `POST /events/public/:slug/register` e `GET /events/public/:slug`.

## Frontend

- Estado de auth global em `src/store/auth.store.ts` (Zustand); o token persiste em `localStorage` e é reidratado no init do store.
- `src/api/axios.ts` é o client HTTP único; um interceptor injeta `Authorization: Bearer <token>` do `localStorage` e outro faz logout + redirect para `/login` em qualquer 401. A baseURL vem de `VITE_API_URL` (fallback `http://localhost:3000`) e é exportada como `API_BASE_URL` — use-a para montar URLs de `/uploads`.
- Rotas em `src/pages/`; criação de evento é um wizard de 4 etapas (`CreateEvent` → `EventSetupPayment` → `EventSetupForm` → `EventSetupPage`).
- `ProtectedRoute` guarda rotas autenticadas.

## Configuração

`backend/.env` precisa de `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` e as variáveis SMTP da Brevo (`MAIL_*`). Sem `MAIL_*`, o envio de e-mail falha silenciosamente (fire-and-forget) mas não quebra a inscrição. Detalhes completos no `README.md`.
