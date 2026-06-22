# DATABASE

## Objetivo

Definir a estrutura de dados do Agency OS.

Toda modelagem deve ser:

- Multi-tenant
- Escalável
- Auditável
- Compatível com IA
- Compatível com automações

---

# REGRA GLOBAL

Toda tabela operacional deve possuir:

id
tenant_id
created_at
updated_at

---

# TENANTS

Representa uma empresa.

## tenants

id
name
slug
domain
status
created_at
updated_at

---

# USERS

Usuários da plataforma.

## users

id
tenant_id
email
name
role
status
created_at
updated_at

---

# LEADS

Leads capturados.

## leads

id
tenant_id
name
email
phone
city
source
status
notes
created_at
updated_at

---

# OPPORTUNITIES

Pipeline comercial.

## opportunities

id
tenant_id
lead_id
stage
value
probability
assigned_to
created_at
updated_at

---

# CONVERSATIONS

Sessões de conversa.

## conversations

id
tenant_id
lead_id
status
started_at
ended_at

---

# MESSAGES

Mensagens individuais.

## messages

id
tenant_id
conversation_id
role

user
assistant
system
agent

content
created_at

---

# AGENTS

Registro dos agentes.

## agents

id
name
type
status
created_at

---

# AGENT RUNS

Histórico de execução.

## agent_runs

id
tenant_id
agent_id
conversation_id
input
output
execution_time
status
created_at

---

# KNOWLEDGE DOCUMENTS

Documentos enviados.

## knowledge_documents

id
tenant_id
title
type
file_url
status
created_at

---

# KNOWLEDGE CHUNKS

Fragmentos processados.

## knowledge_chunks

id
tenant_id
document_id
content
position
created_at

---

# EMBEDDINGS

Vetores.

## embeddings

id
tenant_id
chunk_id
embedding
created_at

---

# QUOTES

Orçamentos.

## quotes

id
tenant_id
lead_id
status
total
created_at
updated_at

---

# QUOTE ITEMS

Itens do orçamento.

## quote_items

id
quote_id
service
quantity
unit_price
total

---

# SERVICES

Serviços oferecidos.

## services

id
tenant_id
name
description
active

---

# PRICING TABLES

Tabela de preços.

## pricing_tables

id
tenant_id
service_id
unit
price
active

---

# TASKS

Tarefas internas.

## tasks

id
tenant_id
title
assigned_to
status
due_date

---

# WORKFLOWS

Fluxos automatizados.

## workflows

id
tenant_id
name
status

---

# WORKFLOW RUNS

Execuções.

## workflow_runs

id
tenant_id
workflow_id
status
started_at
ended_at

---

# EVENTS

Event Store.

## events

id
tenant_id
event_name
payload
created_at

---

# ANALYTICS EVENTS

Métricas.

## analytics_events

id
tenant_id
event_type
payload
created_at

---

# TENANT SETTINGS

Configurações.

## tenant_settings

tenant_id
company_name
logo_url
primary_color
secondary_color
whatsapp
email
address

---

# TENANT FEATURES

Feature Flags.

## tenant_features

tenant_id
feature
enabled

---

# AUDIT LOGS

Auditoria.

## audit_logs

id
tenant_id
user_id
action
entity
entity_id
payload
created_at

---

# RELACIONAMENTOS PRINCIPAIS

Tenant

↓

Users

↓

Leads

↓

Conversations

↓

Messages

---

Lead

↓

Opportunity

↓

Quote

---

Documents

↓

Chunks

↓

Embeddings

---

# REGRA FINAL

Nenhuma tabela operacional pode ser criada sem justificar:

- por que existe
- qual agente utiliza
- qual workflow utiliza
- qual produto utiliza