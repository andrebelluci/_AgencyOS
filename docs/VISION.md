# AGENCY OS

## O que é

Agency OS é uma plataforma SaaS multi-tenant para pequenas empresas.

O objetivo não é vender sites.

O objetivo é vender funcionários digitais capazes de executar tarefas comerciais, operacionais e de atendimento.

O site é apenas uma interface.

O produto real é um sistema composto por IA, automações, conhecimento estruturado e agentes especializados.

**Importante:** o widget embeddable (V0.1) é mecanismo de **distribuição e onboarding** — não é o produto final. O produto é o **Funcionário Digital**: uma empresa operável por IA.

---

# De navegação a intenção

**Hoje (web tradicional):**

Visitante → Navega → Procura informação → Encontra contato

**Destino (Agency OS):**

Visitante → Expressa intenção → IA entende contexto → Experiência se adapta → Objetivo é concluído

Não estamos construindo um chatbot para site. Estamos construindo uma **empresa operável por IA**. O site é uma das interfaces.

---

# Evolução do produto (versões)

| Versão | Nome estratégico | Objetivo |
|--------|------------------|----------|
| **V0.1** | Site + Widget + Funcionário Digital | Validar aquisição de leads |
| **V0.2** | Hero Conversacional + Widget Hardening | Experiência guiada na hero; API pública resiliente |
| **V0.3** | Site Adaptativo | IA seleciona estados (perfil → conteúdo/CTA/componentes) |
| **V0.4** | Site Conversacional | Conversa substitui parte da navegação |
| **V0.5** | Digital Twin Público | Visitante fala com representação operacional da empresa |

Sequência: **Widget → Hero → Site Adaptativo → Site Conversacional → Digital Twin Público**

Detalhamento em [ROADMAP.md](ROADMAP.md), [PRODUCTS.md](PRODUCTS.md) e [DEV_PLAN.md](DEV_PLAN.md). Implementação V0.1 inalterada.

---

# Problema

Pequenas empresas possuem:

- dificuldade para responder clientes rapidamente
- dificuldade para gerar orçamentos
- dificuldade para acompanhar leads
- dificuldade para produzir conteúdo
- dependência de atendimento humano
- processos repetitivos

Na maioria dos casos o problema não é falta de site.

O problema é falta de operação.

---

# Solução

Criar um sistema operacional para pequenas empresas.

O sistema deve:

- captar leads
- qualificar leads
- responder clientes
- gerar orçamentos
- criar propostas
- realizar follow-up
- armazenar conhecimento
- automatizar tarefas repetitivas

Tudo através de agentes especializados.

---

# Produto Inicial

Nome interno:

Funcionário Digital

Primeira versão:

- Landing Page
- Chat IA
- Captura de Leads
- Integração WhatsApp
- Orçamento Automático
- Painel Administrativo

Objetivo:

Gerar resultado financeiro para o cliente.

---

# Público-Alvo Inicial

Empresas de serviço.

Exemplos:

- Pintores
- Empresas de acabamento
- Cimento queimado
- Marmorarias
- Reformas
- Construção
- Energia solar
- Instalações

Motivo:

Processos semelhantes.

Grande volume de dúvidas repetitivas.

Necessidade constante de orçamento.

Dependência de WhatsApp.

---

# Filosofia do Produto

O cliente não compra tecnologia.

O cliente compra resultado.

Não vender:

"Site"

Vender:

"Recepcionista IA"

"Orçamentista IA"

"Atendimento 24 horas"

"Funcionário Digital"

---

# Visão de Longo Prazo

Agency OS deve evoluir para uma plataforma onde cada empresa possui:

- Site Inteligente (adaptativo e conversacional)
- Base de Conhecimento (ativo principal)
- CRM
- Agentes Especializados
- Automações
- Gêmeo Digital (destino final)

A empresa passa a operar através da plataforma.

---

# Diretrizes arquiteturais futuras

Estas diretrizes orientam decisões **após V0.1**. Não alteram escopo, backlog ou cronograma atual.

## Modelo de IA é substituível

O Agency OS não deve depender de OpenAI, Gemini, Claude ou qualquer fornecedor específico. O modelo é intercambiável via camada de abstração em `src/ai/`.

## Conhecimento é o ativo principal

O ativo mais valioso não é o modelo — é o **conhecimento estruturado da empresa**. Priorizar captura, organização, recuperação e evolução contínua.

## RAG privado por padrão

Fluxo preferencial: Pergunta → Knowledge Base da empresa → RAG → Resposta. Não: Pergunta → Internet → Resposta. O conhecimento empresarial vem da própria empresa.

## Site conversacional ≠ HTML gerado por IA

A IA **não gera páginas inteiras** em tempo real. A visão é: **Estados + Componentes + Regras + Contexto + IA**. A IA seleciona experiências; não monta toda a interface do zero.

## Digital Twin é o destino final

O visitante deixa de conversar com um chatbot genérico e passa a interagir com uma **representação operacional** da empresa — serviços, processos, histórico e conhecimento integrados.

---

# As 5 Grandes Ideias

## 1. Site Personalizado

Cada visitante recebe uma experiência diferente.

O conteúdo se adapta automaticamente.

Objetivo:

Aumentar conversão.

---

## 2. Site Conversacional

> **Versão estratégica completa:** V0.4. Primeiro passo (Hero guiado) em V0.2. Ver evolução em [VISION.md](VISION.md).

O visitante conversa em vez de navegar.

A IA conduz a experiência.

Objetivo:

Eliminar fricção.

---

## 3. Funcionário Digital

Agente responsável por executar tarefas.

Objetivo:

Substituir trabalho repetitivo.

---

## 4. Gêmeo Digital

Representação digital da empresa.

Treinada com:

- documentos
- processos
- FAQs
- histórico
- catálogo

Objetivo:

Permitir que o cliente converse com a própria empresa.

---

## 5. Site Preparado para IA

O site deve ser compreendido tanto por humanos quanto por agentes.

Estruturar:

- APIs
- Dados estruturados
- JSON-LD
- Schema.org
- Knowledge Graph

Objetivo:

Preparar a empresa para a internet orientada por agentes.

---

# Estratégia

Primeiro:

Validar vendas.

Depois:

Escalar plataforma.

Nunca construir complexidade antes de existir demanda.

---

# Regra Principal

Toda funcionalidade desenvolvida deve responder:

"Isso ajuda a transformar uma empresa comum em uma empresa operável por IA?"

Se a resposta for não, a funcionalidade deve ser questionada.

---

# Objetivo Final

Construir o principal sistema operacional para pequenas empresas baseado em IA.

Não competir com criadores de sites.

Não competir com agências tradicionais.

Criar uma nova categoria:

Empresa Operável por IA.