# BACKLOG — Agency OS

Issues organizadas para GitHub Projects.  
Importar manualmente ou via `gh issue create`.

**Labels sugeridas:** `v0.1`, `v0.2`, `v0.3`, `infra`, `ai`, `widget`, `panel`, `db`, `ops`, `admin`, `hardening`

**Milestones:** `V0.1 — Funcionário Digital`, `V0.2 — Site Conversacional`, `V0.3 — Orçamentista IA`

> **Nota estratégica (2026-06):** Os milestones GitHub **não foram renomeados** para preservar issues e cronograma. Na visão de longo prazo ([VISION.md](VISION.md)):
> - **V0.2 (estratégico)** = Hero Conversacional + Widget Hardening + dark mode — GitHub **#41–#51** · [DEVELOPMENT_WAVES_V0.2.md](DEVELOPMENT_WAVES_V0.2.md)
> - **V0.3 (estratégico)** = Site Adaptativo — ainda sem issues dedicadas
> - **V0.4 (estratégico)** = Site Conversacional completo
> - Milestone `V0.3 — Orçamentista IA` = automação comercial (#46–#53), paralelo ao Site Adaptativo
>
> **Onda 7 (operação):** #32–#34 são **pré-deploy V0.1** — não iniciam V0.2 produto.

---

## Como importar no GitHub Projects

**Issues V0.1:** [#1–#31](https://github.com/andrebelluci/_AgencyOS/issues?q=is%3Aissue+milestone%3A%22V0.1+-+Funcionario+Digital%22) · Onda 7 ops: **#37** (ISSUE-032), **#38** (ISSUE-033), **#39** (ISSUE-034)

**Issues V0.2:** milestone [`V0.2 - Site Conversacional`](https://github.com/andrebelluci/_AgencyOS/milestone/2) · **#41–#51** · prompts em [DEVELOPMENT_WAVES_V0.2.md](DEVELOPMENT_WAVES_V0.2.md)

> **Mapeamento BACKLOG ↔ GitHub:** números #32–#36 no GitHub foram consumidos por PRs mergeados. As issues operacionais usam IDs lógicos ISSUE-032/033/034 = GitHub **#37/#38/#39**.

Para criar o board (requer escopo `project`):

```powershell
gh auth refresh -s read:project,project
gh project create --owner @me --title "Agency OS"
```

Depois: Projects → Add items → filtrar milestone `V0.1 - Funcionario Digital`.

Para recriar issues V0.1: `powershell -File scripts/create-github-issues.ps1`

Para recriar issues V0.2: `powershell -File scripts/create-github-issues-v02.ps1`

---

# FASE 1 — V0.1 (Funcionário Digital)

## Bloco 0 — Fundação

### ISSUE-001: Bootstrap Next.js
- **Esforço:** Médio
- **Labels:** v0.1, infra
- **Descrição:** Criar app Next.js 15 App Router, TypeScript strict, Tailwind, Shadcn UI, ESLint, estrutura `src/` conforme DEV_PLAN.md.
- **Aceite:** `npm run dev` sobe; pasta `src/` criada; `.env.example` documentado.

### ISSUE-002: Configurar Supabase
- **Esforço:** Pequeno
- **Labels:** v0.1, infra
- **Descrição:** Projeto Supabase (Auth, Postgres, Storage). Variáveis em `.env.local`.
- **Aceite:** Conexão testada; bucket `knowledge` criado.

### ISSUE-003: Drizzle ORM + migrations base
- **Esforço:** Médio
- **Labels:** v0.1, db
- **Descrição:** Drizzle config, schema `tenants`, `tenant_settings`, `users`. Migration inicial.
- **Aceite:** `drizzle-kit push` ou migrate funciona; tipos exportados.

### ISSUE-004: Tenant resolution middleware
- **Esforço:** Médio
- **Labels:** v0.1, infra
- **Descrição:** Middleware identifica tenant por subdomínio (`{slug}.agencyos.com.br`) e `public_key` (widget). Helper `getTenant()`.
- **Aceite:** Request sem tenant retorna 404; dev tenant em localhost funciona.

### ISSUE-005: Auth Supabase + login
- **Esforço:** Pequeno
- **Labels:** v0.1, infra
- **Descrição:** Página login, callback, sessão, proteção rotas `(dashboard)`.
- **Aceite:** Owner loga e acessa dashboard; não autenticado redireciona.

### ISSUE-006: RLS Supabase
- **Esforço:** Médio
- **Labels:** v0.1, db
- **Descrição:** Row Level Security em todas as tabelas por `tenant_id`. Políticas para service role vs authenticated.
- **Aceite:** Query cross-tenant falha no banco.

---

## Bloco 1 — Dados operacionais

### ISSUE-007: Schema leads, conversations, messages
- **Esforço:** Médio
- **Labels:** v0.1, db
- **Descrição:** Migrations conforme DATABASE.md seção MVP. `leads.status` enum CRM básico.
- **Aceite:** Relacionamentos conversation→messages, lead→conversation.

### ISSUE-008: Módulos repositories/services
- **Esforço:** Médio
- **Labels:** v0.1
- **Descrição:** `src/modules/{leads,conversations}/` com repository + service. Toda query filtra `tenant_id`.
- **Aceite:** CRUD leads e messages via service layer.

### ISSUE-009: tenant_settings CRUD
- **Esforço:** Pequeno
- **Labels:** v0.1, panel
- **Descrição:** Service + formulário settings (empresa, WhatsApp, cidade, serviços JSON, prompt).
- **Aceite:** Owner edita e persiste configurações.

### ISSUE-010: Seed tenant desenvolvimento
- **Esforço:** Pequeno
- **Labels:** v0.1, db
- **Descrição:** Script seed com tenant dev, user owner, settings exemplo (empresa de acabamento).
- **Aceite:** `npm run db:seed` popula ambiente local.

---

## Bloco 2 — IA Core

### ISSUE-011: Estrutura agents/ orchestrator + sales
- **Esforço:** Médio
- **Labels:** v0.1, ai
- **Descrição:** `agent.ts`, `prompt.ts`, `rules.ts`, `tools.ts`, `types.ts` conforme AGENTS.md e CURSOR_RULES.md.
- **Aceite:** Orchestrator roteia para Sales; Sales responde com prompt montado.

### ISSUE-012: Prompt builder (4 camadas)
- **Esforço:** Pequeno
- **Labels:** v0.1, ai
- **Descrição:** `src/agents/shared/prompt-builder.ts` — system + platform + tenant + agent.
- **Aceite:** Prompt inclui dados de tenant_settings dinamicamente.

### ISSUE-013: Tools desacopladas
- **Esforço:** Pequeno
- **Labels:** v0.1, ai
- **Descrição:** `createLead`, `updateLead`, `buildWhatsAppLink` em `src/tools/`. Zod validation.
- **Aceite:** Tools não importam agents; agents importam tools.

### ISSUE-014: OpenAI streaming
- **Esforço:** Médio
- **Labels:** v0.1, ai
- **Descrição:** Client OpenAI, helper SSE, function calling para tools do Sales Agent.
- **Aceite:** Stream de tokens funciona em teste isolado.

### ISSUE-015: API POST /api/chat
- **Esforço:** Médio
- **Labels:** v0.1, ai
- **Descrição:** Route Handler público (CORS), recebe message + conversation_id + public_key, persiste messages, retorna SSE.
- **Aceite:** Ciclo completo mensagem→resposta→persistência.

---

## Bloco 3 — Widget

### ISSUE-016: UI Chat component
- **Esforço:** Médio
- **Labels:** v0.1, widget
- **Descrição:** Client component com input, histórico, streaming, loading states. Design limpo (Linear/Stripe).
- **Aceite:** Chat funciona em `/chat` com tenant dev.

### ISSUE-017: API GET /api/widget/config
- **Esforço:** Pequeno
- **Labels:** v0.1, widget
- **Descrição:** Retorna branding público (cores, nome, welcome message) por public_key. Sem dados sensíveis.
- **Aceite:** Widget carrega config sem auth.

### ISSUE-018: embed.js
- **Esforço:** Médio
- **Labels:** v0.1, widget
- **Descrição:** Script injeta botão + iframe/modal apontando para `/chat?key=`. Cross-origin testado.
- **Aceite:** Funciona em HTML estático externo.

### ISSUE-019: Botão WhatsApp no widget
- **Esforço:** Pequeno
- **Labels:** v0.1, widget
- **Descrição:** Integrar buildWhatsAppLink após captura de lead. Registrar clique em metadata.
- **Aceite:** Link wa.me com mensagem pré-preenchida abre corretamente.

---

## Bloco 4 — Knowledge

### ISSUE-020: Schema knowledge_documents + knowledge_chunks
- **Esforço:** Médio
- **Labels:** v0.1, db
- **Descrição:** pgvector extension, coluna embedding em chunks.
- **Aceite:** Migration habilita vector search.

### ISSUE-021: FAQ texto (sem PDF)
- **Esforço:** Pequeno
- **Labels:** v0.1, panel
- **Descrição:** CRUD FAQ no painel, conteúdo salvo como document type=faq.
- **Aceite:** Owner cadastra perguntas/respostas.

### ISSUE-022: searchKnowledge tool
- **Esforço:** Médio
- **Labels:** v0.1, ai
- **Descrição:** Busca semântica top-K por tenant_id. Fallback texto se sem embedding.
- **Aceite:** Query retorna chunks relevantes.

### ISSUE-023: RAG integrado no Sales Agent
- **Esforço:** Médio
- **Labels:** v0.1, ai
- **Descrição:** Sales chama searchKnowledge em perguntas factuais. Regra: não inventar se sem contexto.
- **Aceite:** Resposta cita informação do FAQ cadastrado.

### ISSUE-024: Upload PDF + pipeline embeddings
- **Esforço:** Grande
- **Labels:** v0.1, ai
- **Descrição:** Upload Supabase Storage → extract text → chunk → embed → pgvector.
- **Aceite:** PDF processado e consultável via chat.

### ISSUE-025: Painel /knowledge
- **Esforço:** Médio
- **Labels:** v0.1, panel
- **Descrição:** Lista documentos, status processamento, delete, re-index.
- **Aceite:** Owner gerencia base de conhecimento.

---

## Bloco 5 — Go-live

### ISSUE-026: Dashboard
- **Esforço:** Pequeno
- **Labels:** v0.1, panel
- **Descrição:** Cards: total conversas, total leads, leads da semana (SQL count).
- **Aceite:** Números corretos por tenant.

### ISSUE-027: Página /leads
- **Esforço:** Pequeno
- **Labels:** v0.1, panel
- **Descrição:** Tabela leads com status editável manualmente.
- **Aceite:** Owner vê e atualiza status CRM.

### ISSUE-028: Página /conversations
- **Esforço:** Médio
- **Labels:** v0.1, panel
- **Descrição:** Lista conversas, detalhe com histórico de messages.
- **Aceite:** Owner lê conversas completas.

### ISSUE-029: Settings + embed code generator
- **Esforço:** Pequeno
- **Labels:** v0.1, panel
- **Descrição:** Exibir snippet `<script src="..." data-key="...">` copiável.
- **Aceite:** Cliente copia e instala no site.

### ISSUE-030: Deploy produção
- **Esforço:** Pequeno
- **Labels:** v0.1, infra
- **Descrição:** Vercel + Supabase prod, env vars, domínio `*.agencyos.com.br`.
- **Aceite:** App acessível em produção.
- **Depende de:** #38 (ISSUE-033 / GitHub #38)

### ISSUE-031: Onboarding 1º cliente
- **Esforço:** Pequeno
- **Labels:** v0.1, ops
- **Descrição:** Checklist manual usando #37 Platform Admin + #39 Provisioning: configurar tenant, treinar FAQ, instalar widget, validar lead real em produção.
- **Aceite:** Cliente gera lead real em produção.
- **Depende de:** #30, #37, #39 (GitHub); refinamentos **031A–031D** (pré-requisito recomendado)

### ISSUE-031A: Mensagem inicial configurável
- **Esforço:** Pequeno
- **Labels:** v0.1, widget, panel
- **Descrição:** Campo `tenant_settings.initial_message` com template `{{company_name}}`; editável em Settings; primeira mensagem do widget; default para novos tenants.
- **Aceite:** Owner edita mensagem; widget exibe texto resolvido na abertura.

### ISSUE-031B: Ações rápidas
- **Esforço:** Pequeno
- **Labels:** v0.1, widget, panel
- **Descrição:** `tenant_settings.quick_actions` (JSON): label, type (`whatsapp`|`link`), url, enabled. Editor no painel; widget renderiza ações habilitadas.
- **Aceite:** Ações aparecem no chat; WhatsApp usa número do tenant se URL vazia.

### ISSUE-031C: Refinamento Sales Agent
- **Esforço:** Pequeno
- **Labels:** v0.1, agents
- **Descrição:** Prompt/regras: RAG obrigatório para serviços; sem inventar preços/serviços; qualificação quando RAG vazio; menos respostas genéricas.
- **Aceite:** `npm run test:agents` passa; comportamento documentado em AGENTS.md (referência).

### ISSUE-031D: Identidade visual básica do widget
- **Esforço:** Pequeno
- **Labels:** v0.1, widget, panel
- **Descrição:** `primary_color` editável via color picker + HEX no Settings; validação `#RRGGBB`; aplicado no embed (launcher), header, botões e ações do widget.
- **Aceite:** Cor salva reflete no widget sem redeploy de código; default para novos tenants.

---

## Bloco 6 — Operação pré-deploy (Onda 7)

> Fecha V0.1 para clientes reais. **Sem** self-service, checkout, assinatura ou billing.

### ISSUE-032: Platform Admin
- **GitHub:** [#37](https://github.com/andrebelluci/_AgencyOS/issues/37)
- **Esforço:** Médio
- **Labels:** v0.1, admin, ops, panel
- **Descrição:** Área `(admin)` exclusiva para superadmin (`PLATFORM_ADMIN_EMAILS`). Listar tenants; criar tenant (via service #34); criar owner; ativar/desativar tenant (`tenants.status`); métricas básicas cross-tenant (total tenants, leads, conversas, mensagens últimos 7 dias).
- **Aceite:** Superadmin logado acessa `/admin`; owner comum recebe 403; criar tenant + owner em um fluxo; toggle active/inactive reflete no widget (`/api/chat` e `/api/widget/config` retornam 403 para tenant inativo).
- **Não inclui:** billing, planos, RBAC operator, self-service signup.
- **Depende de:** #39 (ISSUE-034 / GitHub)

### ISSUE-033: Production Hardening
- **GitHub:** [#38](https://github.com/andrebelluci/_AgencyOS/issues/38)
- **Esforço:** Médio
- **Labels:** v0.1, infra, hardening
- **Descrição:** Rate limit por IP e por `public_key` em `/api/chat`, `/api/widget/config` e rotas públicas críticas. Logs estruturados (JSON) com `request_id`, `tenant_id`, rota, latência. Métricas/contadores para chamadas OpenAI (tokens, erros) e embeddings (jobs, falhas). Handler global de erro em produção (sem stack trace ao cliente); mensagens genéricas na API pública.
- **Aceite:** Exceder limite retorna 429; logs aparecem no Vercel; falha OpenAI registrada e resposta SSE encerra com erro amigável; embedding failure visível em log/métrica.
- **Não inclui:** billing por uso, WAF enterprise, quotas por plano (V0.2).
- **Depende de:** #29 (APIs públicas estáveis)
- **Bloqueia:** #30 (deploy)

### ISSUE-034: Tenant Provisioning
- **GitHub:** [#39](https://github.com/andrebelluci/_AgencyOS/issues/39)
- **Esforço:** Médio
- **Labels:** v0.1, ops, db
- **Descrição:** Service `provisionTenant()` + script CLI `npm run provision:tenant`: gera `slug`, `public_key` (crypto-safe), cria `tenants` + `tenant_settings` default + user owner no Supabase Auth + row em `users`. Documentar fluxo manual em `docs/PROVISIONING.md` (passo a passo para operador).
- **Aceite:** Um comando ou chamada de service cria tenant utilizável; owner recebe credenciais; `public_key` único; settings vazias com defaults sensatos; idempotência documentada para slug duplicado.
- **Não inclui:** email automático, convite self-service, pagamento.
- **Depende de:** #10 (seed como referência)

### Mapeamento Onda 7 (BACKLOG ↔ GitHub)

| BACKLOG | GitHub | Título |
|---------|--------|--------|
| ISSUE-034 | [#39](https://github.com/andrebelluci/_AgencyOS/issues/39) | Tenant Provisioning |
| ISSUE-032 | [#37](https://github.com/andrebelluci/_AgencyOS/issues/37) | Platform Admin |
| ISSUE-033 | [#38](https://github.com/andrebelluci/_AgencyOS/issues/38) | Production Hardening |
| ISSUE-030 | [#30](https://github.com/andrebelluci/_AgencyOS/issues/30) | Deploy produção |
| ISSUE-031 | [#31](https://github.com/andrebelluci/_AgencyOS/issues/31) | Onboarding 1º cliente |

**Ordem:** `#39 → (#37 ‖ #38) → #30 → #31`

---

# FASE 2 — V0.2 (Site Conversacional)

> **Ativo desde 2026-06-28.** Gate V0.1 (#31) ✅. Ordem de execução em [DEVELOPMENT_WAVES_V0.2.md](DEVELOPMENT_WAVES_V0.2.md) — **não** segue ordem numérica do BACKLOG.

| ID | GitHub | Título | Esforço | Onda V0.2 |
|----|--------|--------|---------|-----------|
| ISSUE-045 | [#50](https://github.com/andrebelluci/_AgencyOS/issues/50) | Widget dark mode | Pequeno | **1** (primeira) |
| ISSUE-038 | [#44](https://github.com/andrebelluci/_AgencyOS/issues/44) | Busca e filtro em conversas | Pequeno | 1 |
| ISSUE-042 | [#48](https://github.com/andrebelluci/_AgencyOS/issues/48) | Métricas conversão widget→lead→WhatsApp | Pequeno | 1 |
| ISSUE-036 | [#42](https://github.com/andrebelluci/_AgencyOS/issues/42) | Hero conversacional (estados pré-definidos) | Médio | 2 |
| ISSUE-037 | [#43](https://github.com/andrebelluci/_AgencyOS/issues/43) | iFrame embed alternativo | Pequeno | 2 |
| ISSUE-035 | [#41](https://github.com/andrebelluci/_AgencyOS/issues/41) | Domínio customizado por tenant | Médio | 2 |
| ISSUE-039 | [#45](https://github.com/andrebelluci/_AgencyOS/issues/45) | RBAC owner + operator | Médio | 3 |
| ISSUE-040 | [#46](https://github.com/andrebelluci/_AgencyOS/issues/46) | tenant_features + planos | Médio | 3 |
| ISSUE-043 | [#49](https://github.com/andrebelluci/_AgencyOS/issues/49) | Support Agent separado | Médio | 3 |
| ISSUE-044 | [#51](https://github.com/andrebelluci/_AgencyOS/issues/51) | RAG: citação de fonte na resposta | Médio | 3 |
| ISSUE-041 | [#47](https://github.com/andrebelluci/_AgencyOS/issues/47) | Landing page Agency OS | Médio | 3 |

### Mapeamento BACKLOG ↔ GitHub (V0.2)

| BACKLOG | GitHub | Branch esperada |
|---------|--------|-----------------|
| ISSUE-035 | #41 | `feat/issue-041-custom-domain` |
| ISSUE-036 | #42 | `feat/issue-042-hero-conversational` |
| ISSUE-037 | #43 | `feat/issue-043-iframe-embed` |
| ISSUE-038 | #44 | `feat/issue-044-conversations-search` |
| ISSUE-039 | #45 | `feat/issue-045-rbac` |
| ISSUE-040 | #46 | `feat/issue-046-tenant-features` |
| ISSUE-041 | #47 | `feat/issue-047-landing` |
| ISSUE-042 | #48 | `feat/issue-048-conversion-metrics` |
| ISSUE-043 | #49 | `feat/issue-049-support-agent` |
| ISSUE-044 | #51 | `feat/issue-051-rag-citation` |
| ISSUE-045 | #50 | `feat/issue-050-widget-dark-mode` |

**Ordem de execução V0.2:** `#50 → #44 → #48 → #42 → (#43 ‖ #41) → #45 → #46 → (#49 ‖ #51) → #47`

---

### ISSUE-045: Widget dark mode (V0.2)
- **GitHub:** [#50](https://github.com/andrebelluci/_AgencyOS/issues/50)
- **Esforço:** Pequeno
- **Labels:** v0.2, widget, panel
- **Onda V0.2:** 1 (primeira issue)
- **Descrição:** Tema do chat no iframe (`/chat`) e painel do embed: `light`, `dark` ou `auto` (`prefers-color-scheme`). Setting em `tenant_settings` + opcional `data-theme` no script embed. **Não** herda CSS do site hospedeiro automaticamente (iframe isolado); `auto` segue preferência do OS/navegador do visitante.
- **Aceite:** Site escuro + widget configurado `dark` ou `auto` exibe chat coerente; contraste WCAG AA; `primary_color` continua como accent.
- **Depende de:** #31 ✅
- **Não inclui:** detecção do tema da página via `postMessage` (futuro); fontes/sombras/temas completos (V0.3+).

### ISSUE-038: Busca e filtro em conversas (V0.2)
- **GitHub:** [#44](https://github.com/andrebelluci/_AgencyOS/issues/44)
- **Esforço:** Pequeno
- **Labels:** v0.2, panel
- **Onda V0.2:** 1
- **Descrição:** `/conversations` com busca textual e filtros (período, lead vinculado).
- **Aceite:** Owner encontra conversa por texto em mensagens; filtro de datas funciona; query por `tenant_id`.
- **Depende de:** #28 (página conversations V0.1)

### ISSUE-042: Métricas conversão widget→lead→WhatsApp (V0.2)
- **GitHub:** [#48](https://github.com/andrebelluci/_AgencyOS/issues/48)
- **Esforço:** Pequeno
- **Labels:** v0.2, panel
- **Onda V0.2:** 1
- **Descrição:** Funil no dashboard: sessões chat → mensagens → leads → cliques WhatsApp.
- **Aceite:** Métricas visíveis por tenant (7d/30d); integra tracking WhatsApp V0.1.
- **Depende de:** #26, #19

### ISSUE-036: Hero conversacional (V0.2)
- **GitHub:** [#42](https://github.com/andrebelluci/_AgencyOS/issues/42)
- **Esforço:** Médio
- **Labels:** v0.2, widget, ai
- **Onda V0.2:** 2
- **Descrição:** Chat inline na hero com estados pré-definidos (serviço, cidade, prazo). CTAs por regras — sem LLM gerando layout.
- **Aceite:** Snippet hero documentado; fluxo persiste em conversations; lead quando qualificado.
- **Depende de:** Onda 1 ✅; #18 embed

### ISSUE-037: iFrame embed alternativo (V0.2)
- **GitHub:** [#43](https://github.com/andrebelluci/_AgencyOS/issues/43)
- **Esforço:** Pequeno
- **Labels:** v0.2, widget
- **Onda V0.2:** 2 (paralela após #42)
- **Descrição:** Snippet iframe direto para hero/sidebar/página dedicada.
- **Aceite:** Gerador em /settings; cross-origin OK; WIDGET_CUSTOMIZATION.md atualizado.
- **Depende de:** #42

### ISSUE-035: Domínio customizado por tenant (V0.2)
- **GitHub:** [#41](https://github.com/andrebelluci/_AgencyOS/issues/41)
- **Esforço:** Médio
- **Labels:** v0.2, infra
- **Onda V0.2:** 2 (paralela após #42)
- **Descrição:** `custom_domain` em tenants; middleware resolve antes do subdomínio.
- **Aceite:** Domínio do cliente resolve tenant; widget e APIs funcionam; DNS documentado.
- **Depende de:** #4 middleware

### ISSUE-039: RBAC owner + operator (V0.2)
- **GitHub:** [#45](https://github.com/andrebelluci/_AgencyOS/issues/45)
- **Esforço:** Médio
- **Labels:** v0.2, panel, db
- **Onda V0.2:** 3
- **Descrição:** Roles `owner` e `operator`; operator vê leads/conversas, não settings críticos.
- **Aceite:** RLS + guards; operator 403 em settings/knowledge write.
- **Depende de:** #5 auth; Onda 2 ✅

### ISSUE-040: tenant_features + planos (V0.2)
- **GitHub:** [#46](https://github.com/andrebelluci/_AgencyOS/issues/46)
- **Esforço:** Médio
- **Labels:** v0.2, db, panel
- **Onda V0.2:** 3
- **Descrição:** Tabela `tenant_features`; `isFeatureEnabled()`; gates por plano básico.
- **Aceite:** Features ligáveis por tenant; defaults para existentes.
- **Não inclui:** billing, Stripe, checkout.
- **Depende de:** #45

### ISSUE-043: Support Agent separado (V0.2)
- **GitHub:** [#49](https://github.com/andrebelluci/_AgencyOS/issues/49)
- **Esforço:** Médio
- **Labels:** v0.2, ai
- **Onda V0.2:** 3 (paralela após #46)
- **Descrição:** Orchestrator roteia suporte/FAQ para Support Agent.
- **Aceite:** `test:agents` passa; garantia/FAQ → Support; venda → Sales.
- **Depende de:** #11 agents; #46 recomendado

### ISSUE-044: RAG citação de fonte (V0.2)
- **GitHub:** [#51](https://github.com/andrebelluci/_AgencyOS/issues/51)
- **Esforço:** Médio
- **Labels:** v0.2, ai, widget
- **Onda V0.2:** 3 (paralela após #46)
- **Descrição:** Respostas RAG citam documento/FAQ; UI exibe "Fonte: ...".
- **Aceite:** FAQ no knowledge → citação visível; sem fonte inventada.
- **Depende de:** #22 searchKnowledge

### ISSUE-041: Landing page Agency OS (V0.2)
- **GitHub:** [#47](https://github.com/andrebelluci/_AgencyOS/issues/47)
- **Esforço:** Médio
- **Labels:** v0.2, panel, infra
- **Onda V0.2:** 3 (final)
- **Descrição:** Landing marketing apex: hero, benefícios, CTA, SEO.
- **Aceite:** Página responsiva em produção; não quebra tenants.
- **Depende de:** #49/#51 mergeados (recomendado)

---

# FASE 3 — V0.3

| ID | Título | Esforço |
|----|--------|---------|
| ISSUE-046 | Estimator Agent | Grande |
| ISSUE-047 | Tabelas pricing_tables + services | Médio |
| ISSUE-048 | Orçamento automático + PDF | Grande |
| ISSUE-049 | Tabela opportunities + pipeline | Médio |
| ISSUE-050 | Follow-up automático | Grande |
| ISSUE-051 | Event store leve | Médio |
| ISSUE-052 | Analytics dashboard | Médio |
| ISSUE-053 | WhatsApp Business API (spike) | Grande |

---

# Dependências entre issues (V0.1)

```
001 → 003 → 004 → 005 → 006
003 → 007 → 008 → 009 → 010
008 → 011 → 012 → 013 → 014 → 015
015 → 016 → 017 → 018 → 019
007 → 020 → 021 → 022 → 023 → 024 → 025
008 → 026 → 027 → 028 → 029
010 → 039 → 037
029 → 038
038 → 030
030 + 037 + 039 → 031
```

**Onda 7 (GitHub):** `#39 → (#37 ‖ #38) → #30 → #31`
