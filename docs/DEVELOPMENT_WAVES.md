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
| #5 | Auth + login | 3 | `feat/issue-005-auth` | ✅ Feito (em `main`) |
| #7 | Schema leads/messages | 4 | `feat/issue-007-schema-leads` | ✅ Feito (em `main`) |
| #8 | Repositories/services | 5 | `feat/issue-008-repositories` | ⬜ **EM ANDAMENTO** |
| #9 | Settings CRUD | 5 | `feat/issue-009-settings` | ⬜ Bloqueada por #8 mergeado |
| #10 | Seed dev | 5 | `feat/issue-010-seed` | ⬜ Bloqueada por #9 mergeado |
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
ONDA 5  #8 → #9 → #10 ───────────────────► VOCÊ ESTÁ AQUI
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
5. **Handoff** — QA (uma issue por sessão), sem fechar issue

> **QA:** cada issue tem prompt próprio em `docs/DEVELOPMENT_WAVES.md`. Smoke gates integrados (Onda 5, Onda 6, F1–F6) são exceção explícita.

---

# ONDA 0 — Bootstrap ✅

> **O que faz:** Coloca o esqueleto do app de pé — Next.js, TypeScript, Tailwind, Shadcn e a estrutura de pastas (`src/modules`, `src/agents`, rotas placeholder). Nada de negócio ainda; só garantir que o projeto compila, faz lint e as rotas `/`, `/dashboard`, `/chat` existem como casca.

**Issue:** #1 · **Branch:** `feat/issue-001-bootstrap` (já em main)

### Prompt QA Onda 0 — Issue #1 (retroativo)

```
QA Agent: valide ISSUE-001 retroativamente (código em main).

Issue: GitHub #1
Critérios: docs/BACKLOG.md ISSUE-001.

Verificar:
- npm run build && npm run lint && npm run dev
- Rotas respondem: / /login /dashboard /chat /api/health
- Estrutura src/modules, src/agents, drizzle, tests existe

MCP Browser Cursor (`cursor-ide-browser`) nas rotas públicas.

Relatório: ✅ marcar issue done | ❌ abrir correção
```

---

# ONDA 1 — Supabase + Drizzle ✅

> **O que faz:** Conecta o app ao banco. Configura o cliente Supabase (browser + server), cria o bucket de arquivos da base de conhecimento e define as **primeiras tabelas** com Drizzle: `tenants` (cada cliente da plataforma), `tenant_settings` (configurações da empresa) e `users` (donos que logam no painel). Sem isso, não há onde persistir dados.

**Issues:** #2 → #3 (sequencial) · Feito em `main`

### Prompt QA Onda 1.1 — Issue #2 (retroativo)

```
QA Agent: valide ISSUE-002 retroativamente (código em main).

Issue: GitHub #2
Critérios: docs/BACKLOG.md ISSUE-002.

Verificar:
- Variáveis Supabase documentadas em .env.example
- Clientes Supabase browser + server em src/lib/supabase/
- Conexão com projeto Supabase OK
- Bucket Storage `knowledge` existe (docs/SUPABASE_SETUP.md)

npm run build && npm run lint.

Relatório: ✅ marcar issue done | ❌ abrir correção
```

### Prompt QA Onda 1.2 — Issue #3 (retroativo)

```
QA Agent: valide ISSUE-003 retroativamente (código em main).

Issue: GitHub #3
Critérios: docs/BACKLOG.md ISSUE-003.

Verificar:
- Drizzle config e schema: tenants, tenant_settings, users
- npm run db:migrate (ou drizzle-kit push) roda sem erro
- Tipos exportados em src/lib/db/schema

npm run build && npm run lint.

Relatório: ✅ marcar issue done | ❌ abrir correção
```

---

# ONDA 2 — Tenant + RLS ✅

> **O que faz:** Implementa o **multi-tenant** de verdade. O middleware identifica qual empresa está sendo acessada (subdomínio ou chave pública) e injeta o `tenant_id` no contexto. Em paralelo, o **RLS** (Row Level Security) no Postgres garante que, mesmo com SQL direto, um tenant nunca lê ou escreve dados de outro. É a fundação de segurança do SaaS.

**Issues:** #4 ‖ #6 · Feito em `main` (sem branches — recuperado)

### Prompt QA Onda 2.1 — Issue #4 (retroativo)

