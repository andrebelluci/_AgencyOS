# Estratégia de Skills & Agentes — Cursor

Pesquisa e decisões sobre extensões do Cursor para o Agency OS.  
Última revisão: 2026-06-22.

---

## Resumo executivo

**Sim, o Cursor se beneficia de mais skills** — mas com curadoria. Skills genéricas demais competem com as nossas (`agency-os-*`). O ideal é:

1. **Skills de domínio Agency OS** (nossas) — escopo, tenant, chat, sprint
2. **Skills de plataforma** (comunidade) — Supabase, SaaS patterns, UI/UX
3. **Regras `.mdc`** — sempre ativas ou por glob

**Não confundir:** `docs/AGENTS.md` = agentes de IA do **produto**. Skills Cursor = ajuda ao **desenvolvimento**.

---

## Inventário instalado neste projeto

### Skills em `.cursor/skills/` (projeto)

| Skill | Origem | Quando usar |
|-------|--------|-------------|
| `implement-sprint` | Agency OS | Implementar blocos do DEV_PLAN |
| `agency-os-tenant` | Agency OS | Multi-tenant, RLS, middleware |
| `agency-os-chat` | Agency OS | /api/chat, widget, streaming |
| `agency-os-knowledge` | Agency OS | RAG, PDF, embeddings |
| `agency-os-widget-ui` | Agency OS | UI widget + painel admin |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Landing, paletas, UX guidelines — invocar `/ui-ux-pro-max` |

### Skills em `.agents/skills/` (projeto)

