# MULTI TENANCY

## Objetivo

Permitir que uma única plataforma atenda centenas ou milhares de empresas.

Todos os clientes compartilham:

- código
- infraestrutura
- agentes
- automações
- banco de dados

Mas cada cliente possui:

- domínio próprio
- identidade visual própria
- conhecimento próprio
- usuários próprios
- dados próprios

---

# PRINCÍPIO FUNDAMENTAL

NÃO EXISTEM PROJETOS DE CLIENTES.

EXISTE APENAS UM PRODUTO.

Toda customização deve acontecer através de configuração.

Nunca através de código específico.

---

# O QUE NÃO FAZER

ERRADO:

cliente-a/
cliente-b/
cliente-c/

com aplicações independentes.

---

ERRADO:

if cliente == "empresa-x"

executar lógica especial.

---

ERRADO:

criar componentes exclusivos para cada cliente.

---

# O QUE FAZER

CORRETO:

Uma única plataforma.

Um único deploy.

Configuração por tenant.

---

# CONCEITO DE TENANT

Tenant representa uma empresa.

Exemplo:

Tenant:

Belluci Acabamentos

Tenant:

Alpha Reformas

Tenant:

Solar Prime

---

Cada tenant possui:

id
nome
slug
domínio
configurações

---

# RESOLUÇÃO DE TENANT

Toda requisição precisa identificar o tenant.

Ordem:

1. Domínio customizado
2. Subdomínio
3. Ambiente local

---

Exemplo:

belluci.com.br

↓

tenant_id = belluci

---

Exemplo:

alpha.agencyos.com.br

↓

tenant_id = alpha

---

Local:

localhost

↓

tenant_id = development

---

# ESTRUTURA DE BANCO

Todas as tabelas devem possuir:

tenant_id

---

Exemplo:

tenants

id
name
slug
domain
status
created_at

---

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

---

documents

id
tenant_id

---

quotes

id
tenant_id

---

opportunities

id
tenant_id

---

# REGRA OBRIGATÓRIA

Toda consulta deve filtrar por tenant.

Exemplo:

SELECT *
FROM leads
WHERE tenant_id = ?

---

Nunca retornar dados sem tenant.

---

# ISOLAMENTO

Cada empresa deve enxergar apenas seus dados.

Nunca:

- leads de outra empresa
- conversas de outra empresa
- documentos de outra empresa

---

# CONFIGURAÇÃO POR TENANT

Tabela:

tenant_settings

---

Campos sugeridos:

tenant_id

company_name

logo_url

primary_color

secondary_color

whatsapp

email

address

business_hours

---

Objetivo:

Permitir personalização sem alterar código.

---

# BRANDING

Cada tenant possui:

logo

cores

tipografia

conteúdo

---

O sistema permanece igual.

---

# DOMÍNIOS

Cada tenant pode utilizar:

Domínio próprio

Exemplo:

belluciacabamentos.com.br

---

Ou subdomínio

Exemplo:

belluci.agencyos.com.br

---

# ESTRUTURA DE CONHECIMENTO

Cada tenant possui sua própria base.

Exemplo:

knowledge_documents

id
tenant_id
title
content

---

Embeddings:

id
tenant_id
document_id

---

# REGRA

Agentes só podem acessar documentos do tenant atual.

---

# AGENTES MULTI TENANT

Sales Agent

↓

Pode acessar apenas:

- leads do tenant
- CRM do tenant

---

Support Agent

↓

Pode acessar apenas:

- documentos do tenant
- FAQ do tenant

---

Estimator Agent

↓

Pode acessar apenas:

- preços do tenant
- serviços do tenant

---

# TABELAS DE PREÇO

Cada empresa possui preços diferentes.

Tabela:

pricing_tables

id
tenant_id
service
price

---

Nunca compartilhar preços.

---

# PROMPTS

Prompts devem ser montados dinamicamente.

Exemplo:

Sistema:

Você representa Belluci Acabamentos.

Serviços:

- Cimento queimado
- Porcelanato
- Reformas

Cidade:

Mogi Mirim

---

Não criar prompts fixos.

---

# STORAGE

Arquivos devem ser organizados por tenant.

Exemplo:

storage/

belluci/

pdfs/

logos/

documents/

---

alpha/

pdfs/

logos/

documents/

---

# ANALYTICS

Toda métrica deve ser segmentada.

Exemplo:

Leads por tenant

Conversões por tenant

Receita por tenant

---

# PERMISSÕES

Estrutura:

Platform Owner

↓

Tenant Owner

↓

Admin

↓

Manager

↓

Operator

---

# PLATFORM OWNER

Controla toda a plataforma.

Pode acessar:

- todos os tenants
- faturamento
- configurações globais

---

# TENANT OWNER

Controla apenas sua empresa.

---

# ADMIN

Gerencia operação.

---

# MANAGER

Gerencia equipe.

---

# OPERATOR

Executa tarefas.

---

# FEATURE FLAGS

Toda funcionalidade deve poder ser ativada por tenant.

Tabela:

tenant_features

---

Exemplos:

chat_ai

crm

follow_up

analytics

digital_twin

---

Objetivo:

Criar planos diferentes.

---

# PLANOS

Exemplo:

Starter

- Chat IA
- Leads

---

Pro

- Chat IA
- Leads
- CRM
- Orçamentos

---

Business

- Tudo

---

# DEPLOY

Existe apenas:

1 aplicação

1 banco

1 backend

1 frontend

---

Múltiplos tenants.

---

# MIGRAÇÕES

Toda alteração de banco deve funcionar para:

- cliente atual
- futuros clientes

---

Nunca criar estrutura exclusiva.

---

# TESTES

Toda funcionalidade nova deve responder:

Funciona com:

- 1 tenant?
- 10 tenants?
- 100 tenants?

---

# CHECKLIST DE DESENVOLVIMENTO

Antes de concluir qualquer funcionalidade:

✓ Possui tenant_id?

✓ Está isolada?

✓ Funciona com domínio customizado?

✓ Funciona com subdomínio?

✓ Não depende de cliente específico?

✓ É configurável?

✓ Pode ser reutilizada?

---

# REGRA DE OURO

Se uma funcionalidade só funciona para um cliente específico, a arquitetura está errada.

Toda funcionalidade deve funcionar para qualquer empresa utilizando apenas configuração.

---

# OBJETIVO FINAL

Operar centenas ou milhares de empresas através de uma única plataforma, um único código e uma única infraestrutura.