```
QA Agent: valide ISSUE-004 retroativamente (código em main).

Issue: GitHub #4
Critérios: docs/BACKLOG.md ISSUE-004.

Verificar:
- src/middleware.ts resolve tenant em dev (localhost)
- getTenant() retorna tenant_id correto
- Request sem tenant válido → 404 ou erro esperado
- src/lib/tenant/ e src/modules/tenants/repository.ts

npm run build && npm run lint.

Relatório: ✅ marcar issue done | ❌ abrir correção
```

### Prompt QA Onda 2.2 — Issue #6 (retroativo)

```
QA Agent: valide ISSUE-006 retroativamente (código em main).

Issue: GitHub #6
Critérios: docs/BACKLOG.md ISSUE-006.

Verificar:
- Migrations RLS em drizzle/migrations/0001_*.sql (e fixes se houver)
- RLS ativo em tenants, tenant_settings, users
- Query cross-tenant falha no SQL (testar no Supabase ou script)

Arquivos: drizzle/migrations/, políticas por tenant_id.

Relatório: ✅ marcar issue done | ❌ abrir correção
```

---

# ONDA 3 — Auth ✅

> **O que faz:** O dono da agência consegue **entrar no painel**. Login com Supabase Auth (email/senha), callback de sessão, proteção das rotas `(dashboard)/*` — quem não está logado vai para `/login`. O usuário autenticado fica vinculado ao `tenant_id` correto. Sem auth, o painel é só placeholder aberto.

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

### Prompt QA Onda 3 — Issue #5

```
QA Agent: valide ISSUE-005 na branch feat/issue-005-auth.

Branch: feat/issue-005-auth
Issue: GitHub #5
Critérios: docs/BACKLOG.md ISSUE-005.

Checkout da branch, npm run build, npm run lint, npm run dev.

Verificar (MCP Browser Cursor — cursor-ide-browser):
- /login funcional (email/senha)
- Login owner → /dashboard OK
- Sessão inválida ou logout → redirect /login
- users.tenant_id vinculado ao tenant resolvido

Relatório: ✅ aprovar merge em main | ❌ devolver ao Dev Agent
```

---

# ONDA 4 — Schema operacional ✅

> **O que faz:** Cria as **tabelas de negócio** no banco: `leads` (oportunidades comerciais com status de CRM), `conversations` (sessões de chat) e `messages` (histórico de mensagens). Define enums, chaves estrangeiras e estende o RLS para essas tabelas. Ainda não há UI nem API de chat — só o modelo de dados pronto para os services da Onda 5.

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

### Prompt QA Onda 4 — Issue #7

```
QA Agent: valide ISSUE-007 na branch feat/issue-007-schema-leads.

Branch: feat/issue-007-schema-leads
Issue: GitHub #7
Critérios: docs/BACKLOG.md ISSUE-007.

Checkout da branch, npm run build, npm run lint.

Verificar:
- Tabelas leads, conversations, messages existem no Supabase
- tenant_id em todas as colunas; FKs corretas
- Enums leads.status e leads.score
- Migration RLS nas 3 tabelas (0003 ou equivalente)
- npm run db:migrate roda limpo
- Query cross-tenant falha no banco

Relatório: ✅ aprovar merge em main | ❌ devolver ao Dev Agent
```

---

# ONDA 5 — Services + Settings + Seed ⬜ VOCÊ ESTÁ AQUI

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

