# MVP

> **Implementação:** decisões e ordem de desenvolvimento em [DEV_PLAN.md](DEV_PLAN.md).  
> **Issues:** [BACKLOG.md](BACKLOG.md).  
> Em conflito de escopo com ROADMAP Fase 1, prevalece este documento + DEV_PLAN.

## Posicionamento V0.1

**Entregamos:** Site do cliente + Widget embeddable + Funcionário Digital (chat, leads, knowledge, painel).

**Não entregamos no V0.1:** Hero inline, site adaptativo, site conversacional completo, Digital Twin público.

O widget é **mecanismo de distribuição** — o produto é o Funcionário Digital. Visão V0.2–V0.5 em [VISION.md](VISION.md).

---

## Nome do Produto

Funcionário Digital

---

# Objetivo

Validar que pequenas empresas estão dispostas a pagar mensalmente por um funcionário digital capaz de:

* atender visitantes
* responder dúvidas
* capturar leads
* qualificar oportunidades
* encaminhar contatos para WhatsApp
* registrar conversas

24 horas por dia.

---

# Missão do MVP

Permitir que qualquer empresa transforme seu site em um canal ativo de geração de oportunidades.

O visitante não precisa preencher formulários.

O visitante conversa.

O sistema qualifica.

O sistema captura.

O sistema registra.

---

# O Que Estamos Validando

Hipótese Principal:

Pequenas empresas pagarão mensalmente por um funcionário digital que gere oportunidades comerciais reais.

Hipóteses Secundárias:

* visitantes preferem conversar do que preencher formulários
* empresas valorizam velocidade de resposta
* empresas valorizam transparência sobre o que a IA está fazendo
* um widget conversacional pode aumentar geração de leads

---

# O Que NÃO Estamos Validando

Não estamos validando:

* Agency OS completo
* Digital Twin
* Marketplace de Agentes
* Empresa Operável por IA
* CRM avançado
* ERP
* Analytics avançado
* Automações complexas
* Integrações complexas
* Aplicativo mobile
* Personalização por IA em tempo real

---

# Perfil de Cliente Inicial

* Reformas
* Construção
* Acabamentos
* Pintura
* Gesso
* Marmoraria
* Vidraçaria
* Marcenaria
* Energia Solar
* Pequenos serviços locais

---

# Problema Resolvido

Empresas perdem oportunidades porque:

* não respondem rápido
* esquecem contatos
* não atendem fora do horário comercial
* não qualificam leads
* dependem exclusivamente do WhatsApp

---

# Solução MVP

**Funcionário Digital** no site do cliente via **widget embeddable** (distribuição e onboarding).

Componentes V0.1:

* Widget Conversacional (`embed.js`)
* Chat IA + captura de leads
* CRM Básico (`leads.status`)
* Painel do Cliente

> **Não é** Site Conversacional completo (V0.4) nem Hero inline (V0.2). O widget valida mercado; o produto é o Funcionário Digital. Ver [VISION.md](VISION.md).

---

# Funcionalidades MVP

## 1. Widget Conversacional

Objetivo:

Permitir instalação em qualquer site existente.

Compatível com:

* HTML
* WordPress
* Hostinger
* Wix
* Webflow
* Sites próprios

Métodos:

* Script Embed
* iFrame

O cliente não precisa migrar seu site.

---

## 2. Hero Conversacional

> **Versão:** V0.2 (não V0.1). Ver [DEV_PLAN.md](DEV_PLAN.md).

Objetivo:

Transformar a área principal do site em uma experiência conversacional.

Exemplos:

* Qual serviço você procura?
* Em qual cidade está sua obra?
* Qual seu prazo?

As respostas podem direcionar conteúdo e CTAs.

Sem IA gerando layout.

Apenas personalização baseada em estados pré-definidos.

---

## 3. Chat IA

Objetivo:

Atender visitantes.

Capaz de:

* responder perguntas
* apresentar serviços
* explicar diferenciais
* tirar dúvidas básicas
* iniciar qualificação

---

## 4. Captura de Leads

Objetivo:

Registrar interessados.

Dados mínimos:

* Nome
* Telefone
* Cidade
* Serviço
* Mensagem

Salvar no CRM.

---

## 5. Qualificação

Objetivo:

Identificar potencial do lead.

Perguntas:

* Qual serviço?
* Qual cidade?
* Qual prazo?
* Qual metragem?

Resultado:

Lead Score simples.

Baixo

Médio

Alto

---

## 6. WhatsApp

Objetivo:

Levar a conversa para um humano.

Botão:

Continuar no WhatsApp

Sem integração oficial nesta fase.

Apenas redirecionamento.

---

## 7. CRM Básico

Objetivo:

Registrar oportunidades.

