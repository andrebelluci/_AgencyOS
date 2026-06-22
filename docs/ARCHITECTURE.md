# ARCHITECTURE

## Objetivo

Construir uma plataforma SaaS multi-tenant preparada para IA.

A arquitetura deve suportar:

- múltiplos clientes
- múltiplos agentes
- múltiplos domínios
- múltiplas bases de conhecimento

Sem necessidade de reescrever o sistema.

---

# PRINCÍPIOS

## 1. Multi-Tenant First

Tudo deve nascer preparado para múltiplos clientes.

Nunca criar soluções específicas para um único cliente.

Todo dado deve pertencer a um tenant.

---

## 2. AI First

Toda funcionalidade deve ser compatível com:

- agentes
- automações
- workflows
- IA

---

## 3. API First

Tudo deve possuir API.

Mesmo funcionalidades internas.

Objetivo:

Permitir integração futura.

---

## 4. Modularidade

Cada módulo deve ser independente.

Evitar acoplamento.

---

## 5. Escalabilidade

Começar simples.

Escalar sem reconstruir.

---

# STACK

## Frontend

- Next.js
- TypeScript
- Tailwind
- Shadcn/UI
- Framer Motion

---

## Backend

- Next.js Server Actions
- Route Handlers

Inicialmente evitar backend separado.

Monolito modular.

---

## Banco

PostgreSQL

Motivos:

- robusto
- barato
- escalável
- suporta pgvector

---

## ORM

Drizzle ORM

Motivos:

- tipagem
- performance
- simplicidade

---

## Autenticação

Supabase Auth

Tipos:

- owner
- admin
- manager
- operator

---

## IA

OpenAI

Inicialmente:

- GPT
- Embeddings

Futuro:

Arquitetura preparada para trocar provedores.

---

## Vetorial

pgvector

Objetivo:

- RAG
- busca semântica
- memória empresarial

---

# ESTRUTURA

## V0.1 — Monólito único (ADR-004)

Ver estrutura completa em [DEV_PLAN.md](DEV_PLAN.md).

```
src/app/, src/modules/, src/agents/, src/tools/, drizzle/
```

## V1+ — Monorepo (futuro)

```
apps/web, apps/admin, apps/api
packages/ui, ai, crm, analytics, automation, agents, knowledge, clients
```

Não implementar monorepo antes de 20 clientes ativos.

---

# MULTI TENANCY

## Conceito

Um sistema.

Múltiplas empresas.

---

## Exemplo

cliente1.com.br

cliente2.com.br

cliente3.com.br

↓

Mesmo sistema.

↓

Tenant diferente.

---

## Tenant Resolution

Toda requisição deve identificar:

- domínio
- subdomínio
- tenant

---

Exemplo:

cliente1.com.br

↓

tenant_id = cliente1

---

# MODELO DE DADOS

Todas as tabelas devem possuir:

tenant_id

Exemplo:

users

id
tenant_id
name
email

---

leads

id
tenant_id
name
phone

---

conversations

id
tenant_id
lead_id

---

knowledge_documents

id
tenant_id

---

Nunca criar tabela sem tenant_id.

Exceto tabelas globais.

---

# MÓDULOS

## Tenant Module

Responsável por:

- empresas
- domínios
- configurações

---

## Auth Module

Responsável por:

- login
- permissões
- sessões

---

## CRM Module

Responsável por:

- leads
- oportunidades
- pipeline

---

## AI Module

Responsável por:

- prompts
- agentes
- embeddings
- memória

---

## Knowledge Module

Responsável por:

- PDFs
- FAQs
- documentos
- indexação

---

## Analytics Module

Responsável por:

- métricas
- dashboards
- relatórios

---

# AGENTES

Estrutura:

agents/

sales/

estimator/

support/

content/

knowledge/

followup/

analytics/

orchestrator/

digital-twin/

---

Cada agente deve possuir:

agent.ts

prompt.ts

tools.ts

rules.ts

types.ts

---

Exemplo:

agents/sales/

agent.ts
prompt.ts
tools.ts
rules.ts

---

# PROMPTS

Nunca colocar prompts espalhados.

Cada agente possui:

prompt.ts

Objetivo:

Manutenção simples.

---

# TOOLS

Ferramentas devem ser desacopladas.

Exemplo:

tools/

createLead.ts

generateQuote.ts

searchKnowledge.ts

sendWhatsapp.ts

---

Agentes utilizam ferramentas.

Ferramentas não conhecem agentes.

---

# MEMÓRIA

Existem três tipos.

---

## Memória Curta

Conversa atual.

Duração:

Sessão.

---

## Memória Média

Relacionamento com lead.

Duração:

Meses.

---

## Memória Longa

Conhecimento da empresa.

Duração:

Permanente.

---

# RAG

Objetivo:

Permitir respostas baseadas em documentos.

Fluxo:

Documento

↓

Chunking

↓

Embedding

↓

pgvector

↓

Busca

↓

Contexto

↓

Resposta

---

# EVENTOS

Arquitetura orientada a eventos.

Exemplos:

lead.created

conversation.started

quote.generated

proposal.sent

meeting.scheduled

knowledge.uploaded

---

Objetivo:

Permitir automações futuras.

---

# AUTOMAÇÕES

Exemplo:

Novo Lead

↓

Qualificação

↓

CRM

↓

Orçamento

↓

WhatsApp

↓

Follow-up

---

Sistema deve ser preparado para workflows.

---

# ANALYTICS

Registrar:

- visitas
- leads
- conversões
- conversas
- propostas

Objetivo:

Demonstrar ROI.

---

# SEGURANÇA

Todo acesso deve validar:

tenant_id

role

permission

---

Nunca confiar em dados do cliente.

Sempre validar no servidor.

---

# UPLOADS

Inicial:

Supabase Storage

Tipos:

PDF
Imagem
Documento

---

# DEPLOY

FASE 1

Frontend:

Vercel

Banco:

Supabase

Storage:

Supabase

---

FASE 2

Docker

Coolify

VPS

---

FASE 3

Kubernetes somente se necessário.

Evitar complexidade prematura.

---

# ESCALABILIDADE

Meta inicial:

1 cliente

Meta intermediária:

20 clientes

Meta avançada:

100+ clientes

Arquitetura deve suportar crescimento gradual.

---

# O QUE EVITAR

Não criar:

- microsserviços
- kubernetes
- arquitetura distribuída
- filas complexas

antes de existir necessidade real.

---

# REGRA PRINCIPAL

Escolher sempre a solução mais simples capaz de suportar o próximo estágio do roadmap.

Não otimizar para 10.000 clientes.

Otimizar para validar e escalar progressivamente.

---

# OBJETIVO FINAL

Construir uma plataforma única capaz de operar centenas de empresas através de agentes especializados e conhecimento estruturado.