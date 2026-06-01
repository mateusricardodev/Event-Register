
# QA Report — inscrições.app
**Data:** 2026-06-01  
**Auditor:** QA Engineer Sênior (Claude)  
**Escopo:** `backend/src` + `frontend/src`  
**Metodologia:** Revisão estática de código, análise de controle de acesso, rastreamento de fluxo de dados

---

## ⏳ Pendências (não implementadas ainda)

| ID | Descrição | Motivo do adiamento |
|---|---|---|
| M-02 | `formFields` e `extraFields` sem schema de validação | Exige definir lista de campos permitidos no backend (DTO) e sincronizar com a UI — tarefa de média complexidade |
| M-07 | Usuários criados automaticamente nas inscrições nunca conseguem logar | Requer fluxo de "definir senha por email" (convite) — feature separada |
| A-01 | CPF armazenado em texto puro (LGPD) | Exige migração de banco + criptografia AES-256-GCM — alto impacto, fazer antes do deploy em produção |

---

## Sumário Executivo

| Severidade | Quantidade |
|---|---|
| 🔴 Crítico | 5 |
| 🟠 Alto | 7 |
| 🟡 Médio | 8 |
| 🔵 Baixo | 5 |
| **Total** | **25** |

---

## 🔴 CRÍTICOS

### C-01 — Race condition no controle de vagas (CONFIRMADA)
**Arquivos:** `registrations.service.ts:33-52`, `registrations.service.ts:84-89`, `registrations.service.ts:174-179`

Três métodos (`create`, `createByOrganizer`, `createPublic`) seguem o padrão:
```
count() → comparar com limite → create()
```
Sem transação com lock. Duas requisições simultâneas passam pelo `count()` antes de qualquer `create()` ser persistido, resultando em **N+1 inscrições** onde o máximo era N.

**Reprodução:** disparar 50 requests `POST /events/public/:slug/register` simultâneos num evento com `maxParticipants: 1`. O banco terá mais de 1 inscrição confirmada.

**Correção:** usar `prisma.$transaction` com isolamento `Serializable` ou implementar `SELECT ... FOR UPDATE` via query raw. Exemplo mínimo:
```ts
await this.prisma.db.$transaction(async (tx) => {
  const count = await tx.registration.count({ where: { eventId, status: { not: 'canceled' } } });
  if (count >= event.maxParticipants) throw new BadRequestException('Evento lotado');
  return tx.registration.create({ data: { ... } });
}, { isolationLevel: 'Serializable' });
```

---

### C-02 — Qualquer usuário autenticado pode cancelar ou editar inscrições alheias
**Arquivos:** `registrations.service.ts:125-165`, `registrations.controller.ts:50-59`

`update()` e `cancel()` recebem apenas o `id` da inscrição. **Nenhum dos dois verifica se o usuário autenticado é dono da inscrição ou dono do evento.** Um usuário mal-intencionado pode cancelar a inscrição de qualquer participante.

```ts
// registrations.service.ts:125 — sem nenhuma verificação de userId
async update(id: string, dto: UpdateRegistrationDto) {
  const registration = await this.prisma.db.registration.findUnique({ where: { id } });
  // ...continua sem checar ownership
}
```

**Correção:** passar `userId` para `update` e `cancel`; verificar se `registration.userId === userId` ou se o usuário é dono do evento da inscrição.

---

### C-03 — Qualquer usuário autenticado pode listar e adicionar inscrições em eventos alheios
**Arquivos:** `registrations.controller.ts:29-41`, `registrations.service.ts:67-77`, `registrations.service.ts:79-123`

- `GET /events/:eventId/registrations` — retorna todos os inscritos de qualquer evento sem verificar se o solicitante é o dono.
- `POST /events/:eventId/registrations` — permite que qualquer usuário autenticado adicione inscrições a qualquer evento.

**Correção:** passar `userId` e chamar `checkOwnership` em ambos os handlers.

---

