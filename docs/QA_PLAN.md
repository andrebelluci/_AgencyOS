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
| **Dev** | `agency-os-dev-agent` | Lê issue → implementa → handoff |
| **QA** | `agency-os-qa-agent` | MCP Browser Cursor + testes → relatório |

**Regra:** quem implementa não fecha a própria issue. **Um prompt QA = uma issue** (ver prompts em `docs/DEVELOPMENT_WAVES.md`).

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

## Estrutura de testes (a criar com código)

```
tests/
├── unit/
│   ├── tools/
│   ├── tenant/
│   └── agents/
├── integration/
│   ├── leads.test.ts
│   └── chat-api.test.ts
└── e2e/
    ├── widget-chat.spec.ts
    ├── lead-capture.spec.ts
    └── dashboard.spec.ts
```

Introduzir conforme blocos do DEV_PLAN:
- **Bloco 2:** `tests/unit/tools/`
- **Bloco 3:** `tests/e2e/widget-chat.spec.ts`
- **Bloco 5:** smoke completo F1–F6

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
# Desenvolvimento (uma issue)
"Dev Agent: implemente a ISSUE-003"

# Qualidade (uma issue — após handoff)
"QA Agent: valide a ISSUE-003 no browser"

# Prompts prontos por onda/issue
Ver docs/DEVELOPMENT_WAVES.md → "Prompt QA Onda X — Issue #N"
```

**Não combinar** várias issues num único QA, exceto smoke gates documentados:
- Onda 5 completa (#8+#9+#10 já em main)
- Onda 6 completa (F1–F6 em docs/QA_PLAN.md)

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
