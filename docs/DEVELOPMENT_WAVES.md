# Ondas de Desenvolvimento — V0.1

Plano **sequencial obrigatório** das issues #1–#31.  
Cada prompt inclui **criação de branch**. Cada onda termina com **QA** antes de merge.

> **Regra de ouro:** a **Onda 6** (Chat, Knowledge, Painel avançado) só começa quando as **Ondas 1–5** estiverem ✅. Não pular.

---

## Progresso atual (atualize após cada merge)

| Issue | Título | Onda | Branch esperada | Status |
|-------|--------|------|-----------------|--------|
| #1 | Bootstrap Next.js | 0 | `feat/issue-001-bootstrap` | ✅ Feito (em `main`) |
| #2 | Supabase | 1 | `feat/issue-002-supabase` | ✅ Feito (em `main`) |
| #3 | Drizzle base | 1 | `feat/issue-003-drizzle-base` | ✅ Feito (em `main`) |
| #4 | Tenant middleware | 2 | `feat/issue-004-tenant-middleware` | ✅ Feito (em `main` — sem branch) |
| #6 | RLS base | 2 | `feat/issue-006-rls-base` | ✅ Feito (em `main` — sem branch) |
| #5 | Auth + login | 3 | `feat/issue-005-auth` | ⬜ **PRÓXIMA** |
| #7 | Schema leads/messages | 4 | `feat/issue-007-schema-leads` | ⬜ Bloqueada por #5 |
| #8 | Repositories/services | 5 | `feat/issue-008-repositories` | ⬜ |
| #9 | Settings CRUD | 5 | `feat/issue-009-settings` | ⬜ |
| #10 | Seed dev | 5 | `feat/issue-010-seed` | ⬜ |
| #11–#19 | Chat/IA | 6A | ver trilho A | 🔒 Bloqueada |
| #20–#25 | Knowledge | 6B | ver trilho B | 🔒 Bloqueada |
| #26–#29 | Painel dados | 6C | ver trilho C | 🔒 Bloqueada |
| #30–#31 | Go-live | 7 | `feat/issue-030-deploy` | 🔒 Bloqueada |

**Legenda:** ✅ mergeado · ⬜ pendente · 🔒 aguarda ondas anteriores

---

## Convenção de branches

```
feat/issue-NNN-descricao-curta
```

| Issue | Branch |
|-------|--------|
| #5 | `feat/issue-005-auth` |
| #7 | `feat/issue-007-schema-leads` |
| #8 | `feat/issue-008-repositories` |
| #9 | `feat/issue-009-settings` |
| #10 | `feat/issue-010-seed` |
| #11 | `feat/issue-011-agents` |
| #12 | `feat/issue-012-prompt-builder` |
| … | `feat/issue-NNN-...` |

### Bloco Git (copiar em todo prompt Dev)

```
## Git — OBRIGATÓRIO (primeiro passo)
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/issue-NNN-nome

# Ao concluir (antes do handoff QA):
git add <arquivos relevantes>
git commit -m "feat(scope): descrição breve (#NNN)"
git push -u origin feat/issue-NNN-nome

# NÃO mergear em main. NÃO fechar issue no GitHub.
# QA aprova → você faz merge (ou PR via gh pr create).
```

### Paralelo = branches diferentes

| ❌ Errado | ✅ Certo |
|----------|---------|
| Duas issues na mesma sessão em `main` | Uma issue = uma branch = uma sessão Cursor |
| Duas issues na mesma branch | Cada issue sua branch; merge na ordem |

### Recuperação: Onda 2 feita sem branches

O trabalho de #4 e #6 já está em `main`. **Não refazer.** A partir de agora:

1. Toda issue nova → branch a partir de `main` atualizado
2. Opcional: marcar issues #4 e #6 como done no GitHub após QA retroativo
3. Não criar branches retroativas a menos que precise de PRs documentados

---

## Mapa completo (não pule etapas)

