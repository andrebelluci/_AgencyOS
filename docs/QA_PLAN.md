# QA Plan — Agency OS

Estratégia de qualidade para **V0.1** (concluído) e **V0.2** (ativo). Complementa o Dev Agent e QA Agent do Cursor.

---

## Modelo de dois agentes

```
┌─────────────┐     implementa      ┌─────────────┐
│  Dev Agent  │ ──────────────────► │  QA Agent   │
│  (código)   │ ◄── bugs ────────── │  (validação)│
└─────────────┘                     └─────────────┘
       │                                    │
       ▼                                    ▼
  GitHub Issue                        Issue fechada
  (open)                              (só se QA OK)
```

| Agente | Skill | Responsabilidade |
|--------|-------|------------------|
| **Dev** | `agency-os-dev-agent` | Lê issue → implementa → QA → auto-fix → entrega |
| **QA** | `agency-os-qa-agent` | Checklist QA (sozinho ou Fase 2 do Dev) → relatório |

**Regra:** quem implementa não fecha a própria issue. **Um prompt QA = uma issue** (ver prompts em `docs/DEVELOPMENT_WAVES_V0.2.md` para V0.2; `docs/DEVELOPMENT_WAVES_V0.1.md` para V0.1).

---

## Pirâmide de testes (V0.1)

| Camada | Ferramenta | Quando | Prioridade |
|--------|------------|--------|------------|
| **Unit** | Vitest | tools, tenant, validators, prompt-builder | Alta |
| **Integration** | Vitest + DB test | services/repositories com tenant_id | Média |
| **E2E commitado** | Playwright (`tests/e2e/`) | Fluxos críticos em CI | Média (pós Bloco 3) |
| **Exploratório** | **MCP Browser Cursor** (`cursor-ide-browser`) | Cada issue antes de fechar | Alta |
| **Manual** | Checklist onboarding | 1º cliente real | Alta |

Não buscar 100% coverage no V0.1. Cobrir **caminhos que geram receita**.

---

## Fluxos obrigatórios de teste (smoke V0.1)

### F1 — Widget + Chat
- [ ] Widget carrega em página externa (embed.js)
- [ ] Mensagem enviada recebe resposta
- [ ] Histórico persiste ao recarregar conversation
- [ ] Sem erros no console

### F2 — Lead
- [ ] Sales Agent captura nome + telefone
- [ ] Lead aparece em `/leads` do tenant correto
- [ ] Score e status salvos

### F3 — Knowledge
- [ ] FAQ cadastrado refletido na resposta do chat
- [ ] Agente não inventa fora do contexto

#### F3.1 — RAG First (paráfrase FAQ) — **obrigatório**

Cenário de referência ([ADR-005](decisions/005-rag-first.md)):

**FAQ cadastrada**

- Pergunta: `Qual roupa devo usar?`
- Resposta: `Padrinhos utilizam terno preto.`

**Pergunta do usuário (paráfrase)**

`Com que roupa posso ir?`

**Resultado esperado**

- O agente invoca `searchKnowledge` (ou equivalente no runtime)
- Encontra a FAQ equivalente (busca semântica ou textual)
- Responde utilizando o conhecimento da empresa (ex.: menciona terno preto / dress code cadastrado)

**Resultado não aceitável**

- Responder apenas com conhecimento genérico de mercado (ex.: “depende do tipo de evento…” sem citar a política do tenant)
- Inventar dress code não presente na base
- Ignorar FAQ existente quando recuperável

**Evidência:** logs `search_knowledge_tool_called` / `knowledge_search_completed` ou smoke `npm run test:search-knowledge` (check `search:faq-paraphrase` quando disponível).

### F4 — WhatsApp
- [ ] Link `wa.me` com mensagem pré-preenchida
- [ ] Clique registrado (metadata)

### F5 — Auth + Painel
- [ ] Login owner
- [ ] Dashboard com contagens corretas
- [ ] Settings persistem

### F6 — Multi-tenant
- [ ] Tenant A não acessa dados de Tenant B (RLS + app)

---

## Fluxos de teste V0.2 (smoke F7)

Referência de ondas: [DEVELOPMENT_WAVES_V0.2.md](DEVELOPMENT_WAVES_V0.2.md).  
Regressão V0.1: manter **F1–F6** passando (`npm run test:e2e:no-ai` ou `npm run test:e2e:smoke`).

### F7.1 — Onda 1 V0.2 (após #50, #44, #48 em `main`)