### C-04 — Busca global retorna dados de TODOS os eventos do sistema
**Arquivos:** `registrations.controller.ts:44-47`, `registrations.service.ts:216-237`

`GET /registrations/search?q=...` retorna até 50 registros de qualquer evento, de qualquer organizador. Um organizador pode pesquisar e visualizar CPF, email e dados pessoais de participantes de eventos de concorrentes.

**Correção:** filtrar por eventos que pertencem ao `userId` autenticado:
```ts
where: {
  event: { createdBy: userId },
  OR: [ ... ]
}
```

---

### C-05 — `GET /events/:id` é público e sem autenticação
**Arquivo:** `events.controller.ts:39-43`

O endpoint `GET /events/:id` (detalhe do evento com tickets e métodos de pagamento) não tem `@UseGuards(JwtGuard)`. Qualquer pessoa pode acessar os dados completos de qualquer evento sem estar autenticada, bastando conhecer o UUID.

**Correção:** adicionar `@UseGuards(JwtGuard)` e verificar ownership, ou ao menos separar o que é retornado para requisições não autenticadas.

---

## 🟠 ALTOS

### A-01 — CPF armazenado em texto puro (violação LGPD)
**Arquivos:** `registrations.service.ts:104`, `registrations.service.ts:196`, `backend/prisma/schema.prisma`

CPF é dado pessoal sensível protegido pela LGPD. Está salvo como `String` sem criptografia. Um dump do banco expõe todos os CPFs.

**Correção:** criptografar com AES-256-GCM usando chave de ambiente antes de salvar; descriptografar apenas na exibição. Nunca usar hash (precisa ser reversível para exibição).

---

### A-02 — Sem rate limiting em nenhum endpoint
**Arquivo:** `main.ts`

`/auth/login`, `/auth/register` e `POST /events/public/:slug/register` não têm rate limiting. Possibilita:
- Brute force de senhas
- Spam de inscrições em eventos públicos
- Enumeração de e-mails via `/auth/register` (retorna 409 se email existe)

**Correção:** instalar `@nestjs/throttler` e configurar globalmente:
```ts
ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }])
```

---

### A-03 — Sem headers de segurança (helmet)
**Arquivo:** `main.ts`