Etapas:

* Novo
* Qualificado
* Proposta
* Fechado
* Perdido

Sem automações.

Sem pipeline avançado.

---

## 8. Base de Conhecimento

Objetivo:

Treinar o Funcionário Digital.

Tipos:

* PDFs
* FAQs
* Texto livre

Utilizar RAG básico.

---

## 9. Painel do Cliente

Objetivo:

Dar transparência e controle.

### Dashboard

* Total de conversas
* Total de leads
* Leads da semana

### Conversas

* Histórico
* Busca

### Leads

* Lista
* Status

### Conhecimento

* PDFs
* FAQs
* Textos

### Configurações

* Nome da empresa
* WhatsApp
* Serviços
* Cidade
* Prompt da empresa

---

# Agentes MVP

## Orchestrator Agent

Responsável por:

* entender intenção
* controlar fluxo
* decidir próximos passos

---

## Sales Agent

Responsável por:

* atendimento
* qualificação
* captura de leads

---

## Knowledge Agent

Responsável por:

* documentos
* embeddings
* recuperação de contexto

Interno.

Usuário não vê.

---

# Agentes Fora do MVP

* Estimator Agent
* CRM Agent
* Analytics Agent
* Follow-Up Agent
* Support Agent
* Digital Twin Agent

---

# Módulos MVP

* Auth
* Tenants
* Chat
* CRM
* Knowledge
* AI
* Dashboard
* Widget

---

# Banco de Dados MVP

Tabelas obrigatórias:

* tenants
* users
* leads
* conversations
* messages
* knowledge_documents
* knowledge_chunks
* tenant_settings

Não criar tabelas futuras.

---

# Fluxo Principal

Visitante

↓

Widget

↓

Chat

↓

IA

↓

Qualificação

↓

Lead

↓

CRM

↓

WhatsApp

↓

Fim

---

# Critério de Sucesso

O MVP será considerado validado quando atingir:

* 3 clientes pagantes
* receita recorrente
* utilização real
* geração comprovada de leads
* pelo menos 1 cliente utilizando em produção

---

# Funcionalidades Futuras

Não fazem parte do MVP:

* Orçamentos automáticos
* Estimator Agent
* CRM avançado
* Follow-up automático
* Analytics avançado
* Personalização por IA em tempo real
* Geração automática de páginas
* Marketplace
* Digital Twin

---

# Roadmap

> **Estratégico:** evolução completa V0.1–V0.5 em [VISION.md](VISION.md). Milestones GitHub em [BACKLOG.md](BACKLOG.md) **não foram alterados**.

## V0.1

Funcionário Digital + Widget

* Widget (`embed.js`)
* Chat
* Leads
* WhatsApp
* Conhecimento
* Painel

**Objetivo:** validar aquisição de leads.

---

## V0.2

Hero Conversacional + Widget Hardening

* Hero Conversacional (chat inline, estados pré-definidos) — issues #36–#37
* Widget Hardening (rate limit, abuse, quotas) — tema estratégico

---

## V0.3

Site Adaptativo (visão) + Orçamentista IA (backlog #45–#52)

* Estados + componentes + regras por perfil
* Estimator Agent, orçamentos, pipeline

---

## V0.4

Site Conversacional — conversa substitui parte da navegação.

---

## V0.5

Digital Twin Público — representação operacional da empresa.

---

## V1

Agency OS

---

# Ordem de Implementação

## Sprint 1

Infraestrutura

* Next.js
* Supabase
* Auth
* Tenant

---

## Sprint 2

Banco

* Leads
* Conversas
* Conhecimento

---

## Sprint 3

Chat

* Orchestrator
* Sales Agent

---

## Sprint 4

RAG

* Upload
* Embeddings
* Busca

---

## Sprint 5

Painel

* Dashboard
* Leads
* Conversas

---

## Sprint 6

Widget

* Embed
* iFrame

---

## Sprint 7

Primeiro Cliente

* Deploy
* Treinamento
* Validação

---

# Regra de Ouro

Se uma funcionalidade não ajudar a conseguir os primeiros clientes pagantes, ela não entra no MVP.

---

# Definição de Pronto

O MVP está pronto quando uma empresa consegue:

1. Instalar o widget.
2. Treinar o agente.
3. Receber visitantes.
4. Responder dúvidas.
5. Capturar leads.
6. Encaminhar para WhatsApp.
7. Fechar negócios.

Mesmo que todo o restante ainda não exista.

---

# Visão

Não estamos construindo o Agency OS completo.

Estamos construindo a menor versão possível capaz de provar que o Agency OS merece existir.

O widget é mecanismo de distribuição. O produto é o Funcionário Digital. Evolução V0.2–V0.5 em [VISION.md](VISION.md).