| Skill | Origem | Quando usar |
|-------|--------|-------------|
| `supabase` | [supabase/agent-skills](https://github.com/supabase/agent-skills) | Auth, Storage, migrations, SSR |
| `supabase-postgres-best-practices` | supabase/agent-skills | RLS, índices, performance |

> Cursor descobre skills em `.cursor/skills/` **e** `.agents/skills/`.

### Regras em `.cursor/rules/`

| Arquivo | Tipo | Escopo |
|---------|------|--------|
| `agency-os-core.mdc` | Nossa | alwaysApply |
| `agency-os-nextjs.mdc` | Nossa | `src/**` |
| `agency-os-database.mdc` | Nossa | drizzle, db |
| `agency-os-ai-agents.mdc` | Nossa | agents, tools |
| `agency-os-design.mdc` | Nossa | components, app |
| `multi-tenancy.md` | [saas-starter-skills](https://github.com/param087/saas-starter-skills) | SaaS patterns |
| `database-schema.md` | saas-starter-skills | Drizzle schema |
| `data-access-layer.md` | saas-starter-skills | Queries tenant-scoped |
| `environment-and-config.md` | saas-starter-skills | Env validation |
| `file-uploads-and-storage.md` | saas-starter-skills | PDF upload Supabase |
| `api-routes-and-validation.md` | saas-starter-skills | API + Zod |
| `authentication.md` | saas-starter-skills | Supabase Auth patterns |
| `project-scaffolding.md` | saas-starter-skills | Bootstrap Next.js |

**Hierarquia em conflito:** regras `agency-os-*` prevalecem sobre saas-starter-skills (nosso DEV_PLAN é mais específico).

---

## Pesquisa — skills recomendadas (comunidade)

### Alta prioridade para Agency OS

| Recurso | Stars | Por quê | Status |
|---------|-------|---------|--------|
| **ui-ux-pro-max** | ~95k | Design intelligence, Shadcn, Next.js, landing | ✅ Instalado |
| **supabase/agent-skills** | oficial | Auth, RLS, pgvector — ADR-002 | ✅ Instalado |
| **saas-starter-skills** | param087 | Multi-tenant, Drizzle, API validation | ✅ Parcial (8/15) |
| **DESIGN.md** | nosso | Contrato visual Linear/Stripe | ✅ Criado |

### Média prioridade — instalar quando necessário

| Recurso | Quando | Comando |
|---------|--------|---------|
| **agency-os-dev-agent** | Ciclo de issues | já em `.cursor/skills/` |
| **agency-os-qa-agent** | Validação browser | já em `.cursor/skills/` + MCP playwright |
| **saas-ui-skills** (param087) | V0.2 painel mais complexo | `npx saas-ui-skills install --target cursor` |
| **ui-design-brain** | Alternativa leve ao ui-ux-pro-max | clone em `.cursor/skills/ui-design-brain` |
| **saas-starter-skills** restantes | V0.3 billing | `payments-stripe`, `subscription-billing` |
| **PatrickJS/awesome-cursorrules** | Regras Next.js específicas | copiar `.mdc` selecionados |
| **spencerpauly/awesome-cursor-skills** | CI triage, parallel tests | quando tiver CI |

### Baixa prioridade / futuro

| Recurso | Motivo para adiar |
|---------|-------------------|
| **HKTITAN/cursor-sdk** | Só se usar Cursor SDK em automação |
| **Wsl2Oliveira/cursor-agent-skills** | Foco em ops/CI, não MVP |
| **DIBmaster/cursor-skills** | Review de páginas — útil pós-launch |
| **vercel-labs/add-skill** | CLI alternativo de instalação |

---

## Skills que NÃO precisamos agora

| Skill / abordagem | Motivo |
|-------------------|--------|
| Stripe skills | Sem billing até V0.3 |
| Kubernetes / on-call skills | KILL_LIST |
| Content/SEO skills | Content Agent é V1+ |
| Microserviços rules | ADR-004 monólito |
| Múltiplos "agentes Cursor" separados | Papéis via prompt + skills é suficiente |

---

## ui-ux-pro-max — como usar

Instalado via `npx uipro-cli init --ai cursor`.

**Requisito:** Python 3 (scripts de busca de paletas/estilos).

```
# Invocar manualmente
/ui-ux-pro-max

# Ou pedir em linguagem natural
"Crie a landing do Funcionário Digital usando ui-ux-pro-max"
```

**Combinação ideal:**
1. `/ui-ux-pro-max` → paleta + layout
2. `docs/DESIGN.md` → constraints Agency OS
3. `agency-os-widget-ui` → padrões widget/painel

---

## Supabase skills — como usar

Ativam automaticamente em tarefas Supabase. Forçar com:

```
"Configure RLS seguindo supabase-postgres-best-practices"
"Setup Supabase Auth SSR com a skill supabase"
```

Benchmark Supabase: agentes com skill + MCP performam ~20% melhor que só MCP.

---

## saas-starter-skills — skills restantes (V0.2/V0.3)

```powershell
npx saas-starter-skills install --target cursor --scope project --skills "authorization-rbac,observability-and-errors,deployment-and-ci"
# V0.3:
npx saas-starter-skills install --target cursor --scope project --skills "payments-stripe,subscription-billing,transactional-email,background-jobs"
```

---

## Mapa: fase do produto → skills

| Fase | Skills principais |
|------|---------------------|
| **V0.1** | implement-sprint, agency-os-*, ui-ux-pro-max, supabase*, multi-tenancy |
| **V0.2** | agency-os-widget-ui, saas-ui-skills, authorization-rbac |
| **V0.3** | payments-stripe, agency-os-chat (estimator), observability |
| **V1** | cursor-sdk, deployment-and-ci, awesome-cursor-skills CI |

---

## Manutenção

1. Nova feature → avaliar se precisa skill ou só regra `.mdc`
2. Skill comunitária → testar em issue isolada antes de manter
3. Conflito com DEV_PLAN → nossa doc prevalece
4. Reiniciar Cursor após instalar skills

---

## Links úteis

- [Cursor Docs — Agent Skills](https://cursor.com/docs/skills)
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Supabase Agent Skills](https://github.com/supabase/agent-skills)
- [saas-starter-skills](https://github.com/param087/saas-starter-skills)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- [awesome-cursor-skills (forum)](https://forum.cursor.com/t/introducing-awesome-cursor-skills-a-curated-list-of-awesome-skills-for-cursor/157305)
- [DesignMD — DESIGN.md pattern](https://designmd.directory/guides/design-md-for-cursor)
