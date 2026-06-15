# CODE_REVIEW.md — Auditoria pré-produção

**Projeto:** inscrições.app (SaaS de eventos/credenciamento)
**Data:** 2026-06-14
**Revisor:** QA Sênior + Application Security Review
**Escopo:** `backend/src`, `frontend/src`, `backend/prisma`

> Esta fase é **somente auditoria**. Nenhum código foi alterado. As correções aguardam aprovação.

---

## 1. Resumo executivo

**Pronto para produção? NÃO.**

A base é organizada e tem pontos positivos relevantes (validação de magic-bytes no upload, `Decimal` para dinheiro, `ValidationPipe` com whitelist, check-in atômico/idempotente, valor do pagamento calculado no servidor, 61 testes unitários de service). Porém há bloqueadores que impedem o deploy:

1. **Bloqueador de deploy:** o frontend tem a URL da API **hardcoded** em `localhost:3000` — o app não conversa com o backend em produção.
2. **Vazamento multi-tenant (IDOR de leitura):** qualquer usuário autenticado lê eventos e tickets de **outra organização** trocando o id na URL.
3. **LGPD:** CPF, telefone, data de nascimento e e-mail em **texto puro**, retornados **sem máscara** e com **PII em logs**.
4. **Integridade de estoque sob concorrência** não comprovada (depende de comportamento não verificado do adapter Prisma; sem retry).
5. **Sem validação de ambiente / fail-fast** do `JWT_SECRET` — risco de deploy com auth quebrada/forjável.

Recomendação: tratar os itens **Críticos** e o **Top 10** antes de qualquer ambiente exposto.

---

## 2. Achados por severidade

### 🔴 CRÍTICO

#### C1 — IDOR de leitura: evento de qualquer organização
- **Local:** `backend/src/events/events.controller.ts:43-47` → `backend/src/events/events.service.ts:29-43`
- **Problema:** `GET /events/:id` tem só `JwtGuard`; `findOne` não valida `createdBy`/dono.
- **Risco:** Org A lê dados de evento da Org B (título, local, `maxParticipants`, organizador, contadores) só sabendo/adivinhando o id.
- **Correção:** validar `event.createdBy === userId` (ou vínculo) em `findOne`, como já é feito em `update/remove`.

#### C2 — Listagem de tickets totalmente pública
- **Local:** `backend/src/tickets/tickets.controller.ts:11-14`
- **Problema:** `GET /events/:eventId/tickets` **sem `JwtGuard`**; retorna tickets + `_count.registrations`.
- **Risco:** exposição de preços e **número de vendas/inscritos** de qualquer evento, sem login.
- **Correção:** aplicar `JwtGuard` + checagem de dono, ou expor só o necessário via rota pública por slug.

#### C3 — LGPD: PII em texto puro, sem máscara e em logs
- **Locais:**
  - Armazenamento plaintext: `backend/prisma/schema.prisma` (`Registration.cpf/phone/birthDate`, `User.email`).
  - CPF completo em respostas: `backend/src/registrations/registrations.service.ts:75-88` (findByEvent), `:249-271` (search), `backend/src/checkin/checkin.service.ts:59-73` (`mapRegistration` → list/by-code).
  - PII em log: `backend/src/mail/mail.service.ts:53,55` (loga `participantEmail`).
- **Risco:** exposição de dados pessoais sensíveis; multiplicada por C1/C2 e por vazamento de log; não-conformidade LGPD.
- **Correção:** mascarar CPF nas respostas (ex.: `***.***.**9-00`), retornar CPF completo só onde estritamente necessário (e logar quem acessou), remover e-mail/CPF de logs, e planejar **criptografia em repouso** (ou ao menos hashing/tokenização do CPF para busca).

---

### 🟠 ALTO

#### A1 — Integridade de estoque de ingressos sob concorrência
- **Locais:** `backend/src/registrations/registrations.service.ts:32-46` (auto-inscrição), `:97-131` (organizador, `maxParticipants`), `:200-235` (público).
- **Problema:** padrão `count` → `create` dentro de `$transaction(..., { isolationLevel: 'Serializable' as never })`. Dois pontos frágeis:
  1. O cast `as never` força o tipo; **não há garantia** de que o driver `@prisma/adapter-pg` honra o nível Serializable. Se cair para READ COMMITTED, a corrida volta a permitir **vender mais ingressos que o estoque**.
  2. **Sem retry** em `serialization_failure (40001)` → sob concorrência, comprador legítimo recebe **500** em vez de "esgotado".
