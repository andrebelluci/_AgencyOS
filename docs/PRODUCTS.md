# PRODUCTS

## Objetivo

Definir os produtos, planos e modelo comercial do Agency OS.

Este documento existe para garantir que o desenvolvimento siga as prioridades comerciais.

O cliente não compra tecnologia.

O cliente compra resultado.

Toda funcionalidade deve estar associada a um produto vendável.

---

# FILOSOFIA

Não vender:

- Site
- Chatbot
- Automação
- Inteligência Artificial

Vender:

- Mais Leads
- Mais Vendas
- Mais Agilidade
- Mais Atendimento
- Mais Eficiência

---

# POSICIONAMENTO

Categoria:

Funcionário Digital

Descrição:

Um colaborador virtual treinado para atender, qualificar, responder dúvidas e gerar oportunidades 24 horas por dia.

---

# WIDGET vs PRODUTO

| | Widget embeddable (V0.1) | Funcionário Digital (produto) |
|--|--------------------------|-------------------------------|
| **Papel** | Distribuição, onboarding, validação de mercado | Operação comercial da empresa |
| **O que é** | Script no site do cliente (`embed.js`) | Agentes + knowledge + CRM + painel |
| **Futuro** | Um dos modos de interface | Núcleo permanente da plataforma |

O widget valida adoção. O destino é **Site Adaptativo → Site Conversacional → Digital Twin Público** ([VISION.md](VISION.md)).

---

# EVOLUÇÃO ESTRATÉGICA (V0.1 → V0.5)

> Narrativa de longo prazo. Não altera escopo V0.1 nem issues em [BACKLOG.md](BACKLOG.md).

## V0.1 — Funcionário Digital + Widget

**Objetivo:** validar aquisição de leads.

Entrega: chat, captura, knowledge, painel, `embed.js`.

---

## V0.2 — Hero Conversacional + Widget Hardening

