# Testes — Agency OS

Guia prático para rodar testes automatizados (Playwright E2E) e QA exploratório.

Complementa [QA_PLAN.md](QA_PLAN.md) (estratégia) e a skill `agency-os-qa-agent` (agente Cursor).

---

## Visão rápida

| Camada | Ferramenta | Comando |
|--------|------------|---------|
| **E2E smoke V0.1** | Playwright | `npm run test:e2e:smoke` |
| **E2E sem IA** | Playwright | `npm run test:e2e:no-ai` |
| **Relatório HTML** | Playwright nativo | `npm run test:e2e:report` |
| **QA exploratório** | MCP Browser Cursor | `"QA Agent: valide ISSUE-XXX"` |
| **Scripts pontuais** | tsx | `npm run test:agents`, etc. |

---

## Pré-requisitos

1. **Node.js** e dependências: `npm install`
2. **Browsers Playwright** (uma vez): `npm run test:e2e:install`
3. **`.env.local`** com Supabase + `DATABASE_URL`
4. **Migrations aplicadas**: `npm run db:migrate`
5. **Tenant de dev**: `npm run db:seed`
   - `public_key`: `pk_dev_local`
   - Login: `owner@belluci.dev` / `BelluciDev2026!`
   - Empresa: `Belluci Acabamentos`
   - Assistente (default): `Funcionário Digital`
6. **OpenAI** (opcional): `OPENAI_API_KEY` — necessário para testes `@openai`

---

## Comandos npm

```bash
# Suite completa (sobe dev server se porta livre)
npm run test:e2e

# Smoke F1–F6 (inclui @openai se key existir)
npm run test:e2e:smoke

# Smoke determinístico — sem testes que usam OpenAI
npm run test:e2e:no-ai

# UI mode (debug visual)
npm run test:e2e:ui

# Headed (ver o browser)
npm run test:e2e:headed

# Abrir último relatório HTML
npm run test:e2e:report

# Um fluxo específico
npx playwright test --grep @f1
npx playwright test tests/e2e/f5-auth-panel.spec.ts
```

### Dev server já rodando (recomendado em máquinas lentas)

Evita conflito de dois `next dev` na mesma pasta:

**PowerShell:**

```powershell
# Terminal 1
npm run dev

# Terminal 2 — após "Ready"
$env:PLAYWRIGHT_SKIP_WEBSERVER = "1"
npm run test:e2e:no-ai
```

**Porta diferente (ex.: 3001):**

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3001"
$env:PLAYWRIGHT_SKIP_WEBSERVER = "1"
npm run test:e2e:no-ai
```

---

## Estrutura

```
tests/e2e/
├── auth.setup.ts       # login → playwright/.auth/owner.json
├── constants.ts        # credenciais e labels do seed
├── fixtures/           # test.extend + helpers
├── pages/              # page objects (chat, login, dashboard)
├── f1-widget-chat.spec.ts
├── f2-lead-capture.spec.ts    @openai
├── f3-knowledge.spec.ts       @openai
├── f4-whatsapp.spec.ts        @openai
├── f5-auth-panel.spec.ts
└── f6-multi-tenant.spec.ts
```

**Config:** `playwright.config.ts` na raiz do projeto.

---

## Smoke V0.1 (tags)

| Tag | Fluxo | Arquivo |
|-----|-------|---------|
| `@f1` | Widget + chat + embed | `f1-widget-chat.spec.ts` |
| `@f2` | Captura de lead | `f2-lead-capture.spec.ts` |
| `@f3` | FAQ → resposta no chat | `f3-knowledge.spec.ts` |
| `@f4` | Link WhatsApp (wa.me) | `f4-whatsapp.spec.ts` |
| `@f5` | Login, dashboard, settings, `assistant_label` | `f5-auth-panel.spec.ts` |
| `@f6` | Isolamento multi-tenant | `f6-multi-tenant.spec.ts` |
| `@smoke` | Todos os specs acima | — |
| `@openai` | Requer `OPENAI_API_KEY` | F2, F3, F4 + persist F1 |

Exemplos:

```bash
npx playwright test --grep @f5
npx playwright test --grep "@smoke" --grep-invert "@openai"
```

---

## Relatórios

Playwright usa **HTML nativo** (sem Allure):

| Saída | Caminho |
|-------|---------|
| Relatório HTML | `playwright-report/` |
| JUnit (CI) | `test-results/junit.xml` |
| JSON | `test-results/results.json` |
| Screenshots / vídeo / trace | `test-results/artifacts/` |

Após falha: `npm run test:e2e:report`

Em retry, trace fica em `test-results/artifacts/` (config: `trace: on-first-retry`).

---

## Variáveis de ambiente (E2E)

| Variável | Default | Uso |
|----------|---------|-----|
| `PLAYWRIGHT_BASE_URL` | `http://localhost:3000` | URL do app |
| `PLAYWRIGHT_SKIP_WEBSERVER` | — | `1` = não subir `npm run dev` |
| `E2E_PUBLIC_KEY` | `pk_dev_local` | Tenant do widget |
| `E2E_OWNER_EMAIL` | `owner@belluci.dev` | Login painel |
| `E2E_OWNER_PASSWORD` | `BelluciDev2026!` | Login painel |
| `E2E_COMPANY_NAME` | `Belluci Acabamentos` | Assert no header do chat |
| `E2E_ASSISTANT_LABEL` | `Funcionário Digital` | Assert `assistant_label` |
| `OPENAI_API_KEY` | — | Testes `@openai` |

---

## Fluxo típico antes de merge

```bash
npm run lint
npm run build
npm run test:e2e:no-ai    # rápido, sem custo OpenAI
# opcional, com IA:
npm run test:e2e:smoke
```

---

## QA Agent (Cursor)

Invocações úteis:

```
QA Agent: rode smoke F1–F6 com Playwright
QA Agent: valide ISSUE-XXX na branch feat/issue-XXX
```

O agente usa:
1. Playwright para regressão
2. MCP `cursor-ide-browser` para exploratório (issues novas)

Skill: `.cursor/skills/agency-os-qa-agent/SKILL.md`

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `Another next dev server is already running` | `$env:PLAYWRIGHT_SKIP_WEBSERVER="1"` ou mate o PID na porta 3000 |
| Timeout no `page.goto` | Suba `npm run dev` antes; primeira compilação Next pode levar minutos |
| Login falha no setup | Rode `npm run db:seed`; confira credenciais em `constants.ts` |
| Testes `@openai` skipped | Defina `OPENAI_API_KEY` no `.env.local` |
| Porta 3000 ocupada | Next usa 3001 — ajuste `PLAYWRIGHT_BASE_URL` |
| `assistant_label` não aparece | Rode `npm run db:migrate` (migration `0010_assistant_label`) |

---

## Scripts legados (não Playwright)

Testes pontuais de issues anteriores:

```bash
npm run test:agents
npm run test:prompt-builder
npm run test:openai-streaming
npm run test:search-knowledge
npm run test:pdf-pipeline
npm run db:test-rls
```

---

## Referências

- [QA_PLAN.md](QA_PLAN.md) — pirâmide de testes e critérios Done
- [WIDGET_CUSTOMIZATION.md](WIDGET_CUSTOMIZATION.md) — `assistant_label`, embed
- [CURSOR_AGENTS.md](CURSOR_AGENTS.md) — Dev Agent + QA Agent
