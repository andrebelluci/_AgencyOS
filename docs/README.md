# Documentação Agency OS

## Hierarquia (fonte de verdade)

Em caso de conflito, prevalece nesta ordem:

1. **NON_NEGOTIABLES.md** — princípios invioláveis
2. **DEV_PLAN.md** — decisões de implementação e escopo por versão
3. **MVP.md** — hipóteses de validação e critérios de sucesso
4. **ADRs** (`decisions/`) — decisões técnicas irreversíveis
5. **VISION.md** — direção de longo prazo (nunca cortar)
6. Demais documentos — referência por domínio

---

## Mapa dos documentos

| Documento | Propósito | Quando consultar |
|-----------|-----------|------------------|
| [VISION.md](VISION.md) | Visão e categoria de produto | Estratégia, pitch, roadmap longo |
| [ROADMAP.md](ROADMAP.md) | Fases 1–5 da plataforma completa | Planejamento trimestral/anual |
| [DEV_PLAN.md](DEV_PLAN.md) | **Plano executável de desenvolvimento** | **Todo dia de código** |
| [DEVELOPMENT_WAVES.md](DEVELOPMENT_WAVES.md) | **Índice das ondas V0.1 / V0.2** | **Sprint planning / execução** |
| [DEVELOPMENT_WAVES_V0.1.md](DEVELOPMENT_WAVES_V0.1.md) | Ondas e prompts **V0.1** (histórico) | Referência V0.1 |
| [DEVELOPMENT_WAVES_V0.2.md](DEVELOPMENT_WAVES_V0.2.md) | Ondas e prompts **V0.2** (ativo) | **Sprint atual** |
| [BACKLOG.md](BACKLOG.md) | Issues por fase (GitHub Projects) | Sprint planning |
| [MVP.md](MVP.md) | O que validar comercialmente | Decisões de escopo |
| [PRODUCTS.md](PRODUCTS.md) | Planos e modelo comercial | Pricing, features por plano |
| [AGENTS.md](AGENTS.md) | Agentes de IA do **produto** (runtime) | Implementar chat/agentes |
| [CURSOR_AGENTS.md](CURSOR_AGENTS.md) | Regras e skills do **Cursor** (dev) | Configurar o IDE |
| [CURSOR_SKILLS_STRATEGY.md](CURSOR_SKILLS_STRATEGY.md) | Pesquisa e inventário de skills | Escolher extensões Cursor |
| [QA_PLAN.md](QA_PLAN.md) | Testes, Dev/QA agents, smoke V0.1 | Validar issues |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura alvo da plataforma | Design de sistema |
| [MULTITENANCY.md](MULTITENANCY.md) | Isolamento por tenant | Toda feature nova |
| [DATABASE.md](DATABASE.md) | Modelo completo + schema MVP | Migrations, queries |
| [WORKFLOWS.md](WORKFLOWS.md) | Fluxos operacionais (futuro) | Automações Fase 3+ |
| [PROMPT_SYSTEM.md](PROMPT_SYSTEM.md) | Camadas de prompt dos agentes | `src/agents/` |
| [KILL_LIST.md](KILL_LIST.md) | O que NÃO construir | Cortar escopo |
| [CURSOR_RULES.md](CURSOR_RULES.md) | Padrões de código | Code review |
| [decisions/](decisions/) | ADRs | Decisões irreversíveis |

---

## Versões do produto

| Versão | Nome | Objetivo |
|--------|------|----------|
| **V0.1** | Funcionário Digital | 1–3 clientes pagantes |
| **V0.2** | Site Conversacional | Escalar onboarding |
| **V0.3** | Orçamentista IA | Plano PRO vendável |
| **V1** | Agency OS | Plataforma SaaS |

Detalhes em [DEV_PLAN.md](DEV_PLAN.md).

---

## Agentes: produto vs Cursor

- **AGENTS.md** → agentes de IA que rodam **dentro do Agency OS** (Sales, Orchestrator, etc.)
- **CURSOR_AGENTS.md** → regras e skills que orientam o **desenvolvimento** no Cursor IDE

Não confundir os dois.
