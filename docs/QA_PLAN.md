# QA Plan — Agency OS

Estratégia de qualidade para V0.1. Complementa o Dev Agent e QA Agent do Cursor.

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
"QA Agent: valide ISSUE-017 na branch feat/issue-017-widget-config"
"QA Agent: rode smoke F1–F6 com Playwright"
```

Smoke gates (várias issues): Onda 5/6 V0.1 — ver DEVELOPMENT_WAVES_V0.1.md; Ondas 1–3 V0.2 — ver DEVELOPMENT_WAVES_V0.2.md.

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
- Skill `.cursor/skills/agency-os-dev-agent/`
- Skill `.cursor/skills/agency-os-qa-agent/`