- **Cobertura atual:** `registrations.service.spec.ts:195-206` só verifica que a *opção* é passada (mock), **não** o comportamento real.
- **Risco:** overselling de ingressos **ou** 500 sob disputa.
- **Correção:** restrição no banco (ex.: contador atômico com `CHECK`, ou unique parcial), ou `SELECT ... FOR UPDATE` na linha de estoque; adicionar retry no 40001; cobrir com teste de concorrência real (ver §4).

#### A2 — JWT/Sessão: sem validação de ambiente, sem refresh, token em localStorage
- **Locais:** `backend/src/auth/auth.module.ts:11-14` (secret do env, `expiresIn: '7d'`), `backend/src/app.module.ts:13` (`ConfigModule.forRoot` **sem** `validationSchema`), `frontend/src/store/auth.store.ts:19,21` (token em `localStorage`), `frontend/src/api/axios.ts:7-13` (sem interceptor de resposta 401).
- **Risco:** se `JWT_SECRET` vier vazio em produção, tokens são assinados com segredo indefinido → **forjáveis**. Token de 7 dias em `localStorage` é exfiltrável por XSS (account takeover prolongado). Expiração de sessão não tratada no front (telas quebram silenciosamente).
- **Correção:** validar env no boot (Joi/zod) e **fail-fast**; reduzir expiração + refresh token; interceptor 401 → logout/redirect; idealmente token httpOnly.

#### A3 — Rate limiting frouxo em superfícies sensíveis
- **Local:** `backend/src/app.module.ts:15` (`ThrottlerModule` global, 60 req/min).
- **Problema:** sem limite específico para `POST /auth/login`, `POST /auth/register`, `POST /events/public/:slug/register` e endpoints de check-in. 60/min por IP permite brute-force de senha e abuso de inscrição/credenciamento.
- **Correção:** `@Throttle` dedicado (ex.: 5–10/min) nessas rotas; considerar bloqueio progressivo no login.

#### A4 — Injeção de HTML no e-mail de confirmação
- **Local:** `backend/src/mail/mail.service.ts:94,109,116,132` (interpola `participantName`, `eventTitle`, `eventLocation`, `registrationId` direto no HTML).
- **Problema:** dados controlados pelo participante (nome, na inscrição pública) entram no HTML **sem escaping**.
- **Risco:** injeção de HTML/conteúdo de phishing no e-mail enviado em nome da plataforma.
- **Correção:** escapar todos os campos interpolados (helper de HTML-escape) ou usar template engine com escaping automático.

---

### 🟡 MÉDIO

#### M1 — Validação inconsistente de CPF
- **Local:** `backend/src/registrations/dto/update-registration.dto.ts:8-10` (cpf só `@IsString`).
- **Problema:** criação valida CPF (`@IsCpf`), atualização não. Permite gravar CPF inválido via `PUT /registrations/:id`.
- **Correção:** aplicar `@IsCpf` também no update.

#### M2 — `birthDate` sem validação de data
- **Local:** `create-registration-organizer.dto.ts:26-27`, `update-registration.dto.ts:16-18` (`@IsString`).
- **Problema:** `new Date(dto.birthDate)` (registrations.service.ts:127,167,230) pode gerar `Invalid Date` gravado no banco.
- **Correção:** `@IsDateString` + checagem de intervalo plausível.

#### M3 — `formFields`/`extraFields` como `String` JSON sem validação
- **Locais:** `schema.prisma` (`Event.formFields`, `Registration.extraFields`), `create-registration-organizer.dto.ts:33-35` (`@IsObject` genérico).
- **Problema:** sem schema/limite de tamanho/chaves; perde queryability e integridade; risco de payload abusivo.
- **Mitigação existente:** o front não usa `dangerouslySetInnerHTML` (React escapa) → XSS no web é baixo. O vetor real é o e-mail (A4).
- **Correção:** validar estrutura/limites; avaliar coluna `Json` ou modelo relacional para campos de formulário.

