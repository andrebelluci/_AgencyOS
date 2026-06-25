# ROADMAP

> **Visão de longo prazo.** Para implementação imediata, use [DEV_PLAN.md](DEV_PLAN.md).  
> **Correção:** Multi-tenant é V0.1 (NON_NEGOTIABLES), não Fase 2. Orçamento automático é V0.3, não Fase 1.

## Evolução de produto (versões V0.x)

Roadmap **estratégico** de interface e experiência. Não substitui milestones de issues no GitHub.

| Versão | Produto | O que entrega | Gate comercial |
|--------|---------|---------------|----------------|
| **V0.1** | Funcionário Digital + Widget | Chat, leads, knowledge, painel, `embed.js` | 1º cliente pagante |
| **V0.2** | Hero Conversacional | Chat inline na hero, onboarding conversacional, perguntas contextuais; **Widget Hardening** (rate limit, abuse, quotas, timeout, observabilidade) | 3–10 pagantes |
| **V0.3** | Site Adaptativo | Estados + componentes + regras (ex.: residencial, comercial, arquiteto); conteúdo/CTA/prova social por perfil — **sem HTML gerado por LLM** | Demanda comprovada |
| **V0.4** | Site Conversacional | Conversa substitui parte da navegação; IA guia a jornada | Produto diferenciado |
| **V0.5** | Digital Twin Público | Representação operacional da empresa para o visitante | Enterprise / premium |

**Widget (V0.1)** = distribuição e validação de mercado. **Funcionário Digital** = produto.

Issues V0.2/V0.3 no [BACKLOG.md](BACKLOG.md) permanecem; esta tabela alinha a **narrativa** de longo prazo (V0.4/V0.5 ainda sem issues).

### Nota sobre milestones GitHub

