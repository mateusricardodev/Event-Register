# REVIEW.md — Revisão geral do código (Ecclesio)

**Data:** 2026-07-22 · **Escopo:** backend + frontend, exceto módulo de check-in mobile (`backend/src/checkin`, `frontend/src/app`) conforme solicitado.

---

## 1. Resumo geral

**Nota: 7/10**

O código é consistentemente bom: ESM disciplinado, DTOs com class-validator em quase tudo, transações serializáveis nos pontos de corrida, idempotência no webhook/e-mail, upload com validação de magic bytes, autorização por dono replicada com padrão claro. Não há `any` fora de specs, não há `console.log` de debug espalhado, não há TODO/FIXME pendente, não há mistura camelCase/snake_case.

O que derruba a nota: **uma rota legada pública que permite inscrição confirmada grátis em evento pago**, um endpoint de evento sem checagem de dono, a janela de vigência dos lotes de pagamento que nunca é validada, e métricas financeiras erradas no dashboard. São problemas pontuais e todos de correção barata.

---

## 2. Problemas encontrados

### 🔴 Críticos (corrigir antes de lançar)

#### C1 — Rota pública legada permite inscrição confirmada sem pagar
- **Arquivo:** `backend/src/registrations/registrations.controller.ts:75` → `registrations.service.ts:202` (`createPublic`)
- **Problema:** `POST /events/public/:slug/register` (sem guard, correto para rota pública) cria a inscrição com `status: 'confirmed'` **sem passar pelo fluxo de pagamento**, sem exigir `paymentMethodId`, sem checar data de encerramento e sem o throttle reforçado. É a rota antiga, anterior ao fluxo PIX — o frontend hoje só usa `POST /public/events/:slug/register`. Qualquer pessoa que descubra a rota (ela está inclusive documentada no README) se inscreve de graça em evento pago.
- **Correção:** remover a rota e o método `createPublic` do `RegistrationsService` (e os specs/e2e que os cobrem). Se quiser manter compatibilidade, fazer a rota delegar para `PublicService.register`.

#### C2 — `GET /events/:id` não valida dono do recurso
- **Arquivo:** `backend/src/events/events.controller.ts:44` → `events.service.ts:34` (`findOne`)
- **Problema:** único endpoint de evento autenticado **sem** `checkOwnership`. Qualquer usuário logado (inclusive um "user sombra" que trocar a senha... ou outro organizador) lê evento alheio trocando o ID: título, formFields, métodos de pagamento, contagem de inscritos, e **e-mail do organizador**. Vaza dados entre tenants.
- **Correção:** passar `user.id` do controller e validar `event.createdBy !== userId → ForbiddenException`, como nos demais métodos.

#### C3 — Janela de vigência das modalidades de pagamento é ignorada
- **Arquivos:** `backend/src/public/public.service.ts:41` (listagem) e `:95` (register)
- **Problema:** `EventPaymentMethod` tem `startDate`/`endDate` (o wizard coleta e exibe como "lote"), mas nem `findEventBySlug` filtra métodos fora da vigência, nem `register()` valida a janela ao aceitar o `paymentMethodId`. Um lote promocional expirado continua comprável pelo preço antigo — inclusive por chamada direta à API com o ID do método antigo.
- **Correção:** na listagem pública, filtrar `(startDate == null OR startDate <= now) AND (endDate == null OR endDate >= now)`; no `register()`, revalidar a mesma condição e lançar `BadRequestException('Esta modalidade não está mais disponível')`.

---

### 🟡 Importantes (corrigir em breve)

#### I1 — Dashboard soma receita de pagamentos NÃO pagos
- **Arquivo:** `frontend/src/pages/Dashboard.tsx:80`
- **Problema:** `revenue` soma `payment.amount` de qualquer inscrição com payment, incluindo `pending` e `failed`. "Total arrecadado" mostra dinheiro que não entrou.
- **Correção:** `r.payment?.status === 'paid' ? Number(r.payment.amount) : 0`.