A aplicação não usa `helmet`. Estão ausentes: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`.

**Correção:**
```ts
import helmet from 'helmet';
app.use(helmet());
```

---

### A-04 — CORS completamente aberto
**Arquivo:** `main.ts:15`

`app.enableCors()` sem opções aceita qualquer origem. Em produção, isso permite que qualquer site faça requisições autenticadas em nome do usuário.

**Correção:**
```ts
app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
```

---

### A-05 — Deleção de evento não é atômica
**Arquivo:** `events.service.ts:114-128`

A deleção em cascata usa 5 queries sequenciais sem transação. Uma falha a qualquer passo deixa o banco com dados órfãos (ex: payments sem registration).

**Correção:** envolver todo o bloco em `prisma.$transaction([...])`.

---

### A-06 — Sem validação de CPF no backend
**Arquivos:** `registrations/dto/create-registration-organizer.dto.ts:13`, `registrations.service.ts`

CPF é aceito como qualquer string. `000.000.000-00` ou `abc` passam pela validação. O frontend aplica máscara mas não valida o dígito verificador.

**Correção:** implementar validador customizado `@IsCpf()` com o algoritmo de dígitos verificadores.

---

### A-07 — Inscrição duplicada: mesmo CPF pode se inscrever N vezes no mesmo evento
**Arquivo:** `registrations.service.ts:167-214`

`createPublic` e `createByOrganizer` não verificam se já existe uma inscrição ativa com o mesmo CPF (ou mesmo userId) para o evento.

**Correção:** adicionar verificação:
```ts
const existing = await tx.registration.findFirst({
  where: { eventId: event.id, cpf: dto.cpf, status: { not: 'canceled' } }
});
if (existing) throw new ConflictException('CPF já inscrito neste evento');
```

---

## 🟡 MÉDIOS

### M-01 — `auth.service.ts:me()` retorna `null` sem lançar 404
**Arquivo:** `auth.service.ts:62-67`

Se o usuário for deletado do banco após emitir o JWT, `/auth/me` retorna HTTP 200 com corpo `null` em vez de 404 ou 401. O frontend pode quebrar ao tentar acessar propriedades de `null`.

**Correção:**
```ts
if (!user) throw new NotFoundException('Usuário não encontrado');
```

---

### M-02 — `formFields` e `extraFields` sem schema de validação
**Arquivos:** `create-event.dto.ts:63`, `registrations.service.ts:197`

`formFields` é salvo como string JSON arbitrária sem validação de estrutura. `extraFields` aceita qualquer `Record<string, string>` sem restringir chaves ou tamanho máximo, abrindo espaço para payload bombing.

**Correção:** definir um schema Zod ou class-validator para os campos permitidos; limitar tamanho máximo do objeto.

---

### M-03 — Frontend: `EventDetail.tsx` trava em loading se qualquer requisição falhar
**Arquivo:** `frontend/src/pages/EventDetail.tsx:58-68`

```ts
Promise.all([...]).then(([evtRes, regRes]) => {
  // ...
  setLoading(false)  // só chamado no .then()
})
// sem .catch() → loading fica true para sempre se a API retornar erro
```

**Correção:** adicionar `.catch(() => setLoading(false))` ou usar `finally`.

---

### M-04 — Frontend: chamadas de API sem tratamento de erro em múltiplas páginas
**Arquivos:** `Dashboard.tsx`, `EventDetail.tsx:52-55` (`loadRegistrations`)

`loadRegistrations()` chama `api.get(...)` sem `.catch()`. Erros silenciosos não chegam ao usuário.

**Correção:** padronizar com `try/catch` e exibir mensagem de erro na UI.

---

### M-05 — `GET /events/:id/payment-methods` sem verificação de ownership
**Arquivo:** `events.controller.ts:72-76`, `events.service.ts:166-171`

Protegido por JWT mas qualquer usuário autenticado pode listar os métodos de pagamento de qualquer evento.

**Correção:** passar `userId` e verificar ownership em `getPaymentMethods`.

---

### M-06 — Senha mínima de 6 caracteres é fraca demais
**Arquivo:** `auth/dto/register.dto.ts:12`

`@MinLength(6)` é insuficiente para produção. Sem complexidade mínima (maiúscula, número, símbolo).

**Correção:** `@MinLength(8)` + `@Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)`.

---

### M-07 — Usuários criados automaticamente (inscrições) nunca conseguem fazer login
**Arquivo:** `registrations.service.ts:93-96`

Quando um participante se inscreve, um usuário é criado com senha aleatória que não é comunicada a ninguém. Esse usuário não tem como recuperar acesso. Não existe fluxo de "esqueci a senha".

**Correção:** implementar fluxo de convite por email ou não criar usuários automaticamente (desvincular participante de User).

---

### M-08 — Slug de evento sem validação de formato
**Arquivo:** `create-event.dto.ts:37`

`slug` aceita qualquer string, incluindo espaços, caracteres especiais e paths maliciosos como `../admin`.

**Correção:**
```ts
@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug inválido' })
```

---

## 🔵 BAIXOS

### B-01 — Sem paginação nos endpoints de listagem
**Arquivos:** `registrations.service.ts:56-65`, `registrations.service.ts:67-77`

`findMyRegistrations` e `findByEvent` retornam todos os registros sem limite. Um evento com 10.000 inscritos sobrecarrega a memória e o tempo de resposta.

**Correção:** adicionar `skip`/`take` com parâmetros `page` e `limit`.

---

### B-02 — Slug pode ser `null` e não tem índice único garantido no DTO
**Arquivo:** `events.service.ts:59-63`

A verificação de slug duplicado só ocorre se `dto.slug` for truthy. Se o banco tiver `slug` como campo único e nullable, isso já está coberto, mas a UX não guia o usuário a sempre definir um slug.

---

### B-03 — Banner: extensão do arquivo confiada no `mimetype` do cliente
**Arquivo:** `events.controller.ts:99-103`

O filtro de imagem verifica `file.mimetype`, que é enviado pelo cliente e pode ser forjado. Um atacante pode enviar um arquivo PHP renomeado como `.jpg`.

**Correção:** usar `file-type` para detectar o magic bytes real do arquivo após o upload.

---

### B-04 — `randomPassword` gerada via `Math.random()` (não criptograficamente seguro)
**Arquivo:** `registrations.service.ts:93`

```ts
const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
```

`Math.random()` não é CSPRNG. Embora o bcrypt adicione entropia no hash, a senha base é previsível em ambientes com seed controlado.

**Correção:** usar `crypto.randomBytes(32).toString('hex')`.

---

### B-05 — Token JWT sem `expiresIn` configurado explicitamente
**Arquivo:** `auth.module.ts` (não lido, mas inferido pelo payload)

Se `JwtModule.register` não especifica `expiresIn`, o padrão pode ser indefinido ou muito longo (depende da versão). Tokens sem expiração são um risco de segurança.

**Correção:** configurar explicitamente `expiresIn: '7d'` ou valor adequado ao contexto.

---

## Fase 2 — Cobertura de Testes

### Configuração recomendada

**docker-compose.test.yml** (banco isolado):
```yaml
version: '3.8'
services:
  postgres-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: inscricoes_test
    ports:
      - '5433:5432'
