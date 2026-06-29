---
name: implement-sprint
description: Implementa blocos/sprints do DEV_PLAN.md do Agency OS. Use quando o usuário pedir implementar sprint, bloco, fase V0.1/V0.2, ou iniciar desenvolvimento de uma issue do BACKLOG.
---

# Implement Sprint — Agency OS

## Antes de codar

1. Ler `docs/DEV_PLAN.md` — identificar versão ativa (V0.2) e issues em `docs/BACKLOG.md`
2. Ler ondas e prompt da issue: `docs/DEVELOPMENT_WAVES_V0.2.md` (ativo) ou `DEVELOPMENT_WAVES_V0.1.md` (histórico)
3. Verificar gate da onda anterior está atendido
4. Confirmar escopo da versão — V0.2: issues #41–#51; não adiantar V0.3

## V0.2 — ordem atual

```
Onda 1: #50 → #44 → #48
Onda 2: #42 → (#43 ‖ #41)
Onda 3: #45 → #46 → (#49 ‖ #51) → #47
```

**Não reimplementar 031E** (`assistant_label`, auto-offset) nem **031F** (RAG FAQ híbrido) — já em `main`. Agentes V0.2 (#49, #51) seguem [ADR-005](docs/decisions/005-rag-first.md).

## Ambientes

- **Dev:** `.env.local` → Supabase dev — implementar e testar issues aqui
- **Prod:** só pós-merge (operador migra + Vercel Production) — ver [DEPLOY.md](docs/DEPLOY.md)
- **Nunca** seed/provision de teste em prod

## Durante implementação

- Seguir estrutura de pastas em DEV_PLAN.md
- `tenant_id` em toda operação de banco
- Páginas finas, lógica em `src/modules/`
- Zod + tipagem forte
- QA: `npm run build && npm run lint` + `npm run test:e2e:no-ai` quando widget/painel

## Checklist por bloco (V0.1 — referência)

### Bloco 0
- [ ] Next.js + Supabase + Drizzle
- [ ] tenants, tenant_settings, users
- [ ] Middleware tenant + Auth + RLS

### Bloco 1
- [ ] leads, conversations, messages
- [ ] Services/repositories
- [ ] Settings CRUD + seed

### Bloco 2
- [ ] agents/orchestrator + sales
- [ ] prompt-builder + tools
- [ ] /api/chat streaming

### Bloco 3
- [ ] Chat UI + embed.js
- [ ] /api/widget/config
- [ ] WhatsApp link

### Bloco 4
- [ ] knowledge schema + FAQ
- [ ] searchKnowledge + RAG
- [ ] Painel /knowledge

### Bloco 5
- [ ] Dashboard, leads, conversations
- [ ] Embed generator + deploy

## Ao concluir issue

Marcar critério de aceite do BACKLOG (seção V0.2 quando aplicável). Não commitar sem pedido do usuário.