> **Sub-etapa:** Camada de acesso a dados — `repository` + `service` para leads e conversas/mensagens, com `import "server-only"` e filtro `tenant_id` em toda query. É o código que o chat (#15) e o painel (#27) vão chamar depois.

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

### Prompt QA Onda 5.1 — Issue #8

```
QA Agent: valide ISSUE-008 na branch feat/issue-008-repositories.

Branch: feat/issue-008-repositories
Issue: GitHub #8

Checkout da branch, npm run build, npm run lint.
Critérios: docs/BACKLOG.md ISSUE-008.

Verificar:
- src/modules/leads/ e src/modules/conversations/ com repository + service
- import "server-only" nos services
- Toda query filtra tenant_id (não vazar cross-tenant)
- CRUD leads e messages via service layer (script, teste ou route temporária)

Não exigir: UI /settings (#9), seed (#10), chat (#15).

MCP Browser Cursor (`cursor-ide-browser`) se houver rota temporária para testar.

Relatório: ✅ aprovar merge em main | ❌ devolver ao Dev Agent
```

---

## ONDA 5.2 — Issue #9

> **Sub-etapa:** Tela `/settings` funcional — o dono edita nome da empresa, WhatsApp, cidade, lista de serviços e prompt do sistema. React Hook Form + Zod + Server Action. Só funciona bem se #8 já estiver em `main` (auth + tenant context já existem desde ondas anteriores).

**Pré-requisito:** #8 mergeado em `main` (não só QA aprovado na branch)
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

### Prompt QA Onda 5.2 — Issue #9

```
QA Agent: valide ISSUE-009 na branch feat/issue-009-settings.

Branch: feat/issue-009-settings
Issue: GitHub #9

Pré-requisito: #8 já mergeado em main (esta branch deve incluir os services).

Checkout da branch, npm run build, npm run lint, npm run dev.
Critérios: docs/BACKLOG.md ISSUE-009.

Verificar (MCP Browser Cursor — cursor-ide-browser):
- Login como owner → acessar /settings
- Formulário: company_name, whatsapp, city, services, system_prompt
- Salvar → reload → dados persistem
- Usuário não autenticado não edita settings de outro tenant

Não exigir: seed (#10), chat, widget embed.

Relatório: ✅ aprovar merge em main | ❌ devolver ao Dev Agent
```

---

## ONDA 5.3 — Issue #10

> **Sub-etapa:** Script `npm run db:seed` — cria o tenant "Belluci Acabamentos", usuário owner, settings de exemplo e `public_key` fixa para testar o widget. Idempotente (rodar 2× não duplica). Depende de auth (#5) e, na prática, de settings (#9) para o fluxo completo de teste.

**Pré-requisito:** #9 mergeado em `main`
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

### Prompt QA Onda 5.3 — Issue #10

```
QA Agent: valide ISSUE-010 na branch feat/issue-010-seed.

Branch: feat/issue-010-seed
Issue: GitHub #10

Pré-requisito: #8 e #9 já mergeados em main.

Checkout da branch, npm run build, npm run lint.
Critérios: docs/BACKLOG.md ISSUE-010.

Verificar:
- npm run db:seed executa sem erro
- Idempotente: rodar 2x não duplica tenant/user
- Tenant dev "Belluci Acabamentos" com public_key fixa
- Login com user owner do seed → /dashboard OK
- /settings mostra dados de exemplo do seed (se #9 mergeado)

MCP Browser Cursor (`cursor-ide-browser`) para login e /settings após seed.

Relatório: ✅ aprovar merge em main | ❌ devolver ao Dev Agent
```

### Smoke gate Onda 6 (após #10 mergeado em main)

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

### Prompt #12

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

### Prompt QA Onda 6A — Issue #12

```
QA Agent: valide ISSUE-012 na branch feat/issue-012-prompt-builder.

Branch: feat/issue-012-prompt-builder
Issue: GitHub #12
Critérios: docs/BACKLOG.md ISSUE-012.

Verificar:
- prompt-builder monta 4 camadas (system, platform, tenant, agent)
- Dados de tenant_settings entram no prompt dinamicamente
- Teste unitário ou script isolado passa

npm run build && npm run lint.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #13 (pode rodar ‖ #12 em outra sessão)

```
Dev Agent: implemente ISSUE-013 (GitHub #13).

## Git — OBRIGATÓRIO
git checkout main && git pull && git checkout -b feat/issue-013-tools

## Escopo
src/tools/create-lead.ts, update-lead.ts, build-whatsapp-link.ts — Zod, sem import de agents.

git commit -m "feat(tools): createLead updateLead whatsapp link (#13)"
git push -u origin feat/issue-013-tools
Handoff QA.
```

### Prompt QA Onda 6A — Issue #13

```
QA Agent: valide ISSUE-013 na branch feat/issue-013-tools.

Branch: feat/issue-013-tools
Issue: GitHub #13
Critérios: docs/BACKLOG.md ISSUE-013.

Verificar:
- Tools em src/tools/ com validação Zod
- Tools NÃO importam agents
- createLead, updateLead, buildWhatsAppLink funcionam isoladamente

npm run build && npm run lint && npm run test (se existir).

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #11 (após #12 e #13 mergeados)

```
Dev Agent: implemente ISSUE-011 (GitHub #11).
Branch: feat/issue-011-agents

## Escopo
Orchestrator + Sales Agent (agent.ts, prompt.ts, rules.ts, tools.ts).
Leia: docs/AGENTS.md

Handoff QA.
```

### Prompt QA Onda 6A — Issue #11

```
QA Agent: valide ISSUE-011 na branch feat/issue-011-agents.

Pré-requisito: #12 e #13 mergeados em main.

Verificar:
- Orchestrator roteia intenção comercial para Sales
- Sales usa prompt-builder e importa tools (não o contrário)
- Resposta de teste com prompt montado

npm run build && npm run lint.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #14

```
Dev Agent: implemente ISSUE-014 (GitHub #14).
Branch: feat/issue-014-openai-streaming
OpenAI client + helper SSE + function calling para tools.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #14

```
QA Agent: valide ISSUE-014 na branch feat/issue-014-openai-streaming.

Verificar: stream de tokens em teste isolado; function calling invoca tools.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #15

```
Dev Agent: implemente ISSUE-015 (GitHub #15).
Branch: feat/issue-015-api-chat
POST /api/chat — CORS, public_key, persiste messages, retorna SSE.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #15

```
QA Agent: valide ISSUE-015 na branch feat/issue-015-api-chat.

Verificar:
- POST /api/chat com public_key válida
- Ciclo mensagem → resposta → persistência em messages
- CORS para origem do widget

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #16

```
Dev Agent: implemente ISSUE-016 (GitHub #16).
Branch: feat/issue-016-chat-ui
UI chat em /chat — input, histórico, streaming, loading.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #16

```
QA Agent: valide ISSUE-016 na branch feat/issue-016-chat-ui.

MCP Browser Cursor em /chat?key= (tenant dev):
- Enviar mensagem → resposta aparece
- Streaming ou loading state visível
- Sem erros no console

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #17

```
Dev Agent: implemente ISSUE-017 (GitHub #17).
Branch: feat/issue-017-widget-config
GET /api/widget/config por public_key.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #17

```
QA Agent: valide ISSUE-017 na branch feat/issue-017-widget-config.

Verificar:
- GET /api/widget/config?key= retorna branding público
- Sem dados sensíveis (sem system_prompt completo, etc.)

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #18

```
Dev Agent: implemente ISSUE-018 (GitHub #18).
Branch: feat/issue-018-embed-js
public/widget/embed.js — botão + iframe/modal.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #18

```
QA Agent: valide ISSUE-018 na branch feat/issue-018-embed-js.

Verificar:
- embed.js carrega em HTML estático externo
- Abre chat com public_key correta
- Limitação MCP: testar /chat?key= direto se iframe inacessível

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #19

```
Dev Agent: implemente ISSUE-019 (GitHub #19).
Branch: feat/issue-019-whatsapp-button
Botão WhatsApp após captura de lead; metadata de clique.

Handoff QA.
```

### Prompt QA Onda 6A — Issue #19

```
QA Agent: valide ISSUE-019 na branch feat/issue-019-whatsapp-button.

Pré-requisito: #16 e #13 mergeados.

MCP Browser Cursor:
- Após lead capturado, link wa.me com mensagem pré-preenchida
- Clique registrado em metadata

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
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

### Prompt #20

```
Dev Agent: implemente ISSUE-020 (GitHub #20).

## Git — OBRIGATÓRIO
git checkout main && git pull && git checkout -b feat/issue-020-knowledge-schema

## Escopo
knowledge_documents + knowledge_chunks + pgvector + RLS.
Skill: agency-os-knowledge.

git commit -m "feat(db): knowledge schema pgvector (#20)"
git push -u origin feat/issue-020-knowledge-schema
Handoff QA.
```

### Prompt QA Onda 6B — Issue #20

```
QA Agent: valide ISSUE-020 na branch feat/issue-020-knowledge-schema.

Verificar:
- Tabelas knowledge_documents e knowledge_chunks com pgvector
- RLS por tenant_id
- Migration habilita vector search

npm run db:migrate && npm run build && npm run lint.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #21 (sessão paralela 1)

```
Dev Agent: implemente ISSUE-021 (GitHub #21).
Branch: feat/issue-021-faq-crud
CRUD FAQ em /knowledge — texto, type=faq.

git commit -m "feat(panel): FAQ CRUD (#21)"
git push -u origin feat/issue-021-faq-crud
Handoff QA.
```

### Prompt QA Onda 6B — Issue #21

```
QA Agent: valide ISSUE-021 na branch feat/issue-021-faq-crud.

Pré-requisito: #20 mergeado.

MCP Browser Cursor:
- Login → /knowledge
- Cadastrar pergunta/resposta FAQ
- Conteúdo persiste após reload

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #22 (sessão paralela 2 — pode rodar ‖ #21)

```
Dev Agent: implemente ISSUE-022 (GitHub #22).
Branch: feat/issue-022-search-knowledge
Tool searchKnowledge top-K por tenant_id.

git commit -m "feat(ai): searchKnowledge tool (#22)"
git push -u origin feat/issue-022-search-knowledge
Handoff QA.
```

### Prompt QA Onda 6B — Issue #22

```
QA Agent: valide ISSUE-022 na branch feat/issue-022-search-knowledge.

Pré-requisito: #20 mergeado.

Verificar:
- searchKnowledge retorna chunks relevantes para query de teste
- Filtra por tenant_id
- Fallback texto se sem embedding

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #23

```
Dev Agent: implemente ISSUE-023 (GitHub #23).
Branch: feat/issue-023-rag-sales
Sales Agent chama searchKnowledge; não inventa sem contexto.

Handoff QA.
```

### Prompt QA Onda 6B — Issue #23

```
QA Agent: valide ISSUE-023 na branch feat/issue-023-rag-sales.

Pré-requisito: #15 e #22 mergeados.

MCP Browser Cursor em /chat:
- FAQ cadastrado (#21) refletido na resposta
- Pergunta fora do FAQ → não inventa fatos

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #24

```
Dev Agent: implemente ISSUE-024 (GitHub #24).
Branch: feat/issue-024-pdf-pipeline
Upload PDF → extract → chunk → embed → pgvector.

Handoff QA.
```

### Prompt QA Onda 6B — Issue #24

```
QA Agent: valide ISSUE-024 na branch feat/issue-024-pdf-pipeline.

Verificar:
- Upload PDF no painel ou API
- Pipeline processa e grava chunks com embedding
- Conteúdo do PDF consultável via searchKnowledge/chat

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #25

```
Dev Agent: implemente ISSUE-025 (GitHub #25).
Branch: feat/issue-025-knowledge-panel
/knowledge — lista docs, status, delete, re-index.

Handoff QA.
```

### Prompt QA Onda 6B — Issue #25

```
QA Agent: valide ISSUE-025 na branch feat/issue-025-knowledge-panel.

MCP Browser Cursor em /knowledge:
- Lista documentos e status de processamento
- Delete e re-index funcionam

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
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

### Prompt #26 (sessão paralela 1)

```
Dev Agent: implemente ISSUE-026 (GitHub #26).
Branch: feat/issue-026-dashboard
Cards com SQL count: conversas, leads, leads da semana.

git commit -m "feat(panel): dashboard metrics (#26)"
git push -u origin feat/issue-026-dashboard
Handoff QA.
```

### Prompt QA Onda 6C — Issue #26

```
QA Agent: valide ISSUE-026 na branch feat/issue-026-dashboard.

Pré-requisito: #8 mergeado (services).

MCP Browser Cursor:
- Login → /dashboard
- Números batem com dados do tenant (não placeholder)

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #27 (sessão paralela 2)

```
Dev Agent: implemente ISSUE-027 (GitHub #27).
Branch: feat/issue-027-leads-page
Tabela Shadcn + editar status CRM.

git commit -m "feat(panel): leads page CRM (#27)"
git push -u origin feat/issue-027-leads-page
Handoff QA.
```

### Prompt QA Onda 6C — Issue #27

```
QA Agent: valide ISSUE-027 na branch feat/issue-027-leads-page.

MCP Browser Cursor em /leads:
- Lista leads do tenant
- Editar status CRM persiste

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #28 (sessão paralela 3)

```
Dev Agent: implemente ISSUE-028 (GitHub #28).
Branch: feat/issue-028-conversations-page
Lista conversas + detalhe com messages.

git commit -m "feat(panel): conversations page (#28)"
git push -u origin feat/issue-028-conversations-page
Handoff QA.
```

### Prompt QA Onda 6C — Issue #28

```
QA Agent: valide ISSUE-028 na branch feat/issue-028-conversations-page.

MCP Browser Cursor em /conversations:
- Lista conversas
- Detalhe mostra histórico completo de messages

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #29 (após #26–#28 mergeados)

```
Dev Agent: implemente ISSUE-029 (GitHub #29).
Branch: feat/issue-029-embed-generator
Snippet <script> copiável em /settings com public_key.

Handoff QA.
```

### Prompt QA Onda 6C — Issue #29

```
QA Agent: valide ISSUE-029 na branch feat/issue-029-embed-generator.

Pré-requisito: #26, #27, #28 mergeados.

MCP Browser Cursor em /settings:
- Snippet embed visível e copiável
- data-key corresponde ao public_key do tenant

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Smoke gate Onda 6 (após trilhos A+B+C em main)

Smoke **integrado** — só roda quando issues críticas de 6A, 6B e 6C estão mergeadas. Não substitui QA individual.

```
QA Agent: smoke gate Onda 6 completo (main atualizado).

Critérios: docs/QA_PLAN.md F1–F6.
npm run db:seed && npm run dev

Fluxo: widget/chat → lead capturado → /leads → FAQ no chat → WhatsApp link.

Gate Onda 7: só liberar deploy (#30) se este smoke passar.
```

---

# ONDA 7 — Go-live 🔒

> **O que faz:** Leva o MVP para **produção** e documenta o onboarding do primeiro cliente pago. Deploy Vercel + Supabase prod, variáveis de ambiente, checklist de smoke em URL real (`docs/QA_PLAN.md` F1–F6) e `docs/ONBOARDING.md` com o passo a passo para configurar um tenant novo.

**Pré-requisito:** Onda 6 completa + smoke F1–F6 (docs/QA_PLAN.md)

| Issue | Branch |
|-------|--------|
| #30 | `feat/issue-030-deploy` |
| #31 | `docs/issue-031-onboarding` (doc + execução manual) |

### Prompt #30

```
Dev Agent: ISSUE-030. Branch feat/issue-030-deploy.
Vercel + Supabase prod + docs/DEPLOY.md.

git commit -m "chore(deploy): production setup (#30)"
git push -u origin feat/issue-030-deploy
Handoff QA.
```

### Prompt QA Onda 7 — Issue #30

```
QA Agent: valide ISSUE-030 na branch feat/issue-030-deploy.

Verificar em URL de produção:
- App acessível (Vercel)
- Supabase prod conectado
- Variáveis de ambiente corretas
- docs/DEPLOY.md completo

MCP Browser Cursor na URL produção: login, /dashboard, /chat básico.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

### Prompt #31

```
Dev Agent: ISSUE-031. Branch docs/issue-031-onboarding.
Criar docs/ONBOARDING.md com checklist 1º cliente. Executar com usuário.

Handoff QA.
```

### Prompt QA Onda 7 — Issue #31

```
QA Agent: valide ISSUE-031 na branch docs/issue-031-onboarding.

Verificar:
- docs/ONBOARDING.md existe e cobre: tenant, settings, FAQ, widget, lead real
- Checklist executável passo a passo
- Evidência de execução com usuário (ou simulação documentada)

Relatório: ✅ aprovar merge / marcar V0.1 done | ❌ devolver ao Dev Agent
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
| **5** | **⬜ sequencial + merge entre cada** | **#8 → #9 → #10** |
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

**Regra:** um prompt QA = **uma issue**. Não combinar #8+#9+#10 nem #2+#3 na mesma sessão.

Exceções (smoke integrado, explícito no doc):
- Smoke gate Onda 5 (após #10 em main)
- Smoke gate Onda 6 (F1–F6, antes da Onda 7)
- Retroativo: cada issue ainda tem prompt próprio, mesmo que código já esteja em main

```
Atue como QA Agent (skill agency-os-qa-agent).

Branch: feat/issue-NNN-nome
Issue: GitHub #N  ← uma só

Checkout da branch, npm run build, npm run lint, MCP Browser Cursor (`cursor-ide-browser`).
Critérios: docs/BACKLOG.md ISSUE-NNN + gate da onda em docs/DEVELOPMENT_WAVES.md.

Relatório: ✅ aprovar merge | ❌ devolver ao Dev Agent
```

---

# V0.2 / V0.3

Issues #32–#49 só após #31. Mesma regra de branch: `feat/issue-0XX-...`
