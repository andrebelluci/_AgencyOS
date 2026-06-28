# Agentes de Desenvolvimento (Cursor)

Dois agentes operacionais para o ciclo de entrega:

| Agente | Skill | Invocação |
|--------|-------|-----------|
| **Dev Agent** | `agency-os-dev-agent` | "Dev Agent: implemente e valide ISSUE-003" |
| **QA Agent** | `agency-os-qa-agent` | Fase 2 do Dev, ou "QA Agent: valide ISSUE-003" |

Fluxo padrão: **Dev implementa + QA + auto-fix (máx 3 ciclos)** em um prompt → você faz merge.

Detalhes: [QA_PLAN.md](QA_PLAN.md)

---

# Agentes no Cursor vs Agentes do Produto

> **Estratégia completa de skills:** [CURSOR_SKILLS_STRATEGY.md](CURSOR_SKILLS_STRATEGY.md)  
> **Design visual:** [DESIGN.md](DESIGN.md)

## Dois conceitos diferentes

| | Agentes do **Produto** | Agentes do **Cursor** |
|---|---|---|
| **Onde** | `src/agents/` no código | `.cursor/rules/` e `.cursor/skills/` |
| **O que fazem** | Atendem visitantes do cliente | Ajudam **você** a desenvolver o Agency OS |
| **Documentação** | [AGENTS.md](AGENTS.md) | Este arquivo |
| **Exemplos** | Sales Agent, Orchestrator | Regras de multi-tenant, skill de chat |

**AGENTS.md NÃO cria agentes do Cursor automaticamente.**  
Ele define os agentes de IA que rodam dentro da plataforma Agency OS.

---

# Configuração do Cursor neste projeto

## Regras (`.cursor/rules/`)

| Arquivo | Escopo | Função |
|---------|--------|--------|
| `agency-os-core.mdc` | Sempre | Princípios, hierarquia docs, multi-tenant |
| `agency-os-nextjs.mdc` | `src/**` | Padrões Next.js, Server Components, Zod |
| `agency-os-database.mdc` | `drizzle/**`, `src/lib/db/**` | Schema, tenant_id, RLS |
| `agency-os-ai-agents.mdc` | `src/agents/**`, `src/tools/**` | Agentes de produto, tools desacopladas |
| `agency-os-design.mdc` | `src/components/**`, `src/app/**` | Design system, widget, painel |

## Skills (`.cursor/skills/` + `.agents/skills/`)

| Skill | Origem | Quando usar |
|-------|--------|-------------|
| `implement-sprint` | Agency OS | Blocos do DEV_PLAN |
| `agency-os-tenant` | Agency OS | Multi-tenant |
| `agency-os-chat` | Agency OS | Chat, widget, API |
| `agency-os-knowledge` | Agency OS | RAG, PDF |
| `agency-os-widget-ui` | Agency OS | UI widget + painel |
| `agency-os-dev-agent` | Agency OS | Implementa, QA, auto-fix, entrega |
| `agency-os-qa-agent` | Agency OS | MCP Browser Cursor + testes, relatório QA |
| `ui-ux-pro-max` | Comunidade | `/ui-ux-pro-max` — landing, paletas |
| `supabase` | Supabase oficial | Auth, Storage, migrations |
| `supabase-postgres-best-practices` | Supabase | RLS, índices, SQL |

### Regras extras (`.cursor/rules/` de saas-starter-skills)

`multi-tenancy`, `database-schema`, `data-access-layer`, `environment-and-config`, `file-uploads-and-storage`, `api-routes-and-validation`, `authentication`, `project-scaffolding`

Complementam as regras `agency-os-*.mdc`. Em conflito, **agency-os prevalece**.

---

# Como pedir ajuda ao Cursor

Frases que ativam o contexto certo:

- **"Dev Agent: implemente e valide ISSUE-045"** → agency-os-dev-agent (prompt #50 em DEVELOPMENT_WAVES_V0.2.md)
- **V0.1:** prompts históricos em DEVELOPMENT_WAVES_V0.1.md
- **"Implemente o Bloco 0 do DEV_PLAN"** → lê DEV_PLAN + skill implement-sprint
- **"Crie o Sales Agent"** → lê AGENTS.md + regra agency-os-ai-agents
- **"Adicione tabela X"** → lê DATABASE.md MVP + regra database
- **"Configure o widget"** → lê skill agency-os-chat
- **"Isso respeita multi-tenant?"** → lê NON_NEGOTIABLES + skill tenant

---

# Papéis simulados (não são agentes separados do Cursor)

Para acelerar, trate o Cursor como diferentes papéis conforme a tarefa:

| Papel | Foco | Documentos |
|-------|------|------------|
| **Dev Agent** | Issues, implementação, QA, auto-fix | DEV_PLAN, BACKLOG, DEVELOPMENT_WAVES_V0.2 (ativo) |
| **QA Agent** | Browser, testes, relatório | QA_PLAN, MCP cursor-ide-browser |
| **CTO** | Escopo, prioridade, decisões | DEV_PLAN, NON_NEGOTIABLES, KILL_LIST |
| **Architect** | Estrutura, módulos, ADRs | ARCHITECTURE, decisions/ |
| **Backend** | DB, services, API | DATABASE, MULTITENANCY |
| **AI Engineer** | Agentes, prompts, RAG | AGENTS, PROMPT_SYSTEM |
| **Frontend** | Widget, painel, UX | CURSOR_RULES, DEV_PLAN |
| **Product** | O que validar | MVP, PRODUCTS |

Peça explicitamente: *"Atue como AI Engineer e implemente o searchKnowledge tool"*.

---

# MCP — Browser para QA

| Servidor | Uso |
|----------|-----|
| **cursor-ide-browser** | QA exploratório (nativo Cursor, sem config extra) |
| ~~playwright MCP~~ | Removido — não usar |

Testes E2E em CI continuam via `@playwright/test` commitado em `tests/e2e/` (não é MCP).

---

# Manutenção

Ao adicionar feature nova:

1. Atualizar DEV_PLAN.md se mudar escopo de versão
2. Adicionar issue em BACKLOG.md
3. Criar/atualizar regra `.cursor/rules/` se novo padrão
4. Agentes de **produto** novos → atualizar AGENTS.md + `src/agents/`