- [ ] **Dark mode (#50):** Settings → tema `light` / `dark` / `auto`; `/chat?key=` reflete tema; `primary_color` como accent; `assistant_label` preservado (031E)
- [ ] **Busca conversas (#44):** `/conversations` — busca textual encontra mensagem; filtro por período funciona
- [ ] **Métricas (#48):** Dashboard exibe funil widget → mensagens → leads → WhatsApp (7d/30d)
- [ ] `npm run build && npm run lint && npm run test:e2e:no-ai`

### F7.2 — Onda 2 V0.2 (após #42, #43, #41 em `main`)

- [ ] **Hero (#42):** Demo com chat inline na hero; estados pré-definidos; lead ou WhatsApp ao final
- [ ] **iFrame (#43):** Snippet iframe em /settings carrega `/chat?key=` cross-origin
- [ ] **Domínio (#41):** Host custom resolve tenant (dev: Host header ou hosts file); widget e APIs OK
- [ ] F7.1 ainda passa

### F7.3 — Milestone V0.2 completo (após Onda 3)

- [ ] **RBAC (#45):** Operator acessa leads/conversas; 403 em settings/knowledge write
- [ ] **Features (#46):** `tenant_features` liga/desliga capability esperada
- [ ] **Support (#49):** Pergunta garantia/FAQ → Support Agent; venda → Sales
- [ ] **Citação RAG (#51):** Resposta com FAQ cita fonte visível no chat — **complementa [ADR-005](decisions/005-rag-first.md)**; validar que a consulta à base ocorreu antes (F3.1)
- [ ] **Landing (#47):** Página marketing apex responsiva com CTA
- [ ] F1–F6 + F7.1 + F7.2 passam
- [ ] Hardening complementar (quotas tenant) documentado/testado se entregue

---

## MCP Browser do Cursor (QA exploratório)

**Servidor:** `cursor-ide-browser` (integrado ao Cursor — aba Browser nativa). Único MCP de browser do projeto.

### Workflow

```
browser_tabs (list) → browser_navigate → browser_lock → snapshot/click/fill → screenshot → unlock
```

### Ferramentas

| Tool | Uso |
|------|-----|
| `browser_navigate` | `http://localhost:3000` ou preview Vercel |
| `browser_snapshot` | Ler DOM acessível |
| `browser_click` / `browser_fill` | Interações |
| `browser_take_screenshot` | Evidência em falhas |
| `browser_cdp` | Console/network via `Runtime.evaluate` se necessário |

### Limitação importante

**Iframes não são acessíveis** pelo MCP Browser. Para validar embed (#18), testar `/chat?key=` direto até haver workaround.

### MCP Browser vs Playwright commitado

| Situação | Ferramenta |
|----------|------------|
| Validar issue pontual no Cursor | **MCP cursor-ide-browser** |
| Regressão em CI | Playwright em `tests/e2e/` |
| Debug visual | `browser_take_screenshot` |
| PR merge gate | `npm run test` + `npm run test:e2e` |

---

## Estrutura de testes

```
tests/
├── e2e/                          # Playwright — smoke F1–F6
│   ├── constants.ts
│   ├── fixtures/
│   ├── pages/
│   ├── f1-widget-chat.spec.ts
│   ├── f2-lead-capture.spec.ts
│   ├── f3-knowledge.spec.ts
│   ├── f4-whatsapp.spec.ts
│   ├── f5-auth-panel.spec.ts
│   └── f6-multi-tenant.spec.ts
├── unit/                         # (futuro — Vitest)
└── integration/                  # (futuro — Vitest + DB)
```

Comandos: `npm run test:e2e` · `npm run test:e2e:smoke` · `npm run test:e2e:report` · ver [TEST.md](TEST.md)

---

## Critério de "Done" (issue)

Issue só fecha quando:

1. ✅ Critérios de aceite do BACKLOG atendidos
2. ✅ `npm run build` passa
3. ✅ `npm run lint` passa
4. ✅ Testes automatizados relevantes passam (ou documentado n/a)
5. ✅ QA Agent aprovou (browser smoke)
6. ✅ Sem bug crítico/alto aberto
7. ✅ Perguntas factuais sobre a empresa respeitam **RAG First** (F3.1 quando aplicável)

---

## Comandos para o usuário

```
# Smoke Playwright V0.1 (regressão)
npm run test:e2e:smoke

# Relatório HTML
npm run test:e2e:report

# Fluxo completo (um paste)
"Dev Agent: implemente e valide ISSUE-045"  → ver prompt #50 em DEVELOPMENT_WAVES_V0.2.md

# Só validar (issue já implementada)
"QA Agent: valide ISSUE-045 (GitHub #50) na branch feat/issue-050-widget-dark-mode"
"QA Agent: rode smoke F1–F6 com Playwright"
"QA Agent: rode smoke F7.1 V0.2"   → após Onda 1 mergeada
```

Smoke gates: Onda 5/6 **V0.1** — `DEVELOPMENT_WAVES_V0.1.md`; Ondas 1–3 **V0.2** — `DEVELOPMENT_WAVES_V0.2.md` · critérios **F7.1–F7.3** abaixo.

---

## CI (V0.2)

Quando houver código estável:

```yaml
# .github/workflows/ci.yml (futuro)
- npm run lint
- npm run test
- npm run test:e2e  # com playwright install
```

Até lá: QA via **MCP Browser do Cursor** (`cursor-ide-browser`) é suficiente.

---

## Referências

- [CURSOR_AGENTS.md](CURSOR_AGENTS.md)
- [BACKLOG.md](BACKLOG.md) — critérios por issue
- [decisions/005-rag-first.md](decisions/005-rag-first.md) — RAG First (Knowledge First)
- Skill `.cursor/skills/agency-os-dev-agent/`
- Skill `.cursor/skills/agency-os-qa-agent/`