#### M4 — Auto-inscrição sem checagens de invariante
- **Local:** `backend/src/registrations/registrations.service.ts:23-46`.
- **Problema:** não verifica `event.isPublished` nem duplicidade (mesmo usuário pode se inscrever várias vezes no mesmo ticket; só os fluxos organizador/público checam CPF duplicado).
- **Correção:** checar `isPublished` e impedir duplicidade (idealmente unique no banco — ver M7).

#### M5 — Erros silenciados no frontend (admin)
- **Local:** `frontend/src/pages/EventDetail.tsx:61` (`.catch(() => {})`).
- **Problema:** falha de carregamento não exibe feedback → tela em branco/estado preso. Páginas admin em geral não têm UI de erro (só a área `/app` nova trata).
- **Correção:** estado de erro + retry nas chamadas; padronizar um wrapper de fetch.

#### M6 — Índices e constraints faltando (Prisma)
- **Local:** `backend/prisma/schema.prisma`.
- **Faltam:** índices em `Registration.eventId` (filtrado em quase tudo), `Registration.cpf` (busca `contains`), `Registration.checkedIn`, `Registration.ticketId`. (`code` e `slug` já são `@unique` — ok.)
- **Correção:** `@@index([eventId, status])`, `@@index([eventId, checkedIn])`, índice para busca por CPF.

#### M7 — Sem unicidade de inscrição no banco
- **Local:** `schema.prisma` (`Registration`).
- **Problema:** dedup só em app (e ausente na auto-inscrição). Sob corrida, dois inserts duplicados passam.
- **Correção:** unique parcial `(eventId, cpf)` / `(eventId, userId)` ignorando `canceled`.

#### M8 — `onDelete` manual e frágil
- **Local:** `backend/src/events/events.service.ts:119-133` (cascata feita à mão; já precisou incluir `checkinLog`/`eventVolunteer`).
- **Risco:** esquecer uma tabela nova quebra o delete em runtime.
- **Correção:** declarar `onDelete: Cascade` nas relações no schema e deixar o banco garantir.

#### M9 — Filtro global não loga erros inesperados
- **Local:** `backend/src/common/filters/http-exception.filter.ts:10-31`.
- **Positivo:** não vaza stack trace ao cliente (retorna 500 genérico).
- **Gap:** não há log do erro original (observabilidade). 500 viram caixa-preta.
- **Correção:** logar exceções não-HTTP (com requestId), sem PII.

---

### 🔵 BAIXO

- **B1 — CORS com `credentials:true` desnecessário:** `backend/src/main.ts:18-21`. Origem já restrita a `FRONTEND_URL` (bom); como a auth é Bearer (não cookie), `credentials:true` é supérfluo. Ajustar por higiene.
- **B2 — `.env` versionado?** Não — confirmado `git check-ignore` cobre `backend/.env` (ok). Manter `.env.example` documentado.
- **B3 — Sem testes de controller/guard (integração):** só specs de service. Guards e ownership não são exercitados ponta-a-ponta.
- **B4 — Mensagens/Status:** consistentes via exceptions do Nest; sem achados de status incorreto.

---

## 3. Top 10 — DEVE ser corrigido antes de qualquer deploy (em ordem)

| # | Item | Severidade | Local |
|---|------|-----------|-------|
| 1 | URL da API hardcoded no front (app não funciona em prod) | Bloqueador | `frontend/src/api/axios.ts:4` |
| 2 | Validação de env + fail-fast de `JWT_SECRET`/`DATABASE_URL` | Alto/Crít. | `backend/src/app.module.ts:13` |
| 3 | IDOR leitura de evento (validar dono) | Crítico | `events.controller.ts:43-47` |
| 4 | Tickets `GET` público (aplicar guard) | Crítico | `tickets.controller.ts:11-14` |
| 5 | LGPD: mascarar CPF nas respostas + tirar PII de logs | Crítico | `registrations.service.ts`, `checkin.service.ts`, `mail.service.ts:53,55` |
| 6 | Estoque de ingressos: constraint atômica no banco + retry + teste de concorrência | Alto | `registrations.service.ts:32-46` |
| 7 | Rate limit dedicado em login/registro/inscrição pública/check-in | Alto | `app.module.ts:15` |
| 8 | Front: tratar 401 (auto-logout/redirect); reduzir validade do token | Alto | `frontend/src/api/axios.ts` |
| 9 | Escapar HTML do e-mail de confirmação | Alto | `mail.service.ts:94,109,116,132` |
| 10 | Índices + unique no `Registration` (eventId/cpf/code/checkedIn; unique de duplicidade) | Médio | `schema.prisma` |

