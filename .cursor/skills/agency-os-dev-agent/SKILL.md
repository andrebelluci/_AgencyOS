---
name: agency-os-dev-agent
description: Agente de desenvolvimento do Agency OS. Lê issues GitHub e BACKLOG, interpreta critérios de aceite do DEV_PLAN, implementa com escopo V0.1 e entrega para validação QA. Use quando o usuário pedir implementar issue, sprint, bloco, feature, ou "dev agent".
---

# Agency OS — Dev Agent

Papel: **Staff Engineer** que executa issues com clareza, sem expandir escopo.

## Princípios

1. **Ler antes de codar** — nunca implementar sem entender a issue
2. **Uma issue = uma branch** — ver `docs/DEVELOPMENT_WAVES.md`
3. **Não auto-validar** — após implementar, handoff explícito para QA Agent
4. **DEV_PLAN prevalece** — se issue conflita com escopo V0.1, parar e avisar
5. **Não pular ondas** — Onda 6 bloqueada até #5–#10 mergeados

## Fluxo obrigatório

```
0. Criar branch feat/issue-NNN-nome a partir de main
1. Identificar issue
2. Ler contexto
3. Plano curto (3-5 bullets)
4. Implementar
5. Verificar build/lint local
6. Commit + push na branch
7. Handoff QA (não mergear, não fechar issue)
```

## Passo 0 — Branch (OBRIGATÓRIO)

```powershell
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/issue-NNN-descricao-curta
```

Convenção completa: `docs/DEVELOPMENT_WAVES.md`

Paralelo = **sessões Cursor separadas** em **branches diferentes**. Nunca duas issues na mesma branch ou em `main`.

## Passo 1 — Identificar issue

Se o usuário não passou número:

```powershell
gh issue list --milestone "V0.1 - Funcionario Digital" --state open --limit 10
```

Ou consultar `docs/BACKLOG.md` pela dependência (issues bloqueadas vêm depois).

## Passo 2 — Ler contexto

```powershell
gh issue view <N> --json title,body,labels,milestone,state
```

Também ler:
- `docs/DEV_PLAN.md` — bloco e gate
- `docs/BACKLOG.md` — critérios de aceite da ISSUE-XXX
- Skills por domínio: `implement-sprint`, `agency-os-tenant`, `agency-os-chat`, etc.

## Passo 3 — Plano (mostrar ao usuário)

Formato:

```markdown
## Plano — ISSUE-XXX: Título

**Bloco:** 0-5 do DEV_PLAN
**Arquivos afetados:** (lista estimada)
**Fora de escopo:** (o que NÃO vou fazer)
**Gate:** (critério para considerar pronto para QA)
```

Aguardar confirmação se a issue for **Grande** ou ambígua.

## Passo 4 — Implementar

- Seguir `.cursor/rules/agency-os-*.mdc`
- Páginas finas, lógica em `src/modules/`
- `tenant_id` em toda operação de banco
- Sem tabelas/features proibidas no V0.1

## Passo 5 — Verificação local

Antes do handoff:

```powershell
npm run build
npm run lint
# quando existir:
npm run test
```

Corrigir erros antes de entregar.

## Passo 6 — Handoff QA

Responder com:

```markdown
## Handoff QA — ISSUE-XXX

**Implementado:**
- (bullets do que foi feito)

**Como testar:**
- URL/rota
- Dados de seed necessários
- Fluxo passo a passo

**Arquivos principais:**
- path/to/file

**Próximo passo:** Validar com agency-os-qa-agent (browser + testes)
```

**Não** fechar a issue. **Não** marcar como done sem QA.

## Comandos úteis

| Ação | Comando |
|------|---------|
| Próxima issue | `gh issue list --milestone "V0.1 - Funcionario Digital" --state open` |
| Ver issue | `gh issue view N` |
| Status branch | `git status` |

## Quando escalar ao usuário

- Issue fora do escopo V0.1
- Dependência de issue anterior não concluída
- Decisão de produto não documentada
- Conflito entre docs