**Hero Conversacional:** chat inline na hero, onboarding conversacional, perguntas contextuais, estados pré-definidos (issues #33–#34).

**Widget Hardening** (tema estratégico — issues futuras): rate limiting, abuse protection, quotas por tenant, timeout strategy, observabilidade.

---

## V0.3 — Site Adaptativo

A IA **não gera páginas**. A IA **seleciona estados** (ex.: residencial, comercial, arquiteto, construtora).

Cada perfil recebe conteúdo, provas sociais, CTAs e componentes diferentes.

**Implementação:** Estados + Componentes + Regras + Contexto + IA.

> Milestone GitHub `V0.3 — Orçamentista IA` (issues #42–#49) cobre **automação comercial** em paralelo. Ver [BACKLOG.md](BACKLOG.md).

---

## V0.4 — Site Conversacional

O visitante conversa com a empresa. A conversa substitui **parte** da navegação tradicional. A IA guia a experiência.

---

## V0.5 — Digital Twin Público

O visitante fala com uma **representação operacional** da empresa — serviços, processos, histórico, conhecimento e contexto integrados.

Produto alinhado ao plano **Enterprise** e ao Digital Twin Agent ([AGENTS.md](AGENTS.md)).

---

# PRODUTO PRINCIPAL

## Funcionário Digital

Primeiro produto comercial.

Objetivo:

Validar mercado.

Gerar receita.

Criar recorrência.

---

## Problema Resolvido

Pequenas empresas perdem clientes porque:

- não respondem rápido
- esquecem leads
- fazem orçamento manualmente
- dependem de atendimento humano

---

## Solução

Funcionário Digital disponível 24h.

Capaz de:

- responder dúvidas
- capturar contatos
- gerar orçamentos
- encaminhar para WhatsApp
- registrar oportunidades

---

# PLANOS

## STARTER

Indicado para:

Profissionais autônomos e pequenas empresas.

---

### Inclui

Landing Page

Chat IA

Captura de Leads

WhatsApp

Painel Básico

---

### Agentes

Sales Agent

Orchestrator

---

### Objetivo

Gerar mais contatos.

---

# PRO

Indicado para:

Empresas que recebem volume maior de solicitações.

---

### Inclui

Tudo do Starter

+

Orçamento Automático

CRM

Base de Conhecimento

Histórico de Conversas

---

### Agentes

Sales Agent

Estimator Agent

Support Agent

Orchestrator

Knowledge Agent

---

### Objetivo

Reduzir trabalho manual.

---

# BUSINESS

Indicado para:

Empresas que desejam operação parcialmente automatizada.

---

### Inclui

Tudo do Pro

+

Follow-up Automático

Analytics

Relatórios

Múltiplos Usuários

Automações

---

### Agentes

Sales Agent

Estimator Agent

Support Agent

Knowledge Agent

Follow-Up Agent

Analytics Agent

Orchestrator

---

### Objetivo

Escalar operação.

---

# ENTERPRISE

Indicado para:

Empresas que desejam IA integrada ao negócio.

---

### Inclui

Tudo do Business

+

Digital Twin

Personalização Avançada

Integrações

APIs

Workflows

---

### Agentes

Todos

---

### Objetivo

Empresa operável por IA.

---

# EVOLUÇÃO DOS PRODUTOS

## Fase 1

Produto único.

Funcionário Digital.

---

Objetivo:

Fechar os primeiros contratos.

---

# Fase 2

Separar em soluções.

---

Recepcionista IA

Responsável por:

- atendimento
- qualificação

---

Orçamentista IA

Responsável por:

- medições
- propostas
- preços

---

Suporte IA

Responsável por:

- FAQ
- documentação
- dúvidas

---

# Fase 3

Pacotes completos.

---

Comercial IA

Conjunto:

Sales Agent

CRM Agent

Follow-Up Agent

---

Operação IA

Conjunto:

Support Agent

Knowledge Agent

Analytics Agent

---

Empresa IA

Conjunto:

Todos os agentes

---

# FUTURO

## Site Conversacional (V0.4)

> Primeiro passo na hero: V0.2. Visão completa em [VISION.md](VISION.md).

Produto de experiência.

---

Problema:

Navegação tradicional.

---

Solução:

Experiência baseada em conversa e intenção — **sem HTML gerado por LLM**.

---

# FUTURO

## Gêmeo Digital (V0.5 — Digital Twin Público)

Produto premium (Enterprise).

---

Problema:

Conhecimento empresarial disperso.

---

Solução:

Representação digital da empresa.

---

# FUTURO

## Agent Ready Website

Produto premium.

---

Problema:

Empresas não estão preparadas para agentes.

---

Solução:

Estrutura para IA consumir informações da empresa.

---

# FUNCIONALIDADES POR AGENTE

## Sales Agent

Produtos:

Starter

Pro

Business

Enterprise

---

## Estimator Agent

Produtos:

Pro

Business

Enterprise

---

## Support Agent

Produtos:

Pro

Business

Enterprise

---

## Knowledge Agent

Produtos:

Pro

Business

Enterprise

---

## Follow-Up Agent

Produtos:

Business

Enterprise

---

## Analytics Agent

Produtos:

Business

Enterprise

---

## Digital Twin Agent

Produtos:

Enterprise

---

# MÉTRICAS DE SUCESSO

## STARTER

Leads Gerados

---

## PRO

Leads
+
Orçamentos

---

## BUSINESS

Leads
+
Orçamentos
+
Conversões

---

## ENTERPRISE

Leads
+
Conversões
+
Eficiência Operacional

---

# MODELO DE RECEITA

## Receita Inicial

Implantação

+

Mensalidade

---

Exemplo

Implantação

R$ 500 a R$ 2.000

---

Mensalidade

R$ 97 a R$ 997

Dependendo do plano.

---

# META DE EVOLUÇÃO

Agência

↓

Produto

↓

Plataforma

↓

Sistema Operacional

↓

Empresa Operável por IA

---

# REGRA PRINCIPAL

Nenhuma funcionalidade deve ser construída sem responder:

1. Qual produto utiliza isso?
2. Qual plano utiliza isso?
3. Qual problema resolve?
4. Como gera valor para o cliente?

Se não houver resposta clara, a funcionalidade deve ser adiada.

---

# OBJETIVO FINAL

Construir uma plataforma onde pequenas empresas possam contratar funcionários digitais da mesma forma que hoje contratam colaboradores humanos.

Agency OS não vende sites.

Agency OS vende capacidade operacional.