# WORKFLOWS

## Objetivo

Definir os fluxos operacionais do Agency OS.

Workflows representam como os agentes trabalham juntos para gerar resultado.

Todo workflow deve possuir:

- Trigger
- Condições
- Agentes envolvidos
- Ferramentas utilizadas
- Resultado esperado

---

# PRINCÍPIOS

1. Automatizar processos repetitivos

2. Reduzir trabalho humano

3. Registrar tudo

4. Ser auditável

5. Ser reutilizável

6. Funcionar para qualquer tenant

---

# WORKFLOW 001

## NOVO LEAD

Objetivo:

Transformar visitante em oportunidade.

---

Trigger

lead.created

---

Fluxo

Visitante

↓

Chat IA

↓

Sales Agent

↓

Lead Criado

↓

CRM

↓

Oportunidade Criada

↓

Follow-up Programado

---

Agentes

Sales Agent

CRM Agent

Follow-Up Agent

---

Resultado Esperado

Lead registrado.

Oportunidade criada.

Próximo contato definido.

---

# WORKFLOW 002

## QUALIFICAÇÃO DE LEAD

Objetivo

Determinar potencial do lead.

---

Trigger

lead.created

---

Perguntas

Qual serviço deseja?

Qual cidade?

Qual metragem?

Qual prazo?

Qual orçamento estimado?

---

Classificação

Frio

Morno

Quente

---

Resultado

score definido

etapa definida

prioridade definida

---

# WORKFLOW 003

## ORÇAMENTO AUTOMÁTICO

Objetivo

Gerar orçamento sem intervenção humana.

---

Trigger

quote.requested

---

Fluxo

Sales Agent

↓

Estimator Agent

↓

Tabela de Preços

↓

Cálculo

↓

Orçamento

↓

PDF

↓

Lead

---

Resultado

Orçamento enviado.

---

# WORKFLOW 004

## PROPOSTA COMERCIAL

Objetivo

Gerar proposta formal.

---

Trigger

quote.approved

---

Fluxo

Estimator Agent

↓

Proposal Generator

↓

PDF

↓

WhatsApp

↓

Email

---

Resultado

Proposta entregue.

---

# WORKFLOW 005

## FOLLOW-UP

Objetivo

Evitar perda de oportunidades.

---

Trigger

lead.no_response

---

Fluxo

CRM Agent

↓

Follow-Up Agent

↓

Mensagem

↓

Aguardar Resposta

---

Intervalos

1 dia

3 dias

7 dias

14 dias

30 dias

---

Parada

Cliente respondeu

ou

Negócio encerrado

---

# WORKFLOW 006

## CONVERSA DE SUPORTE

Objetivo

Resolver dúvidas.

---

Trigger

support.requested

---

Fluxo

Usuário

↓

Support Agent

↓

Knowledge Agent

↓

Resposta

---

Se confiança < 80%

↓

Humano

---

Resultado

Problema resolvido.

---

# WORKFLOW 007

## INGESTÃO DE CONHECIMENTO

Objetivo

Adicionar conhecimento à empresa.

---

Trigger

document.uploaded

---

Fluxo

PDF

↓

Knowledge Agent

↓

Chunking

↓

Embeddings

↓

pgvector

↓

Indexação

---

Resultado

Documento disponível para busca.

---

# WORKFLOW 008

## GERAÇÃO DE FAQ

Objetivo

Transformar conhecimento em respostas.

---

Trigger

knowledge.updated

---

Fluxo

Knowledge Agent

↓

Content Agent

↓

FAQ

↓

Base de Conhecimento

---

Resultado

Novas respostas disponíveis.

---

# WORKFLOW 009

## CRIAÇÃO DE CONTEÚDO

Objetivo

Gerar conteúdo para SEO e GEO.

---

Trigger

content.requested

---

Fluxo

Content Agent

↓

Pesquisa Interna

↓

Estrutura

↓

Artigo

↓

Schema.org

↓

JSON-LD

---

Resultado

Conteúdo pronto.

---

# WORKFLOW 010

## AGENDAMENTO

Objetivo

Marcar reuniões.

---

Trigger

meeting.requested

---

Fluxo

Sales Agent

↓

Disponibilidade

↓

Calendário

↓

Confirmação

↓

CRM

---

Resultado

Reunião marcada.

---

# WORKFLOW 011

## RECUPERAÇÃO DE LEADS

Objetivo

Reativar oportunidades antigas.

---

Trigger

lead.inactive

---

Fluxo

Analytics Agent

↓

Identifica Lead

↓

Follow-Up Agent

↓

Contato

↓

CRM Atualizado

---

Resultado

Lead recuperado.

---

# WORKFLOW 012

## ANÁLISE DE PERFORMANCE

Objetivo

Gerar inteligência.

---

Trigger

daily

weekly

monthly

---

Fluxo

Analytics Agent

↓

Coleta Dados

↓

Relatório

↓

Dashboard

---

Indicadores

Leads

Conversões

Orçamentos

Receita

Tempo de Resposta

---

Resultado

Insights acionáveis.

---

# WORKFLOW 013

## ONBOARDING DE NOVO TENANT

Objetivo

Criar empresa na plataforma.

---

Trigger

tenant.created

---

Fluxo

Tenant

↓

Configuração

↓

Domínio

↓

Usuário Owner

↓

Plano

↓

Agentes

↓

Sistema Ativado

---

Resultado

Empresa pronta para operar.

---

# WORKFLOW 014

## DIGITAL TWIN UPDATE

Objetivo

Atualizar o gêmeo digital.

---

Trigger

new_knowledge

new_conversation

new_document

crm_update

---

Fluxo

Knowledge Agent

↓

Digital Twin Agent

↓

Atualização Contextual

---

Resultado

Representação da empresa evolui continuamente.

---

# EVENTOS PADRÃO

lead.created

lead.updated

lead.qualified

lead.converted

conversation.started

conversation.ended

quote.requested

quote.generated

quote.sent

proposal.created

proposal.sent

meeting.scheduled

document.uploaded

knowledge.updated

tenant.created

user.created

workflow.started

workflow.completed

workflow.failed

---

# REGRAS

Todo workflow deve:

- possuir trigger
- gerar logs
- gerar eventos
- ser auditável
- ser reutilizável

---

# REGRA DE OURO

Nenhum agente trabalha sozinho.

Os agentes formam uma equipe.

O valor do Agency OS não está em um agente.

Está na colaboração entre eles.

---

# OBJETIVO FINAL

Transformar processos empresariais em fluxos operados por IA.

O cliente não utiliza funcionalidades.

O cliente utiliza operações completas.