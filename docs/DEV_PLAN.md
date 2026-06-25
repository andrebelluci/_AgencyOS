# DEV PLAN — Agency OS

## Status

Documento mestre de implementação.  
Última revisão: 2026-06-25 (expansão Onda 7 — operação pré-deploy #32–#34).

---

# Decisões tomadas (CTO)

Estas decisões resolvem conflitos entre documentos e não encurtam prazos — apenas eliminam ambiguidade.

| # | Decisão | Motivo |
|---|---------|--------|
| D1 | **Multi-tenant desde V0.1** | NON_NEGOTIABLES + ADR-003. ROADMAP Fase 2 estava errado ao adiar. |
| D2 | **Monólito Next.js único** (não monorepo) até 20 clientes | ADR-004. `apps/` e `packages/` ficam para V1. |
| D3 | **Orçamento automático = V0.3**, não V0.1 | MVP.md prevalece sobre ROADMAP Fase 1 para escopo. |
| D4 | **CRM V0.1 = `leads.status`** | Sem tabela `opportunities` até V0.3. |
| D5 | **8 tabelas no V0.1** | Ver DATABASE.md seção MVP. Sem event store, workflows, agent_runs. |
| D6 | **2 agentes runtime no V0.1** | Orchestrator + Sales. Knowledge = pipeline RAG, não agente conversacional. |
| D7 | **Prompt em 4 camadas no V0.1** | system + platform + tenant + agent. Workflow/task layers em V0.2+. |
| D8 | **Widget: script embed primeiro** | iFrame e domínio customizado em V0.2. |
| D9 | **WhatsApp = link wa.me** | API oficial só com ROI comprovado (V0.3+). |
| D10 | **RLS Supabase obrigatório** | Isolamento não pode depender só da aplicação. |
| D11 | **Embeddings na coluna de `knowledge_chunks`** | Sem tabela `embeddings` separada no V0.1. |
| D12 | **1 usuário owner por tenant no V0.1** | RBAC completo em V0.2. |
| D13 | **API pública para widget** | Route Handlers `/api/chat`, `/api/widget/config`. Server Actions no painel. |
| D14 | **Hero Conversacional = V0.2** | MVP.md seção 2 movida para V0.2 neste plano. Primeiro passo da evolução de interface (antes do Site Adaptativo V0.3 e Site Conversacional V0.4). |
| D15 | **Onda 7 expandida — operação pré-deploy** | Antes do deploy oficial (#30), entram #34 Provisioning → (#32 Admin ‖ #33 Hardening). Sem billing, self-service ou RBAC avançado. V0.2 produto (#35+) só após #31. |
| D16 | **Superadmin por allowlist** | `PLATFORM_ADMIN_EMAILS` (env). Sem tabela de roles nem RBAC multi-nível no V0.1. |

---

# Visão estratégica (referência)

Esta seção **não altera** escopo V0.1 core (#1–#29). Issues #32–#34 fecham **operação** antes do go-live; V0.2 produto (#35+) permanece bloqueado até #31.

| Versão | Foco estratégico |
|--------|------------------|
| V0.1 | Widget + Funcionário Digital — validar leads |
| V0.2 | Hero Conversacional + Widget Hardening |
| V0.3 | Site Adaptativo (Estados + Componentes + Regras) |
| V0.4 | Site Conversacional |
| V0.5 | Digital Twin Público |

Sequência: **Widget → Hero → Site Adaptativo → Site Conversacional → Digital Twin**.

Detalhamento: [VISION.md](VISION.md), [ROADMAP.md](ROADMAP.md).

### Diretrizes arquiteturais futuras (pós-V0.1)

- **Modelo de IA substituível** — abstração em `src/ai/`; sem lock-in em fornecedor
- **Conhecimento = ativo principal** — captura, organização, RAG, evolução contínua
- **RAG privado por padrão** — resposta da knowledge base da empresa, não da internet
- **IA seleciona estados** — não gera HTML/páginas inteiras em tempo real
- **Digital Twin = destino final** — representação operacional, não chatbot genérico

---

# V0.1 — Escopo fechado

## Entra

- Infra: Next.js 15, TypeScript, Tailwind, Shadcn, Supabase, Drizzle, Vercel
- Multi-tenant: `tenant_id`, subdomínio, `public_key` no widget, RLS
- Auth: Supabase Auth, 1 owner por tenant
- Config: empresa, WhatsApp, cidade, serviços, prompt customizado
- Chat IA: streaming, histórico persistido
- Agentes: Orchestrator + Sales
- Tools: `createLead`, `updateLead`, `searchKnowledge`, `buildWhatsAppLink`
- Knowledge: FAQ texto + PDF com RAG (pgvector)
- Leads: captura + score (baixo/médio/alto) + status CRM básico
- Widget: `public/widget/embed.js`
- Painel: dashboard, leads, conversas, knowledge, settings, código embed
- WhatsApp: redirecionamento com mensagem pré-preenchida

## Onda 7 — Operação e go-live (#30–#34)

Fecha o V0.1 para **clientes reais**. Onboarding continua **assistido manualmente** — sem self-service, checkout, assinatura ou billing.

| Issue | Entrega |
|-------|---------|
| **#34** Tenant Provisioning | Service/CLI: criar tenant, owner, `public_key`, settings vazias; checklist de onboarding manual |
| **#32** Platform Admin | Área `(admin)` exclusiva: listar/criar tenants, criar owner, ativar/desativar, métricas básicas cross-tenant |
| **#33** Production Hardening | Rate limit IP + `public_key`, logs estruturados, observabilidade OpenAI/embeddings, erros de produção |
| **#30** Deploy produção | Vercel + Supabase prod (após #33 mergeado) |
| **#31** Onboarding 1º cliente | Executar fluxo com #32+#34 em produção; lead real |

**Ordem:** `#34 → (#32 ‖ #33) → #30 → #31`

**Gate deploy (#30):** #33 ✅ (API pública endurecida).  
**Gate V0.2 (#35+):** #31 ✅ + 1º cliente pagante.

---

## Proibido até cliente pagante

Orçamentos, Estimator Agent, Hero conversacional, WhatsApp API, follow-up automático, pipeline visual, analytics avançado, múltiplos usuários, feature flags, event store, workflow engine, domínio customizado, iFrame, Content Agent, Digital Twin, monorepo, billing, self-service, checkout.

---

# Estrutura de pastas (V0.1)

```
agency-os/
├── docs/
├── public/widget/embed.js
├── drizzle/migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (admin)/          # Onda 7 — #32 Platform Admin
│   │   ├── (widget)/chat/
│   │   └── api/{chat,leads,knowledge,widget,admin}/
│   ├── components/{ui,chat,leads,knowledge,dashboard,admin}/
│   ├── lib/{db,supabase,tenant,auth,utils,rate-limit,logging}/
│   ├── modules/{tenants,leads,conversations,knowledge,settings,provisioning}/
│   ├── agents/{orchestrator,sales,shared}/
│   ├── tools/
│   └── ai/
└── tests/
```

Evolução para monorepo documentada em ARCHITECTURE.md (V1).

---

# Banco V0.1 (8 tabelas)

`tenants`, `tenant_settings`, `users`, `leads`, `conversations`, `messages`, `knowledge_documents`, `knowledge_chunks`

Detalhamento de campos em DATABASE.md.

---

# Fluxos V0.1

1. **Atendimento** — widget → conversation → orchestrator → sales → stream → messages
2. **Dúvidas** — sales → searchKnowledge → resposta baseada em contexto
3. **Lead** — sales coleta dados → createLead → leads + conversation.lead_id
4. **WhatsApp** — buildWhatsAppLink → clique registrado → wa.me
5. **Onboarding** — owner configura settings → upload knowledge → copia embed
6. **Painel** — contagens + listas

---

# Ordem de implementação (6–8 semanas)

## Bloco 0 — Fundação (Semana 1)
1. Bootstrap Next.js + deps
2. Supabase project
3. Drizzle + migrations (tenants, tenant_settings, users)
4. Tenant middleware + getTenant()
5. Auth + login + proteção dashboard
6. RLS policies

## Bloco 1 — Dados (Semana 2)
7. Schema leads, conversations, messages
8. Repositories/services por módulo
9. tenant_settings CRUD
10. Seed dev tenant

## Bloco 2 — IA (Semana 3)
11. Estrutura agents/ + prompt-builder
12. Tools desacopladas
13. OpenAI streaming
14. POST /api/chat

## Bloco 3 — Widget (Semana 4)
15. UI chat
16. Rota pública + /api/widget/config
17. embed.js
18. Teste cross-origin
19. Botão WhatsApp

## Bloco 4 — Knowledge (Semana 5)
20. Schema knowledge_*
21. FAQ texto (quick win)
22. searchKnowledge tool
23. RAG no Sales Agent
24. Upload PDF + chunking + embeddings
25. Painel /knowledge

## Bloco 5 — Go-live (Semana 6–7)
26. Dashboard
27. /leads + /conversations
28. /settings + embed generator
29. **#34** Tenant Provisioning
30. **#32** Platform Admin ‖ **#33** Production Hardening
31. **#30** Deploy produção
32. **#31** Onboarding 1º cliente

### Gates entre blocos

| Gate | Critério |
|------|----------|
| 0→1 | Login + RLS isolando tenant |
| 1→2 | Lead criado via service |
| 2→3 | Chat responde no browser |
| 3→4 | Widget externo captura lead |
| 4→5 | Agente usa FAQ sem inventar |
| 5→7 | Provisioning + hardening antes de deploy |
| 7→V0.2 | 1 cliente em produção com leads reais (#31 ✅) |

---

# V0.2 — Pós 1º pagante

**Interface (estratégico):** Hero conversacional — chat inline na hero, onboarding conversacional, perguntas contextuais, estados pré-definidos (issues #36–#37).

**Resiliência (estratégico):** Widget Hardening completo (quotas por tenant, abuse avançado) — parte mínima antecipada em **#33** (Onda 7); restante em V0.2.

**Backlog existente (#35–#44):** domínio customizado, Hero, iFrame, busca em conversas, RBAC básico, tenant_features, landing Agency OS, métricas widget→lead→WhatsApp, Support Agent, citação RAG.

> Milestone GitHub `V0.2 — Site Conversacional` agrupa estas issues. Site Conversacional **completo** = V0.4 na visão estratégica.

---

# V0.3 — Pós 3–10 pagantes

**Interface (estratégico):** Site Adaptativo — IA seleciona estados/perfil; conteúdo, CTA e componentes por regras (sem HTML gerado por LLM). Issues dedicadas ainda não criadas.

**Automação comercial (backlog #45–#52):** Estimator Agent, pricing_tables, quotes, opportunities, follow-up, event store leve, analytics, WhatsApp API (se ROI).

> Milestone GitHub `V0.3 — Orçamentista IA` refere-se à trilha de automação, não ao Site Adaptativo.

---

# V1 — Agency OS

Monorepo, CRM completo, automações, planos enforced, preparação Agent Ready.

Visão completa permanece em VISION.md e ROADMAP.md — este documento não a remove.

---

# Referência cruzada

- Issues detalhadas: [BACKLOG.md](BACKLOG.md)
- Agentes de produto: [AGENTS.md](AGENTS.md)
- Agentes de desenvolvimento: [CURSOR_AGENTS.md](CURSOR_AGENTS.md)