| Milestone no GitHub | Conteúdo real | Versão estratégica equivalente |
|---------------------|--------------|-------------------------------|
| `V0.2 — Site Conversacional` | Hero (#36), iFrame, RBAC, Support… (#35–#44) | V0.2 Hero + hardening restante (mínimo em Onda 7 #33) |
| `V0.3 — Orçamentista IA` | Estimator, quotes, pipeline (#45–#52) | Automação comercial (paralelo ao **V0.3 Site Adaptativo**) |

Não renomear milestones sem migração planejada de issues.

---

## Objetivo

Transformar o Agency OS de um MVP validado em uma plataforma SaaS multi-tenant capaz de operar empresas através de IA.

Este roadmap existe para evitar construir funcionalidades antes da hora.

Prioridade sempre:

1. Vender
2. Validar
3. Automatizar
4. Escalar

---

# FASE 1 — MVP COMERCIAL

Status: PRIORIDADE MÁXIMA

Objetivo:

Vender o primeiro Funcionário Digital.

Prazo sugerido:

30 a 60 dias.

---

## Entregáveis

### Landing Page

Objetivo:

Apresentar o serviço.

Necessário:

- Hero
- Benefícios
- Prova social
- CTA
- WhatsApp
- SEO básico

---

### Chat IA

Objetivo:

Atender visitantes.

Necessário:

- Interface de conversa
- Histórico
- Streaming de respostas
- Integração OpenAI

---

### Captura de Leads

Objetivo:

Transformar conversa em oportunidade.

Necessário:

- Nome
- Telefone
- Email
- Serviço desejado

---

### Encaminhamento WhatsApp

Objetivo:

Levar visitante para fechamento.

Necessário:

- Link dinâmico
- Mensagem pré-preenchida
- Registro da origem

---

### Orçamento Automático

> **Movido para V0.3** (Estimator Agent). Não faz parte do V0.1. Ver [DEV_PLAN.md](DEV_PLAN.md).

---

### Painel Administrativo

Objetivo:

Permitir configuração.

Necessário:

- Leads
- Conversas
- Tabelas de preço
- Configurações

---

# Critério de sucesso da Fase 1

Conseguir vender para pelo menos:

- 1 cliente pagante

Ideal:

- 3 clientes pagantes

Excelente:

- 10 clientes pagantes

---

# FASE 2 — PLATAFORMA

Objetivo:

Parar de vender projeto.

Começar a vender plataforma.

Prazo:

3 a 12 meses.

---

## Multi-Tenant

> **Base desde V0.1** (subdomínio + public_key). Domínio customizado e branding avançado nesta fase.

Objetivo:

Um sistema.

Múltiplos clientes.

Cada cliente possui:

- domínio próprio (customizado em V0.2+)
- identidade visual
- base de conhecimento
- configurações

---

## CRM

Objetivo:

Gerenciar oportunidades.

Necessário:

- Pipeline
- Etapas
- Histórico
- Follow-up

---

## Base de Conhecimento

Objetivo:

Treinar agentes.

Necessário:

- Upload PDF
- FAQ
- Conteúdo estruturado

---

## Gestão de Conversas

Objetivo:

Acompanhar atendimento.

Necessário:

- Histórico
- Pesquisa
- Filtros

---

## Gestão de Usuários

Objetivo:

Permitir equipes.

Necessário:

- Admin
- Gestor
- Operador

---

## Métricas

Objetivo:

Mostrar valor.

Necessário:

- Leads gerados
- Conversões
- Conversas
- Orçamentos

---

# Critério de sucesso da Fase 2

Pelo menos:

20 clientes ativos.

---

# FASE 3 — AUTOMAÇÃO

Objetivo:

Criar empresas parcialmente operadas por IA.

Prazo:

1 a 2 anos.

---

## Follow-up Automático

A IA acompanha oportunidades.

Exemplos:

- WhatsApp
- Email
- SMS futuramente

---

## Agendamento

A IA agenda reuniões.

Integrações:

- Google Calendar
- Outlook

---

## Geração de Propostas

A IA cria documentos.

Formatos:

- PDF
- Link compartilhável

---

## Automações

Exemplos:

Novo lead

↓

Qualificação

↓

Orçamento

↓

Follow-up

↓

Fechamento

---

# Critério de sucesso da Fase 3

Empresa consegue operar parte do comercial sem intervenção humana.

---

# FASE 4 — GÊMEO DIGITAL

Objetivo:

Representar digitalmente a empresa.

Prazo:

2 a 5 anos.

---

## Memória Empresarial

Armazenar:

- documentos
- histórico
- processos
- decisões

---

## Conhecimento Profundo

Agente conhece:

- produtos
- serviços
- políticas
- preços
- diferenciais

---

## Personalidade

Empresa passa a ter identidade conversacional.

---

# Critério de sucesso da Fase 4

Cliente sente que está conversando com a empresa.

Não com um chatbot.

---

# FASE 5 — INTERNET ORIENTADA A AGENTES

Objetivo:

Preparar clientes para o futuro.

Prazo:

3 a 5 anos.

---

## Agent Ready Website

Implementar:

- APIs
- Dados estruturados
- JSON-LD
- Schema.org

---

## Agent Commerce

Permitir que agentes:

- consultem serviços
- solicitem orçamento
- executem ações

---

## MCP

Preparar integração com ecossistemas baseados em agentes.

---

# Critério de sucesso da Fase 5

Empresas passam a ser consumidas por IA da mesma forma que hoje são consumidas por humanos.

---

# O QUE NÃO FAZER

Não construir:

- ERP completo
- Financeiro complexo
- Sistema de estoque
- RH
- Funcionalidades sem cliente

---

# REGRA DE PRIORIZAÇÃO

Ao surgir uma nova ideia:

Perguntar:

1. Gera receita?
2. Gera vendas?
3. Gera retenção?
4. Escala a plataforma?

Se a resposta for não para todas:

Não desenvolver agora.

---

# DIRETRIZES ARQUITETURAIS FUTURAS

> Orientam decisões **após V0.1**. Não alteram escopo, backlog ou cronograma atual. Detalhes em [VISION.md](VISION.md).

- **Modelo de IA substituível** — sem dependência de OpenAI, Gemini, Claude ou fornecedor único
- **Conhecimento é o ativo principal** — captura, organização, recuperação e evolução do knowledge empresarial
- **RAG privado por padrão** — Pergunta → Knowledge Base → RAG → Resposta (não internet)
- **Site conversacional ≠ HTML por LLM** — Estados + Componentes + Regras + Contexto + IA
- **Digital Twin = destino final** — representação operacional da empresa para o visitante

---

# META FINAL

Criar a principal plataforma brasileira para transformar pequenas empresas em empresas operáveis por IA.