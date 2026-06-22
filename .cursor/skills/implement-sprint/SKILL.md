---
name: implement-sprint
description: Implementa blocos/sprints do DEV_PLAN.md do Agency OS. Use quando o usuário pedir implementar sprint, bloco, fase V0.1, ou iniciar desenvolvimento de uma issue do BACKLOG.
---

# Implement Sprint — Agency OS

## Antes de codar

1. Ler `docs/DEV_PLAN.md` — identificar bloco e issues em `docs/BACKLOG.md`
2. Verificar gate do bloco anterior está atendido
3. Confirmar escopo V0.1 — não adicionar tabelas/features proibidas

## Durante implementação

- Seguir estrutura de pastas em DEV_PLAN.md
- `tenant_id` em toda operação de banco
- Páginas finas, lógica em `src/modules/`
- Zod + tipagem forte

## Checklist por bloco

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

Marcar critério de aceite do BACKLOG. Não commitar sem pedido do usuário.
