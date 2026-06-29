# Ondas de Desenvolvimento — V0.2

Plano **sequencial obrigatório** das issues V0.2 (GitHub **#41–#51**).
Cada prompt é **um bloco Dev+QA** (copiar e colar). Cada issue termina com relatório ✅/❌ antes de merge.

> **Escopo V0.2:** Hero Conversacional + Widget Hardening complementar + evoluções de painel/IA. Ver [DEV_PLAN.md](DEV_PLAN.md) seção V0.2.

> **Pré-requisito:** V0.1 completo (#31 onboarding ✅). Gate recomendado: 1º cliente pagante.

> **Regra de ouro:** a **Onda 2** (Hero + embed + domínio) só começa quando a **Onda 1** estiver ✅.

---

## Entregas V0.1 já feitas — não reimplementar na V0.2

Refinamentos **031E** e **031F** (pós-#31, **fora** do milestone V0.2) — descobertos com o 1º cliente real. **Não** adiantam escopo V0.2.

### 031E — Widget e auth (D19)

| Entrega | Onde | Regra para issues V0.2 |
|---------|------|------------------------|
| **`assistant_label`** | `tenant_settings`, Settings → Widget, `/api/widget/config`, cabeçalho `/chat` | #50 dark mode e #43 iFrame **leem** o campo; **não** hardcodar "Funcionário Digital" no widget |
| **`{{assistant_label}}`** | `initial_message` template | Manter substituição ao alterar mensagem inicial |
| **Auto-offset launcher** | `public/widget/embed.js` | **Não** reimplementar detecção de colisão; evoluir só se issue nova (ex.: offset no painel, `MutationObserver`) |
| **Fix login apex** | `link-user-tenant`, `require-owner` | Owner em `*.vercel.app` usa `users.tenant_id` — não reverter |

Commits: `e5433af` (auth), `4e8c862` (031E) · migração `0010` · [WIDGET_CUSTOMIZATION.md](WIDGET_CUSTOMIZATION.md)

### 031F — RAG FAQ + Knowledge First (D20 / ADR-005)

| Entrega | Onde | Regra para issues V0.2 |
|---------|------|------------------------|
| **Chunk FAQ pergunta+resposta** | `src/modules/knowledge/faq-format.ts`, `faq-index.ts` | #51 citação **usa** metadados existentes; não reindexar do zero |
| **Embeddings ao salvar FAQ** | `knowledge/service`, `repository` | Manter pipeline ao editar FAQ no painel |
| **Busca híbrida** | `search-utils.ts`, `searchKnowledge` tool | #49 Support e #51 **consomem** tool atual — não duplicar busca |
| **Sales/Orchestrator RAG-first** | `agents/sales`, `orchestrator/rules` | #49 Support herda mesma regra ([ADR-005](decisions/005-rag-first.md)) |
| **Reindex CLI** | `scripts/reindex-faq-knowledge.ts` | Ops apenas — não é escopo de issue V0.2 |

Commit: `17338fa` (031F) · docs: `2408e69` (ADR-005 formalizado) · [OPERATIONS.md](OPERATIONS.md) troubleshooting FAQ

> **ADR-005:** conhecimento interno > LLM genérico. FAQ ignorada quando recuperável = **bug** (REGRA 21). **#51** = citação visível (UX); **#49** = roteamento Support — ambos **complementam**, não substituem `searchKnowledge`.

> **"Funcionário Digital"** = nome do produto/plataforma (marketing). No widget do tenant manda **`assistant_label`**.

---

## Progresso atual (atualize após cada merge)

> **📍 Você está aqui (2026-06-29):** V0.1 fechado (#31, 031E, 031F, ADR-005 ✅). Milestone V0.2 aberto — nenhuma issue V0.2 mergeada ainda.
>
> **Próximo passo de código:** **#50 ISSUE-045 Widget dark mode** — Onda 1.
>
> **Sequência V0.2:** Onda 1 `#50 → #44 → #48` · Onda 2 `#42 → (#43 ‖ #41)` · Onda 3 `#45 → #46 → (#49 ‖ #51) → #47` + hardening complementar

| GitHub | BACKLOG | Título | Onda | Branch esperada | Status |
|--------|---------|--------|------|-----------------|--------|
| **#50** | ISSUE-045 | Widget dark mode | 1 | `feat/issue-050-widget-dark-mode` | ⬜ **PRÓXIMO** |
| #44 | ISSUE-038 | Busca e filtro em conversas | 1 | `feat/issue-044-conversations-search` | ⬜ Bloqueada por #50 |
| #48 | ISSUE-042 | Métricas conversão widget→lead→WhatsApp | 1 | `feat/issue-048-conversion-metrics` | ⬜ Bloqueada por #44 |
| #42 | ISSUE-036 | Hero conversacional | 2 | `feat/issue-042-hero-conversational` | ⬜ Bloqueada por Onda 1 |
| #43 | ISSUE-037 | iFrame embed alternativo | 2 | `feat/issue-043-iframe-embed` | ⬜ Paralela após #42 |
| #41 | ISSUE-035 | Domínio customizado | 2 | `feat/issue-041-custom-domain` | ⬜ Paralela após #42 |
| #45 | ISSUE-039 | RBAC owner + operator | 3 | `feat/issue-045-rbac` | ⬜ Bloqueada por Onda 2 |
| #46 | ISSUE-040 | tenant_features + planos | 3 | `feat/issue-046-tenant-features` | ⬜ Bloqueada por #45 |
| #49 | ISSUE-043 | Support Agent separado | 3 | `feat/issue-049-support-agent` | ⬜ Paralela após #46 |
| #51 | ISSUE-044 | RAG citação de fonte | 3 | `feat/issue-051-rag-citation` | ⬜ Paralela após #46 |
| #47 | ISSUE-041 | Landing page Agency OS | 3 | `feat/issue-047-landing` | ⬜ Após trilho IA (#49/#51) |

**Legenda:** ✅ mergeado · ⬜ pendente · 🟡 em andamento

### Mapeamento BACKLOG ↔ GitHub (V0.2)

| BACKLOG | GitHub | Nota |
|---------|--------|------|
| ISSUE-035 | [#41](https://github.com/andrebelluci/_AgencyOS/issues/41) | Domínio customizado |
| ISSUE-036 | [#42](https://github.com/andrebelluci/_AgencyOS/issues/42) | Hero conversacional |
| ISSUE-037 | [#43](https://github.com/andrebelluci/_AgencyOS/issues/43) | iFrame embed |
| ISSUE-038 | [#44](https://github.com/andrebelluci/_AgencyOS/issues/44) | Busca conversas |
| ISSUE-039 | [#45](https://github.com/andrebelluci/_AgencyOS/issues/45) | RBAC |
| ISSUE-040 | [#46](https://github.com/andrebelluci/_AgencyOS/issues/46) | tenant_features |
| ISSUE-041 | [#47](https://github.com/andrebelluci/_AgencyOS/issues/47) | Landing |
| ISSUE-042 | [#48](https://github.com/andrebelluci/_AgencyOS/issues/48) | Métricas |
| ISSUE-043 | [#49](https://github.com/andrebelluci/_AgencyOS/issues/49) | Support Agent |
| ISSUE-044 | [#51](https://github.com/andrebelluci/_AgencyOS/issues/51) | RAG citação |
| ISSUE-045 | [#50](https://github.com/andrebelluci/_AgencyOS/issues/50) | Dark mode — **1ª na ordem de execução** |

> Branches usam **número GitHub** (`feat/issue-050-...`), não o ID lógico ISSUE-0XX.

---

## Convenção de branches (V0.2)

```
feat/issue-NNN-descricao-curta
```

| GitHub | Branch |
|--------|--------|
| #50 | `feat/issue-050-widget-dark-mode` |
| #44 | `feat/issue-044-conversations-search` |
| #48 | `feat/issue-048-conversion-metrics` |
| #42 | `feat/issue-042-hero-conversational` |
| #43 | `feat/issue-043-iframe-embed` |
| #41 | `feat/issue-041-custom-domain` |
| #45 | `feat/issue-045-rbac` |
| #46 | `feat/issue-046-tenant-features` |
| #49 | `feat/issue-049-support-agent` |
| #51 | `feat/issue-051-rag-citation` |
| #47 | `feat/issue-047-landing` |

### Bloco Git (copiar em todo prompt Dev V0.2)

```
## Git — OBRIGATÓRIO (primeiro passo)
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/issue-NNN-nome

# Ao concluir Fase 4 (após QA aprovado):
git add <arquivos relevantes>
git commit -m "feat(scope): descrição breve (#NNN)"
git push -u origin feat/issue-NNN-nome

# NÃO mergear em main. NÃO fechar issue no GitHub.
# QA aprova → você faz merge (ou PR via gh pr create).
```

---

## Mapa completo V0.2 (não pule etapas)

```
GATE V0.1  #31 ✅
     │
     ▼
ONDA 1  #50 → #44 → #48          Quick wins (widget + painel)
     │
     ▼  GATE: smoke Onda 1 (dark mode + busca + métricas)
ONDA 2  #42 → (#43 ‖ #41)        Hero + embed + domínio
     │
     ▼  GATE: smoke Onda 2 (hero demo + iframe + domínio doc)
ONDA 3  #45 → #46 → (#49 ‖ #51) → #47
     │                    + Widget Hardening complementar (quotas tenant)
     ▼
V0.2 FECHADO → gate V0.3
```

---

# Protocolo de prompt (V0.2)

Mesmo protocolo V0.1 — ver [DEVELOPMENT_WAVES_V0.1.md](DEVELOPMENT_WAVES_V0.1.md#protocolo-de-prompt).

1. **Git** — criar branch
2. **Fase 1 — Implementar** — escopo, aceite `docs/BACKLOG.md` (seção V0.2)
3. **Fase 2 — QA** — critérios + MCP Browser quando UI
4. **Fase 3 — Auto-fix** — até 3 ciclos
5. **Fase 4 — Entrega** — build/lint, commit, push, relatório

Skills V0.2: `agency-os-dev-agent`, `agency-os-widget-ui`, `agency-os-chat`, `agency-os-tenant`, `agency-os-knowledge` (quando IA/RAG).

---

# ONDA 1 — Quick wins (widget + painel) ⬜

> **O que faz:** Entrega valor rápido sem mudar arquitetura core — tema escuro do widget, busca no painel e funil de conversão.

**Pré-requisito:** V0.1 em `main` (#31 ✅)

### Ordem

```
#50 dark mode  →  #44 busca conversas  →  #48 métricas conversão
```

---

### Prompt #50 — Dev + QA (ISSUE-045)

```
Dev Agent: implemente e valide ISSUE-045 (GitHub #50) — V0.2.
Skills: agency-os-dev-agent + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-050-widget-dark-mode

## Fase 1 — Implementar (V0.2)
- tenant_settings.widget_theme: light | dark | auto
- Migration Drizzle + RLS
- Settings: seletor de tema no painel
- GET /api/widget/config expõe theme
- /chat e embed.js: CSS variables dark/light; auto = prefers-color-scheme
- data-theme opcional no script embed (override)
- primary_color como accent em ambos os temas
- **Reutilizar** assistant_label e demais campos de `/api/widget/config` (031E)
- **Não alterar** pipeline RAG / searchKnowledge (031F, ADR-005)
- docs/WIDGET_CUSTOMIZATION.md atualizado (V0.2)

## Fase 2 — QA
- MCP Browser: /chat?key= com theme dark e auto
- Contraste legível (WCAG AA spot check)
- Settings persiste tema; widget reflete sem redeploy
- `assistant_label` e `primary_color` intactos após mudança de tema (031E)
- npm run db:migrate (migration widget_theme)
- npm run build && npm run lint
- npm run test:e2e:no-ai (regressão V0.1 — ver docs/TEST.md)

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): dark mode theme light/dark/auto (#50)"
git push -u origin feat/issue-050-widget-dark-mode
Relatório ✅/❌. NÃO mergear.
```

---

### Prompt #44 — Dev + QA (ISSUE-038)

```
Dev Agent: implemente e valide ISSUE-038 (GitHub #44) — V0.2.
Skills: agency-os-dev-agent + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-044-conversations-search

## Fase 1 — Implementar (V0.2)
- /conversations: campo busca + filtro por período
- Query em messages/conversations filtrada por tenant_id
- Índice ou query eficiente (evitar full scan em prod)
- UI Shadcn alinhada a /leads

## Fase 2 — QA
- MCP Browser /conversations: busca encontra texto em mensagem
- Filtro de datas funciona
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): conversations search and filters (#44)"
git push -u origin feat/issue-044-conversations-search
Relatório ✅/❌.
```

---

### Prompt #48 — Dev + QA (ISSUE-042)

```
Dev Agent: implemente e valide ISSUE-042 (GitHub #48) — V0.2.
Skills: agency-os-dev-agent + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-048-conversion-metrics

## Fase 1 — Implementar (V0.2)
- Funil: sessões chat → mensagens → leads → cliques WhatsApp
- Reutilizar tracking WhatsApp V0.1
- Cards no dashboard ou seção /dashboard/conversion
- Agregação por tenant_id; períodos 7d/30d

## Fase 2 — QA
- MCP Browser /dashboard: métricas coerentes com dados seed/prod
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): widget to lead conversion metrics (#48)"
git push -u origin feat/issue-048-conversion-metrics
Relatório ✅/❌.
```

---

### Smoke gate Onda 1 V0.2 (após #50, #44, #48 em main)

```
QA Agent: smoke gate Onda 1 V0.2 (main atualizado).

Critérios: docs/QA_PLAN.md F7.1
- Widget dark/auto em /chat?key=
- Busca em /conversations
- Métricas no dashboard
npm run build && npm run lint && npm run test:e2e:no-ai
Relatório ✅/❌ antes de iniciar Onda 2.
```

---

# ONDA 2 — Experiência do visitante ⬜

> **O que faz:** Hero conversacional com estados pré-definidos, embed iframe alternativo e domínio customizado por tenant.

**Pré-requisito:** Onda 1 ✅ + smoke gate

### Ordem e paralelismo

```
#42 Hero (sequencial primeiro)
        │
        ├────────────────┬────────────────┐
        ▼                ▼                │
   #43 iFrame       #41 Domínio          │
        │                │                │
        └────────┬───────┘                │
                 ▼                        │
         smoke gate Onda 2                 │
```

| Issue | Branch | Modo |
|-------|--------|------|
| #42 | `feat/issue-042-hero-conversational` | sequencial primeiro |
| #43 | `feat/issue-043-iframe-embed` | paralelo após #42 |
| #41 | `feat/issue-041-custom-domain` | paralelo após #42 |

---

### Prompt #42 — Dev + QA (ISSUE-036)

```
Dev Agent: implemente e valide ISSUE-036 (GitHub #42) — V0.2.
Skills: agency-os-dev-agent + agency-os-chat + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-042-hero-conversational

## Fase 1 — Implementar (V0.2)
- Modo hero: chat inline (estados pré-definidos em tenant_settings ou JSON)
- Perguntas: serviço, cidade, prazo (configurável)
- Transições de estado sem LLM gerando HTML — CTAs/conteúdo por regras
- Persistência normal em conversations/messages
- Documentar snippet hero em WIDGET_CUSTOMIZATION.md

## Fase 2 — QA
- Demo: página com hero inline + fluxo completo até lead ou WhatsApp
- MCP Browser onde possível (/chat hero mode)
- npm run build && npm run lint && npm run test:agents (se aplicável)

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): conversational hero with predefined states (#42)"
git push -u origin feat/issue-042-hero-conversational
Relatório ✅/❌.
```

---

### Prompt #43 — Dev + QA (ISSUE-037)

```
Dev Agent: implemente e valide ISSUE-037 (GitHub #43) — V0.2.
Skills: agency-os-dev-agent + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-043-iframe-embed

## Fase 1 — Implementar (V0.2)
- Snippet iframe em /settings (além do embed.js)
- Parâmetros: key, theme, width, height
- Cross-origin OK; postMessage tema do host fora de escopo
- **Reutilizar** `/api/widget/config` (assistant_label, primary_color, initial_message — 031E)
- WIDGET_CUSTOMIZATION.md — seção iframe V0.2

## Fase 2 — QA
- iframe em página teste carrega /chat?key=
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): iframe embed snippet (#43)"
git push -u origin feat/issue-043-iframe-embed
Relatório ✅/❌.
```

---

### Prompt #41 — Dev + QA (ISSUE-035)

```
Dev Agent: implemente e valide ISSUE-035 (GitHub #41) — V0.2.
Skills: agency-os-dev-agent + agency-os-tenant + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-041-custom-domain

## Fase 1 — Implementar (V0.2)
- tenants.custom_domain (migration + RLS)
- Middleware: resolver tenant por domínio antes de subdomínio (MULTITENANCY.md)
- UI admin ou settings para configurar domínio
- docs/DEPLOY.md — CNAME/DNS V0.2

## Fase 2 — QA
- Host custom resolve tenant correto (dev: header Host ou /etc/hosts)
- Widget e /api/chat funcionam no domínio
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(tenant): custom domain resolution (#41)"
git push -u origin feat/issue-041-custom-domain
Relatório ✅/❌.
```

---

### Smoke gate Onda 2 V0.2

```
QA Agent: smoke gate Onda 2 V0.2 (main atualizado).

Critérios: docs/QA_PLAN.md F7.2
- Hero com estados em demo page
- iframe snippet funcional
- custom_domain documentado e testável
- F7.1 ainda passa
Relatório ✅/❌ antes de Onda 3.
```

---

# ONDA 3 — Plataforma + IA ⬜

> **O que faz:** RBAC, feature flags, Support Agent, citação RAG, landing marketing e hardening complementar (quotas por tenant).

**Pré-requisito:** Onda 2 ✅

### Ordem

```
#45 RBAC → #46 tenant_features → (#49 Support ‖ #51 RAG citação) → #47 Landing
         + Widget Hardening complementar (quotas/abuse — extensão do #38 V0.1)
```

---

### Prompt #45 — Dev + QA (ISSUE-039)

```
Dev Agent: implemente e valide ISSUE-039 (GitHub #45) — V0.2.
Skills: agency-os-dev-agent + agency-os-tenant + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-045-rbac

## Fase 1 — Implementar (V0.2)
- users.role: owner | operator (migration)
- Middleware/guards: operator sem settings/knowledge write
- RLS policies atualizadas
- Fluxo criar operator (manual assistido OK)

## Fase 2 — QA
- Owner: acesso total
- Operator: leads/conversas OK; settings → 403
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(auth): owner and operator RBAC (#45)"
git push -u origin feat/issue-045-rbac
Relatório ✅/❌.
```

---

### Prompt #46 — Dev + QA (ISSUE-040)

```
Dev Agent: implemente e valide ISSUE-040 (GitHub #46) — V0.2.
Skills: agency-os-dev-agent + agency-os-tenant + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-046-tenant-features

## Fase 1 — Implementar (V0.2)
- Tabela tenant_features + RLS
- isFeatureEnabled(tenantId, feature)
- Defaults para tenants existentes
- Gate opcional: hero, support_agent, dark_mode

## Fase 2 — QA
- Feature desabilitada bloqueia rota/UX esperada
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(tenant): tenant_features flags (#46)"
git push -u origin feat/issue-046-tenant-features
Relatório ✅/❌.
```

---

### Prompt #49 — Dev + QA (ISSUE-043)

```
Dev Agent: implemente e valide ISSUE-043 (GitHub #49) — V0.2.
Skills: agency-os-dev-agent + agency-os-knowledge + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-049-support-agent

## Fase 1 — Implementar (V0.2)
- src/agents/support/ — agent, prompt, rules alinhados a [ADR-005](decisions/005-rag-first.md)
- Orchestrator roteia support vs sales
- Tools: searchKnowledge (reuso 031F); createTicket stub
- Support: searchKnowledge obrigatório antes de resposta factual (FAQ/garantia)
- npm run test:agents

## Fase 2 — QA
- Pergunta garantia/FAQ → Support; compra/lead → Sales
- Cenário F3.1 (paráfrase FAQ) passa com Support Agent
- npm run build && npm run lint && npm run test:agents

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(agents): support agent routing (#49)"
git push -u origin feat/issue-049-support-agent
Relatório ✅/❌.
```

---

### Prompt #51 — Dev + QA (ISSUE-044)

```
Dev Agent: implemente e valide ISSUE-044 (GitHub #51) — V0.2.
Skills: agency-os-dev-agent + agency-os-knowledge + agency-os-widget-ui + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-051-rag-citation

## Fase 1 — Implementar (V0.2)
- searchKnowledge retorna sourceTitle/sourceId (estender metadados 031F se necessário)
- Sales/Support append citação na resposta — **complementa [ADR-005](decisions/005-rag-first.md)** (UX); não dispensa consulta à base
- UI chat: linha "Fonte: ..." discreta
- Sem citação quando RAG vazio; sem fonte inventada

## Fase 2 — QA
- FAQ no knowledge → resposta cita documento **e** conteúdo veio da base (F3.1 + F7.3)
- npm run build && npm run lint && npm run test:e2e:no-ai

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(ai): RAG source citation in chat (#51)"
git push -u origin feat/issue-051-rag-citation
Relatório ✅/❌.
```

---

### Prompt #47 — Dev + QA (ISSUE-041)

```
Dev Agent: implemente e valide ISSUE-041 (GitHub #47) — V0.2.
Skills: agency-os-dev-agent + agency-os-widget-ui + ui-ux-pro-max + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-047-landing

## Fase 1 — Implementar (V0.2)
- Landing marketing Agency OS (apex ou rota dedicada)
- Hero, benefícios, prova social, CTA, SEO meta
- Não quebrar widget dos tenants

## Fase 2 — QA
- MCP Browser: landing responsiva, CTA visível
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(marketing): Agency OS landing page (#47)"
git push -u origin feat/issue-047-landing
Relatório ✅/❌.
```

---

### Widget Hardening complementar V0.2 (sem issue dedicada)

Extensão do hardening V0.1 (#38). Implementar na mesma branch de #46 ou branch `feat/issue-052-widget-quotas` se preferir PR isolado:

- Quotas por tenant (mensagens/dia, embeddings/mês)
- Rate limit refinado por plano (quando tenant_features ativo)
- Timeout strategy documentada
- Observabilidade: contadores por tenant no admin

Critérios: exceder quota → 429 com mensagem clara; logs com tenant_id.

---

### Smoke gate final V0.2

```
QA Agent: smoke gate V0.2 completo (main atualizado).

Critérios: docs/QA_PLAN.md F7.3
Fluxo integrado V0.2:
1. Widget dark + hero + iframe em demo
2. Domínio custom (se configurado)
3. Operator RBAC no painel
4. Support Agent + citação RAG no chat
5. Landing apex
6. Métricas dashboard
7. F1–F6 + F7.1 + F7.2 passam (npm run test:e2e:no-ai)
Relatório ✅ fecha milestone V0.2.
```

---

# Prompt mestre Dev+QA (V0.2)

```
Dev Agent: implemente e valide ISSUE-0XX (GitHub #NNN) — V0.2.
Skills: agency-os-dev-agent + agency-os-qa-agent (+ skills do domínio).

## Git
git checkout main && git pull && git checkout -b feat/issue-NNN-nome

## Fase 1 — Implementar
Critérios: docs/BACKLOG.md seção V0.2 · docs/DEVELOPMENT_WAVES_V0.2.md

## Fase 2 — QA
npm run build && npm run lint
MCP Browser quando UI

## Fase 3 — Auto-fix
Máx 3 ciclos. Escopo V0.2 apenas.

## Fase 4 — Entrega
Commit + push. Relatório ✅/❌. NÃO mergear.
```

---

# V0.3

Issues ISSUE-046+ no milestone `V0.3 - Orcamentista IA`. Documento futuro: `DEVELOPMENT_WAVES_V0.3.md`.

Ver [BACKLOG.md](BACKLOG.md) Fase 3 · [DEV_PLAN.md](DEV_PLAN.md) seção V0.3.

---

# Referência cruzada V0.2

| Documento | Uso |
|-----------|-----|
| [BACKLOG.md](BACKLOG.md) | Aceite por ISSUE-035–045 |
| [DEV_PLAN.md](DEV_PLAN.md) | Escopo e decisões D8, D12, D14, D18, D19, D20 |
| [decisions/005-rag-first.md](decisions/005-rag-first.md) | ADR-005 — obrigatório #49, #51 |
| [WIDGET_CUSTOMIZATION.md](WIDGET_CUSTOMIZATION.md) | Dark mode, hero, iframe |
| [MULTITENANCY.md](MULTITENANCY.md) | Domínio customizado |
| [AGENTS.md](AGENTS.md) | Support Agent |
| [DEVELOPMENT_WAVES_V0.1.md](DEVELOPMENT_WAVES_V0.1.md) | Histórico V0.1 |

Recriar issues: `powershell -File scripts/create-github-issues-v02.ps1`