---

## 4. Plano de testes proposto

### 4.1 Unitários (faltantes / a reforçar)
- **Auth:** senha incorreta, e-mail duplicado, `/me` com token inválido. (parcial em `auth.service.spec.ts`)
- **Eventos/ownership:** `findOne` deve barrar não-dono (após correção C1); update/delete por terceiros.
- **Registrations:** `update` rejeita CPF inválido (M1); `birthDate` inválido (M2); auto-inscrição em evento não publicado (M4).
- **Check-in:** já coberto (idempotência/autorização em `checkin.service.spec.ts`). Manter.

### 4.2 Integração / e2e (hoje só há stub em `backend/test/app.e2e-spec.ts`)
- **Multi-tenant:** Org A não acessa `GET /events/:id`, tickets, registrations, check-in da Org B (cobre C1/C2 e revalida os já protegidos).
- **Auth e2e:** login → token → rota protegida → expiração → 401.
- **Pagamento:** valor vem do servidor (`ticket.price`), não do cliente; bloqueio de pagamento duplicado.
- **Inscrição pública:** respeita `maxParticipants` e `isPublished`.

### 4.3 Teste de concorrência (DEVE falhar hoje — prova a A1)
Disparar inscrições em paralelo contra um ticket com estoque menor que o nº de requisições e verificar a invariante. Esboço (e2e, banco real):

```ts
// pseudo-e2e: ticket.quantity = 5, 20 inscrições simultâneas
const results = await Promise.allSettled(
  Array.from({ length: 20 }, () =>
    request(app).post('/events/public/EVT/register').send(novoInscrito()),
  ),
);
const ok = results.filter(r => r.status === 'fulfilled' && r.value.status === 201).length;
const confirmados = await prisma.registration.count({
  where: { ticketId: 'TICKET', status: { not: 'canceled' } },
});

expect(confirmados).toBeLessThanOrEqual(5); // hoje pode FALHAR (oversell) ...
expect(ok).toBe(5);                          // ... ou retornar 500 em vez de "esgotado"
```
Resultado esperado pós-correção: exatamente 5 confirmados, demais com 4xx "esgotado" (nunca 500, nunca >5).

---

## 5. Quick wins (baixo esforço, alto impacto)
1. `frontend/src/api/axios.ts:4` → `baseURL: import.meta.env.VITE_API_URL` (destrava prod). **(#1 do Top 10)**
2. `JwtGuard` em `tickets.controller.ts:11-14`.
3. `@IsCpf` no `update-registration.dto.ts`; `@IsDateString` no `birthDate`.
4. Remover `participantEmail` dos logs em `mail.service.ts:53,55` (ou mascarar).
5. `@@index([eventId, status])` e `@@index([eventId, checkedIn])` em `schema.prisma`.
6. `@Throttle({ default: { limit: 5, ttl: 60000 } })` em `auth.controller` (login/register).
7. Helper `escapeHtml()` aplicado nos campos do `mail.service`.
8. Validação de env no boot (`ConfigModule.forRoot({ validationSchema })`).

---

### Pontos positivos (manter)
- Upload de banner: validação de magic-bytes + limite 5MB + filename seguro (`events.controller.ts:94-128`).
- Dinheiro em `Decimal` (não Float) no schema.
- `ValidationPipe` com `whitelist` + `forbidNonWhitelisted` (`main.ts:25-27`).
- Pagamento calcula `amount` no servidor a partir de `ticket.price` (`payments.service.ts:36`).
- Check-in atômico/idempotente com log de auditoria (`checkin.service.ts:136-219`).
- Helmet habilitado (`main.ts:16`).
