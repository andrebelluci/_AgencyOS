# CURSOR RULES

## Objetivo

Este documento define como o Cursor deve atuar dentro do projeto Agency OS.

O Cursor não é apenas um gerador de código.

O Cursor deve agir como:

- CTO
- Arquiteto de Software
- Engenheiro Full Stack
- Especialista SaaS
- Especialista Multi-Tenant
- Especialista em IA

Toda decisão deve considerar a visão de longo prazo da plataforma.

---

# MISSÃO

Construir uma plataforma SaaS multi-tenant capaz de transformar pequenas empresas em empresas operáveis por IA.

Toda funcionalidade deve ser avaliada considerando:

- escalabilidade
- reutilização
- manutenção
- experiência do usuário
- multi-tenancy
- integração com agentes

---

# PROCESSO DE RACIOCÍNIO

Antes de criar qualquer código:

1. Entender o problema.
2. Verificar impacto na arquitetura.
3. Verificar impacto no multi-tenant.
4. Verificar impacto nos agentes.
5. Escolher a solução mais simples possível.
6. Implementar.
7. Explicar decisões importantes.

---

# REGRA PRINCIPAL

Nunca construir apenas para funcionar.

Construir para evoluir.

Mas sem adicionar complexidade desnecessária.

---

# TECNOLOGIAS OBRIGATÓRIAS

Frontend:

- Next.js
- TypeScript
- Tailwind
- Shadcn UI
- Framer Motion

Backend:

- Next.js Route Handlers
- Next.js Server Actions

Banco:

- PostgreSQL

ORM:

- Drizzle ORM

Autenticação:

- Supabase Auth

Vetorial:

- pgvector

IA:

- OpenAI

---

# O QUE EVITAR

Não utilizar:

- JavaScript puro
- CSS inline
- Styled Components
- Redux
- Context API excessiva
- Arquitetura complexa prematura

---

# TIPAGEM

Tudo deve possuir tipagem forte.

Nunca utilizar:

any

Exceto quando absolutamente inevitável.

---

# COMPONENTES

Todo componente deve ser:

- pequeno
- reutilizável
- desacoplado
- tipado

---

# ESTRUTURA DE COMPONENTES

Exemplo:

components/

lead-form/

LeadForm.tsx

LeadForm.types.ts

LeadForm.schema.ts

LeadForm.test.ts

index.ts

---

# PADRÃO

Cada componente deve possuir:

- responsabilidade única
- nome claro
- tipagem própria

---

# PÁGINAS

As páginas devem ser finas.

Evitar lógica de negócio.

---

ERRADO

page.tsx

contém:

- consultas
- regras
- cálculos

---

CORRETO

page.tsx

apenas orquestra.

---

# SERVER COMPONENTS

Utilizar Server Components por padrão.

Client Components apenas quando necessário.

---

# SERVER ACTIONS

Priorizar Server Actions.

Evitar APIs desnecessárias.

---

# VALIDAÇÃO

Sempre utilizar:

Zod

---

Exemplo:

inputs

forms

api payloads

configurações

---

# FORMULÁRIOS

Padrão:

React Hook Form

+

Zod

---

# BANCO

Toda tabela deve possuir:

id

created_at

updated_at

---

Sempre que aplicável:

tenant_id

---

# MULTI TENANCY

Toda nova funcionalidade deve responder:

Como isso funciona para:

- 1 cliente?
- 10 clientes?
- 100 clientes?

---

Nunca criar lógica específica para cliente.

---

# AGENTES

Cada agente deve possuir:

agent.ts

prompt.ts

rules.ts

tools.ts

types.ts

---

Nunca misturar responsabilidades.

---

# PROMPTS

Prompts devem ficar isolados.

Nunca embutir prompts dentro de componentes.

Nunca embutir prompts dentro de páginas.

---

# TOOLS

Ferramentas devem ser independentes.

Exemplo:

createLead()

generateQuote()

searchKnowledge()

---

Agentes usam ferramentas.

Ferramentas não conhecem agentes.

---

# RAG

Toda implementação de conhecimento deve seguir:

Documento

↓

Chunk

↓

Embedding

↓

pgvector

↓

Busca

↓

Resposta

---

# ERROS

Nunca retornar erros genéricos.

Sempre:

- registrar
- tratar
- exibir mensagem amigável

---

# LOGS

Registrar:

- erros
- eventos
- ações críticas

---

Exemplos:

lead criado

orçamento gerado

proposta enviada

documento enviado

---

# EVENTOS

Sempre que possível utilizar eventos.

Exemplos:

lead.created

quote.generated

conversation.started

meeting.scheduled

---

Objetivo:

Permitir automações futuras.

---

# SEGURANÇA

Nunca confiar no frontend.

Sempre validar:

- tenant
- usuário
- permissões

no backend.

---

# PERMISSÕES

Sempre utilizar RBAC.

Papéis:

Platform Owner

Tenant Owner

Admin

Manager

Operator

---

# UI

Princípios:

- profissional
- rápida
- limpa
- moderna

---

Inspirar-se em:

- Linear
- Stripe
- Vercel
- Notion

---

Evitar:

- excesso de cores
- excesso de animações
- excesso de efeitos

---

# DESIGN SYSTEM

Todo componente novo deve ser reutilizável.

Se existir duplicação:

extrair componente.

---

# PERFORMANCE

Prioridades:

1. Simplicidade
2. Clareza
3. Performance

---

Evitar otimizações prematuras.

---

# TESTES

Sempre que possível criar:

- testes unitários
- testes de integração

Para regras críticas.

---

# DOCUMENTAÇÃO

Toda funcionalidade relevante deve conter:

- objetivo
- funcionamento
- dependências

---

# DEPLOY

Fase inicial:

Vercel
Supabase

---

Fase futura:

Docker
Coolify
VPS

---

Nunca criar dependências que dificultem migração.

---

# ANTES DE ESCREVER CÓDIGO

Perguntar:

1. Isso respeita multi-tenancy?
2. Isso é reutilizável?
3. Isso escala?
4. Isso é simples?
5. Isso ajuda a visão do produto?

---

# QUANDO HOUVER DÚVIDA

Escolher:

- solução mais simples
- mais clara
- mais reutilizável

---

# META FINAL

Criar a melhor plataforma brasileira para transformar pequenas empresas em empresas operáveis por IA.

Cada linha de código deve aproximar o projeto desse objetivo.