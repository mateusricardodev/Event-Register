# 🧠 Prompt para Claude Code — Backend + Database (incrições.app)

Você é um engenheiro backend sênior especializado em:

* Node.js / TypeScript
* Arquitetura escalável
* Modelagem de banco de dados
* APIs REST bem estruturadas

Sua tarefa é construir o backend completo do sistema **incrições.app**, com base nas regras abaixo.

---

# 🎯 Objetivo do Sistema

Criar uma plataforma para:

* Criar eventos religiosos
* Gerenciar inscrições
* Vender ingressos
* Controlar participantes

---

# 🧱 Stack Obrigatória

* Node.js + TypeScript
* Framework: NestJS (preferido) ou Express estruturado
* Banco de dados: PostgreSQL
* ORM: Prisma (preferido)

---

# 🗄️ Modelagem do Banco (ESSENCIAL)

Crie um schema completo com as seguintes entidades:

## 👤 User

* id
* name
* email (único)
* password (hash)
* role (admin | organizer | user)
* createdAt

---

## 📅 Event

* id
* title
* description
* location
* date
* bannerUrl
* createdBy (userId)
* createdAt

---

## 🎟️ Ticket

* id
* eventId
* name (ex: "Ingresso geral")
* price
* quantity
* createdAt

---

## 🧾 Registration (Inscrição)

* id
* userId
* eventId
* ticketId
* status (pending | confirmed | canceled)
* createdAt

---

## 💳 Payment (estrutura inicial)

* id
* registrationId
* amount
* status (pending | paid | failed)
* provider (mock)
* createdAt

---

# 🔗 Relacionamentos

* User cria Events
* Event tem vários Tickets
* User se inscreve via Registration
* Registration pertence a Ticket
* Payment vinculado à Registration

---

# 🔐 Autenticação

Implementar:

* JWT authentication
* Login / Register
* Middleware de proteção de rotas

---

# 📡 API Endpoints

## Auth

* POST /auth/register
* POST /auth/login
* GET /auth/me

---

## Eventos

* POST /events
* GET /events
* GET /events/:id
* PUT /events/:id
* DELETE /events/:id

---

## Tickets

* POST /events/:id/tickets
* GET /events/:id/tickets

---

## Inscrições

* POST /registrations
* GET /my-registrations

---

## Pagamento (mock)

* POST /payments
* Simular confirmação

---

# ⚙️ Regras de Negócio

* Não permitir inscrição sem ticket
* Validar limite de ingressos
* Um usuário pode se inscrever várias vezes (se permitido)
* Apenas criador pode editar evento

---

# 📁 Estrutura de Pastas

Organizar por módulos:

* auth/
* users/
* events/
* tickets/
* registrations/
* payments/

---

# 🧠 Boas Práticas

* DTOs bem definidos
* Validação com class-validator
* Uso de services separados
* Código limpo e escalável

---

# 🚀 Extras (IMPORTANTE)

* Seeds iniciais (1 usuário + 2 eventos)
* Logs básicos
* Tratamento de erros global
* CORS habilitado

---

# 🔌 Integração com Front

Preparar API para:

* consumo por React
* respostas JSON padronizadas

---

# 🎯 Resultado Esperado

* Backend funcional
* Banco modelado corretamente
* API pronta para produção inicial
* Fácil integração com frontend

---

Gere:

1. Estrutura completa do projeto
2. Código dos principais arquivos
3. Schema Prisma
4. Instruções de como rodar