```
ONDA 0  #1 ✅
ONDA 1  #2 → #3 ✅
ONDA 2  #4 ‖ #6 ✅ (feito em main)
ONDA 3  #5 ──────────────────────────────► VOCÊ ESTÁ AQUI
ONDA 4  #7
ONDA 5  #8 → #9 → #10
         │
         ▼  GATE: auth + seed + services funcionando
ONDA 6  Trilho A (#11–#19) ‖ Trilho B (#20–#25) ‖ Trilho C (#26–#29)
ONDA 7  #30 → #31
```

---

# Protocolo de prompt

Todo prompt Dev segue esta estrutura:

1. **Git** — criar branch
2. **Contexto** — docs e skills
3. **Escopo** — o que fazer / não fazer
4. **Aceite** — critérios BACKLOG
5. **Handoff** — QA, sem fechar issue

---

# ONDA 0 — Bootstrap ✅

**Issue:** #1 · **Branch:** `feat/issue-001-bootstrap` (já em main)

### QA (retroativo se ainda aberta)

```
QA Agent: valide ISSUE-001 (GitHub #1).
npm run build && npm run lint && npm run dev
Rotas: / /dashboard /chat /api/health
MCP Playwright. Relatório pass/fail.
```

---

# ONDA 1 — Supabase + Drizzle ✅

**Issues:** #2 → #3 (sequencial) · Feito em `main`

### QA retroativo

```
QA Agent: valide #2 e #3 retroativamente.
#2: Supabase conecta; bucket knowledge existe (docs/SUPABASE_SETUP.md).
#3: drizzle migrate OK; tabelas tenants, tenant_settings, users.
```

---

# ONDA 2 — Tenant + RLS ✅

**Issues:** #4 ‖ #6 · Feito em `main` (sem branches — recuperado)

### QA retroativo

```
QA Agent: valide #4 e #6 retroativamente.
#4: middleware resolve tenant dev; getTenant() funciona.
#6: migrations 0001/0002 RLS; query cross-tenant falha no SQL.
Arquivos: src/middleware.ts, drizzle/migrations/0001_*.sql
```

---

# ONDA 3 — Auth ⬜ PRÓXIMA

**Pré-requisito:** #4 + #6 ✅  
**Issue:** #5 (uma issue, uma branch)  
**Gate:** owner loga e acessa `/dashboard`

### Prompt #5 — copiar e colar

```
Dev Agent: implemente ISSUE-005 (GitHub #5).

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-005-auth

## Contexto
Leia: skill supabase, .cursor/rules/authentication.md, docs/DEV_PLAN.md Bloco 0.
Skills: agency-os-tenant (vincular user → tenant_id).

## Escopo
- Supabase Auth SSR (@supabase/ssr)
- Página /login funcional (substituir placeholder)
- Route callback /auth/callback
- Proteger rotas (dashboard)/* — redirect se não autenticado
- Vincular users.tenant_id ao tenant resolvido

## Não fazer
- ISSUE-007+ (leads), settings CRUD completo (#9), seed (#10)

## Aceite (docs/BACKLOG.md)
- Owner loga e acessa /dashboard
- Não autenticado → redirect /login

## Verificação
npm run build && npm run lint

## Git — ao concluir
git commit -m "feat(auth): supabase login and dashboard guard (#5)"
git push -u origin feat/issue-005-auth

## Handoff
Relatório handoff QA. Não mergear. Não fechar issue.
```

### Prompt QA Onda 3

```
QA Agent: valide ISSUE-005 na branch feat/issue-005-auth.
Login → /dashboard OK. Logout ou sessão inválida → /login.
MCP Playwright. npm run build && npm run lint.
```

---

# ONDA 4 — Schema operacional ⬜

