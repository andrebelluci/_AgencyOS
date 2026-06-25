# Ondas de Desenvolvimento — V0.1

Plano **sequencial obrigatório** das issues #1–#31.
Cada prompt é **um bloco Dev+QA** (copiar e colar). Cada issue termina com relatório ✅/❌ antes de merge.

> **Regra de ouro:** a **Onda 6** (Chat, Knowledge, Painel avançado) só começa quando as **Ondas 1–5** estiverem ✅. Não pular.

> **Visão estratégica (referência):** Este documento é o **plano operacional V0.1** (#1–#31). A evolução de produto V0.1→V0.5 (Widget → Hero → Site Adaptativo → Site Conversacional → Digital Twin) e as diretrizes arquiteturais estão em [VISION.md](VISION.md), [ROADMAP.md](ROADMAP.md) e [DEV_PLAN.md](DEV_PLAN.md). **Não alteram** ondas, prompts nem ordem abaixo. Milestones GitHub (`V0.2 — Site Conversacional`, `V0.3 — Orçamentista IA`) podem usar nomes diferentes da narrativa estratégica — ver nota em [BACKLOG.md](BACKLOG.md).

---

## Progresso atual (atualize após cada merge)

> **📍 Você está aqui (2026-06-25):** Onda 6 concluída em `main` (#11–#29 mergeados). **Smoke gate Onda 6 F1–F6 ✅ aprovado** (pós-fixes: histórico no reload, `sendBeacon` WhatsApp, hydration widget). Fixes do smoke ainda **sem commit** em `main` — commitar antes do deploy.
>
> **Próximo passo:** Onda 7 → **#30 Deploy** (`feat/issue-030-deploy`). Gate liberado. Depois #31 onboarding.

| Issue | Título | Onda | Branch esperada | Status |
|-------|--------|------|-----------------|--------|
| #1 | Bootstrap Next.js | 0 | `feat/issue-001-bootstrap` | ✅ Feito (em `main`) |
| #2 | Supabase | 1 | `feat/issue-002-supabase` | ✅ Feito (em `main`) |
| #3 | Drizzle base | 1 | `feat/issue-003-drizzle-base` | ✅ Feito (em `main`) |
| #4 | Tenant middleware | 2 | `feat/issue-004-tenant-middleware` | ✅ Feito (em `main` — sem branch) |
| #6 | RLS base | 2 | `feat/issue-006-rls-base` | ✅ Feito (em `main` — sem branch) |
| #5 | Auth + login | 3 | `feat/issue-005-auth` | ✅ Feito (em `main`) |
| #7 | Schema leads/messages | 4 | `feat/issue-007-schema-leads` | ✅ Feito (em `main`) |
| #8 | Repositories/services | 5 | `feat/issue-008-repositories` | ✅ Feito (em `main`) |
| #9 | Settings CRUD | 5 | `feat/issue-009-settings` | ✅ Feito (em `main`) |
| #10 | Seed dev | 5 | `feat/issue-010-seed` | ✅ Feito (em `main`) |
| #11–#19 | Chat/IA | 6A | ver trilho A | ✅ Feito (em `main`) |
| #20–#25 | Knowledge | 6B | ver trilho B | ✅ Feito (em `main`) |
| #26–#29 | Painel dados | 6C | ver trilho C | ✅ Feito (em `main`) |
| — | Smoke gate Onda 6 (F1–F6) | 6 | — | ✅ Aprovado (2026-06-25) |
| #30 | Deploy produção | 7 | `feat/issue-030-deploy` | ⬜ **PRÓXIMO** |
| #31 | Onboarding 1º cliente | 7 | `docs/issue-031-onboarding` | ⬜ Bloqueada por #30 |

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

# Ao concluir Fase 4 (após QA aprovado):
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

### Merge entre issues sequenciais (ex.: Onda 5)

**Sim — após QA aprovar, faça merge em `main` antes de iniciar a issue seguinte.**

Ciclo por issue:

```
implementar → QA na branch → merge em main → pull main → próxima branch
```

Por quê? Todo prompt Dev parte de `main` atualizado (`git checkout main && git pull`). Se #8 ainda não estiver em `main`, a branch de #9 nasce **sem** os repositories/services de #8 — e #9 (settings) ou #10 (seed) podem depender indiretamente dessa base.

| Pergunta | Resposta |
|----------|----------|
| Merge #8 antes de começar #9? | **Sim** |
| Merge #9 antes de começar #10? | **Sim** |
| Posso abrir #9 sem mergear #8? | Só se criar a branch **a partir de** `feat/issue-008-...` (empilhamento). Não recomendado no V0.1 — conflitos em cascata no merge final. |
| QA da Onda 5 inteira? | QA **por issue** (#8, #9, #10) antes de cada merge; smoke integrado só após #10 em `main`. |
| QA de várias issues juntas? | **Não** — exceto smoke gates (Onda 5 completa, Onda 6 F1–F6). |

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
ONDA 3  #5 ✅
ONDA 4  #7 ✅
ONDA 5  #8 → #9 → #10 ✅
ONDA 6  Trilho A (#11–#19) ‖ Trilho B (#20–#25) ‖ Trilho C (#26–#29) ✅
         │
         ▼  GATE: smoke F1–F6 ✅ (2026-06-25)
ONDA 7  #30 → #31 ───────────────────────► VOCÊ ESTÁ AQUI
```

---

# Protocolo de prompt

## Formato preferido: Dev + QA em um bloco só

Cole **um prompt único** por issue. O Dev Agent implementa, roda QA e **corrige sozinho** se falhar (até 3 ciclos).

Estrutura:

1. **Git** — criar branch
2. **Fase 1 — Implementar** — escopo, aceite BACKLOG
3. **Fase 2 — QA** — critérios + MCP Browser quando UI
4. **Fase 3 — Auto-fix** — corrigir falhas sem pedir ao usuário; repetir Fase 2
5. **Fase 4 — Entrega** — build/lint, commit, push, relatório final

> Prompts separados só para **smoke gates** (Onda 5 completa, Onda 6 F1–F6). Issues antigas com QA solto: usar o **Prompt mestre Dev+QA** abaixo.

### Bloco padrão Fases 2–4 (referência)

```
## Fase 2 — QA (skill agency-os-qa-agent)
Branch: feat/issue-NNN-nome
Critérios: docs/BACKLOG.md ISSUE-NNN
[checklist específico]
npm run build && npm run lint (+ npm run test se existir)
MCP Browser Cursor (`cursor-ide-browser`) quando houver UI/API testável

## Fase 3 — Auto-fix
Se reprovado: corrigir bugs desta issue automaticamente e repetir Fase 2.
Máximo 3 ciclos. Só pedir ao usuário se bloqueado, ambíguo ou fora de escopo V0.1.

## Fase 4 — Entrega
Commit + push na branch. Relatório final ✅ aprovar merge | ❌ bloqueio.
NÃO mergear em main. NÃO fechar issue no GitHub.
```

---

# ONDA 0 — Bootstrap ✅

> **O que faz:** Coloca o esqueleto do app de pé — Next.js, TypeScript, Tailwind, Shadcn e a estrutura de pastas (`src/modules`, `src/agents`, rotas placeholder). Nada de negócio ainda; só garantir que o projeto compila, faz lint e as rotas `/`, `/dashboard`, `/chat` existem como casca.

**Issue:** #1 · **Branch:** `feat/issue-001-bootstrap` (já em main)

### Prompt #1 — Dev + QA (retroativo, main)

```
Dev Agent: valide e corrija se necessário ISSUE-001 (retroativo em main).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Fase 1 — Verificar (já em main)
Critérios: docs/BACKLOG.md ISSUE-001

## Fase 2 — QA
- npm run build && npm run lint && npm run dev
- Rotas: / /login /dashboard /chat /api/health
- Estrutura src/modules, src/agents, drizzle, tests
- MCP Browser Cursor nas rotas públicas

## Fase 3 — Auto-fix
Se falhar: corrigir em branch feat/issue-001-fix, repetir Fase 2 (máx 3 ciclos).

## Fase 4 — Entrega
Relatório ✅ marcar issue done | ❌ bloqueio.
```

---

# ONDA 1 — Supabase + Drizzle ✅

> **O que faz:** Conecta o app ao banco. Configura o cliente Supabase (browser + server), cria o bucket de arquivos da base de conhecimento e define as **primeiras tabelas** com Drizzle: `tenants` (cada cliente da plataforma), `tenant_settings` (configurações da empresa) e `users` (donos que logam no painel). Sem isso, não há onde persistir dados.

**Issues:** #2 → #3 (sequencial) · Feito em `main`

### Prompt #2 — Dev + QA (retroativo, main)

```
Dev Agent: valide e corrija se necessário ISSUE-002 (retroativo em main).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Fase 1 — Verificar (já em main)
Critérios: docs/BACKLOG.md ISSUE-002

## Fase 2 — QA
- Variáveis Supabase em .env.example
- Clientes em src/lib/supabase/
- Conexão OK; bucket `knowledge` (docs/SUPABASE_SETUP.md)
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos. Branch feat/issue-002-fix se precisar corrigir.

## Fase 4 — Entrega
Relatório ✅ marcar done | ❌ bloqueio.
```

### Prompt #3 — Dev + QA (retroativo, main)

```
Dev Agent: valide e corrija se necessário ISSUE-003 (retroativo em main).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Fase 1 — Verificar (já em main)
Critérios: docs/BACKLOG.md ISSUE-003

## Fase 2 — QA
- Schema: tenants, tenant_settings, users
- npm run db:migrate (ou drizzle-kit push) sem erro
- Tipos em src/lib/db/schema
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
Relatório ✅ marcar done | ❌ bloqueio.
```

---

# ONDA 2 — Tenant + RLS ✅

> **O que faz:** Implementa o **multi-tenant** de verdade. O middleware identifica qual empresa está sendo acessada (subdomínio ou chave pública) e injeta o `tenant_id` no contexto. Em paralelo, o **RLS** (Row Level Security) no Postgres garante que, mesmo com SQL direto, um tenant nunca lê ou escreve dados de outro. É a fundação de segurança do SaaS.

**Issues:** #4 ‖ #6 · Feito em `main` (sem branches — recuperado)

### Prompt #4 — Dev + QA (retroativo, main)

```
Dev Agent: valide e corrija se necessário ISSUE-004 (retroativo em main).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Fase 1 — Verificar (já em main)
Critérios: docs/BACKLOG.md ISSUE-004

## Fase 2 — QA
- middleware resolve tenant dev (localhost)
- getTenant() retorna tenant_id correto
- Request sem tenant → 404 ou erro esperado
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
Relatório ✅ marcar done | ❌ bloqueio.
```

### Prompt #6 — Dev + QA (retroativo, main)

```
Dev Agent: valide e corrija se necessário ISSUE-006 (retroativo em main).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Fase 1 — Verificar (já em main)
Critérios: docs/BACKLOG.md ISSUE-006

## Fase 2 — QA
- Migrations RLS drizzle/migrations/0001_*.sql (+ fixes)
- RLS em tenants, tenant_settings, users
- Query cross-tenant falha no SQL

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
Relatório ✅ marcar done | ❌ bloqueio.
```

---

# ONDA 3 — Auth ✅

> **O que faz:** O dono da agência consegue **entrar no painel**. Login com Supabase Auth (email/senha), callback de sessão, proteção das rotas `(dashboard)/*` — quem não está logado vai para `/login`. O usuário autenticado fica vinculado ao `tenant_id` correto. Sem auth, o painel é só placeholder aberto.

**Pré-requisito:** #4 + #6 ✅
**Issue:** #5 (uma issue, uma branch)
**Gate:** owner loga e acessa `/dashboard`

### Prompt #5 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-005 (GitHub #5).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-005-auth

## Fase 1 — Implementar
Leia: skill supabase, .cursor/rules/authentication.md, agency-os-tenant.
- Supabase Auth SSR (@supabase/ssr)
- /login funcional, /auth/callback
- Proteger (dashboard)/* → redirect /login
- Vincular users.tenant_id ao tenant resolvido
Não fazer: #7+, #9, #10

## Fase 2 — QA
MCP Browser Cursor:
- Login owner → /dashboard OK
- Sessão inválida/logout → /login
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos. Não pedir ao usuário.

## Fase 4 — Entrega
git commit -m "feat(auth): supabase login and dashboard guard (#5)"
git push -u origin feat/issue-005-auth
Relatório ✅/❌. NÃO mergear. NÃO fechar issue.
```

---

# ONDA 4 — Schema operacional ✅

> **O que faz:** Cria as **tabelas de negócio** no banco: `leads` (oportunidades comerciais com status de CRM), `conversations` (sessões de chat) e `messages` (histórico de mensagens). Define enums, chaves estrangeiras e estende o RLS para essas tabelas. Ainda não há UI nem API de chat — só o modelo de dados pronto para os services da Onda 5.

**Pré-requisito:** Onda 3 (#5) mergeada
**Issues:** #7 (+ extensão RLS das 3 tabelas novas)
**Branch:** `feat/issue-007-schema-leads`

### Prompt #7 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-007 (GitHub #7).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-007-schema-leads

## Fase 1 — Implementar
Leia: docs/DATABASE.md MVP, agency-os-tenant, supabase-postgres-best-practices.
- Drizzle: leads, conversations, messages + enums + FKs
- Migration SQL + RLS (0003 ou equivalente)
Não fazer: #8, #27, #15

## Fase 2 — QA
- Tabelas no Supabase; tenant_id em todas as colunas
- npm run db:migrate limpo; cross-tenant falha no banco
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(db): leads conversations messages schema and RLS (#7)"
git push -u origin feat/issue-007-schema-leads
Relatório ✅/❌. NÃO mergear.
```

---

# ONDA 5 — Services + Settings + Seed ✅

> **O que faz:** Transforma o schema em **código utilizável** e deixa o ambiente de desenvolvimento **testável de ponta a ponta**. Em três passos sequenciais: (1) repositories e services que leem/escrevem leads e mensagens sempre filtrando `tenant_id`; (2) formulário de configuração da empresa em `/settings` (nome, WhatsApp, cidade, serviços, prompt); (3) script de seed que popula um tenant de dev com dados de exemplo para você logar e testar sem cadastrar tudo na mão. **Gate da Onda 6:** login + seed + settings + services funcionando juntos em `main`.

**Pré-requisito:** Onda 4 mergeada
**Issues:** #8 → #9 → #10 (**sequencial**, uma branch por issue, **merge em `main` após cada uma**)
**Gate para Onda 6:** login + seed + settings + CRUD services OK

> ⚠️ **A Onda 6 não começa até #10 estar mergeado e QA aprovado.**

### Fluxo Onda 5 (merge obrigatório entre etapas)

```
#8 implementar → QA → merge main
    ↓
#9 implementar (a partir de main com #8) → QA → merge main
    ↓
#10 implementar (a partir de main com #8+#9) → QA → merge main → liberar Onda 6
```

---

## ONDA 5.1 — Issue #8

> **Sub-etapa:** Camada de acesso a dados — `repository` + `service` para leads e conversas/mensagens.

### Prompt #8 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-008 (GitHub #8).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-008-repositories

## Fase 1 — Implementar
Leia: data-access-layer.md, agency-os-tenant.
- src/modules/leads/ e conversations/ — repository + service
- import "server-only"; toda query filtra tenant_id
Não fazer: UI #9, seed #10, chat #15

## Fase 2 — QA
- CRUD leads/messages via service (script, teste ou route dev)
- npm run build && npm run lint
- MCP Browser se houver rota de teste

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(modules): leads and conversations services (#8)"
git push -u origin feat/issue-008-repositories
Relatório ✅/❌. NÃO mergear.
```

---

## ONDA 5.2 — Issue #9

> **Sub-etapa:** Tela `/settings` funcional.

**Pré-requisito:** #8 mergeado em `main`

### Prompt #9 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-009 (GitHub #9).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-009-settings

## Fase 1 — Implementar
Leia: docs/DESIGN.md, agency-os-widget-ui.
- /settings: company_name, whatsapp, city, services, system_prompt
- React Hook Form + Zod + Server Action; só owner autenticado

## Fase 2 — QA
MCP Browser Cursor:
- Login → /settings → salvar → reload persiste
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): tenant settings CRUD (#9)"
git push -u origin feat/issue-009-settings
Relatório ✅/❌. NÃO mergear.
```

---

## ONDA 5.3 — Issue #10

> **Sub-etapa:** Script `npm run db:seed` idempotente.

**Pré-requisito:** #9 mergeado em `main`

### Prompt #10 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-010 (GitHub #10).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-010-seed

## Fase 1 — Implementar
- npm run db:seed — tenant "Belluci Acabamentos", slug development
- public_key pk_dev_local; owner + tenant_settings exemplo
- Idempotente (2x sem duplicar)

## Fase 2 — QA
- npm run db:seed OK; login owner → /dashboard
- /settings com dados do seed
- npm run build && npm run lint
- MCP Browser após seed

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "chore(db): development tenant seed (#10)"
git push -u origin feat/issue-010-seed
Relatório ✅/❌. NÃO mergear.
```

### Smoke gate Onda 5 (após #10 mergeado em main)

Smoke **integrado** — só roda quando #8, #9 e #10 já estão em `main`. Não substitui o QA individual de cada issue.

```
QA Agent: smoke gate Onda 5 completo (main atualizado, #8+#9+#10 mergeados).

npm run db:seed && npm run dev
Fluxo: login com seed → /settings edita e persiste → criar lead de teste via service/script.

Gate Onda 6: só liberar trilhos A/B/C se este smoke passar.
```

---

# ONDA 6 — Features avançadas 🔒

> **O que faz:** Entrega o **produto visível** — o Funcionário Digital de verdade. Três trilhos em paralelo (cada um em branch separada): **6A Chat** (agentes IA, streaming OpenAI, API `/api/chat`, widget embed, botão WhatsApp); **6B Knowledge** (upload FAQ/PDF, embeddings pgvector, busca semântica para o Sales Agent); **6C Painel** (dashboard com números reais, lista de leads, histórico de conversas, gerador de snippet embed). As páginas existem desde a Onda 0, mas aqui passam a mostrar dados e comportamento reais.

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

> Prompt builder em camadas, tools (`createLead`, `updateLead`, WhatsApp link), Orchestrator + Sales Agent, streaming SSE, UI do chat, config do widget e `embed.js` para colar no site do cliente.

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

### Prompt #12 — Dev + QA (copiar tudo)

```
Dev Agent: implemente e valide ISSUE-012 (GitHub #12).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-012-prompt-builder

## Fase 1 — Implementar
- src/agents/shared/prompt-builder.ts — system + platform + tenant + agent
- Leia: docs/PROMPT_SYSTEM.md

## Fase 2 — QA
- prompt-builder monta 4 camadas
- tenant_settings entram no prompt dinamicamente
- teste unitário ou script isolado passa
- npm run build && npm run lint

## Fase 3 — Auto-fix
Corrigir falhas e repetir Fase 2 (máx 3 ciclos). Não pedir ao usuário.

## Fase 4 — Entrega
git commit -m "feat(ai): four-layer prompt builder (#12)"
git push -u origin feat/issue-012-prompt-builder
Relatório final ✅/❌. NÃO mergear. NÃO fechar issue.
```

### Prompt #13 — Dev + QA (pode rodar ‖ #12 em outra sessão)

```
Dev Agent: implemente e valide ISSUE-013 (GitHub #13).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-013-tools

## Fase 1 — Implementar
- src/tools/create-lead.ts, update-lead.ts, build-whatsapp-link.ts
- Zod validation; tools NÃO importam agents

## Fase 2 — QA
- Tools isoladas funcionam
- npm run build && npm run lint && npm run test (se existir)

## Fase 3 — Auto-fix
Corrigir falhas e repetir Fase 2 (máx 3 ciclos).

## Fase 4 — Entrega
git commit -m "feat(tools): createLead updateLead whatsapp link (#13)"
git push -u origin feat/issue-013-tools
Relatório final ✅/❌. NÃO mergear.
```

### Prompt #11 — Dev + QA (após #12 e #13 mergeados)

```
Dev Agent: implemente e valide ISSUE-011 (GitHub #11).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-011-agents

## Fase 1 — Implementar
- Orchestrator + Sales Agent (agent.ts, prompt.ts, rules.ts, tools.ts)
- Leia: docs/AGENTS.md

## Fase 2 — QA
Pré-requisito: #12 e #13 em main.
- Orchestrator roteia para Sales
- Sales usa prompt-builder; importa tools (não o contrário)
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(ai): orchestrator and sales agent (#11)"
git push -u origin feat/issue-011-agents
Relatório ✅/❌. NÃO mergear.
```

### Prompt #14 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-014 (GitHub #14).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-014-openai-streaming

## Fase 1 — Implementar
OpenAI client + helper SSE + function calling para tools.

## Fase 2 — QA
Stream de tokens em teste isolado; function calling invoca tools.
npm run build && npm run lint.

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(ai): openai streaming (#14)"
git push -u origin feat/issue-014-openai-streaming
Relatório ✅/❌. NÃO mergear.
```

### Prompt #15 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-015 (GitHub #15).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-015-api-chat

## Fase 1 — Implementar
POST /api/chat — CORS, public_key, persiste messages, retorna SSE.

## Fase 2 — QA
- POST /api/chat com public_key válida
- Ciclo mensagem → resposta → persistência; CORS OK
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(api): POST /api/chat SSE (#15)"
git push -u origin feat/issue-015-api-chat
Relatório ✅/❌. NÃO mergear.
```

### Prompt #16 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-016 (GitHub #16).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-016-chat-ui

## Fase 1 — Implementar
UI chat em /chat — input, histórico, streaming, loading.

## Fase 2 — QA
MCP Browser em /chat?key=pk_dev_local:
- Mensagem → resposta; streaming/loading; sem erros console
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): chat UI (#16)"
git push -u origin feat/issue-016-chat-ui
Relatório ✅/❌. NÃO mergear.
```

### Prompt #17 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-017 (GitHub #17).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-017-widget-config

## Fase 1 — Implementar
- GET /api/widget/config por public_key (query ou header)
- Retornar branding público: nome, cores, welcome message
- Sem dados sensíveis (não expor system_prompt completo)
- Skill: agency-os-chat

## Fase 2 — QA
Branch: feat/issue-017-widget-config
Critérios: docs/BACKLOG.md ISSUE-017

Verificar:
- GET /api/widget/config?key=pk_dev_local (ou header x-public-key)
- Resposta JSON com campos públicos esperados
- system_prompt e dados internos NÃO vazam
- npm run build && npm run lint
- Testar com curl ou MCP Browser se houver página de teste

## Fase 3 — Auto-fix
Se reprovado: corrigir automaticamente (sem pedir ao usuário) e repetir Fase 2.
Máximo 3 ciclos. Escalar só se bloqueado ou fora de escopo.

## Fase 4 — Entrega
git commit -m "feat(widget): GET /api/widget/config by public_key (#17)"
git push -u origin feat/issue-017-widget-config
Relatório final ✅ aprovar merge | ❌ bloqueio.
NÃO mergear em main. NÃO fechar issue.
```

### Prompt #18 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-018 (GitHub #18).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-018-embed-js

## Fase 1 — Implementar
public/widget/embed.js — botão + iframe/modal → /chat?key=

## Fase 2 — QA
- embed.js em HTML estático; abre chat com public_key
- Se iframe inacessível no MCP: /chat?key= direto
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): embed.js (#18)"
git push -u origin feat/issue-018-embed-js
Relatório ✅/❌. NÃO mergear.
```

### Prompt #19 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-019 (GitHub #19).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-019-whatsapp-button

## Fase 1 — Implementar
Botão WhatsApp após lead; metadata de clique.
Pré-requisito: #16 e #13 mergeados.

## Fase 2 — QA
MCP Browser: wa.me após lead; clique em metadata
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(widget): whatsapp button (#19)"
git push -u origin feat/issue-019-whatsapp-button
Relatório ✅/❌. NÃO mergear.
```

**Dependências cruzadas 6A↔6B:**
- #23 só após #15 (6A) + #22 (6B)
- #19 só após #16 + #13

---

## TRILHO 6B — Knowledge

> Base de conhecimento RAG — schema de documentos e chunks com pgvector, CRUD de FAQ no painel, tool `searchKnowledge`, integração no Sales Agent e pipeline de PDF.

| Issue | Branch |
|-------|--------|
| #20 | `feat/issue-020-knowledge-schema` |
| #21 | `feat/issue-021-faq-crud` |
| #22 | `feat/issue-022-search-knowledge` |
| #23 | `feat/issue-023-rag-sales` |
| #24 | `feat/issue-024-pdf-pipeline` |
| #25 | `feat/issue-025-knowledge-panel` |

### Prompt #20 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-020 (GitHub #20).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-020-knowledge-schema

## Fase 1 — Implementar
knowledge_documents + knowledge_chunks + pgvector + RLS.
Skill: agency-os-knowledge.

## Fase 2 — QA
- Tabelas com pgvector; RLS por tenant_id
- npm run db:migrate && npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(db): knowledge schema pgvector (#20)"
git push -u origin feat/issue-020-knowledge-schema
Relatório ✅/❌. NÃO mergear.
```

### Prompt #21 — Dev + QA (sessão paralela 1)

```
Dev Agent: implemente e valide ISSUE-021 (GitHub #21).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-021-faq-crud

## Fase 1 — Implementar
CRUD FAQ em /knowledge — type=faq.
Pré-requisito: #20 mergeado.

## Fase 2 — QA
MCP Browser: login → /knowledge → cadastrar FAQ → persiste após reload
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): FAQ CRUD (#21)"
git push -u origin feat/issue-021-faq-crud
Relatório ✅/❌.
```

### Prompt #22 — Dev + QA (sessão paralela 2 — ‖ #21)

```
Dev Agent: implemente e valide ISSUE-022 (GitHub #22).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-022-search-knowledge

## Fase 1 — Implementar
Tool searchKnowledge top-K por tenant_id; fallback texto.
Pré-requisito: #20 mergeado.

## Fase 2 — QA
- Query retorna chunks relevantes; filtra tenant_id
- npm run build && npm run lint && npm run test (se existir)

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(ai): searchKnowledge tool (#22)"
git push -u origin feat/issue-022-search-knowledge
Relatório ✅/❌.
```

### Prompt #23 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-023 (GitHub #23).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-023-rag-sales

## Fase 1 — Implementar
Sales chama searchKnowledge; não inventa sem contexto.
Pré-requisito: #15 e #22 mergeados.

## Fase 2 — QA
MCP Browser /chat: FAQ (#21) na resposta; fora do FAQ não inventa
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(ai): RAG in sales agent (#23)"
git push -u origin feat/issue-023-rag-sales
Relatório ✅/❌.
```

### Prompt #24 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-024 (GitHub #24).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-024-pdf-pipeline

## Fase 1 — Implementar
Upload PDF → extract → chunk → embed → pgvector.

## Fase 2 — QA
- Upload processa; conteúdo consultável via searchKnowledge/chat
- npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(knowledge): PDF pipeline (#24)"
git push -u origin feat/issue-024-pdf-pipeline
Relatório ✅/❌.
```

### Prompt #25 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-025 (GitHub #25).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-025-knowledge-panel

## Fase 1 — Implementar
/knowledge — lista docs, status, delete, re-index.

## Fase 2 — QA
MCP Browser /knowledge: lista, delete, re-index funcionam
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): knowledge management (#25)"
git push -u origin feat/issue-025-knowledge-panel
Relatório ✅/❌.
```

---

## TRILHO 6C — Painel com dados reais

> Substitui placeholders por telas que consomem os services da Onda 5 — contagens no dashboard, tabela de leads com CRM, detalhe de conversas e gerador de código embed em settings.

| Issue | Branch |
|-------|--------|
| #26 | `feat/issue-026-dashboard` |
| #27 | `feat/issue-027-leads-page` |
| #28 | `feat/issue-028-conversations-page` |
| #29 | `feat/issue-029-embed-generator` |

### Prompt #26 — Dev + QA (sessão paralela 1)

```
Dev Agent: implemente e valide ISSUE-026 (GitHub #26).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-026-dashboard

## Fase 1 — Implementar
Cards dashboard: SQL count conversas, leads, leads da semana.
Pré-requisito: #8 mergeado.

## Fase 2 — QA
MCP Browser /dashboard: números reais (não placeholder)
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): dashboard metrics (#26)"
git push -u origin feat/issue-026-dashboard
Relatório ✅/❌.
```

### Prompt #27 — Dev + QA (sessão paralela 2)

```
Dev Agent: implemente e valide ISSUE-027 (GitHub #27).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-027-leads-page

## Fase 1 — Implementar
/leads — tabela Shadcn + editar status CRM.

## Fase 2 — QA
MCP Browser /leads: lista leads; editar status persiste
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): leads page CRM (#27)"
git push -u origin feat/issue-027-leads-page
Relatório ✅/❌.
```

### Prompt #28 — Dev + QA (sessão paralela 3)

```
Dev Agent: implemente e valide ISSUE-028 (GitHub #28).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-028-conversations-page

## Fase 1 — Implementar
/conversations — lista + detalhe com messages.

## Fase 2 — QA
MCP Browser /conversations: lista e histórico completo
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): conversations page (#28)"
git push -u origin feat/issue-028-conversations-page
Relatório ✅/❌.
```

### Prompt #29 — Dev + QA (após #26–#28 mergeados)

```
Dev Agent: implemente e valide ISSUE-029 (GitHub #29).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-029-embed-generator

## Fase 1 — Implementar
/settings — snippet <script> copiável com public_key.
Pré-requisito: #26, #27, #28 mergeados.

## Fase 2 — QA
MCP Browser /settings: snippet visível; data-key = public_key do tenant
npm run build && npm run lint

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "feat(panel): embed code generator (#29)"
git push -u origin feat/issue-029-embed-generator
Relatório ✅/❌.
```

### Smoke gate Onda 6 (após trilhos A+B+C em main)

Smoke **integrado** — só roda quando issues críticas de 6A, 6B e 6C estão mergeadas. Não substitui QA individual.

**Status:** ✅ **Aprovado** em 2026-06-25 (fixes pós-reprovação: `GET /api/chat/history`, `sendBeacon` no clique WhatsApp, `ChatPageClient` sem hydration). Commit dos fixes pendente em `main`.

```
QA Agent: smoke gate Onda 6 completo (main atualizado).

Critérios: docs/QA_PLAN.md F1–F6.
npm run db:seed && npm run dev

Fluxo: widget/chat → lead capturado → /leads → FAQ no chat → WhatsApp link.

Gate Onda 7: só liberar deploy (#30) se este smoke passar.
```

---

# ONDA 7 — Go-live ⬜

> **O que faz:** Leva o MVP para **produção** e documenta o onboarding do primeiro cliente pago. Deploy Vercel + Supabase prod, variáveis de ambiente, checklist de smoke em URL real (`docs/QA_PLAN.md` F1–F6) e `docs/ONBOARDING.md` com o passo a passo para configurar um tenant novo.

**Pré-requisito:** Onda 6 completa + smoke F1–F6 ✅ (liberado em 2026-06-25)

**Antes de #30:** commitar em `main` os fixes do smoke gate (histórico, WhatsApp click, widget hydration).

| Issue | Branch |
|-------|--------|
| #30 | `feat/issue-030-deploy` |
| #31 | `docs/issue-031-onboarding` (doc + execução manual) |

### Prompt #30 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-030 (GitHub #30).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b feat/issue-030-deploy

## Fase 1 — Implementar
Vercel + Supabase prod + docs/DEPLOY.md + env vars.

## Fase 2 — QA
URL produção: app acessível, login, /dashboard, /chat básico
docs/DEPLOY.md completo
MCP Browser na URL de produção

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "chore(deploy): production setup (#30)"
git push -u origin feat/issue-030-deploy
Relatório ✅/❌. NÃO mergear.
```

### Prompt #31 — Dev + QA

```
Dev Agent: implemente e valide ISSUE-031 (GitHub #31).
Skills: agency-os-dev-agent + agency-os-qa-agent.

## Git
git checkout main && git pull && git checkout -b docs/issue-031-onboarding

## Fase 1 — Implementar
docs/ONBOARDING.md — checklist 1º cliente (tenant, settings, FAQ, widget, lead real).
Executar com usuário ou simular e documentar.

## Fase 2 — QA
- Checklist executável passo a passo
- Cobre fluxo completo até lead real em produção
- Evidência de execução documentada

## Fase 3 — Auto-fix
Máx 3 ciclos.

## Fase 4 — Entrega
git commit -m "docs: first client onboarding checklist (#31)"
git push -u origin docs/issue-031-onboarding
Relatório ✅ marcar V0.1 done | ❌ bloqueio.
```

---

# Resumo: ordem e paralelismo

| Onda | Modo | Issues |
|------|------|--------|
| 0 | ✅ | #1 |
| 1 | ✅ sequencial | #2 → #3 |
| 2 | ✅ paralelo (2 branches) | #4 ‖ #6 |
| 3 | ✅ sequencial | #5 |
| 4 | ✅ sequencial | #7 |
| 5 | ✅ sequencial + merge entre cada | #8 → #9 → #10 |
| 6 | ✅ trilhos A/B/C + smoke F1–F6 | #11–#29 |
| **7** | **⬜ sequencial** | **#30 → #31** ← você está aqui |

---

# Prompt mestre Dev+QA (copiar um bloco só)

```
Dev Agent: implemente e valide ISSUE-NNN (GitHub #N).
Skills: agency-os-dev-agent + agency-os-qa-agent.

Onda: [3|4|5|6A|6B|6C|7]
Branch: feat/issue-NNN-nome

## Git — OBRIGATÓRIO
git fetch origin && git checkout main && git pull origin main
git checkout -b feat/issue-NNN-nome

## Fase 1 — Implementar
- gh issue view N
- Critérios: docs/BACKLOG.md ISSUE-NNN
- [escopo da issue]

## Fase 2 — QA
- Checklist do BACKLOG + gate da onda
- npm run build && npm run lint (+ test se existir)
- MCP Browser Cursor (`cursor-ide-browser`) se UI

## Fase 3 — Auto-fix
Corrigir falhas automaticamente (sem pedir ao usuário). Repetir Fase 2.
Máximo 3 ciclos. Escalar só se bloqueado ou fora de escopo V0.1.

## Fase 4 — Entrega
git commit -m "feat(scope): descrição (#N)"
git push -u origin feat/issue-NNN-nome
Relatório final ✅ aprovar merge | ❌ bloqueio.
NÃO mergear em main. NÃO fechar issue.
```

---

# Prompt mestre QA (somente validação)

Use só se a issue **já foi implementada** e você quer validar sem reimplementar.
Para fluxo completo, prefira **Prompt mestre Dev+QA** acima.

```
QA Agent: valide ISSUE-NNN na branch feat/issue-NNN-nome.
Skill: agency-os-qa-agent.

Checkout, build, lint, MCP Browser. Critérios: docs/BACKLOG.md.
Relatório: ✅ aprovar merge | ❌ listar bugs para Dev corrigir
```

---

# V0.2 / V0.3

Issues #32–#49 só após #31. Mesma regra de branch: `feat/issue-0XX-...`

| Milestone GitHub | Issues | Visão estratégica (referência) |
|------------------|--------|--------------------------------|
| `V0.2 — Site Conversacional` | #32–#41 (Hero #33, iFrame, RBAC…) | V0.2 Hero + Widget Hardening — [VISION.md](VISION.md) |
| `V0.3 — Orçamentista IA` | #42–#49 (Estimator, quotes…) | Automação comercial; Site Adaptativo = trilha separada (sem issues ainda) |

Prompts Dev+QA para #32+ serão adicionados quando V0.1 (#31) estiver ✅.