#### I2 — Métricas calculadas só sobre a 1ª página (50 inscrições)
- **Arquivos:** `frontend/src/pages/Dashboard.tsx:52-66` e `frontend/src/pages/EventDetail.tsx:62-69`
- **Problema:** ambos buscam `GET /events/:id/registrations` sem `limit`, que pagina em 50. Evento com 200 inscritos mostra contadores e listagem truncados em 50, sem indicação. O Dashboard ainda faz N+1 (uma chamada por evento).
- **Correção:** curto prazo, `?limit=1000`; correto, endpoint agregado de estatísticas no backend (`/events/:id/stats` já existe no checkin como referência de padrão) e paginação real na tabela do EventDetail.

#### I3 — Retry de PIX apaga o pagamento anterior fora de transação
- **Arquivo:** `backend/src/payments/payments.service.ts:43-67`
- **Problema:** `payment.delete` → chamada ao provider → `payment.create`. Se o provider falhar no meio, o Payment antigo (com QR ainda válido) já foi destruído e a inscrição fica sem registro de pagamento. Dois retries simultâneos também podem gerar dois PIX no provider.
- **Correção:** criar o novo PIX no provider primeiro e só então, numa transação, deletar o antigo e gravar o novo. Guardar o `providerPaymentId` antigo para cancelamento best-effort no MP.

#### I4 — Assinatura do webhook só é validada se o header vier
- **Arquivo:** `backend/src/payments/payments.controller.ts:86`
- **Problema:** `if (secret && xSignature)` — uma requisição **sem** `x-signature` pula a validação mesmo com secret configurado. O impacto real é contido (o status é consultado na API do MP, não confiado do body), mas o gate de segurança fica decorativo.
- **Correção:** quando `secret` estiver configurado, exigir assinatura: sem header ou inválida → retorna 200 e ignora.

#### I5 — CPF sem normalização nas rotas do organizador
- **Arquivos:** `backend/src/registrations/registrations.service.ts:109, 169, 218`
- **Problema:** `public.service` normaliza (`cpf.replace(/\D/g,'')`), mas `createByOrganizer`, `update` e `createPublic` gravam/dedupam o CPF como veio no body. Via API, `"529.982.247-25"` e `"52998224725"` coexistem e o dedup por evento falha entre formatos.
- **Correção:** normalizar no service (ou num transformer do DTO) antes de qualquer busca/gravação.

#### I6 — `CreatePaymentMethodDto` aceita `value` sem tipo e `type` livre
- **Arquivo:** `backend/src/events/dto/create-payment-method.dto.ts`
- **Problema:** `value` só tem `@IsOptional()` — aceita string ou negativo (string → 500 do Prisma; negativo → modalidade tratada como grátis). `type` é string livre em vez de whitelist.
- **Correção:** `@IsNumber() @Min(0)` em `value`; `@IsIn(['pix','credit_card','debit_card','cash'])` em `type`. Idem `UpdateRegistrationDto.cpf` → adicionar `@IsCpf()`.

#### I7 — Upload de banner deixa arquivo órfão quando o dono é outro
- **Arquivo:** `backend/src/events/events.controller.ts:113-127`
- **Problema:** o Multer grava o arquivo em disco **antes** do `checkOwnership` (que roda dentro do service). Um usuário autenticado qualquer pode encher o disco postando banners em eventos alheios: recebe 403, mas o arquivo fica em `uploads/`.
- **Correção:** deletar `file.path` no catch do controller (ou checar ownership antes de aceitar o upload).

#### I8 — Erros engolidos silenciosamente no fluxo do organizador
- **Arquivos:** `frontend/src/pages/EventSetupPayment.tsx:45-67` (`handleAdd` com try/finally **sem catch**, `handleRemove` sem tratamento), `frontend/src/pages/EventDetail.tsx:71-80` (`handleCancel` idem) e `EventDetail.tsx:67` (`.catch(() => {})` na carga — falha deixa a página em "..." sem mensagem).
- **Problema:** falha de rede/validação → unhandled rejection, o usuário clica e nada acontece.
- **Correção:** catch com estado de erro visível em cada handler; na carga do EventDetail, estado `loadError` com mensagem e botão de retry.

#### I9 — Nenhum índice no schema do Prisma
- **Arquivo:** `backend/prisma/schema.prisma`
- **Problema:** só existem os `@unique`. As consultas quentes fazem scan: dedup `(eventId, cpf, status)` dentro da transação serializável (mais scan ⇒ mais falso conflito de serialização), webhook por `Payment.providerPaymentId`, listagens por `Registration.eventId` / `userId`, dashboard por `Event.createdBy`.
- **Correção:** `@@index([eventId, status])` e `@@index([eventId, cpf])` em Registration, `@@index([userId])` em Registration, `@index` em `Payment.providerPaymentId`, `@@index([createdBy])` em Event + migration.

