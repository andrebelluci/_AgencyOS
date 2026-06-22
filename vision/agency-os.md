# AGENCY OS - VISÃO ESTRATÉGICA

## CONTEXTO

Este projeto NÃO é uma agência de sites.

Este projeto é uma plataforma SaaS multi-tenant para pequenas empresas.

O objetivo inicial é vender um produto simples chamado:

"Funcionário Digital"

Mas a visão de longo prazo é criar um Agency OS (Sistema Operacional para Empresas) baseado em IA.

Toda decisão arquitetural deve considerar escalabilidade, reutilização, multi-tenancy e agentes de IA.

---

# MISSÃO

Transformar empresas tradicionais em empresas operáveis por IA.

O cliente não compra um site.

O cliente compra:

- mais leads
- mais vendas
- menos atendimento manual
- mais automação
- mais eficiência operacional

O site é apenas a interface.

O produto real é o sistema.

---

# VISÃO DE 5 ANOS

A internet está migrando de páginas para agentes.

Hoje:

- Home
- Sobre
- Serviços
- Contato

Futuro:

- Conversas
- Agentes
- Personalização
- Automação
- Execução de tarefas

O sistema deve ser desenvolvido pensando nesse futuro.

---

# AS 5 GRANDES IDEIAS

## 1. Site Personalizado por Visitante

Objetivo:

Cada visitante recebe uma experiência diferente.

Exemplos:

- conteúdos diferentes
- CTA diferente
- ofertas diferentes
- serviços destacados diferentes

Com base em:

- origem do tráfego
- localização
- comportamento
- histórico
- perfil inferido

Longo prazo:

Personalização gerada por IA em tempo real.

---

## 2. Site Conversacional

Objetivo:

Eliminar navegação tradicional.

Substituir menus por conversa.

Em vez de:

- Home
- Sobre
- Serviços

O visitante apenas conversa.

A IA conduz a experiência.

A IA busca conteúdos.

A IA responde dúvidas.

A IA gera orçamentos.

A IA captura leads.

---

## 3. Funcionário Digital

Objetivo:

Substituir tarefas repetitivas.

Exemplos:

- recepcionista
- SDR
- suporte
- orçamentista
- qualificação de leads

O Funcionário Digital será o primeiro produto comercial.

---

## 4. Gêmeo Digital da Empresa

Objetivo:

Treinar uma IA com:

- documentos
- FAQs
- processos
- catálogo
- histórico

O visitante não conversa com um chatbot.

O visitante conversa com a empresa.

---

## 5. Site Preparado para Agentes

Objetivo:

Não atender apenas humanos.

Atender agentes de IA.

Estruturar:

- APIs
- Dados estruturados
- Schema.org
- JSON-LD
- Knowledge Graph
- MCP futuramente

A empresa deve ser facilmente compreendida por sistemas de IA.

---

# ROADMAP

## FASE 1 - AGORA

Construir:

- Landing Page
- Chat IA
- Captura de Leads
- Integração WhatsApp
- Orçamento Automático
- Painel Administrativo simples

Objetivo:

Validar vendas.

---

## FASE 2 - 6 A 12 MESES

Construir:

- CRM
- Pipeline Comercial
- Automações
- Follow-up
- Multi-Tenant completo
- Gestão de clientes

Objetivo:

Transformar serviço em plataforma.

---

## FASE 3 - 2 A 5 ANOS

Construir:

- Gêmeo Digital
- Site Conversacional completo
- Personalização em tempo real
- Agentes especializados
- Integração com agentes externos
- Agency OS completo

Objetivo:

Transformar empresas em organizações operáveis por IA.

---

# ARQUITETURA

Estrutura sugerida:

agency-os/

apps/
web/
admin/
api/

agents/
sales-agent/
support-agent/
estimator-agent/
content-agent/
orchestrator/

packages/
ui/
crm/
ai/
automation/
analytics/

knowledge/
clients/

deployments/

Todo código deve ser modular.

Nada deve depender de um cliente específico.

Tudo deve ser configurável.

---

# MULTI TENANT

Todo cliente é um tenant.

Exemplos:

cliente-a.com.br
cliente-b.com.br
cliente-c.com.br

Todos compartilham o mesmo sistema.

Muda apenas:

- identidade visual
- conteúdo
- base de conhecimento
- configurações

Nunca criar sistemas separados para clientes.

---

# AGENTES

## Sales Agent

Responsável por:

- capturar leads
- qualificar leads
- responder dúvidas
- agendar reuniões
- encaminhar para WhatsApp
- gerar propostas

Regra:

Sempre tentar gerar próximo passo.

Nunca terminar conversa sem CTA.

---

## Estimator Agent

Responsável por:

- cálculos
- medições
- geração de orçamento
- geração de proposta

Regra:

Nunca inventar preços.

Usar apenas tabelas cadastradas.

---

## Support Agent

Responsável por:

- suporte
- FAQ
- dúvidas
- acompanhamento

Regra:

Se não possuir alta confiança, encaminhar humano.

---

## Content Agent

Responsável por:

- artigos
- FAQs
- Schema.org
- JSON-LD
- GEO
- SEO

Regra:

Gerar conteúdo para humanos e agentes.

---

## Orchestrator

Responsável por:

- entender intenção
- escolher agente
- controlar fluxo

Regra:

Sempre enviar a tarefa para o agente correto.

---

# STACK PRINCIPAL

Frontend:

- Next.js
- TypeScript
- Tailwind
- Shadcn
- Framer Motion

Backend:

- Next.js Server Actions
- API Routes

Banco:

- PostgreSQL

ORM:

- Drizzle ORM

Autenticação:

- Supabase Auth

IA:

- OpenAI

Vetorial:

- pgvector

Hospedagem inicial:

- Vercel
- Supabase

Hospedagem futura:

- VPS própria
- Docker
- Coolify

---

# REGRAS DE DESENVOLVIMENTO

Sempre:

- TypeScript
- Código limpo
- Componentização
- Mobile First
- Server Components
- SEO otimizado
- Performance otimizada
- Arquitetura escalável
- Multi-tenant ready

Nunca:

- Duplicar código
- Criar lógica específica para clientes
- Acoplar componentes
- Criar soluções temporárias sem justificativa

---

# COMO O ASSISTENTE DEVE AGIR

Você é o arquiteto técnico principal deste projeto.

Antes de criar funcionalidades:

1. Pensar em escalabilidade.
2. Pensar em multi-tenancy.
3. Pensar em reutilização.
4. Pensar em agentes de IA.
5. Pensar na visão de 5 anos.

Sempre sugerir:

- melhor arquitetura
- melhores padrões
- automações futuras
- integrações futuras

Quando houver dúvida entre solução rápida e solução escalável:

Explique os trade-offs.

Priorize simplicidade para validação.

Mantenha compatibilidade com a visão de longo prazo.