**Pré-requisito:** Onda 3 (#5) mergeada  
**Issues:** #7 (+ extensão RLS das 3 tabelas novas)  
**Branch:** `feat/issue-007-schema-leads`

### Prompt #7

```
Dev Agent: implemente ISSUE-007 (GitHub #7).

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-007-schema-leads

## Contexto
Leia: docs/DATABASE.md MVP (leads, conversations, messages).
Skills: agency-os-tenant, supabase-postgres-best-practices.

## Escopo
- Drizzle schema: leads, conversations, messages
- Enums: leads.status (novo, qualificado, proposta, fechado, perdido), leads.score (baixo, médio, alto)
- FKs: messages → conversations, conversations.lead_id nullable
- Migration SQL + RLS nas 3 tabelas (migration 0003 ou equivalente)

## Não fazer
- repositories (#8), UI painel (#27), chat API (#15)

## Aceite
- Relacionamentos corretos; tenant_id em todas as colunas
- RLS impede cross-tenant

## Verificação
npm run build && npm run lint && npm run db:migrate (ou drizzle-kit push)

## Git — ao concluir
git commit -m "feat(db): leads conversations messages schema and RLS (#7)"
git push -u origin feat/issue-007-schema-leads

Handoff QA. Não mergear.
```

### Prompt QA Onda 4

```
QA Agent: valide ISSUE-007.
Tabelas existem no Supabase; RLS ativo; migrate roda limpo.
```

---

# ONDA 5 — Services + Settings + Seed ⬜

**Pré-requisito:** Onda 4 mergeada  
**Issues:** #8 → #9 → #10 (**sequencial**, uma branch por issue)  
**Gate para Onda 6:** login + seed + settings + CRUD services OK

> ⚠️ **A Onda 6 não começa até #10 estar mergeado e QA aprovado.**

---

## ONDA 5.1 — Issue #8

**Branch:** `feat/issue-008-repositories`

```
Dev Agent: implemente ISSUE-008 (GitHub #8).

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-008-repositories

## Contexto
Leia: .cursor/rules/data-access-layer.md, skill agency-os-tenant.

## Escopo
- src/modules/leads/ — repository + service
- src/modules/conversations/ — repository + service (messages incluídas)
- import "server-only" em todos os services
- Toda query filtra tenant_id do contexto

## Não fazer
- UI (#9, #27), agents (#11), seed (#10)

## Aceite
- CRUD leads e messages via service layer (testável via script ou route temporária)

## Verificação
npm run build && npm run lint

git commit -m "feat(modules): leads and conversations services (#8)"
git push -u origin feat/issue-008-repositories
Handoff QA.
```

---

## ONDA 5.2 — Issue #9

**Pré-requisito:** #8 mergeado  
**Branch:** `feat/issue-009-settings`

```
Dev Agent: implemente ISSUE-009 (GitHub #9).

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-009-settings

## Contexto
Leia: docs/DESIGN.md, skill agency-os-widget-ui.

## Escopo
- Formulário /settings: company_name, whatsapp, city, services (jsonb), system_prompt
- React Hook Form + Zod + Server Action
- Apenas owner autenticado edita seu tenant

## Aceite
- Dados persistem após reload

git commit -m "feat(panel): tenant settings CRUD (#9)"
git push -u origin feat/issue-009-settings
Handoff QA.
```

---

## ONDA 5.3 — Issue #10

**Pré-requisito:** #9 mergeado  
**Branch:** `feat/issue-010-seed`

```
Dev Agent: implemente ISSUE-010 (GitHub #10).

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-010-seed

## Escopo
- Script npm run db:seed
- Tenant dev "Belluci Acabamentos", slug development, public_key fixo para widget
- User owner vinculado (coordenar com auth #5)
- tenant_settings exemplo (acabamento, reforma, Mogi Mirim)

## Aceite
- Seed idempotente (rodar 2x sem duplicar)
- npm run db:seed popula ambiente local

git commit -m "chore(db): development tenant seed (#10)"
git push -u origin feat/issue-010-seed
Handoff QA.
```

### Prompt QA Onda 5 (completa)

```
QA Agent: valide #8, #9, #10 após merges em main.
Fluxo: login com seed → /settings edita → services criam lead de teste.
Gate Onda 6: só liberar trilhos A/B/C se este QA passar.
```

---

# ONDA 6 — Features avançadas 🔒

## ⛔ BLOQUEIO

**Não iniciar Onda 6 se qualquer item abaixo for falso:**

- [ ] #5 Auth mergeado e QA OK
- [ ] #7 Schema leads mergeado e QA OK
- [ ] #8 Services mergeado e QA OK
- [ ] #9 Settings mergeado e QA OK
- [ ] #10 Seed mergeado e QA OK
- [ ] `npm run db:seed` + login funcionam juntos

As páginas `/leads`, `/dashboard` etc. existem como **placeholder** desde #1 — isso **não** significa que #26–#28 estão prontas.

---

## Estrutura da Onda 6

Três trilhos **após** Onda 5. Cada issue = branch própria (exceto quando indicado).

| Trilho | Issues | Ordem |
|--------|--------|-------|
| **6A Chat** | #12→#13→#11→#14→#15→#16→#17→#18→#19 | Sequencial com paralelo pontual |
| **6B Knowledge** | #20→#21‖#22→#23→#24→#25 | #21‖#22 paralelo |
| **6C Painel** | #26‖#27‖#28→#29 | #26‖#27‖#28 paralelo |

**Paralelo entre trilhos:** 6A ‖ 6B ‖ 6C — **3 sessões Cursor**, cada uma em branch diferente, **só após gate Onda 5**.

---

## TRILHO 6A — Chat/IA

| Issue | Branch |
|-------|--------|
| #12 | `feat/issue-012-prompt-builder` |
| #13 | `feat/issue-013-tools` |
| #11 | `feat/issue-011-agents` (após #12+#13) |
| #14 | `feat/issue-014-openai-streaming` |
| #15 | `feat/issue-015-api-chat` |
| #16 | `feat/issue-016-chat-ui` |
| #17 | `feat/issue-017-widget-config` |
| #18 | `feat/issue-018-embed-js` |
| #19 | `feat/issue-019-whatsapp-button` |

### Prompt #12 (exemplo com branch)

```
Dev Agent: implemente ISSUE-012 (GitHub #12).

## Git — OBRIGATÓRIO
git checkout main && git pull && git checkout -b feat/issue-012-prompt-builder

## Escopo
src/agents/shared/prompt-builder.ts — system + platform + tenant + agent.
Leia: docs/PROMPT_SYSTEM.md

git commit -m "feat(ai): four-layer prompt builder (#12)"
git push -u origin feat/issue-012-prompt-builder
Handoff QA.
```

### Prompt #13 (pode rodar ‖ #12 em outra sessão)

```
Dev Agent: implemente ISSUE-013 (GitHub #13).

## Git — OBRIGATÓRIO
git checkout main && git pull && git checkout -b feat/issue-013-tools

## Escopo
src/tools/create-lead.ts, update-lead.ts, build-whatsapp-link.ts — Zod, sem import de agents.

Handoff QA.
```

*(Demais prompts #11–#19 seguem o mesmo padrão Git + branch da tabela acima. Ver docs/BACKLOG.md para aceite.)*

**Dependências cruzadas 6A↔6B:**
- #23 só após #15 (6A) + #22 (6B)
- #19 só após #16 + #13

---

## TRILHO 6B — Knowledge

| Issue | Branch |
|-------|--------|
| #20 | `feat/issue-020-knowledge-schema` |
| #21 | `feat/issue-021-faq-crud` |
| #22 | `feat/issue-022-search-knowledge` |
| #23 | `feat/issue-023-rag-sales` |
| #24 | `feat/issue-024-pdf-pipeline` |
| #25 | `feat/issue-025-knowledge-panel` |

### Prompt #20

```
Dev Agent: implemente ISSUE-020 (GitHub #20).

## Git — OBRIGATÓRIO
git checkout main && git pull && git checkout -b feat/issue-020-knowledge-schema

## Escopo
knowledge_documents + knowledge_chunks + pgvector + RLS.
Skill: agency-os-knowledge.

Handoff QA.
```

### Prompt #21 e #22 (paralelo — 2 sessões, 2 branches)

```
# Sessão 1 — branch feat/issue-021-faq-crud
Dev Agent: implemente ISSUE-021. CRUD FAQ em /knowledge.

# Sessão 2 — branch feat/issue-022-search-knowledge
Dev Agent: implemente ISSUE-022. Tool searchKnowledge top-K.
```

---

## TRILHO 6C — Painel com dados reais

| Issue | Branch |
|-------|--------|
| #26 | `feat/issue-026-dashboard` |
| #27 | `feat/issue-027-leads-page` |
| #28 | `feat/issue-028-conversations-page` |
| #29 | `feat/issue-029-embed-generator` |

### Prompt #26, #27, #28 (3 sessões paralelas)

```
# Sessão 1
Dev Agent: ISSUE-026. Branch feat/issue-026-dashboard.
Substituir placeholder: cards com SQL count (conversas, leads, semana).

# Sessão 2
Dev Agent: ISSUE-027. Branch feat/issue-027-leads-page.
Tabela Shadcn + editar status CRM.

# Sessão 3
Dev Agent: ISSUE-028. Branch feat/issue-028-conversations-page.
Lista + detalhe messages.
```

### Prompt #29 (após merges 26–28)

```
Dev Agent: ISSUE-029. Branch feat/issue-029-embed-generator.
Snippet <script> copiável em /settings com public_key.
```

---

# ONDA 7 — Go-live 🔒

**Pré-requisito:** Onda 6 completa + smoke F1–F6 (docs/QA_PLAN.md)

| Issue | Branch |
|-------|--------|
| #30 | `feat/issue-030-deploy` |
| #31 | `docs/issue-031-onboarding` (doc + execução manual) |

### Prompt #30

```
Dev Agent: ISSUE-030. Branch feat/issue-030-deploy.
Vercel + Supabase prod + docs/DEPLOY.md.
Handoff QA em URL produção.
```

### Prompt #31

```
Dev Agent: ISSUE-031. Branch docs/issue-031-onboarding.
Criar docs/ONBOARDING.md com checklist 1º cliente. Executar com usuário.
```

---

# Resumo: ordem e paralelismo

| Onda | Modo | Issues |
|------|------|--------|
| 0 | ✅ | #1 |
| 1 | ✅ sequencial | #2 → #3 |
| 2 | ✅ paralelo (2 branches) | #4 ‖ #6 |
| **3** | **⬜ sequencial** | **#5** |
| **4** | **⬜ sequencial** | **#7** |
| **5** | **⬜ sequencial** | **#8 → #9 → #10** |
| 6 | 🔒 3 trilhos ‖ | A / B / C |
| 7 | 🔒 sequencial | #30 → #31 |

---

# Prompt mestre Dev (qualquer onda)

```
Atue como Dev Agent (skill agency-os-dev-agent).

Onda: [3|4|5|6A|6B|6C|7]
Issue: GitHub #N
Branch: feat/issue-NNN-nome

ANTES DE CODAR:
1. Criar branch a partir de main atualizado
2. Verificar pré-requisitos no checklist deste doc
3. gh issue view N
4. Ler docs/BACKLOG.md critérios de aceite

Se pré-requisito não atendido: PARAR e informar qual onda falta.

Ao concluir: build + lint + commit + push + handoff QA.
NÃO mergear. NÃO fechar issue.
```

---

# Prompt mestre QA

```
Atue como QA Agent (skill agency-os-qa-agent).

Branch: feat/issue-NNN-nome
Issue: GitHub #N

Checkout da branch, npm run build, npm run lint, MCP Playwright.
Critérios: docs/BACKLOG.md + gate da onda em docs/DEVELOPMENT_WAVES.md.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

---

# V0.2 / V0.3

Issues #32–#49 só após #31. Mesma regra de branch: `feat/issue-0XX-...`