#### I10 — Login sem rate-limit específico
- **Arquivo:** `backend/src/auth/auth.controller.ts:17`
- **Problema:** só vale o throttle global de 60 req/min — dá para testar 86k senhas/dia por IP.
- **Correção:** `@Throttle({ default: { limit: 5, ttl: 60000 } })` no login (o cadastro público já usa esse padrão em `public.controller.ts:16`).

---

### 🟢 Menores (melhorar quando puder)

| # | Item | Arquivo | Nota |
|---|------|---------|------|
| M1 | `Register.tsx` morto (242 linhas) — `/register` redireciona para `/login` e a página nunca é importada | `frontend/src/pages/Register.tsx` | Deletar |
| M2 | Módulo `tickets` + `POST /registrations` são legado do modelo antigo, sem uso pelo frontend | `backend/src/tickets/*`, `registrations.controller.ts:14` | Confirmar e remover junto com C1 |
| M3 | try/catch com `console.error` + rethrow imediato (sem efeito além do log duplicado) | `backend/src/auth/auth.service.ts:21-41` | Remover o try/catch |
| M4 | CORS com IP da VPS e URL antiga do Vercel hardcoded | `backend/src/main.ts:18-26` | Mover tudo para `FRONTEND_URL` (já aceita lista) |
| M5 | Frontend não valida dígito verificador de CPF — usuário só descobre no submit, com a mensagem crua da API | `PublicRegistration.tsx`, `NewRegistration.tsx`, `EditRegistration.tsx` | Replicar o algoritmo de `is-cpf.validator.ts` num util compartilhado e validar no blur |
| M6 | Hard delete de evento apaga inscrições/pagamentos em cascata, sem confirmação forte na UI | `backend/src/events/events.service.ts:121` | Considerar soft-delete ou exigir digitação do nome do evento |
| M7 | Bundle principal com 893 kB — jsPDF/html2canvas entram no chunk inicial | `frontend/src/pages/PixPayment.tsx:3-5` | `import()` dinâmico ao clicar em "Baixar ingresso" |
| M8 | `GET /public/payments/status/:id` sem throttle específico (polling a cada 4 s por cliente é ok, mas é endpoint público que dispara reconciliação no provider) | `public.controller.ts:23` | `@Throttle` moderado |
| M9 | `PixPayment` usa fallback fixo de 900 s quando `expiresAt` não vem no state | `PixPayment.tsx:61-65` | Buscar do status da API |
| M10 | Banner sem `loading="lazy"` nas listagens | `Events.tsx`, `EventPublic.tsx` | Atributo simples |
| M11 | `auth_user` do localStorage é confiado sem revalidação até o primeiro 401 | `frontend/src/store/auth.store.ts` | Revalidar `/auth/me` no boot (o app mobile já faz isso em `useAppUser.ts`) |

**Verificado e OK (sem ação):** JWT sem fallback hardcoded; senhas sempre bcrypt; CPF não aparece em logs; ValidationPipe global com whitelist+forbid; webhook idempotente (gate `confirmationEmailSentAt` com `updateMany`); transações serializáveis nos pontos certos; magic bytes no upload; `.env` fora do git; helmet + throttler globais; padrão async/await consistente (`.then` só em efeitos de carga, aceitável); exports nomeados consistentes no frontend.

---

## 3. Top 5 correções prioritárias

1. **C1** — Remover a rota legada `POST /events/public/:slug/register` (inscrição grátis em evento pago). *~30 min, risco zero: sem uso no frontend.*
2. **C2** — Checagem de dono em `GET /events/:id`. *~15 min.*
3. **C3** — Validar vigência (`startDate`/`endDate`) das modalidades na listagem pública e no register. *~1 h com testes.*
4. **I1 + I2** — Receita só com `status === 'paid'` e contadores sem o teto de 50. *~1 h.*
5. **I5 + I6** — Normalização de CPF nas rotas do organizador + validação do DTO de modalidade. *~1 h com testes.*

---

*Módulo de check-in (backend `checkin/` e frontend `app/`) não foi revisado, conforme instrução.*