```

**`.env.test`:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/inscricoes_test?schema=public"
JWT_SECRET="test-secret"
MAIL_HOST=localhost
MAIL_PORT=1025
```

**Scripts no `package.json`:**
```json
"test:unit": "jest --testPathPattern=src",
"test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json",
"test:cov": "jest --coverage --testPathPattern=src"
```

**Como rodar:**
```bash
docker-compose -f docker-compose.test.yml up -d
npx prisma migrate deploy  # com DATABASE_URL apontando para :5433
npm run test:unit
npm run test:e2e
docker-compose -f docker-compose.test.yml down
```

---

## Fase 3 — Resumo Final

### Top 5 riscos antes de ir para produção

| # | Risco | Severidade | Esforço de correção |
|---|---|---|---|
| 1 | Race condition nas vagas (C-01) | Crítico | Médio — 1 transação por método |
| 2 | IDOR: cancel/edit de inscrições alheias (C-02, C-03) | Crítico | Baixo — passar userId + verificar |
| 3 | CPF em texto puro / LGPD (A-01) | Alto | Alto — migração de schema + criptografia |
| 4 | Sem rate limiting — brute force / spam (A-02) | Alto | Baixo — instalar throttler |
| 5 | Busca global sem escopo (C-04) | Crítico | Baixo — adicionar filtro de ownership |

### Ordem sugerida de correção

```
1. C-02 + C-03 + C-04 + C-05  → autenticação e autorização (1 dia)
2. C-01                         → transação nas vagas (2h)
3. A-02 + A-03 + A-04          → segurança de infraestrutura (2h)
4. A-05                         → deleção atômica (1h)
5. A-06 + A-07                  → validação de CPF e duplicatas (1 dia)
6. A-01                         → criptografia de CPF / LGPD (2-3 dias)
7. M-01 → M-08                  → qualidade e UX (2 dias)
8. B-01 → B-05                  → melhorias incrementais
```

### Cobertura de testes estimada após Fase 2

| Módulo | Cobertura alvo |
|---|---|
| AuthService | ~95% |
| RegistrationsService | ~90% |
| EventsService | ~85% |
| PaymentsService | ~80% |
| E2E fluxo principal | ~75% de linhas |
| **Estimativa geral** | **~82%** |

---

*Relatório gerado em revisão estática — não substitui pentest ou auditoria de segurança formal.*
